path = r"src\data\index.ts"
content = open(path, 'r', encoding='utf-8').read()
old = "/NEW-SITE-BANI/images/renders/usadba-terra-7.webp"
new = "/NEW-SITE-BANI/images/interiors/barn-premium-1.jpg"
# Replace only first 2 occurrences (image + images for bg-28)
content = content.replace(old, new, 2)
# Insert floorPlan after images array for Barn Premium
marker = "images: ['/NEW-SITE-BANI/images/interiors/barn-premium-1.jpg'], size: '8"
content = content.replace(marker, "images: ['/NEW-SITE-BANI/images/interiors/barn-premium-1.jpg'], floorPlan: '/NEW-SITE-BANI/images/interiors/barn-premium-1.jpg', size: '8")
open(path, 'w', encoding='utf-8').write(content)
print("Fixed Barn Premium")
