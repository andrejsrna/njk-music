import re, glob, json

results = []
for f in sorted(glob.glob('content/music/*.md')):
    txt = open(f, encoding='utf-8').read()
    label = re.search(r'"name":\s*"([^"]+)"', txt)
    title = re.search(r'"Title":\s*"([^"]+)"', txt)
    label = label.group(1) if label else 'Unknown'
    title = title.group(1) if title else f

    tracks = []
    if '## Tracklist' in txt:
        after = txt.split('## Tracklist', 1)[1]
        lines = after.splitlines()
        for line in lines[:20]:
            line = line.strip()
            if not line:
                if tracks:
                    break
                continue
            mm = re.match(r'^\d+\.\s*(.+)$', line)
            if mm:
                name = mm.group(1)
                name = re.sub(r'\*+', '', name)
                name = name.split('—')[0].strip()
                tracks.append(name)
            elif tracks:
                break
    if not tracks:
        tracks = [title]

    results.append({'file': f, 'label': label, 'title': title, 'tracks': tracks})

with open('scripts/tracks_export.json', 'w', encoding='utf-8') as out:
    json.dump(results, out, ensure_ascii=False, indent=2)

for r in results:
    print(f"{r['label']:28s} | {r['title']:55s} | {', '.join(r['tracks'])}")
