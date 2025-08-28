from fastapi import APIRouter, HTTPException, Body, Depends
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from bson import ObjectId
import motor.motor_asyncio
import os

# Import authentication
from auth import get_current_active_user

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
@router.get("/balance", response_description="Get user's coin balance")
async def get_balance(current_user: dict = Depends(get_current_active_user)):
    """Get the Calm Coins balance for the authenticated user"""
    user_id = str(current_user["_id"])
    
    # First check the user's calm_coins in the users collection
    from auth import users_collection
    user_doc = await users_collection.find_one({"_id": ObjectId(current_user["_id"])})
    
    if user_doc and "calm_coins" in user_doc:
        return {"user_id": user_id, "balance": user_doc["calm_coins"]}
    
    # Fallback to coins collection if not in users collection
    user_balance = await coins_collection.find_one({"user_id": user_id})
    
    if not user_balance:
        # Create a new balance record for this user with 0 coins
        new_balance = CalmCoinsBalance(user_id=user_id)
        await coins_collection.insert_one(new_balance.dict())
        return {"user_id": user_id, "balance": 0}
    
    return {"user_id": user_balance["user_id"], "balance": user_balance["balance"]}

@router.post("/earn", response_description="Earn Calm Coins")
async def earn_coins(
    amount: int = Body(...),
    source: str = Body(...),
    description: str = Body(...),
    current_user: dict = Depends(get_current_active_user)
):
    """Add coins to a user's balance (for completing journals, etc.)"""
    if amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be positive")
    
    user_id = str(current_user["_id"])
    
    # Update coins in users collection
    from auth import users_collection
    current_balance = current_user.get("calm_coins", 0) + amount
    
    await users_collection.update_one(
        {"_id": ObjectId(current_user["_id"])},
        {"$set": {"calm_coins": current_balance}}
    )
    
    # Record the transaction
    transaction_dict = {
        "user_id": user_id,
        "amount": amount,
        "transaction_type": "earn",
        "source": source,
        "description": description,
        "timestamp": datetime.now()
    }
    result = await transactions_collection.insert_one(transaction_dict)
    
    return CoinTransactionResponse(
        transaction_id=str(result.inserted_id),
        user_id=user_id,
        amount=amount,
        transaction_type="earn",
        source=source,
        description=description,
        timestamp=transaction_dict["timestamp"],
        new_balance=current_balance
    )

@router.post("/spend", response_description="Spend Calm Coins")
async def spend_coins(
    amount: int = Body(...),
    source: str = Body(...),
    description: str = Body(...),
    current_user: dict = Depends(get_current_active_user)
):
    """Spend coins from the authenticated user's balance (for rewards, etc.)"""
    if amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be positive")
    
    user_id = str(current_user["_id"])
    
    # Get current balance from users collection
    from auth import users_collection
    user_doc = await users_collection.find_one({"_id": ObjectId(current_user["_id"])})
    current_balance = user_doc.get("calm_coins", 0) if user_doc else 0
    
    if current_balance < amount:
        raise HTTPException(status_code=400, detail="Insufficient coin balance")
    
    # Update balance in users collection
    new_balance = current_balance - amount
    await users_collection.update_one(
        {"_id": ObjectId(current_user["_id"])},
        {"$set": {"calm_coins": new_balance}}
    )
    
    # Record the transaction
    transaction_dict = {
        "user_id": user_id,
        "amount": amount,
        "transaction_type": "spend",
        "source": source,
        "description": description,
        "timestamp": datetime.now()
    }
    result = await transactions_collection.insert_one(transaction_dict)
    
    return CoinTransactionResponse(
        transaction_id=str(result.inserted_id),
        user_id=user_id,
        amount=amount,
        transaction_type="spend",
        source=source,
        description=description,
        timestamp=transaction_dict["timestamp"],
        new_balance=new_balance
    )

@router.get("/transactions", response_description="Get transaction history")
async def get_transactions(
    limit: int = 20,
    current_user: dict = Depends(get_current_active_user)
):
    """Get transaction history for the authenticated user"""
    user_id = str(current_user["_id"])
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
            "mental_health_chat": 5,     # Earn 5 coins per chat session
            "journal_entry": 15,         # Earn 15 coins per journal entry
            "mood_tracking": 5,          # Earn 5 coins for mood tracking
            "daily_checkin": 10,         # Earn 10 coins for daily check-in
            "weekly_streak": 50,         # Earn 50 bonus coins for 7-day streak
            "achievement": 100           # Variable coins for achievements
        },
        "spending": {
            "rewards": {
                "premium_insights": 100,      # Advanced AI insights
                "custom_meditation": 150,     # Personalized meditation
                "therapist_session": 500,     # 1-on-1 therapist session
                "mindfulness_course": 200     # Guided course access
            },
            "features": {
                "advanced_analytics": 75,    # Advanced mood analytics
                "priority_support": 300      # Priority customer support
            }
        }
    }

