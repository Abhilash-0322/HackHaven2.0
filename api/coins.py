from fastapi import APIRouter, HTTPException, Body, Depends
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from bson import ObjectId
import motor.motor_asyncio
import os

# Setup Router
router = APIRouter(
    prefix="/coins",
    tags=["Calm Coins"],
    responses={404: {"description": "Not found"}},
)

# MongoDB Connection
client = motor.motor_asyncio.AsyncIOMotorClient(os.environ.get("MONGODB_URI", "mongodb://localhost:27017"))
db = client.calmverse
coins_collection = db.calm_coins
transactions_collection = db.coin_transactions

# Models
class CalmCoinsBalance(BaseModel):
    user_id: str
    balance: int = 0
    last_updated: datetime = Field(default_factory=datetime.now)

class CoinTransaction(BaseModel):
    user_id: str
    amount: int
    transaction_type: str  # "earn" or "spend"
    source: str  # "journal", "appointment", etc.
    description: str
    timestamp: datetime = Field(default_factory=datetime.now)

class CoinTransactionResponse(BaseModel):
    transaction_id: str
    user_id: str
    amount: int
    transaction_type: str
    source: str
    description: str
    timestamp: datetime
    new_balance: int

# Endpoints
@router.get("/balance/{user_id}", response_description="Get user's coin balance")
async def get_balance(user_id: str):
    """Get the Calm Coins balance for a user"""
    user_balance = await coins_collection.find_one({"user_id": user_id})
    
    if not user_balance:
        # Create a new balance record for this user with 0 coins
        new_balance = CalmCoinsBalance(user_id=user_id)
        await coins_collection.insert_one(new_balance.dict())
        return {"user_id": user_id, "balance": 0}
    
    return {"user_id": user_balance["user_id"], "balance": user_balance["balance"]}

@router.post("/earn", response_description="Earn Calm Coins")
async def earn_coins(transaction: CoinTransaction = Body(...)):
    """Add coins to a user's balance (for completing journals, etc.)"""
    if transaction.transaction_type != "earn":
        raise HTTPException(status_code=400, detail="Transaction type must be 'earn' for this endpoint")
    
    if transaction.amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be positive")
    
    # Get current balance or create new record
    user_balance = await coins_collection.find_one({"user_id": transaction.user_id})
    
    if not user_balance:
        new_balance = CalmCoinsBalance(user_id=transaction.user_id, balance=transaction.amount)
        await coins_collection.insert_one(new_balance.dict())
        current_balance = transaction.amount
    else:
        # Update existing balance
        current_balance = user_balance["balance"] + transaction.amount
        await coins_collection.update_one(
            {"user_id": transaction.user_id},
            {"$set": {"balance": current_balance, "last_updated": datetime.now()}}
        )
    
    # Record the transaction
    transaction_dict = transaction.dict()
    result = await transactions_collection.insert_one(transaction_dict)
    
    return CoinTransactionResponse(
        transaction_id=str(result.inserted_id),
        user_id=transaction.user_id,
        amount=transaction.amount,
        transaction_type=transaction.transaction_type,
        source=transaction.source,
        description=transaction.description,
        timestamp=transaction.timestamp,
        new_balance=current_balance
    )

@router.post("/spend", response_description="Spend Calm Coins")
async def spend_coins(transaction: CoinTransaction = Body(...)):
    """Spend coins from a user's balance (for booking appointments, etc.)"""
    if transaction.transaction_type != "spend":
        raise HTTPException(status_code=400, detail="Transaction type must be 'spend' for this endpoint")
    
    if transaction.amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be positive")
    
    # Get current balance
    user_balance = await coins_collection.find_one({"user_id": transaction.user_id})
    
    if not user_balance:
        raise HTTPException(status_code=404, detail="User not found or has no coin balance")
    
    if user_balance["balance"] < transaction.amount:
        raise HTTPException(status_code=400, detail="Insufficient coin balance")
    
    # Update balance
    new_balance = user_balance["balance"] - transaction.amount
    await coins_collection.update_one(
        {"user_id": transaction.user_id},
        {"$set": {"balance": new_balance, "last_updated": datetime.now()}}
    )
    
    # Record the transaction
    transaction_dict = transaction.dict()
    result = await transactions_collection.insert_one(transaction_dict)
    
    return CoinTransactionResponse(
        transaction_id=str(result.inserted_id),
        user_id=transaction.user_id,
        amount=transaction.amount,
        transaction_type=transaction.transaction_type,
        source=transaction.source,
        description=transaction.description,
        timestamp=transaction.timestamp,
        new_balance=new_balance
    )

@router.get("/transactions/{user_id}", response_description="Get transaction history")
async def get_transactions(user_id: str, limit: int = 10):
    """Get transaction history for a user"""
    transactions = await transactions_collection.find({"user_id": user_id}).sort("timestamp", -1).limit(limit).to_list(length=limit)
    
    # Convert ObjectId to string for each transaction
    for transaction in transactions:
        transaction["_id"] = str(transaction["_id"])
    
    return transactions

@router.get("/exchange-rates", response_description="Get coin exchange rates")
async def get_exchange_rates():
    """Get the current exchange rates for Calm Coins"""
    # These are the fixed rates for how coins can be earned and spent
    return {
        "earning": {
            "journal_entry": 10,  # Earn 10 coins per journal entry
            "weekly_streak": 25,  # Earn 25 coins for journaling 7 days in a row
            "mood_analysis": 5    # Earn 5 coins for analyzing mood in a journal
        },
        "spending": {
            "therapist_appointment": {
                "30min": 100,     # 30-minute appointment costs 100 coins
                "60min": 175      # 60-minute appointment costs 175 coins
            },
            "premium_features": {
                "advanced_insights": 50,  # Access to advanced journal insights
                "guided_meditation": 30   # Access to premium guided meditation
            }
        }
    }