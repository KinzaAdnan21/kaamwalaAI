from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models
import schemas
from .deps import get_current_user
import json

router = APIRouter()

@router.post("/me", response_model=schemas.ProviderProfileResponse)
def create_or_update_provider_profile(profile_data: schemas.ProviderProfileCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != "provider":
        current_user.role = "provider"
        
    profile = db.query(models.ProviderProfile).filter(models.ProviderProfile.user_id == current_user.id).first()
    if profile:
        profile.skills = profile_data.skills
        profile.experience_years = profile_data.experience_years
    else:
        profile = models.ProviderProfile(
            user_id=current_user.id,
            skills=profile_data.skills,
            experience_years=profile_data.experience_years
        )
        db.add(profile)
    
    db.commit()
    db.refresh(profile)
    return profile

@router.get("/me", response_model=schemas.ProviderProfileResponse)
def get_provider_profile(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    profile = db.query(models.ProviderProfile).filter(models.ProviderProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Provider profile not found")
    return profile

@router.get("/search", response_model=List[schemas.ProviderProfileResponse])
def search_providers(category: str, city: str = None, db: Session = Depends(get_db)):
    query = db.query(models.ProviderProfile).join(models.User)
    
    profiles = query.filter(models.ProviderProfile.is_available == True).all()
    
    result = []
    for p in profiles:
        skills = p.skills or []
        if category in skills:
            if city is None or p.user.city == city:
                result.append(p)
                
    return result
