#!/usr/bin/env python3
"""Build tracks.json — the authoritative dedupe/SEO database of every released
NJK Music track across all labels.

Two data sources are merged:

  1. content/music/*.md  -> SEO metadata (slug, title, genre, label, UPC, dates,
     DSP links) plus any markdown tracklists.
  2. Deezer API          -> the *complete* discography per label (every album and
     every track title + ISRC), including releases that have no markdown page yet.

Each release is cross-referenced by Deezer album id (fallback: UPC). Any release
found on Deezer but missing from the site is flagged `missing_from_site: true`.
Every track name is normalized to an SEO slug so collisions surface automatically.

Usage:
    python3 scripts/build_tracks_db.py            # rebuild tracks.json
    python3 scripts/build_tracks_db.py --check    # exit 1 if any collision
"""
import glob
import json
import re
import sys
import time
import urllib.request
from datetime import datetime, timezone

ROOT = "content/music"
OUT = "tracks.json"
CHECK = "--check" in sys.argv

# label -> Deezer artist id (Koldman is unresolved on Deezer -> markdown only)
ARTISTS = {
    "No Copyright Gaming Music": "223452715",
    "Jazz & Bass": "268831212",
    "Chill Music Motif": "229270945",
    "Calm Spirit Music": "349034881",
    "Ľudovky od Andreja": "266009392",
}


def get(url, timeout=25, tries=3):
    req = urllib.request.Request(url, headers={"User-Agent": "njk-tracks-db/1.0"})
    for i in range(tries):
        try:
            with urllib.request.urlopen(req, timeout=timeout) as r:
                return json.loads(r.read().decode("utf-8"))
        except Exception as e:
            if i == tries - 1:
                return {"_error": f"{type(e).__name__}: {e}"}
            time.sleep(1.0 * (i + 1))


def deezer_id(url):
    if not url:
        return None
    m = re.search(r"deezer\.com/(?:[a-z]{2}/)?album/(\d+)", url)
    return m.group(1) if m else None


def normalize(name):
    s = name.lower().strip()
    s = s.replace("—", " ").replace("–", " ").replace("-", " ")
    for a, b in [("á", "a"), ("ä", "a"), ("č", "c"), ("ď", "d"), ("é", "e"),
                 ("í", "i"), ("ĺ", "l"), ("ľ", "l"), ("ň", "n"), ("ó", "o"),
                 ("ô", "o"), ("ŕ", "r"), ("š", "s"), ("ť", "t"), ("ú", "u"),
                 ("ý", "y"), ("ž", "z")]:
        s = s.replace(a, b)
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")


def parse_md(path):
    txt = open(path, encoding="utf-8").read()
    fm = {}
    m = re.search(r"^---json\s*\n(.*?)\n---", txt, re.S)
    if m:
        try:
            fm = json.loads(m.group(1))
        except Exception:
            fm = {}
    tracks, isrcs = [], {}
    mt = re.search(r"^#{2,3}\s*Tracklist\s*$.*?(?=^#{1,3}\s|\Z)", txt, re.S | re.M)
    if mt:
        for line in mt.group(0).splitlines():
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            num = re.match(r"^\d+\.\s*(.+)$", line)
            if num:
                name = re.sub(r"\*+", "", num.group(1))
                name = re.split(r"\s*[—–]\s*", name)[0].strip()
                tracks.append(name)
                continue
            ism = re.match(r"^ISRC:\s*`?([A-Z0-9]+)`?", line)
            if ism and tracks:
                isrcs[tracks[-1]] = ism.group(1)
    return fm, tracks, isrcs


# 1) markdown index
md_releases = {}
for path in sorted(glob.glob(f"{ROOT}/*.md")):
    fm, tracks, isrcs = parse_md(path)
    label = (fm.get("label") or {}).get("name")
    did = deezer_id(fm.get("Deezer"))
    rec = {
        "slug": fm.get("slug"),
        "title": fm.get("Title"),
        "label": label,
        "label_slug": (fm.get("label") or {}).get("slug"),
        "genre": (fm.get("genre") or {}).get("Genres"),
        "upc": fm.get("upc"),
        "record_label": fm.get("recordLabel"),
        "release_date": (fm.get("pubDate") or fm.get("publishedAt") or "")[:10],
        "deezer_id": did,
        "tracks": tracks,
        "isrcs": isrcs,
    }
    # index by deezer id and by upc
    if did:
        md_releases.setdefault(("id", did), rec)
    if fm.get("upc"):
        md_releases.setdefault(("upc", fm["upc"]), rec)

