from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import auth, users, providers, bookings, ratings, ai

# Create DB tables
# Note: Using Base.metadata.create_all for quick startup. 
# For production migrations, Alembic should be used.
Base.metadata.create_all(bind=engine)

app = FastAPI(title="KaamWala AI API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development, allow all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(providers.router, prefix="/providers", tags=["providers"])
app.include_router(bookings.router, prefix="/bookings", tags=["bookings"])
app.include_router(ratings.router, prefix="/ratings", tags=["ratings"])
app.include_router(ai.router, prefix="/ai", tags=["ai"])

@app.get("/")
def read_root():
    return {"message": "Welcome to KaamWala AI API"}
