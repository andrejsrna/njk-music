#!/usr/bin/env python3
"""Build tracks.json — a dedupe/SEO database of every released NJK Music track.

Reads content/music/*.md for frontmatter (slug, title, genre, label, UPC, dates)
and markdown tracklists. For releases that ship no tracklist in the markdown but
have a Deezer URL, it pulls the authoritative tracklist (titles + ISRCs) from the
Deezer API. Every track name is normalized to an SEO slug so collisions surface
automatically.

Usage:
    python3 scripts/build_tracks_db.py            # rebuild tracks.json
    python3 scripts/build_tracks_db.py --check    # exit 1 if any collision found
"""
import glob
import json
import re
import sys
import urllib.parse
import urllib.request
from datetime import datetime, timezone

ROOT = "content/music"
OUT = "tracks.json"
CHECK = "--check" in sys.argv


def get(url, timeout=20):
    req = urllib.request.Request(url, headers={"User-Agent": "njk-tracks-db/1.0"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.loads(r.read().decode("utf-8"))


def deezer_id(url):
    if not url:
        return None
    m = re.search(r"deezer\.com/(?:[a-z]{2}/)?album/(\d+)", url)
    return m.group(1) if m else None


def normalize(name):
    """SEO-style slug: lowercase, strip punctuation/diacritics-ish, collapse ws."""
    s = name.lower().strip()
    s = s.replace("—", " ").replace("–", " ").replace("-", " ")
    # fold common accented chars (Slovak) to ASCII for safe dedupe
    for a, b in [("á", "a"), ("ä", "a"), ("č", "c"), ("ď", "d"), ("é", "e"),
                 ("í", "i"), ("ĺ", "l"), ("ľ", "l"), ("ň", "n"), ("ó", "o"),
                 ("ô", "o"), ("ŕ", "r"), ("š", "s"), ("ť", "t"), ("ú", "u"),
                 ("ý", "y"), ("ž", "z")]:
        s = s.replace(a, b)
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return s


def parse_md(path):
    txt = open(path, encoding="utf-8").read()
    # frontmatter json
    fm = {}
    m = re.search(r"^---json\s*\n(.*?)\n---", txt, re.S)
    if m:
        try:
            fm = json.loads(m.group(1))
        except Exception:
            fm = {}
    # markdown tracklist: ## Tracklist or ### Tracklist
    tracks = []
    isrcs = {}
    m = re.search(r"^#{2,3}\s*Tracklist\s*$.*?(?=^#{1,3}\s|\Z)", txt, re.S | re.M)
    if m:
        for line in m.group(0).splitlines():
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            num = re.match(r"^\d+\.\s*(.+)$", line)
            if num:
                name = num.group(1)
                name = re.sub(r"\*+", "", name)
                name = re.split(r"\s*[—–]\s*", name)[0].strip()
                # drop trailing "(feat. ...)" for dedupe? keep for now, strip parens version
                tracks.append(name)
                continue
            ism = re.match(r"^ISRC:\s*`?([A-Z0-9]+)`?", line)
            if ism and tracks:
                isrcs[tracks[-1]] = ism.group(1)
    return fm, tracks, isrcs


releases = []
for path in sorted(glob.glob(f"{ROOT}/*.md")):
    fm, tracks, isrcs = parse_md(path)
    title = fm.get("Title") or path
    slug = fm.get("slug")
    label = fm.get("label") or {}
    deezer = fm.get("Deezer")

    # fetch authoritative tracklist from Deezer when markdown lacks one
    if not tracks and deezer:
        aid = deezer_id(deezer)
        if aid:
            try:
                data = get(f"https://api.deezer.com/album/{aid}")
                if not label.get("name") and data.get("artist"):
                    label = {"name": data["artist"].get("name"), "slug": None}
                for tr in (data.get("tracks", {}).get("data", []) or []):
                    tracks.append(tr.get("title"))
                    isrcs[tr.get("title")] = tr.get("isrc")
            except Exception as e:
                print(f"[warn] Deezer fetch failed for {slug}: {e}", file=sys.stderr)
    # single-release fallback
    if not tracks:
        tracks = [title]

    track_objs = []
    for i, t in enumerate(tracks):
        track_objs.append({
            "title": t,
            "normalized": normalize(t),
            "position": i + 1,
            "isrc": isrcs.get(t),
        })

    releases.append({
        "slug": slug,
        "title": title,
        "label": label.get("name") or None,
        "label_slug": label.get("slug") or None,
        "genre": (fm.get("genre") or {}).get("Genres") or None,
        "upc": fm.get("upc"),
        "record_label": fm.get("recordLabel"),
        "release_date": (fm.get("pubDate") or fm.get("publishedAt") or "")[:10],
        "tracks": track_objs,
    })

# collision detection on normalized names
seen = {}
collisions = []
for rel in releases:
    for tr in rel["tracks"]:
        key = tr["normalized"]
        if not key:
            continue
        if key in seen:
            collisions.append({
                "normalized": key,
                "tracks": [seen[key], {"release": rel["title"], "track": tr["title"]}],
            })
        else:
            seen[key] = {"release": rel["title"], "track": tr["title"]}

total_tracks = sum(len(r["tracks"]) for r in releases)
out = {
    "generated_at": datetime.now(timezone.utc).isoformat(),
    "summary": {
        "releases": len(releases),
        "tracks": total_tracks,
        "collisions": len(collisions),
    },
    "releases": releases,
    "collisions": collisions,
}

with open(OUT, "w", encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False, indent=2)

print(f"Wrote {OUT}: {len(releases)} releases, {total_tracks} tracks, "
      f"{len(collisions)} collision(s).")
if collisions:
    print("\nCOLLISIONS:")
    for c in collisions:
        names = [f"{t['track']} ({t['release']})" for t in c["tracks"]]
        print(" - " + "  <->  ".join(names))
if CHECK and collisions:
    sys.exit(1)
