import glob, io, re
updated = []
for path in glob.glob('**/*.html', recursive=True):
    with io.open(path, 'r', encoding='utf-8') as f:
        text = f.read()
    orig = text
    text = re.sub(r'https://t\.me/[A-Za-z0-9_]+', 'https://t.me/Nikolay2962121', text)
    text = re.sub(r'https://wa\.me/\d+', 'https://wa.me/380962962121', text)
    text = re.sub(r'wa\.me/\d+', 'wa.me/380962962121', text)
    text = text.replace('@' + 'openme' + '_ks', '@Nikolay2962121')
    if text != orig:
        with io.open(path, 'w', encoding='utf-8') as f:
            f.write(text)
        updated.append(path)
print('updated', len(updated), 'files')
for p in updated:
    print(p)
