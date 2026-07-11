import uuid
import json
from database import SessionLocal
import models

db = SessionLocal()
listings = db.query(models.Listing).all()

# Group by type
homes = [l for l in listings if l.property_type not in ["Experience", "Service"]]
experiences = [l for l in listings if l.property_type == "Experience"]
services = [l for l in listings if l.property_type == "Service"]

host_id = listings[0].host_id

def duplicate_to_count(items, target_count):
    if not items: return
    current_count = len(items)
    index = 0
    while current_count < target_count:
        base = items[index % len(items)]
        new_listing = models.Listing(
            host_id=host_id,
            title=base.title + f" {current_count + 1}",
            description=base.description,
            location=base.location,
            price_per_night=base.price_per_night,
            property_type=base.property_type,
            amenities=base.amenities,
            image_urls=base.image_urls,
            rating=base.rating
        )
        db.add(new_listing)
        current_count += 1
        index += 1

duplicate_to_count(homes, 15)
duplicate_to_count(experiences, 15)
duplicate_to_count(services, 15)

db.commit()
print("Duplication complete!")
