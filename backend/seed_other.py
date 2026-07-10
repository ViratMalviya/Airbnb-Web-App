import json
from database import SessionLocal, engine
import models

models.Base.metadata.create_all(bind=engine)
db = SessionLocal()

host = db.query(models.User).filter(models.User.is_host == True).first()

experiences_and_services = [
    # Experiences
    {
        "title": "Experience the Offbeat",
        "description": "Unique local experience in Bengaluru",
        "location": "Bengaluru",
        "price_per_night": 1450.0,
        "property_type": "Experience",
        "amenities": json.dumps(["Guide"]),
        "image_urls": json.dumps(["https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&q=80"]),
        "rating": 5.0
    },
    {
        "title": "Play with clay",
        "description": "Fun weekend pottery workshop",
        "location": "Bengaluru",
        "price_per_night": 2000.0,
        "property_type": "Experience",
        "amenities": json.dumps(["Workshop", "Materials included"]),
        "image_urls": json.dumps(["https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&q=80"]),
        "rating": 4.9
    },
    {
        "title": "Street Food Tour",
        "description": "Local market street food tour",
        "location": "Bengaluru",
        "price_per_night": 3333.0,
        "property_type": "Experience",
        "amenities": json.dumps(["Food", "Guide"]),
        "image_urls": json.dumps(["https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80"]),
        "rating": 4.98
    },
    {
        "title": "Explore Halasuru",
        "description": "Explore cultural sites",
        "location": "Bengaluru",
        "price_per_night": 4250.0,
        "property_type": "Experience",
        "amenities": json.dumps(["Culture", "Walking"]),
        "image_urls": json.dumps(["https://images.unsplash.com/photo-1515542706656-8e6ef17a1521?w=800&q=80"]),
        "rating": 4.99
    },
    # Services
    {
        "title": "Goa photo shoot",
        "description": "Professional photo shoot by Samuel",
        "location": "South Goa",
        "price_per_night": 7500.0,
        "property_type": "Service",
        "amenities": json.dumps(["Photography"]),
        "image_urls": json.dumps(["https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&q=80"]),
        "rating": 5.0
    },
    {
        "title": "Holistic yoga class",
        "description": "Yoga class by Manoj",
        "location": "South Goa",
        "price_per_night": 1200.0,
        "property_type": "Service",
        "amenities": json.dumps(["Yoga", "Wellness"]),
        "image_urls": json.dumps(["https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80"]),
        "rating": 5.0
    },
    {
        "title": "Romantic portraits",
        "description": "Portraits by Sherwyn",
        "location": "South Goa",
        "price_per_night": 5500.0,
        "property_type": "Service",
        "amenities": json.dumps(["Photography"]),
        "image_urls": json.dumps(["https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=800&q=80"]),
        "rating": 4.9
    },
    {
        "title": "Strength training",
        "description": "Training by Shane",
        "location": "South Goa",
        "price_per_night": 720.0,
        "property_type": "Service",
        "amenities": json.dumps(["Fitness"]),
        "image_urls": json.dumps(["https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80"]),
        "rating": 4.8
    }
]

for p in experiences_and_services:
    if not db.query(models.Listing).filter(models.Listing.title == p['title']).first():
        new_listing = models.Listing(**p, host_id=host.id)
        db.add(new_listing)

db.commit()
print("Seeded Experiences and Services successfully!")
