from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
import motor.motor_asyncio
import os
from bson import ObjectId

# Setup
router = APIRouter(prefix="/auth", tags=["Authentication"])
security = HTTPBearer()

# MongoDB Connection
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URI)
db = client.calmverse
users_collection = db.users

# Security Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Models
class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: Optional[str] = None

class UserLogin(BaseModel):
    username: str
    password: str

class User(BaseModel):
    id: str
    username: str
    email: str
    full_name: Optional[str] = None
    is_active: bool = True
    created_at: datetime
    calm_coins: int = 0

class Token(BaseModel):
    access_token: str
    token_type: str
    user: User

class TokenData(BaseModel):
    username: Optional[str] = None

# Helper Functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_user_by_username(username: str):
    user = await users_collection.find_one({"username": username})
    return user

async def get_user_by_email(email: str):
    user = await users_collection.find_one({"email": email})
    return user

async def authenticate_user(username: str, password: str):
    user = await get_user_by_username(username)
    if not user:
        return False
    if not verify_password(password, user["password"]):
        return False
    return user

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    
    user = await get_user_by_username(username=token_data.username)
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(current_user: dict = Depends(get_current_user)):
    if not current_user.get("is_active", True):
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

# Routes
@router.post("/register", response_model=Token)
async def register_user(user: UserCreate):
    # Check if user already exists
    existing_user = await get_user_by_username(user.username)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    existing_email = await get_user_by_email(user.email)
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user.password)
    user_doc = {
        "username": user.username,
        "email": user.email,
        "password": hashed_password,
        "full_name": user.full_name,
        "is_active": True,
        "created_at": datetime.utcnow(),
        "calm_coins": 100  # Welcome bonus
    }
    
    result = await users_collection.insert_one(user_doc)
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    # Get created user
    created_user = await users_collection.find_one({"_id": result.inserted_id})
    user_response = User(
        id=str(created_user["_id"]),
        username=created_user["username"],
        email=created_user["email"],
        full_name=created_user.get("full_name"),
        is_active=created_user["is_active"],
        created_at=created_user["created_at"],
        calm_coins=created_user["calm_coins"]
    )
    
    return Token(access_token=access_token, token_type="bearer", user=user_response)

@router.post("/login", response_model=Token)
async def login_user(form_data: UserLogin):
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )
    
    user_response = User(
        id=str(user["_id"]),
        username=user["username"],
        email=user["email"],
        full_name=user.get("full_name"),
        is_active=user["is_active"],
        created_at=user["created_at"],
        calm_coins=user.get("calm_coins", 0)
    )
    
    return Token(access_token=access_token, token_type="bearer", user=user_response)

@router.get("/me", response_model=User)
async def read_users_me(current_user: dict = Depends(get_current_active_user)):
    return User(
        id=str(current_user["_id"]),
        username=current_user["username"],
        email=current_user["email"],
        full_name=current_user.get("full_name"),
        is_active=current_user["is_active"],
        created_at=current_user["created_at"],
        calm_coins=current_user.get("calm_coins", 0)
    )

@router.put("/me", response_model=User)
async def update_user_profile(
    user_update: dict,
    current_user: dict = Depends(get_current_active_user)
):
    # Remove fields that shouldn't be updated
    allowed_fields = {"full_name", "email"}
    update_data = {k: v for k, v in user_update.items() if k in allowed_fields}
    
    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No valid fields to update"
        )
    
    # Check if email is being changed and if it already exists
    if "email" in update_data:
        existing_email = await get_user_by_email(update_data["email"])
        if existing_email and str(existing_email["_id"]) != str(current_user["_id"]):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
    
    await users_collection.update_one(
        {"_id": ObjectId(current_user["_id"])},
        {"$set": update_data}
    )
    
    # Get updated user
    updated_user = await users_collection.find_one({"_id": ObjectId(current_user["_id"])})
    
    return User(
        id=str(updated_user["_id"]),
        username=updated_user["username"],
        email=updated_user["email"],
        full_name=updated_user.get("full_name"),
        is_active=updated_user["is_active"],
        created_at=updated_user["created_at"],
        calm_coins=updated_user.get("calm_coins", 0)
    )
