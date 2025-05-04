from fastapi import APIRouter, HTTPException, Body, Depends
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from pymongo import MongoClient
import os
from bson import ObjectId
from bson.json_util import dumps
import json
from dotenv import load_dotenv
import httpx

# Import the chatbot agent for mood analysis
from chatbot import get_llm, ChatPromptTemplate, LLMChain

load_dotenv()

# MongoDB setup
MONGODB_URI = os.getenv("MONGODB_URI")
client = MongoClient(MONGODB_URI)
db = client.calmverse
journal_collection = db.journals

# Create router
router = APIRouter(prefix="/journal", tags=["Journal"])


# class JournalEntry(BaseModel):
#     content: str = Field(..., min_length=1)
#     mood: Optional[str] = None
#     tags: List[str] = []
    
#     class Config:
#         schema_extra = {
#             "example": {
#                 "content": "I took some time to meditate this morning and it really helped clear my mind...",
#                 "mood": "calm",
#                 "tags": ["meditation", "morning", "reflection"]
#             }
#         }

class JournalEntry(BaseModel):
    content: str = Field(..., min_length=1)
    mood: Optional[str] = None
    tags: List[str] = []
    emergency_contacts: Optional[List[str]] = None  # Phone numbers of relatives
    ip_address: Optional[str] = None  # For geolocation
    
    class Config:
        schema_extra = {
            "example": {
                "content": "I took some time to meditate this morning...",
                "mood": "calm",
                "tags": ["meditation", "morning", "reflection"],
                "emergency_contacts": ["+1234567890"],
                "ip_address": "192.168.1.1"
            }
        }

class JournalEntryDB(JournalEntry):
    id: str = None
    title: str = None  # Title is now generated
    created_at: datetime = None

class JournalPrompt(BaseModel):
    prompt: str
    category: str

class MoodAnalysisRequest(BaseModel):
    content: str = Field(..., min_length=1)

class MoodAnalysisResponse(BaseModel):
    mood: str
    mood_description: str
    suggestions: List[str]

# List of prompts for users
journal_prompts = [
    JournalPrompt(prompt="What made you smile today?", category="gratitude"),
    JournalPrompt(prompt="Describe three things you're grateful for right now.", category="gratitude"),
    JournalPrompt(prompt="What's one small win you had today?", category="achievements"),
    JournalPrompt(prompt="How did you practice self-care today?", category="self-care"),
    JournalPrompt(prompt="What's something that challenged you today and how did you respond?", category="growth"),
    JournalPrompt(prompt="Describe a moment of calm you experienced recently.", category="mindfulness"),
    JournalPrompt(prompt="What's one thing you're looking forward to tomorrow?", category="hope"),
    JournalPrompt(prompt="If your emotions today were weather, what would they be and why?", category="emotions"),
    JournalPrompt(prompt="Write a letter to your future self about how you're feeling right now.", category="reflection"),
    JournalPrompt(prompt="What's one small change you could make tomorrow to improve your wellbeing?", category="self-improvement")
]

# Helper function to parse ObjectId
def parse_json(data):
    return json.loads(dumps(data))

def generate_journal_title(content: str) -> str:
    """
    Generate a concise journal title based on the content using the AI agent.
    """
    llm = get_llm()
    
    prompt_template = ChatPromptTemplate.from_template(
        """You are an empathetic assistant for CalmVerse. Based on the following journal entry, generate a concise, meaningful title (5-10 words) that captures the essence of the content.

        Journal entry:
        "{content}"

        Provide only the title in your response.
        """
    )
    
    chain = LLMChain(llm=llm, prompt=prompt_template)
    
    try:
        # Limit content to avoid excessive input
        truncated_content = content[:1000] if len(content) > 1000 else content
        title = chain.run(content=truncated_content).strip()
        # Ensure title is not too long
        return title[:100] if len(title) > 100 else title
    except Exception as e:
        # Fallback title if generation fails
        return "My Journal Entry"

