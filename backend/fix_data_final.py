import json
import random
from database import SessionLocal
import models

db = SessionLocal()
listings = db.query(models.Listing).all()

# A list of completely distinct, confirmed working Unsplash URLs
unsplash_images = [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800", # modern house
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800", # pool house
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800", # interior apartment
    "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=800", # beautiful landscape house
    "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=800", # beach house
    "https://images.unsplash.com/photo-1502672260266-1c1e52d1590c?auto=format&fit=crop&q=80&w=800", # room interior
    "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?auto=format&fit=crop&q=80&w=800", # classic house
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800", # villa
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=800", # large suburban home
    "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&q=80&w=800", # brick house
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=800", # yellow house
    "https://images.unsplash.com/photo-1576941089067-2de3c901e126?auto=format&fit=crop&q=80&w=800", # wood cabin
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800", # modern living room
    "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&q=80&w=800", # interior window
    "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=800", # street house
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800", # living room sofa
    "https://images.unsplash.com/photo-1505843513577-22bb7d21e455?auto=format&fit=crop&q=80&w=800", # interior design
    "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800", # bedroom
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=800", # kitchen
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b46a?auto=format&fit=crop&q=80&w=800", # white villa
    "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=800", # living space
    "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&q=80&w=800"  # modern concrete house
]

random.seed(42) # Deterministic shuffle

# Keep track of which image we've assigned so we rotate cleanly
img_idx = 0

for listing in listings:
    # 1. FIX THE IMAGES (Make sure they are valid JSON arrays so they don't fallback to the snowfall image)
    image = unsplash_images[img_idx % len(unsplash_images)]
    img_idx += 1
    
    current_images = []
    if listing.image_urls:
        try:
            current_images = json.loads(listing.image_urls)
        except:
            current_images = []
            
    if current_images:
        current_images[0] = image
    else:
        current_images = [image]
        
    listing.image_urls = json.dumps(current_images)
    
    # 2. FIX THE LOCATIONS (Auroville / Puducherry references -> Shimla / Kufri)
    if listing.location:
        listing.location = listing.location.replace("Puducherry", "Shimla").replace("Auroville", "Kufri")
        
    if listing.title:
        listing.title = listing.title.replace("Puducherry", "Shimla").replace("Auroville", "Kufri")
        
    if listing.description:
        listing.description = listing.description.replace("Puducherry", "Shimla").replace("Auroville", "Kufri")

db.commit()
print("All images and location metadata completely fixed!")
