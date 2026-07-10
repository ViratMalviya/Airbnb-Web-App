import json
from database import SessionLocal, engine
import models

models.Base.metadata.create_all(bind=engine)
db = SessionLocal()

host = db.query(models.User).filter(models.User.is_host == True).first()
if not host:
    host = models.User(name="Mock Host", email="mock@host.com", is_host=True)
    db.add(host)
    db.commit()
    db.refresh(host)

india_properties = [
    {
        "title": "Flat in Calangute",
        "description": "Beautiful flat with pool access.",
        "location": "Goa, India",
        "price_per_night": 10009.0,
        "property_type": "Flat",
        "amenities": json.dumps(["Wifi", "Pool"]),
        "image_urls": json.dumps(["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"]),
        "rating": 5.0
    },
    {
        "title": "Flat in Candolim",
        "description": "Lovely home near the beach.",
        "location": "Goa, India",
        "price_per_night": 11499.0,
        "property_type": "Flat",
        "amenities": json.dumps(["Wifi", "Kitchen"]),
        "image_urls": json.dumps(["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80"]),
        "rating": 4.93
    },
    {
        "title": "Farm stay in Auroville",
        "description": "Peaceful farm stay surrounded by nature.",
        "location": "Puducherry, India",
        "price_per_night": 4337.0,
        "property_type": "Farm",
        "amenities": json.dumps(["Wifi", "Nature"]),
        "image_urls": json.dumps(["https://images.unsplash.com/photo-1588880331179-bc9b93a8cb65?w=800&q=80"]),
        "rating": 4.91
    },
    {
        "title": "Home in Puducherry",
        "description": "Cozy home in the heart of Puducherry.",
        "location": "Puducherry, India",
        "price_per_night": 4564.0,
        "property_type": "Home",
        "amenities": json.dumps(["Wifi", "AC"]),
        "image_urls": json.dumps(["https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&q=80"]),
        "rating": 4.96
    }
]

for p in india_properties:
    # check if exists
    if not db.query(models.Listing).filter(models.Listing.title == p['title']).first():
        new_listing = models.Listing(**p, host_id=host.id)
        db.add(new_listing)

db.commit()
print("Seeded India properties successfully!")
