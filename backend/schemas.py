from pydantic import BaseModel
from typing import List, Optional
from datetime import date

class UserBase(BaseModel):
    name: str
    email: str
    is_host: bool = False
    avatar_url: Optional[str] = None

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: str

    class Config:
        orm_mode = True

class ListingBase(BaseModel):
    title: str
    description: str
    location: str
    price_per_night: float
    property_type: str
    amenities: str
    image_urls: str

class ListingCreate(ListingBase):
    pass

class Listing(ListingBase):
    id: str
    host_id: str
    rating: float

    class Config:
        orm_mode = True

class BookingBase(BaseModel):
    listing_id: str
    check_in: date
    check_out: date
    guests: int
    total_price: float

class BookingCreate(BookingBase):
    pass

class Booking(BookingBase):
    id: str
    guest_id: str
    status: str

    class Config:
        orm_mode = True
