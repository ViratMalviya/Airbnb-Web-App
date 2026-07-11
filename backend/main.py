from fastapi import FastAPI, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from datetime import date
import json

import models, schemas
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Airbnb Clone API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Utility to seed the database if empty
@app.on_event("startup")
def seed_db():
    db = next(get_db())
    if db.query(models.User).first() is None:
        # Create a mock host and mock guest
        host = models.User(name="John Host", email="john@example.com", is_host=True, avatar_url="https://i.pravatar.cc/150?u=john")
        guest = models.User(name="Jane Guest", email="jane@example.com", is_host=False, avatar_url="https://i.pravatar.cc/150?u=jane")
        db.add(host)
        db.add(guest)
        db.commit()
        db.refresh(host)
        
        amenities_home = json.dumps(["Wifi", "Kitchen", "Free parking", "AC", "Pool"])
        amenities_service = json.dumps(["Cleaning", "Maintenance"])
        
        img1 = json.dumps(["https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800"])
        img2 = json.dumps(["https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=800"])
        img3 = json.dumps(["https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&q=80&w=800"])
        img4 = json.dumps(["https://images.unsplash.com/photo-1542718144-668dea81ec80?auto=format&fit=crop&q=80&w=800"])
        img5 = json.dumps(["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800"])
        img6 = json.dumps(["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800"])
        img7 = json.dumps(["https://images.unsplash.com/photo-1517436073-3b1b1519fce6?auto=format&fit=crop&q=80&w=800"])
        
        listings = [
            models.Listing(host_id=host.id, title="Cozy Beachfront Cottage", description="A lovely beachfront cottage.", location="Malibu, USA", price_per_night=250.0, property_type="Cottage", amenities=amenities_home, image_urls=img1, rating=4.9),
            models.Listing(host_id=host.id, title="Modern Downtown Loft", description="Experience city life.", location="New York, USA", price_per_night=150.0, property_type="Apartment", amenities=amenities_home, image_urls=img2, rating=4.7),
            models.Listing(host_id=host.id, title="Luxury Villa with Pool", description="A beautiful villa with a private pool.", location="Goa, India", price_per_night=300.0, property_type="Villa", amenities=amenities_home, image_urls=img3, rating=4.95),
            models.Listing(host_id=host.id, title="Historic Heritage Home", description="Stay in a 200-year old heritage home.", location="Jaipur, India", price_per_night=120.0, property_type="House", amenities=amenities_home, image_urls=img4, rating=4.8),
            models.Listing(host_id=host.id, title="Parisian Apartment with Balcony", description="Wake up to the view of Paris.", location="Paris, France", price_per_night=210.0, property_type="Apartment", amenities=amenities_home, image_urls=img5, rating=4.9),
            # Experience
            models.Listing(host_id=host.id, title="Sunset Yoga on the Beach", description="Relaxing yoga session at sunset.", location="Bali, Indonesia", price_per_night=20.0, property_type="Experience", amenities=json.dumps([]), image_urls=img6, rating=5.0),
            # Service
            models.Listing(host_id=host.id, title="Professional Deep Cleaning", description="Top-notch cleaning service for your home.", location="Anywhere", price_per_night=100.0, property_type="Service", amenities=amenities_service, image_urls=img7, rating=4.8)
        ]
        
        for l in listings:
            db.add(l)
        
        db.commit()
    db.close()

