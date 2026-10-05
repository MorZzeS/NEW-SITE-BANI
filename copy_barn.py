#!/usr/bin/env python3
import shutil, os
src = r"C:\Users\maxto\Desktop\НОВЫЙ САЙТ\Фото бани изнутри\v2_extracted\word\media"
dest = r"C:\Users\maxto\Desktop\НОВЫЙ САЙТ\banger-site\NEW SITE BANI\public\images\interiors"
for i in range(1, 16):
    s = os.path.join(src, f"image{i}.jpeg")
    d = os.path.join(dest, f"barn-premium-{i}.jpg")
    if os.path.exists(s):
        shutil.copy2(s, d)
        print(f"Copied barn-premium-{i}.jpg")
    else:
        print(f"MISSING image{i}.jpeg")
