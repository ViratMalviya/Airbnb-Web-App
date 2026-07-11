import json
from database import SessionLocal
import models

db = SessionLocal()
listings = db.query(models.Listing).all()

working_image = "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800"

for listing in listings:
    if listing.image_urls:
        if "1502672260266" in listing.image_urls:
            # Replace the broken image with a working one
            images = json.loads(listing.image_urls)
            images = [working_image if "1502672260266" in img else img for img in images]
            listing.image_urls = json.dumps(images)

        # Fix Shimla specifically with the known working list just to be safe
        if "Shimla" in listing.location:
             shimla_working_images = [
                 "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800",
                 "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
                 "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800",
                 "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=800",
                 "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=800"
             ]
             # assign one based on hash or just randomly
             # we will just assign the first one for simplicity or we can do based on id hash
             hash_val = sum([ord(c) for c in listing.id])
             listing.image_urls = json.dumps([shimla_working_images[hash_val % len(shimla_working_images)]])

db.commit()
print("Broken images fixed!")
