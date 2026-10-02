#!/usr/bin/env python3
import os

base = r"C:\Users\maxto\Desktop\НОВЫЙ САЙТ\banger-site\NEW SITE BANI\public\images"
files = []
for root, dirs, filenames in os.walk(base):
    for f in filenames:
        path = os.path.join(root, f)
        size = os.path.getsize(path)
        if size > 500 * 1024:
            files.append((path, size, f))

files.sort(key=lambda x: x[1], reverse=True)

print(f"Total files >500KB: {len(files)}")
total_before = sum([f[1] for f in files])
print(f"Total size before: {total_before / (1024*1024):.2f} MB")
print("---")
for f in files:
    print(f"  {f[1]/(1024*1024):.2f} MB  {f[2]}")
