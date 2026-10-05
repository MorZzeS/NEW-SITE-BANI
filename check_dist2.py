#!/usr/bin/env python3
import os
base = r"C:\Users\maxto\Desktop\НОВЫЙ САЙТ\banger-site\NEW SITE BANI\dist"
for root, dirs, files in os.walk(base):
    for d in dirs:
        if 'slug' in d:
            print(os.path.join(root, d))
print("---")
for root, dirs, files in os.walk(base):
    for f in files:
        if 'kak-vybrat' in f or 'ognebiozashchita' in f or 'kak-vybiraem' in f:
            print(os.path.join(root, f))