@router.get("/daily-goals", response_description="Get daily goals for user")
async def get_daily_goals(current_user: dict = Depends(get_current_active_user)):
    """Get daily goals and progress for the authenticated user"""
    user_id = str(current_user["_id"])
    
    # In a real app, you'd calculate this from actual user activity
    # For now, returning mock data that would be calculated from:
    # - Chat sessions today
    # - Journal entries today  
    # - Mood tracking entries today
    # - Other wellness activities
    
    today = datetime.now().date()
    
    # Get today's transactions to calculate progress
    today_transactions = await transactions_collection.find({
        "user_id": user_id,
        "timestamp": {
            "$gte": datetime.combine(today, datetime.min.time()),
            "$lt": datetime.combine(today + datetime.timedelta(days=1), datetime.min.time())
        }
    }).to_list(length=None)
    
    # Calculate progress based on transaction sources
    chat_sessions = len([t for t in today_transactions if t.get("source") == "mental_health_chat"])
    journal_entries = len([t for t in today_transactions if t.get("source") == "journal"])
    mood_tracks = len([t for t in today_transactions if t.get("source") == "mood_tracking"])
    
    goals = [
        {
            "id": 1,
            "title": "Chat with AI Therapist",
            "target": 1,
            "current": min(chat_sessions, 1),
            "coins": 10,
            "completed": chat_sessions >= 1,
            "icon": "MessageCircle"
        },
        {
            "id": 2,
            "title": "Write in Journal", 
            "target": 1,
            "current": min(journal_entries, 1),
            "coins": 15,
            "completed": journal_entries >= 1,
            "icon": "BookOpen"
        },
        {
            "id": 3,
            "title": "Complete Mood Check",
            "target": 1, 
            "current": min(mood_tracks, 1),
            "coins": 5,
            "completed": mood_tracks >= 1,
            "icon": "Heart"
        },
        {
            "id": 4,
            "title": "Read Mental Health Article",
            "target": 1,
            "current": 0,  # Would be calculated from reading activity
            "coins": 8,
            "completed": False,
            "icon": "Brain"
        }
    ]
    
    return goals

@router.get("/achievements", response_description="Get user achievements")
async def get_achievements(current_user: dict = Depends(get_current_active_user)):
    """Get achievements for the authenticated user"""
    user_id = str(current_user["_id"])
    
    # Get user stats for achievement calculation
    total_earned = await transactions_collection.aggregate([
        {"$match": {"user_id": user_id, "transaction_type": "earn"}},
        {"$group": {"_id": None, "total": {"$sum": "$amount"}}}
    ]).to_list(length=1)
    
    total_coins_earned = total_earned[0]["total"] if total_earned else 0
    
    # Count chat sessions
    chat_count = await transactions_collection.count_documents({
        "user_id": user_id,
        "source": "mental_health_chat"
    })
    
    achievements = [
        {
            "id": 1,
            "title": "First Steps",
            "description": "Started your mental health journey", 
            "coins": 50,
            "unlocked": total_coins_earned > 0,
            "icon": "Star"
        },
        {
            "id": 2,
            "title": "Consistent Chatter",
            "description": "Chat for 7 days in a row",
            "coins": 100,
            "unlocked": chat_count >= 7,  # Simplified - would need streak calculation
            "icon": "MessageCircle"
        },
        {
            "id": 3,
            "title": "Mood Master", 
            "description": "Track mood for 30 days",
            "coins": 200,
            "unlocked": False,  # Would calculate from mood tracking data
            "icon": "Heart"
        },
        {
            "id": 4,
            "title": "Wellness Warrior",
            "description": "Earn 1000 total coins",
            "coins": 300, 
            "unlocked": total_coins_earned >= 1000,
            "icon": "Trophy"
        }
    ]
    
    return achievements

@router.get("/streak", response_description="Get user streak information")
async def get_streak(current_user: dict = Depends(get_current_active_user)):
    """Get the user's current activity streak"""
    user_id = str(current_user["_id"])
    
    # Calculate streak based on daily activity
    # This is a simplified version - in production you'd want more sophisticated streak tracking
    
    current_date = datetime.now().date()
    streak_days = 0
    check_date = current_date
    
    # Check each day going backwards to find streak
    for i in range(30):  # Check up to 30 days back
        day_start = datetime.combine(check_date, datetime.min.time())
        day_end = datetime.combine(check_date + datetime.timedelta(days=1), datetime.min.time())
        
        # Check if user had any activity this day
        activity = await transactions_collection.find_one({
            "user_id": user_id,
            "transaction_type": "earn",
            "timestamp": {"$gte": day_start, "$lt": day_end}
        })
        
        if activity:
            streak_days += 1
            check_date -= datetime.timedelta(days=1)
        else:
            break
    
    return {
        "current_streak": streak_days,
        "longest_streak": streak_days,  # Would be stored separately in real app
        "streak_type": "daily_activity"
    }