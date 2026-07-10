import json
from database import SessionLocal, engine
import models

models.Base.metadata.create_all(bind=engine)
db = SessionLocal()

host = db.query(models.User).filter(models.User.is_host == True).first()

more_services = [
    {
        "title": "Gourmet Private Chef",
        "description": "Exquisite meals prepared at your stay",
        "location": "South Goa",
        "price_per_night": 4500.0,
        "property_type": "Service",
        "amenities": json.dumps(["Chefs", "Food"]),
        "image_urls": json.dumps(["https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&q=80"]),
        "rating": 5.0
    },
    {
        "title": "Deep Tissue Massage",
        "description": "Relaxing deep tissue massage",
        "location": "South Goa",
        "price_per_night": 2500.0,
        "property_type": "Service",
        "amenities": json.dumps(["Massage", "Wellness"]),
        "image_urls": json.dumps(["https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80"]),
        "rating": 4.9
    },
    {
        "title": "Healthy Prepared Meals",
        "description": "Daily delivery of prepared healthy meals",
        "location": "South Goa",
        "price_per_night": 1800.0,
        "property_type": "Service",
        "amenities": json.dumps(["Prepared meals", "Food"]),
        "image_urls": json.dumps(["https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80"]),
        "rating": 4.8
    },
    {
        "title": "Professional Make-up Artist",
        "description": "Make-up for events and photoshoots",
        "location": "South Goa",
        "price_per_night": 3000.0,
        "property_type": "Service",
        "amenities": json.dumps(["Make-up", "Beauty"]),
        "image_urls": json.dumps(["https://images.unsplash.com/photo-1516975080661-4680fb827071?w=800&q=80"]),
        "rating": 5.0
    },
    {
        "title": "Hair Styling & Care",
        "description": "Professional hair styling at your location",
        "location": "South Goa",
        "price_per_night": 2200.0,
        "property_type": "Service",
        "amenities": json.dumps(["Hair", "Beauty"]),
        "image_urls": json.dumps(["https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80"]),
        "rating": 4.7
    },
    {
        "title": "Luxury Spa Treatments",
        "description": "Full spa experience delivered to you",
        "location": "South Goa",
        "price_per_night": 6000.0,
        "property_type": "Service",
        "amenities": json.dumps(["Spa treatments", "Wellness"]),
        "image_urls": json.dumps(["https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80"]),
        "rating": 4.9
    },
    {
        "title": "Event Catering",
        "description": "Catering for small and large groups",
        "location": "South Goa",
        "price_per_night": 8000.0,
        "property_type": "Service",
        "amenities": json.dumps(["Catering", "Food"]),
        "image_urls": json.dumps(["https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80"]),
        "rating": 4.9
    }
]

for p in more_services:
    if not db.query(models.Listing).filter(models.Listing.title == p['title']).first():
        new_listing = models.Listing(**p, host_id=host.id)
        db.add(new_listing)

db.commit()
print("Seeded more services successfully!")
