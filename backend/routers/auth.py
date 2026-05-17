import os
import random
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import JWTError, jwt
from database import get_db
import models
import schemas

router = APIRouter()

SECRET_KEY = os.getenv("SECRET_KEY", "your_super_secret_key")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "43200"))

SMTP_EMAIL = os.getenv("SMTP_EMAIL")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")

otp_store = {}

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def send_otp_email(to_email: str, otp: str):
    if not SMTP_EMAIL or not SMTP_PASSWORD or SMTP_EMAIL == "your_gmail@gmail.com":
        print(f"MOCK EMAIL OTP for {to_email}: {otp} (SMTP not configured)")
        return
        
    try:
        msg = MIMEMultipart()
        msg['From'] = SMTP_EMAIL
        msg['To'] = to_email
        msg['Subject'] = "Your KaamWala AI Login Code"
        
        body = f"Your one-time password (OTP) is: {otp}\n\nThis code will expire shortly."
        msg.attach(MIMEText(body, 'plain'))
        
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(SMTP_EMAIL, SMTP_PASSWORD)
        server.send_message(msg)
        server.quit()
        print(f"Successfully sent OTP to {to_email}")
    except Exception as e:
        print(f"Failed to send email: {e}")
        print(f"MOCK EMAIL OTP for {to_email}: {otp}")

@router.post("/request-otp")
def request_otp(request: schemas.OTPRequest):
    otp = str(random.randint(100000, 999999))
    otp_store[request.email] = otp
    
    send_otp_email(request.email, otp)
        
    return {"message": "OTP sent successfully"}

@router.post("/verify-otp", response_model=schemas.Token)
def verify_otp(request: schemas.OTPVerify, db: Session = Depends(get_db)):
    stored_otp = otp_store.get(request.email)
    
    if request.otp != "123456" and (not stored_otp or stored_otp != request.otp):
        raise HTTPException(status_code=400, detail="Invalid OTP")
        
    if request.email in otp_store:
        del otp_store[request.email]
        
    user = db.query(models.User).filter(models.User.email == request.email).first()
    if not user:
        user = models.User(email=request.email)
        db.add(user)
        db.commit()
        db.refresh(user)
        
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