# Mood analysis function
def analyze_mood(content: str):
    """
    Analyze the journal content and return a mood classification,
    description, and personalized suggestions.
    """
    llm = get_llm()
    
    # Create a prompt template for mood analysis
    prompt_template = ChatPromptTemplate.from_template(
        """You are an empathetic mental health assistant for CalmVerse.
        
        Analyze the following journal entry and determine the primary mood or emotional state 
        expressed. Choose a single word or short phrase that best captures the mood (like 'calm',
        'anxious', 'hopeful', 'overwhelmed', etc.).
        
        Also provide a brief 1-2 sentence description of this mood and 2-3 personalized 
        self-care suggestions that would be helpful for someone experiencing this mood.
        
        Format your response in the following way:
        MOOD: [single word or short phrase]
        DESCRIPTION: [1-2 sentence description]
        SUGGESTIONS: 
        - [First suggestion]
        - [Second suggestion]
        - [Third suggestion (optional)]
        
        Journal entry to analyze:
        "{content}"
        """
    )
    
    # Create the chain
    chain = LLMChain(llm=llm, prompt=prompt_template)
    
    # Run the chain
    result = chain.run(content=content)
    
    # Process the result
    response_lines = result.strip().split('\n')
    mood = ""
    description = ""
    suggestions = []
    
    current_section = None
    
    for line in response_lines:
        line = line.strip()
        if line.startswith("MOOD:"):
            current_section = "mood"
            mood = line[5:].strip()
        elif line.startswith("DESCRIPTION:"):
            current_section = "description"
            description = line[12:].strip()
        elif line.startswith("SUGGESTIONS:"):
            current_section = "suggestions"
        elif line.startswith("-") and current_section == "suggestions":
            suggestions.append(line[1:].strip())
        elif current_section == "description":
            description += " " + line
            
    return {
        "mood": mood,
        "mood_description": description,
        "suggestions": suggestions
    }

async def award_coins_for_journal(user_id: str, journal_id: str, title: str):
    """
    Background task to award coins for creating a journal entry
    """
    # Default coin amount for journal entry
    coin_amount = 10
    
    try:
        # Create transaction payload
        transaction = {
            "user_id": user_id,
            "amount": coin_amount,
            "transaction_type": "earn",
            "source": "journal",
            "description": f"Created journal entry: {title}"
        }
        
        # Make POST request to the coins endpoint
        async with httpx.AsyncClient() as client:
            # Using relative URL assuming it's on the same server
            response = await client.post(
                "http://localhost:8000/coins/earn", 
                json=transaction
            )
            
            if response.status_code != 200:
                print(f"Failed to award coins: {response.text}")
            else:
                print(f"Awarded {coin_amount} coins to user {user_id} for journal entry")
                
    except Exception as e:
        print(f"Error awarding coins: {str(e)}")


@router.post("/entries", response_description="Create a new journal entry")
async def create_journal_entry(journal: JournalEntry = Body(...)):
    """Create a new journal entry in the database with an AI-generated title"""
    journal_dict = journal.dict()
    journal_dict["created_at"] = datetime.now()
    
    # Generate title based on content
    journal_dict["title"] = generate_journal_title(journal_dict["content"])
    
    # If no mood is provided, attempt to analyze the content
    if not journal_dict.get("mood") and journal_dict.get("content"):
        try:
            mood_analysis = analyze_mood(journal_dict["content"])
            journal_dict["mood"] = mood_analysis["mood"]
            journal_dict["mood_analysis"] = {
                "description": mood_analysis["mood_description"],
                "suggestions": mood_analysis["suggestions"]
            }
        except Exception:
            # If mood analysis fails, continue without it
            pass
    
    new_journal = journal_collection.insert_one(journal_dict)
    created_journal = journal_collection.find_one({"_id": new_journal.inserted_id})
    
    return parse_json(created_journal)

@router.post("/analyze-mood", response_description="Analyze journal content and determine mood")
async def analyze_journal_mood(request: MoodAnalysisRequest):
    """Analyze journal content and determine mood"""
    try:
        analysis_result = analyze_mood(request.content)
        return MoodAnalysisResponse(
            mood=analysis_result["mood"],
            mood_description=analysis_result["mood_description"],
            suggestions=analysis_result["suggestions"]
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred during mood analysis: {str(e)}"
        )

