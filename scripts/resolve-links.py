#!/usr/bin/env python3
"""Resolve exact platform links for a release from a Spotify album/track URL.

Usage: scripts/resolve-links.py <spotify-url> [--label-bandcamp njk-music,nocopyrightgamingmusic]
Prints JSON: found links, UPC/ISRC, cover and a `missing` list.
Only exact URLs are emitted; anything unresolved is listed in `missing`.
"""
import json, re, sys, urllib.parse, urllib.request

UA = {"User-Agent": "Mozilla/5.0"}


def get(url, as_json=False, timeout=25):
    try:
        with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=timeout) as r:
            body = r.read().decode("utf-8", "replace")
        return json.loads(body) if as_json else body
    except Exception:
        return None


def songlink(spotify_url):
    """Parse the public song.link page (the API needs a key)."""
    kind, sid = re.search(r"spotify\.com/(album|track)/(\w+)", spotify_url).groups()
    page = get(f"https://{'album' if kind == 'album' else 'song'}.link/s/{sid}")
    out, meta = {}, {}
    if not page:
        return out, meta
    m = re.search(r'<script id="__NEXT_DATA__"[^>]*>(.*?)</script>', page, re.S)
    if not m:
        return out, meta
    d = json.loads(m[1])["props"]["pageProps"]["pageData"]
    for sec in d.get("sections", []):
        for l in sec.get("links", []):
            if l.get("url"):
                out[l["platform"]] = l["url"]
    meta = d.get("entityData", {})
    return out, meta


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    url = sys.argv[1].split("?")[0]
    bandcamps = ["njk-music", "nocopyrightgamingmusic"]
    if "--label-bandcamp" in sys.argv:
        bandcamps = sys.argv[sys.argv.index("--label-bandcamp") + 1].split(",")

    res = {"spotify": url, "links": {}, "missing": []}
    sl, meta = songlink(url)
    for k, v in sl.items():
        res["links"][k] = v
    title, isrc = meta.get("title"), meta.get("isrc")
    rd = meta.get("releaseDate") or {}
    # song.link months are 0-indexed (verified against Deezer): add 1
    release = f"{rd['year']}-{rd['month'] + 1:02d}-{rd['day']:02d}" if rd.get("year") else None
    res.update(title=title, artist=meta.get("artistName"), isrc=isrc, release_songlink=release)

    # Deezer: exact by ISRC; album URLs have no ISRC -> fall back to title search (verify manually)
    album_id = None
    if isrc:
        t = get(f"https://api.deezer.com/track/isrc:{isrc}", True)
        album_id = t and t.get("album", {}).get("id")
    elif title:
        s = get("https://api.deezer.com/search/album?q=" + urllib.parse.quote(f'{title} {(meta.get("artistName") or "").split(",")[-1].strip()}'), True)
        for c in (s or {}).get("data", []):
            if c["title"].lower().startswith(title.lower()[:20]):
                album_id = c["id"]; res["deezer_match"] = "title-search, verify"; break
    if album_id:
        if True:
            a = get(f"https://api.deezer.com/album/{album_id}", True) or {}
            res["links"]["deezer"] = a.get("link")
            res.update(upc=a.get("upc"), label=a.get("label"), cover=a.get("cover_xl"),
                       deezer_release=a.get("release_date"), tracks=a.get("nb_tracks"))

    # Apple/iTunes: lookup by UPC
    if res.get("upc"):
        for c in ("us", "gb"):
            d = get(f"https://itunes.apple.com/lookup?upc={res['upc']}&entity=album&country={c}", True)
            if d and d.get("results"):
                res["links"]["appleMusic"] = d["results"][0]["collectionViewUrl"]
                break

    # YouTube Music (needs: uv run --with ytmusicapi)
    try:
        from ytmusicapi import YTMusic
        yt = YTMusic()
        for r in yt.search(title or "", filter="albums", limit=10):
            if r["title"].lower().startswith((title or "").lower()[:20]):
                res["links"]["youtubeMusic"] = f"https://music.youtube.com/playlist?list={r['playlistId']}"
                alb = yt.get_album(r["browseId"])
                if alb.get("tracks"):
                    res["youtube_video_id"] = alb["tracks"][0]["videoId"]
                break
    except ImportError:
        res["note"] = "ytmusicapi missing: run with `uv run --with ytmusicapi`"

    # Bandcamp: scan label /music pages for a matching slug
    slug = re.sub(r"[^a-z0-9]+", "-", (title or "").lower()).strip("-")
    for acct in bandcamps:
        page = get(f"https://{acct}.bandcamp.com/music") or ""
        m = re.search(rf'href="(/(?:album|track)/{re.escape(slug[:30])}[^"]*)"', page)
        if m:
            res["links"]["bandcamp"] = f"https://{acct}.bandcamp.com{m[1]}"
            break

    # Beatport / Traxsource: not scriptable (403 / JS) -> hint for web_extract
    for want in ("beatport", "traxsource", "tidal", "amazonMusic", "appleMusic", "youtubeMusic", "bandcamp", "deezer"):
        if not res["links"].get(want):
            res["missing"].append(want)
    for k in ("beatport", "traxsource"):
        if k not in res["links"] and k not in res["missing"]:
            res["missing"].append(k)
    res["next"] = ("For beatport/traxsource: web_extract the label page "
                   "(Beatport label 'jazz-bass/110391', Traxsource artist page) and follow the track link for the title.")
    print(json.dumps(res, indent=2, ensure_ascii=False))


main()
