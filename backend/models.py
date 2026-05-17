from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Float, Text, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String, nullable=True)
    city = Column(String, nullable=True)
    role = Column(String, nullable=True) # 'customer' or 'provider'
    is_verified = Column(Boolean, default=False)
    
    provider_profile = relationship("ProviderProfile", back_populates="user", uselist=False)
    customer_bookings = relationship("Booking", back_populates="customer", foreign_keys="Booking.customer_id")
    provider_bookings = relationship("Booking", back_populates="provider", foreign_keys="Booking.provider_id")

class ProviderProfile(Base):
    __tablename__ = "provider_profiles"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    skills = Column(JSON, default=[])
    experience_years = Column(Integer, default=0)
    rating = Column(Float, default=0.0)
    jobs_count = Column(Integer, default=0)
    is_available = Column(Boolean, default=True)
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)
    
    user = relationship("User", back_populates="provider_profile")

class Booking(Base):
    __tablename__ = "bookings"
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("users.id"))
    provider_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    category = Column(String)
    issue_description = Column(Text)
    status = Column(String, default="pending") # pending, scheduled, on-way, arriving-soon, arrived, working, completed
    price_min = Column(Integer, nullable=True)
    price_max = Column(Integer, nullable=True)
    final_amount = Column(Integer, nullable=True)
    address = Column(String)
    landmark = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    customer = relationship("User", foreign_keys=[customer_id], back_populates="customer_bookings")
    provider = relationship("User", foreign_keys=[provider_id], back_populates="provider_bookings")
    rating_entry = relationship("Rating", back_populates="booking", uselist=False)

class Rating(Base):
    __tablename__ = "ratings"
    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"))
    customer_id = Column(Integer, ForeignKey("users.id"))
    provider_id = Column(Integer, ForeignKey("users.id"))
    stars = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)

    booking = relationship("Booking", back_populates="rating_entry")
    customer = relationship("User", foreign_keys=[customer_id])
    provider = relationship("User", foreign_keys=[provider_id])
