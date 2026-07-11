import json
from database import SessionLocal, engine
import models

db = SessionLocal()
listings = db.query(models.Listing).all()

for listing in listings:
    try:
        amenities = json.loads(listing.amenities) if listing.amenities else []
    except:
        amenities = []
    
    # Ensure properties have some of the new amenities so filters work
    if listing.property_type in ["Apartment", "Flat", "Cottage", "Villa", "Home"]:
        if "Washer" not in amenities: amenities.append("Washer")
        if "Iron" not in amenities: amenities.append("Iron")
    
    if listing.property_type in ["Cottage", "Apartment"]:
        if "Free parking" not in amenities: amenities.append("Free parking")
        if "AC" not in amenities: amenities.append("AC")

    listing.amenities = json.dumps(amenities)

db.commit()
print("Amenities updated successfully!")