@router.put("/entries/{id}/analyze-mood", response_description="Add mood analysis to existing entry")
async def add_mood_analysis(id: str):
    """Add or update mood analysis for an existing journal entry"""
    try:
        journal = journal_collection.find_one({"_id": ObjectId(id)})
        
        if not journal:
            raise HTTPException(status_code=404, detail=f"Journal entry with ID {id} not found")
            
        content = journal.get("content", "")
        if not content:
            raise HTTPException(status_code=400, detail="Journal entry has no content to analyze")
            
        analysis_result = analyze_mood(content)
        
        update_result = journal_collection.update_one(
            {"_id": ObjectId(id)},
            {"$set": {
                "mood": analysis_result["mood"],
                "mood_analysis": {
                    "description": analysis_result["mood_description"],
                    "suggestions": analysis_result["suggestions"]
                }
            }}
        )
        
        updated_journal = journal_collection.find_one({"_id": ObjectId(id)})
        return parse_json(updated_journal)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing mood: {str(e)}")

# Include the other existing endpoints
@router.get("/entries", response_description="List all journal entries")
async def list_journal_entries():
    """Retrieve all journal entries from the database"""
    journals = journal_collection.find().sort("created_at", -1)
    return parse_json(journals)

@router.get("/entries/{id}", response_description="Get a single journal entry")
async def get_journal_entry(id: str):
    """Retrieve a specific journal entry by ID"""
    try:
        if journal := journal_collection.find_one({"_id": ObjectId(id)}):
            return parse_json(journal)
        
        raise HTTPException(status_code=404, detail=f"Journal entry with ID {id} not found")
    except Exception:
        raise HTTPException(status_code=400, detail=f"Invalid ID format")
    
    

@router.delete("/entries/{id}", response_description="Delete a journal entry")
async def delete_journal_entry(id: str):
    """Delete a journal entry by ID"""
    try:
        delete_result = journal_collection.delete_one({"_id": ObjectId(id)})
        
        if delete_result.deleted_count == 1:
            return {"message": f"Journal entry with ID {id} deleted successfully"}
            
        raise HTTPException(status_code=404, detail=f"Journal entry with ID {id} not found")
    except Exception:
        raise HTTPException(status_code=400, detail=f"Invalid ID format")


@router.put("/entries/{id}", response_description="Update a journal entry")
async def update_journal_entry(id: str, journal: JournalEntry = Body(...)):
    """Update a journal entry by ID with an AI-generated title"""
    try:
        journal_dict = journal.dict(exclude_unset=True)
        
        # Regenerate title if content is provided
        if "content" in journal_dict:
            journal_dict["title"] = generate_journal_title(journal_dict["content"])
        
        update_result = journal_collection.update_one(
            {"_id": ObjectId(id)}, {"$set": journal_dict}
        )
        
        if update_result.modified_count == 1:
            if updated_journal := journal_collection.find_one({"_id": ObjectId(id)}):
                return parse_json(updated_journal)
        
        if journal_collection.find_one({"_id": ObjectId(id)}) is None:
            raise HTTPException(status_code=404, detail=f"Journal entry with ID {id} not found")
            
        return parse_json(journal_collection.find_one({"_id": ObjectId(id)}))
    except Exception:
        raise HTTPException(status_code=400, detail=f"Invalid ID format or update data")

@router.get("/prompts", response_description="Get journal prompts")
async def get_journal_prompts():
    """Return a list of journal prompts to inspire writing"""
    return journal_prompts

