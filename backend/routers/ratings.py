from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from .deps import get_current_user

router = APIRouter()

@router.post("/", response_model=schemas.BookingResponse)
def create_rating(rating_data: schemas.RatingCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    booking = db.query(models.Booking).filter(models.Booking.id == rating_data.booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
        
    if booking.status != "completed":
        raise HTTPException(status_code=400, detail="Cannot rate an incomplete job")
        
    rating = models.Rating(
        booking_id=booking.id,
        customer_id=current_user.id,
        provider_id=booking.provider_id,
        stars=rating_data.stars
    )
    db.add(rating)
    
    provider = db.query(models.ProviderProfile).filter(models.ProviderProfile.user_id == booking.provider_id).first()
    if provider:
        all_ratings = db.query(models.Rating).filter(models.Rating.provider_id == provider.user_id).all()
        total_stars = sum([r.stars for r in all_ratings]) + rating_data.stars
        provider.rating = total_stars / (len(all_ratings) + 1)
        
    db.commit()
    db.refresh(booking)
    return booking
