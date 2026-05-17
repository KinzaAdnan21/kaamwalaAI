from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models
import schemas
from .deps import get_current_user

router = APIRouter()

@router.post("/", response_model=schemas.BookingResponse)
def create_booking(booking_data: schemas.BookingCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    booking = models.Booking(
        customer_id=current_user.id,
        category=booking_data.category,
        issue_description=booking_data.issue_description,
        address=booking_data.address,
        landmark=booking_data.landmark,
        status="pending"
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking

@router.get("/my-bookings", response_model=List[schemas.BookingResponse])
def get_my_bookings(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role == "provider":
        return db.query(models.Booking).filter(models.Booking.provider_id == current_user.id).all()
    else:
        return db.query(models.Booking).filter(models.Booking.customer_id == current_user.id).all()

@router.put("/{booking_id}/assign", response_model=schemas.BookingResponse)
def assign_provider(booking_id: int, provider_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
        
    provider = db.query(models.ProviderProfile).filter(models.ProviderProfile.user_id == provider_id).first()
    if not provider:
        raise HTTPException(status_code=404, detail="Provider not found")
        
    booking.provider_id = provider_id
    booking.status = "scheduled"
    db.commit()
    db.refresh(booking)
    return booking

@router.put("/{booking_id}/status", response_model=schemas.BookingResponse)
def update_booking_status(booking_id: int, status: str, final_amount: int = None, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
        
    valid_statuses = ["pending", "scheduled", "on-way", "arriving-soon", "arrived", "working", "completed"]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail="Invalid status")
        
    booking.status = status
    if final_amount is not None:
        booking.final_amount = final_amount
        
    if status == "completed" and booking.provider_id:
        provider = db.query(models.ProviderProfile).filter(models.ProviderProfile.user_id == booking.provider_id).first()
        if provider:
            provider.jobs_count += 1
            
    db.commit()
    db.refresh(booking)
    return booking
