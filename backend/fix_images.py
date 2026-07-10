import json
from database import SessionLocal, engine
import models

models.Base.metadata.create_all(bind=engine)
db = SessionLocal()

# Find any listing with the broken image URL and fix it
broken_url = "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb65?w=800&q=80"
broken_url_2 = "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb65" # without query params
fixed_url = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80"

listings = db.query(models.Listing).all()
for listing in listings:
    if broken_url in listing.image_urls or broken_url_2 in listing.image_urls:
        print(f"Fixing broken image for listing: {listing.title}")
        urls = json.loads(listing.image_urls)
        new_urls = [fixed_url if (broken_url in u or broken_url_2 in u) else u for u in urls]
        listing.image_urls = json.dumps(new_urls)

db.commit()
print("Fixed broken images in DB successfully!")
