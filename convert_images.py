#!/usr/bin/env python3
import os
from PIL import Image

base = r"C:\Users\maxto\Desktop\НОВЫЙ САЙТ\banger-site\NEW SITE BANI\public\images"
files_before = 0
size_before = 0
files_after = 0
size_after = 0

for root, dirs, filenames in os.walk(base):
    for f in filenames:
        if f.endswith('.png') or f.endswith('.jpg') or f.endswith('.jpeg'):
            path = os.path.join(root, f)
            size = os.path.getsize(path)
            if size > 500 * 1024:
                # Convert to WebP (same filename but .webp extension)
                webp_path = path.replace('.png', '.webp').replace('.jpg', '.webp').replace('.jpeg', '.webp')
                # Skip if webp already exists
                if not os.path.exists(webp_path):
                    try:
                        img = Image.open(path)
                        # Convert to RGB if it has transparency (for WebP compatibility with some browsers)
                        if img.mode in ('RGBA', 'P'):
                            img = img.convert('RGB')
                        img.save(webp_path, 'WEBP', quality=85, optimize=True)
                    except Exception as e:
                        print(f"Error converting {f}: {e}")

# Now calculate sizes
for root, dirs, filenames in os.walk(base):
    for f in filenames:
        if f.endswith('.png') or f.endswith('.jpg') or f.endswith('.jpeg'):
            path = os.path.join(root, f)
            size = os.path.getsize(path)
            if size > 500 * 1024:
                files_before += 1
                size_before += size
        elif f.endswith('.webp'):
            path = os.path.join(root, f)
            size = os.path.getsize(path)
            if size > 500 * 1024:
                files_after += 1
                size_after += size

# Add hero and other heavy webp files that were converted
# Let's recalculate more accurately
all_webp = []
for root, dirs, filenames in os.walk(base):
    for f in filenames:
        if f.endswith('.webp'):
            all_webp.append((os.path.join(root, f), f))

print(f"PNG/JPG files >500KB: {files_before}")
print(f"WebP files >500KB: {len(all_webp)}")
print(f"Size PNG before: {size_before / (1024*1024):.2f} MB")

# Calculate webp sizes
size_webp_total = 0
for p, f in all_webp:
    size_webp_total += os.path.getsize(p)
print(f"Size WebP after: {size_webp_total / (1024*1024):.2f} MB")
print(f"Files converted (new webp): {len(all_webp)}")
print("--- Converted files (first 10) ---")
for p, f in all_webp[:10]:
    print(f"  {f}")