@router.get("/insights", response_description="Get journal insights")
async def get_journal_insights():
    """Generate insights based on journal entries (frequency, mood patterns, etc.)"""
    # Count total entries
    total_entries = journal_collection.count_documents({})
    
    # Get most used moods
    mood_pipeline = [
        {"$match": {"mood": {"$exists": True, "$ne": None}}},
        {"$group": {"_id": "$mood", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 5}
    ]
    mood_data = list(journal_collection.aggregate(mood_pipeline))
    
    # Get most used tags
    tag_pipeline = [
        {"$match": {"tags": {"$exists": True, "$ne": []}}},
        {"$unwind": "$tags"},
        {"$group": {"_id": "$tags", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 5}
    ]
    tag_data = list(journal_collection.aggregate(tag_pipeline))
    
    # Get entries per week
    date_pipeline = [
        {"$group": {
            "_id": {"$dateToString": {"format": "%Y-%U", "date": "$created_at"}},
            "count": {"$sum": 1}
        }},
        {"$sort": {"_id": -1}},
        {"$limit": 10}
    ]
    date_data = list(journal_collection.aggregate(date_pipeline))
    
    return {
        "total_entries": total_entries,
        "top_moods": parse_json(mood_data),
        "top_tags": parse_json(tag_data),
        "entries_by_wee k": parse_json(date_data),
        "message": "Continue journaling regularly to see more detailed insights!"
    }


# from fastapi import APIRouter, HTTPException, Body, Depends, BackgroundTasks
# from pydantic import BaseModel, Field
# from typing import List, Optional
# from datetime import datetime
# from pymongo import MongoClient
# import os
# from bson import ObjectId
# from bson.json_util import dumps, loads
# import json
# from dotenv import load_dotenv
# import httpx
# from fastapi import APIRouter, HTTPException, Body, Depends, BackgroundTasks

# # Import the chatbot agent for mood analysis
# from chatbot import get_llm, ChatPromptTemplate, LLMChain

# load_dotenv()

# # MongoDB setup
# MONGODB_URI = os.getenv("MONGODB_URI")
# client = MongoClient(MONGODB_URI)
# db = client.calmverse
# journal_collection = db.journals

# # Create router
# router = APIRouter(prefix="/journal", tags=["Journal"])

# # Models
# class JournalEntry(BaseModel):
#     title: str = Field(..., min_length=1, max_length=100)
#     content: str = Field(..., min_length=1)
#     mood: Optional[str] = None
#     tags: List[str] = []
    
#     class Config:
#         schema_extra = {
#             "example": {
#                 "title": "Finding peace today",
#                 "content": "I took some time to meditate this morning and it really helped clear my mind...",
#                 "mood": "calm",
#                 "tags": ["meditation", "morning", "reflection"]
#             }
#         }

# class JournalEntryDB(JournalEntry):
#     id: str = None
#     created_at: datetime = None

# class JournalPrompt(BaseModel):
#     prompt: str
#     category: str

# class MoodAnalysisRequest(BaseModel):
#     content: str = Field(..., min_length=1)

# class MoodAnalysisResponse(BaseModel):
#     mood: str
#     mood_description: str
#     suggestions: List[str]

# # Helper function to parse ObjectId
# def parse_json(data):
#     return json.loads(dumps(data))

# # Function to safely convert string to ObjectId
# def to_object_id(id_str):
#     try:
#         return ObjectId(id_str)
#     except Exception as e:
#         raise HTTPException(status_code=400, detail=f"Invalid ID format: {str(e)}")

# # Mood analysis function
# def analyze_mood(content: str):
#     """
#     Analyze the journal content and return a mood classification,
#     description, and personalized suggestions.
#     """
#     llm = get_llm()
    
#     # Create a prompt template for mood analysis
#     prompt_template = ChatPromptTemplate.from_template(
#         """You are an empathetic mental health assistant for CalmVerse.
        
#         Analyze the following journal entry and determine the primary mood or emotional state 
#         expressed. Choose a single word or short phrase that best captures the mood (like 'calm',
#         'anxious', 'hopeful', 'overwhelmed', etc.).
        
#         Also provide a brief 1-2 sentence description of this mood and 2-3 personalized 
#         self-care suggestions that would be helpful for someone experiencing this mood.
        
#         Format your response in the following way:
#         MOOD: [single word or short phrase]
#         DESCRIPTION: [1-2 sentence description]
#         SUGGESTIONS: 
#         - [First suggestion]
#         - [Second suggestion]
#         - [Third suggestion (optional)]
        
#         Journal entry to analyze:
#         "{content}"
#         """
#     )
    
#     # Create the chain
#     chain = LLMChain(llm=llm, prompt=prompt_template)
    
#     # Run the chain
#     result = chain.run(content=content)
    
#     # Process the result
#     response_lines = result.strip().split('\n')
#     mood = ""
#     description = ""
#     suggestions = []
    
#     current_section = None
    
#     for line in response_lines:
#         line = line.strip()
#         if line.startswith("MOOD:"):
#             current_section = "mood"
#             mood = line[5:].strip()
#         elif line.startswith("DESCRIPTION:"):
#             current_section = "description"
#             description = line[12:].strip()
#         elif line.startswith("SUGGESTIONS:"):
#             current_section = "suggestions"
#         elif line.startswith("-") and current_section == "suggestions":
#             suggestions.append(line[1:].strip())
#         elif current_section == "description":
#             description += " " + line
            
#     return {
#         "mood": mood,
#         "mood_description": description,
#         "suggestions": suggestions
#     }

# async def award_coins_for_journal(user_id: str, journal_id: str, title: str):
#     """
#     Background task to award coins for creating a journal entry
#     """
#     # Default coin amount for journal entry
#     coin_amount = 10
    
#     try:
#         # Create transaction payload
#         transaction = {
#             "user_id": user_id,
#             "amount": coin_amount,
#             "transaction_type": "earn",
#             "source": "journal",
#             "description": f"Created journal entry: {title}"
#         }
        
#         # Make POST request to the coins endpoint
#         async with httpx.AsyncClient() as client:
#             # Using relative URL assuming it's on the same server
#             response = await client.post(
#                 "http://localhost:8000/coins/earn", 
#                 json=transaction
#             )
            
#             if response.status_code != 200:
#                 print(f"Failed to award coins: {response.text}")
#             else:
#                 print(f"Awarded {coin_amount} coins to user {user_id} for journal entry")
                
#     except Exception as e:
#         print(f"Error awarding coins: {str(e)}")

# @router.post("/entries", response_description="Create a new journal entry")
# async def create_journal_entry(journal: JournalEntry = Body(...)):
#     """Create a new journal entry in the database"""
#     journal_dict = journal.dict()
#     journal_dict["created_at"] = datetime.now()
    
#     # If no mood is provided, attempt to analyze the content
#     if not journal_dict.get("mood") and journal_dict.get("content"):
#         try:
#             mood_analysis = analyze_mood(journal_dict["content"])
#             journal_dict["mood"] = mood_analysis["mood"]
#             journal_dict["mood_analysis"] = {
#                 "description": mood_analysis["mood_description"],
#                 "suggestions": mood_analysis["suggestions"]
#             }
#         except Exception as e:
#             # If mood analysis fails, continue without it
#             pass
    
#     new_journal = journal_collection.insert_one(journal_dict)
#     created_journal = journal_collection.find_one({"_id": new_journal.inserted_id})
    
#     return parse_json(created_journal)

# @router.post("/analyze-mood", response_description="Analyze journal content and determine mood")
# async def analyze_journal_mood(request: MoodAnalysisRequest):
#     """Analyze journal content and determine mood"""
#     try:
#         analysis_result = analyze_mood(request.content)
#         return MoodAnalysisResponse(
#             mood=analysis_result["mood"],
#             mood_description=analysis_result["mood_description"],
#             suggestions=analysis_result["suggestions"]
#         )
#     except Exception as e:
#         raise HTTPException(
#             status_code=500,
#             detail=f"An error occurred during mood analysis: {str(e)}"
#         )

# @router.put("/entries/{id}/analyze-mood", response_description="Add mood analysis to existing entry")
# async def add_mood_analysis(id: str):
#     """Add or update mood analysis for an existing journal entry"""
#     try:
#         obj_id = to_object_id(id)
#         journal = journal_collection.find_one({"_id": obj_id})
        
#         if not journal:
#             raise HTTPException(status_code=404, detail=f"Journal entry with ID {id} not found")
            
#         content = journal.get("content", "")
#         if not content:
#             raise HTTPException(status_code=400, detail="Journal entry has no content to analyze")
            
#         analysis_result = analyze_mood(content)
        
#         update_result = journal_collection.update_one(
#             {"_id": obj_id},
#             {"$set": {
#                 "mood": analysis_result["mood"],
#                 "mood_analysis": {
#                     "description": analysis_result["mood_description"],
#                     "suggestions": analysis_result["suggestions"]
#                 }
#             }}
#         )
        
#         updated_journal = journal_collection.find_one({"_id": obj_id})
#         return parse_json(updated_journal)
#     except HTTPException:
#         raise
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error analyzing mood: {str(e)}")

# @router.get("/entries", response_description="List all journal entries")
# async def list_journal_entries():
#     """Retrieve all journal entries from the database"""
#     journals = journal_collection.find().sort("created_at", -1)
#     return parse_json(journals)

# @router.get("/entries/{id}", response_description="Get a single journal entry")
# async def get_journal_entry(id: str):
#     """Retrieve a specific journal entry by ID"""
#     try:
#         obj_id = to_object_id(id)
#         if journal := journal_collection.find_one({"_id": obj_id}):
#             return parse_json(journal)
        
#         raise HTTPException(status_code=404, detail=f"Journal entry with ID {id} not found")
#     except HTTPException:
#         raise
#     except Exception as e:
#         raise HTTPException(status_code=400, detail=f"Invalid ID format: {str(e)}")

# @router.delete("/entries/{id}", response_description="Delete a journal entry")
# async def delete_journal_entry(id: str):
#     """Delete a journal entry by ID"""
#     try:
#         obj_id = to_object_id(id)
#         delete_result = journal_collection.delete_one({"_id": obj_id})
        
#         if delete_result.deleted_count == 1:
#             return {"message": f"Journal entry with ID {id} deleted successfully"}
            
#         raise HTTPException(status_code=404, detail=f"Journal entry with ID {id} not found")
#     except HTTPException:
#         raise
#     except Exception as e:
#         raise HTTPException(status_code=400, detail=f"Error deleting entry: {str(e)}")

# @router.put("/entries/{id}", response_description="Update a journal entry")
# async def update_journal_entry(id: str, journal: JournalEntry = Body(...)):
#     """Update a journal entry by ID"""
#     try:
#         obj_id = to_object_id(id)
#         journal_dict = journal.dict(exclude_unset=True)
        
#         # Check if the journal entry exists before updating
#         existing_journal = journal_collection.find_one({"_id": obj_id})
#         if not existing_journal:
#             raise HTTPException(status_code=404, detail=f"Journal entry with ID {id} not found")
        
#         update_result = journal_collection.update_one(
#             {"_id": obj_id}, {"$set": journal_dict}
#         )
        
#         updated_journal = journal_collection.find_one({"_id": obj_id})
#         return parse_json(updated_journal)
#     except HTTPException:
#         raise
#     except Exception as e:
#         raise HTTPException(status_code=400, detail=f"Error updating entry: {str(e)}")

# @router.get("/prompts", response_description="Get journal prompts")
# async def get_journal_prompts():
#     """Return a list of journal prompts to inspire writing"""
#     return journal_prompts

# @router.get("/insights", response_description="Get journal insights")
# async def get_journal_insights():
#     """Generate insights based on journal entries (frequency, mood patterns, etc.)"""
#     # Count total entries
#     total_entries = journal_collection.count_documents({})
    
#     # Get most used moods
#     mood_pipeline = [
#         {"$match": {"mood": {"$exists": True, "$ne": None}}},
#         {"$group": {"_id": "$mood", "count": {"$sum": 1}}},
#         {"$sort": {"count": -1}},
#         {"$limit": 5}
#     ]
#     mood_data = list(journal_collection.aggregate(mood_pipeline))
    
#     # Get most used tags
#     tag_pipeline = [
#         {"$match": {"tags": {"$exists": True, "$ne": []}}},
#         {"$unwind": "$tags"},
#         {"$group": {"_id": "$tags", "count": {"$sum": 1}}},
#         {"$sort": {"count": -1}},
#         {"$limit": 5}
#     ]
#     tag_data = list(journal_collection.aggregate(tag_pipeline))
    
#     # Get entries per week
#     date_pipeline = [
#         {"$group": {
#             "_id": {"$dateToString": {"format": "%Y-%U", "date": "$created_at"}},
#             "count": {"$sum": 1}
#         }},
#         {"$sort": {"_id": -1}},
#         {"$limit": 10}
#     ]
#     date_data = list(journal_collection.aggregate(date_pipeline))
    
#     return {
#         "total_entries": total_entries,
#         "top_moods": parse_json(mood_data),
#         "top_tags": parse_json(tag_data),
#         "entries_by_week": parse_json(date_data),
#         "message": "Continue journaling regularly to see more detailed insights!"
#     }