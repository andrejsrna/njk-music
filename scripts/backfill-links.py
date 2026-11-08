#!/usr/bin/env python3
"""Backfill missing/search-only platform links in content/music/*.md using resolve-links.py.

Default is DRY RUN (prints proposed changes). Use --apply to write.
Only fills fields that are null/empty/search-URL; never overwrites an exact link.
Usage: uv run --with ytmusicapi python3 scripts/backfill-links.py [--apply] [slug ...]
"""
import glob, json, os, re, subprocess, sys

MAP = {"appleMusic": "AppleMusic", "youtubeMusic": "YouTubeMusic", "amazonMusic": "Amazon",
       "deezer": "Deezer", "tidal": "Tidal", "pandora": "Pandora", "bandcamp": "Bandcamp"}
here = os.path.dirname(os.path.abspath(__file__))
apply = "--apply" in sys.argv
only = [a for a in sys.argv[1:] if not a.startswith("--")]


def weak(v):
    return not v or "/search" in v or "search?q" in v or "search/default" in v


changes = 0
for f in sorted(glob.glob(os.path.join(here, "..", "content", "music", "*.md"))):
    slug = os.path.basename(f)[:-3]
    if only and slug not in only:
        continue
    text = open(f).read()
    m = re.search(r"^---json\n(.*?)\n---", text, re.S)
    if not m:
        continue
    d = json.loads(m[1])
    sp = d.get("Spotify") or ""
    if "open.spotify.com/album/" not in sp and "open.spotify.com/track/" not in sp:
        continue
    targets = [k for k in MAP.values() if weak(d.get(k))]
    if not targets:
        continue
    p = subprocess.run([sys.executable, os.path.join(here, "resolve-links.py"), sp],
                       capture_output=True, text=True)
    try:
        r = json.loads(p.stdout)
    except Exception:
        print(f"{slug}: resolver failed"); continue
    # Title sanity check: skip if resolved title does not match the file title
    t1, t2 = re.sub(r"\W", "", (r.get("title") or "").lower()), re.sub(r"\W", "", d["Title"].lower())
    if not t1 or not (t1.startswith(t2[:12]) or t2.startswith(t1[:12])):
        print(f"{slug}: SKIP title mismatch ({r.get('title')!r} vs {d['Title']!r})"); continue
    new = {MAP[k]: v for k, v in r["links"].items() if k in MAP and MAP[k] in targets and v}
    if not new:
        continue
    print(slug, json.dumps(new, ensure_ascii=False))
    changes += len(new)
    if apply:
        for k, v in new.items():
            text, n = re.subn(rf'("{k}": )(?:null|"[^"]*")', lambda mm: mm.group(1) + json.dumps(v), text, count=1)
        open(f, "w").write(text)
print(f"{changes} links {'written' if apply else 'proposed (dry run)'}")