# Users
@app.get("/users/", response_model=List[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = db.query(models.User).offset(skip).limit(limit).all()
    return users

# Listings
@app.get("/listings/", response_model=List[schemas.Listing])
def read_listings(
    skip: int = 0, 
    limit: int = 100, 
    location: Optional[str] = None,
    min_guests: Optional[int] = None,
    property_type: Optional[str] = Query(None),
    amenity: Optional[List[str]] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(models.Listing)
    if location:
        query = query.filter(models.Listing.location.ilike(f"%{location}%"))
    if min_guests:
        query = query.filter(models.Listing.max_guests >= min_guests)
    if property_type:
        if property_type == "Home":
            query = query.filter(models.Listing.property_type.notin_(["Experience", "Service"]))
        else:
            query = query.filter(models.Listing.property_type == property_type)
    if amenity:
        for a in amenity:
            query = query.filter(models.Listing.amenities.ilike(f"%{a}%"))
    listings = query.offset(skip).limit(limit).all()
    return listings

@app.get("/listings/{listing_id}", response_model=schemas.Listing)
def read_listing(listing_id: str, db: Session = Depends(get_db)):
    listing = db.query(models.Listing).filter(models.Listing.id == listing_id).first()
    if listing is None:
        raise HTTPException(status_code=404, detail="Listing not found")
    return listing

@app.post("/listings/", response_model=schemas.Listing)
def create_listing(listing: schemas.ListingCreate, host_id: Optional[str] = None, db: Session = Depends(get_db)):
    if not host_id:
        host = db.query(models.User).filter(models.User.is_host == True).first()
        host_id = host.id if host else "mock-host-id"
    
    # serialize image URLs and amenities if passed as array
    db_listing = models.Listing(**listing.dict(), host_id=host_id)
    if isinstance(db_listing.image_urls, list):
        db_listing.image_urls = json.dumps(db_listing.image_urls)
    elif not db_listing.image_urls:
        # Mock image
        db_listing.image_urls = json.dumps(["https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800"])
    
    if not db_listing.amenities:
        db_listing.amenities = json.dumps(["Wifi", "Kitchen"])
        
    db.add(db_listing)
    db.commit()
    db.refresh(db_listing)
    return db_listing

@app.delete("/listings/{listing_id}")
def delete_listing(listing_id: str, db: Session = Depends(get_db)):
    listing = db.query(models.Listing).filter(models.Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    db.delete(listing)
    db.commit()
    return {"message": "Listing deleted successfully"}

@app.put("/listings/{listing_id}", response_model=schemas.Listing)
def update_listing(listing_id: str, listing: schemas.ListingCreate, db: Session = Depends(get_db)):
    db_listing = db.query(models.Listing).filter(models.Listing.id == listing_id).first()
    if not db_listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    update_data = listing.dict(exclude_unset=True)
    if isinstance(update_data.get('image_urls'), list):
        update_data['image_urls'] = json.dumps(update_data['image_urls'])
        
    for key, value in update_data.items():
        setattr(db_listing, key, value)
        
    db.commit()
    db.refresh(db_listing)
    return db_listing

@app.get("/listings/host/{host_id}", response_model=List[schemas.Listing])
def get_host_listings(host_id: str, db: Session = Depends(get_db)):
    return db.query(models.Listing).filter(models.Listing.host_id == host_id).all()

# Bookings
@app.post("/bookings/", response_model=schemas.Booking)
def create_booking(booking: schemas.BookingCreate, guest_id: str, db: Session = Depends(get_db)):
    # Check for overlaps
    overlapping = db.query(models.Booking).filter(
        models.Booking.listing_id == booking.listing_id,
        models.Booking.check_in < booking.check_out,
        models.Booking.check_out > booking.check_in,
        models.Booking.status == "Confirmed"
    ).first()
    if overlapping:
        raise HTTPException(status_code=400, detail="Dates are already booked")
        
    db_booking = models.Booking(**booking.dict(), guest_id=guest_id)
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking

@app.get("/bookings/guest/{guest_id}", response_model=List[schemas.Booking])
def get_guest_bookings(guest_id: str, db: Session = Depends(get_db)):
    bookings = db.query(models.Booking).filter(models.Booking.guest_id == guest_id).all()
    return bookings

@app.get("/bookings/listing/{listing_id}", response_model=List[schemas.Booking])
def get_listing_bookings(listing_id: str, db: Session = Depends(get_db)):
    bookings = db.query(models.Booking).filter(
        models.Booking.listing_id == listing_id,
        models.Booking.status == "Confirmed"
    ).all()
    return bookings

@app.get("/bookings/host/{host_id}", response_model=List[schemas.Booking])
def get_host_bookings(host_id: str, db: Session = Depends(get_db)):
    # Join bookings with listings to filter by host_id
    bookings = db.query(models.Booking).join(models.Listing).filter(models.Listing.host_id == host_id).all()
    return bookings

# Reviews
@app.post("/reviews/", response_model=schemas.Review)
def create_review(review: schemas.ReviewCreate, guest_id: str, db: Session = Depends(get_db)):
    db_review = models.Review(**review.dict(), guest_id=guest_id, created_at=date.today())
    db.add(db_review)
    
    # Update listing average rating
    listing = db.query(models.Listing).filter(models.Listing.id == review.listing_id).first()
    if listing:
        current_reviews = db.query(models.Review).filter(models.Review.listing_id == review.listing_id).all()
        total_rating = sum(r.rating for r in current_reviews) + review.rating
        listing.rating = total_rating / (len(current_reviews) + 1)
        
    db.commit()
    db.refresh(db_review)
    return db_review

@app.get("/reviews/listing/{listing_id}", response_model=List[schemas.Review])
def get_listing_reviews(listing_id: str, db: Session = Depends(get_db)):
    return db.query(models.Review).filter(models.Review.listing_id == listing_id).all()
