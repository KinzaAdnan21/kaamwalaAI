from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class Token(BaseModel):
    access_token: str
    token_type: str

class OTPRequest(BaseModel):
    email: str

class OTPVerify(BaseModel):
    email: str
    otp: str

class UserCreate(BaseModel):
    email: str
    name: Optional[str] = None
    city: Optional[str] = None
    role: Optional[str] = None

class ProviderProfileCreate(BaseModel):
    skills: List[str]
    experience_years: int

class UserResponse(BaseModel):
    id: int
    email: str
    name: Optional[str]
    city: Optional[str]
    role: Optional[str]
    is_verified: bool

    class Config:
        from_attributes = True

class ProviderProfileResponse(BaseModel):
    id: int
    user_id: int
    skills: List[str]
    experience_years: int
    rating: float
    jobs_count: int
    is_available: bool
    user: Optional[UserResponse] = None

    class Config:
        from_attributes = True

class BookingCreate(BaseModel):
    category: str
    issue_description: str
    address: str
    landmark: Optional[str] = None

class BookingResponse(BaseModel):
    id: int
    customer_id: int
    provider_id: Optional[int]
    category: str
    issue_description: str
    status: str
    price_min: Optional[int]
    price_max: Optional[int]
    final_amount: Optional[int]
    address: str
    landmark: Optional[str]
    created_at: datetime
    customer: Optional[UserResponse] = None
    provider: Optional[UserResponse] = None

    class Config:
        from_attributes = True

class RatingCreate(BaseModel):
    booking_id: int
    stars: int

class DiagnosisRequest(BaseModel):
    issue_description: str

class Cause(BaseModel):
    title: str
    sub: str
    pct: int
    color: str
    range: str

class DiagnosisResponse(BaseModel):
    causes: List[Cause]
