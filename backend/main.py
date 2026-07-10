from fastapi import FastAPI, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from datetime import date
import json

from . import models, schemas
from .database import engine, get_db

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
        
        # Create listings
        amenities = json.dumps(["Wifi", "Kitchen", "Free parking"])
        images1 = json.dumps(["https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800"])
        images2 = json.dumps(["https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=800"])
        
        listing1 = models.Listing(
            host_id=host.id,
            title="Cozy Beachfront Cottage",
            description="A lovely beachfront cottage with beautiful views.",
            location="Malibu, USA",
            price_per_night=250.0,
            property_type="Cottage",
            amenities=amenities,
            image_urls=images1,
            rating=4.9
        )
        
        listing2 = models.Listing(
            host_id=host.id,
            title="Modern Downtown Loft",
            description="Experience city life in this spacious loft.",
            location="New York, USA",
            price_per_night=150.0,
            property_type="Apartment",
            amenities=amenities,
            image_urls=images2,
            rating=4.7
        )
        
        db.add(listing1)
        db.add(listing2)
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
    db: Session = Depends(get_db)
):
    query = db.query(models.Listing)
    if location:
        query = query.filter(models.Listing.location.ilike(f"%{location}%"))
    listings = query.offset(skip).limit(limit).all()
    return listings

@app.get("/listings/{listing_id}", response_model=schemas.Listing)
def read_listing(listing_id: str, db: Session = Depends(get_db)):
    listing = db.query(models.Listing).filter(models.Listing.id == listing_id).first()
    if listing is None:
        raise HTTPException(status_code=404, detail="Listing not found")
    return listing

@app.post("/listings/", response_model=schemas.Listing)
def create_listing(listing: schemas.ListingCreate, host_id: str, db: Session = Depends(get_db)):
    db_listing = models.Listing(**listing.dict(), host_id=host_id)
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
