import os, re
bad = re.compile(r'[РС][\u0400-\u04FF]{1,2}')
for root, dirs, files in os.walk('src'):
    for f in files:
        if f.endswith('.tsx') or f.endswith('.ts') or f.endswith('.css') or f.endswith('.js'):
            path = os.path.join(root, f)
            try:
                text = open(path, 'r', encoding='utf-8').read()
                # Look for corruption markers: Р followed by non-cyrillic latin-like chars
                if 'Р‘' in text or 'Р“' in text or 'Р—' in text or 'Рџ' in text or 'РЎ' in text or 'СЃ' in text:
                    print(path)
            except Exception:
                pass
