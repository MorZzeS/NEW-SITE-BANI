#!/usr/bin/env python3
import os, re

base = r"C:\Users\maxto\Desktop\НОВЫЙ САЙТ\banger-site\NEW SITE BANI\src"
count = 0
files = []
for root, dirs, filenames in os.walk(base):
    for f in filenames:
        if f.endswith('.ts') or f.endswith('.tsx') or f.endswith('.css') or f.endswith('.txt'):
            path = os.path.join(root, f)
            try:
                content = open(path, 'r', encoding='utf-8').read()
                refs = content.count('.png')
                if refs > 0:
                    files.append((path, refs))
                    count += refs
            except:
                pass

print(f"Total '.png' references remaining in src/: {count}")
for f, c in files:
    print(f"  {f}: {c}")