# 2) full Deezer discography
releases = []       # merged release dicts
seen_keys = set()   # to dedupe merges
missing_from_site = []

def add_release(rec, from_deezer):
    key = rec["deezer_id"] or rec.get("upc") or rec["title"]
    if key in seen_keys:
        return
    seen_keys.add(key)
    rec["missing_from_site"] = from_deezer
    if from_deezer:
        missing_from_site.append(rec)
    releases.append(rec)

# pass 1: markdown-only releases that have no deezer id (keep as-is)
for (ktyp, kval), rec in md_releases.items():
    if ktyp == "upc":
        # will merge below if a deezer release matches upc
        continue

# build deezer releases per label
for label, artist_id in ARTISTS.items():
    disc = get(f"https://api.deezer.com/artist/{artist_id}/albums?limit=300")
    for album in disc.get("data", []) or []:
        did = str(album["id"])
        # merge with markdown metadata if we know this album
        md = md_releases.get(("id", did))
        tracks_data = []
        td = get(f"https://api.deezer.com/album/{did}/tracks")
        for tr in (td.get("data", []) or []):
            tracks_data.append({"title": tr.get("title"), "isrc": tr.get("isrc")})
        if md:
            rec = dict(md)
            # Deezer is authoritative for tracklist when markdown lacks it
            if not rec["tracks"]:
                rec["tracks"] = [t["title"] for t in tracks_data]
                rec["isrcs"] = {t["title"]: t["isrc"] for t in tracks_data if t["isrc"]}
            if not rec.get("upc"):
                rec["upc"] = album.get("upc")
            if not rec.get("release_date"):
                rec["release_date"] = album.get("release_date", "")
            add_release(rec, from_deezer=False)
        else:
            add_release({
                "slug": None,
                "title": album.get("title"),
                "label": label,
                "label_slug": None,
                "genre": None,
                "upc": album.get("upc"),
                "record_label": album.get("label"),
                "release_date": album.get("release_date", ""),
                "deezer_id": did,
                "tracks": [t["title"] for t in tracks_data],
                "isrcs": {t["title"]: t["isrc"] for t in tracks_data if t["isrc"]},
            }, from_deezer=True)
        time.sleep(0.05)

# pass 2: markdown releases that never matched a Deezer album (e.g. Koldman)
for (ktyp, kval), rec in md_releases.items():
    if ktyp != "id" and ktyp != "upc":
        continue
    key = rec["deezer_id"] or rec.get("upc") or rec["title"]
    if key not in seen_keys:
        if not rec["tracks"]:
            rec["tracks"] = [rec["title"]]  # single-track fallback
        rec.setdefault("deezer_id", None)
        add_release(rec, from_deezer=False)

# 3) collisions
seen = {}
collisions = []
for rel in releases:
    for tr in rel["tracks"]:
        key = normalize(tr)
        if not key:
            continue
        if key in seen:
            collisions.append({
                "normalized": key,
                "tracks": [seen[key], {"release": rel["title"], "track": tr}],
            })
        else:
            seen[key] = {"release": rel["title"], "track": tr}

total_tracks = sum(len(r["tracks"]) for r in releases)
out = {
    "generated_at": datetime.now(timezone.utc).isoformat(),
    "summary": {
        "releases": len(releases),
        "tracks": total_tracks,
        "missing_from_site": len(missing_from_site),
        "collisions": len(collisions),
    },
    "releases": releases,
    "missing_from_site": [r["title"] for r in missing_from_site],
    "collisions": collisions,
}

with open(OUT, "w", encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False, indent=2)

print(f"Wrote {OUT}: {len(releases)} releases, {total_tracks} tracks, "
      f"{len(missing_from_site)} missing from site, {len(collisions)} collision(s).")
if collisions:
    print("\nCOLLISIONS:")
    for c in collisions:
        names = [f"{t['track']} ({t['release']})" for t in c["tracks"]]
        print(" - " + "  <->  ".join(names))
if CHECK and collisions:
    sys.exit(1)
