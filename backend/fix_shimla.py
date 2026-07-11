import json
import random
from database import SessionLocal
import models

db = SessionLocal()
shimla_listings = db.query(models.Listing).filter(models.Listing.location.contains("Shimla")).all()

working_images = [
    "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=800"
]

for idx, listing in enumerate(shimla_listings):
    image = working_images[idx % len(working_images)]
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

db.commit()
print("Shimla images fixed!")
