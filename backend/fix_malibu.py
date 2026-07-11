import json
from database import SessionLocal
import models

db = SessionLocal()
malibu_listings = db.query(models.Listing).filter(models.Listing.location.contains("Malibu")).all()

working_image = "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=800"

for listing in malibu_listings:
    current_images = json.loads(listing.image_urls) if listing.image_urls else []
    if current_images:
        current_images[0] = working_image
    else:
        current_images = [working_image]
    listing.image_urls = json.dumps(current_images)

db.commit()
print("Malibu images fixed!")
