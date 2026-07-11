import json
from database import SessionLocal
import models

db = SessionLocal()
listings = db.query(models.Listing).all()

unsplash_images = [
    "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1502672260266-1c1e52d1590c?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1576941089067-2de3c901e126?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1505843513577-22bb7d21e455?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b46a?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1605276374104-a6283e92ca01?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&q=80&w=800"
]

for i, listing in enumerate(listings):
    if listing.location and "Puducherry" in listing.location:
        listing.location = listing.location.replace("Puducherry", "Shimla")
    if listing.description and "Puducherry" in listing.description:
        listing.description = listing.description.replace("Puducherry", "Shimla")
        
    image_url = unsplash_images[i % len(unsplash_images)]
    
    current_images = json.loads(listing.image_urls) if listing.image_urls else []
    if current_images:
        current_images[0] = image_url
    else:
        current_images = [image_url]
        
    listing.image_urls = json.dumps(current_images)

db.commit()
print("Database updated successfully!")
