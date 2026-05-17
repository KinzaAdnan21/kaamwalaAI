from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from .deps import get_current_user

router = APIRouter()

@router.get("/me", response_model=schemas.UserResponse)
def get_me(current_user: models.User = Depends(get_current_user)):
    return current_user

@router.post("/register", response_model=schemas.UserResponse)
def register(user_data: schemas.UserCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    current_user.name = user_data.name
    current_user.city = user_data.city
    current_user.role = user_data.role
    db.commit()
    db.refresh(current_user)
    return current_user
