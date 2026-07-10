from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, Text, Date
from sqlalchemy.orm import relationship
import uuid
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    is_host = Column(Boolean, default=False)
    avatar_url = Column(String, nullable=True)

    listings = relationship("Listing", back_populates="host")
    bookings = relationship("Booking", back_populates="guest")

class Listing(Base):
    __tablename__ = "listings"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    host_id = Column(String, ForeignKey("users.id"))
    title = Column(String, index=True)
    description = Column(Text)
    location = Column(String)
    price_per_night = Column(Float)
    property_type = Column(String)
    amenities = Column(String) # Stored as JSON string
    image_urls = Column(String) # Stored as JSON string
    rating = Column(Float, default=0.0)

    host = relationship("User", back_populates="listings")
    bookings = relationship("Booking", back_populates="listing")

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    listing_id = Column(String, ForeignKey("listings.id"))
    guest_id = Column(String, ForeignKey("users.id"))
    check_in = Column(Date)
    check_out = Column(Date)
    guests = Column(Integer)
    total_price = Column(Float)
    status = Column(String, default="Confirmed")

    listing = relationship("Listing", back_populates="bookings")
    guest = relationship("User", back_populates="bookings")
