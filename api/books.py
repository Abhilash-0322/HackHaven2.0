from fastapi import APIRouter, HTTPException, Body, Depends
from pydantic import BaseModel, Field
from typing import List, Optional
import os
import httpx
from bson import ObjectId
from pymongo import MongoClient
from datetime import datetime
from bson.json_util import dumps
import json

# MongoDB setup
MONGODB_URI = os.getenv("MONGODB_URI")
client = MongoClient(MONGODB_URI)
db = client.calmverse
journal_collection = db.journals

# Create router
router = APIRouter(prefix="/books", tags=["Books"])

# Models
class Book(BaseModel):
    id: str
    title: str
    author: Optional[str] = None
    image_url: Optional[str] = None
    description: Optional[str] = None

class BookRecommendation(BaseModel):
    mood: str
    mood_description: Optional[str] = None
    books: List[Book]

# Helper function to parse ObjectId
def parse_json(data):
    return json.loads(dumps(data))

# Dictionary mapping moods to book search terms and descriptions
MOOD_TO_BOOKS = {
    "happy": {
        "search_terms": ["uplifting", "happiness", "joy", "comedy", "feel-good"],
        "description": "Uplifting books to maintain your positive mood"
    },
    "sad": {
        "search_terms": ["hope", "comfort", "inspiring", "uplifting", "overcoming adversity"],
        "description": "Books that provide comfort and hope"
    },
    "anxious": {
        "search_terms": ["calming", "mindfulness", "anxiety relief", "meditation", "self-help"],
        "description": "Books to help ease anxiety and find calm"
    },
    "angry": {
        "search_terms": ["forgiveness", "peace", "emotional healing", "mindfulness", "conflict resolution"],
        "description": "Books about finding peace and resolving conflict"
    },
    "calm": {
        "search_terms": ["meditation", "mindfulness", "nature", "poetry", "philosophy"],
        "description": "Books that promote reflection and inner peace"
    },
    "stressed": {
        "search_terms": ["stress relief", "relaxation", "self-care", "simplicity", "mindfulness"],
        "description": "Books to help manage stress and find balance"
    },
    "grateful": {
        "search_terms": ["gratitude", "mindfulness", "joy", "appreciation", "positive psychology"],
        "description": "Books that celebrate the practice of gratitude"
    },
    "motivated": {
        "search_terms": ["motivation", "goals", "success", "perseverance", "achievement"],
        "description": "Books to keep your motivation high and inspire action"
    },
    "confused": {
        "search_terms": ["clarity", "decision making", "mindfulness", "wisdom", "guidance"],
        "description": "Books to help find clarity and direction"
    },
    "tired": {
        "search_terms": ["rest", "relaxation", "sleep", "energy", "self-care"],
        "description": "Books about rest, recovery, and finding energy"
    },
    "hopeful": {
        "search_terms": ["hope", "inspiration", "optimism", "possibility", "future"],
        "description": "Books that nurture hope and possibility"
    },
    "lonely": {
        "search_terms": ["connection", "community", "friendship", "relationships", "belonging"],
        "description": "Books about finding connection and belonging"
    },
    "inspired": {
        "search_terms": ["creativity", "innovation", "art", "inspiration", "ideas"],
        "description": "Books to fuel your creative inspiration"
    },
    "overwhelmed": {
        "search_terms": ["simplicity", "organization", "focus", "mindfulness", "priorities"],
        "description": "Books to help simplify and manage overwhelm"
    }
}

# Default mood mapping if the specific mood isn't in our dictionary
DEFAULT_MOOD = {
    "search_terms": ["personal growth", "mindfulness", "well-being", "positive psychology"],
    "description": "Books selected to enhance your well-being"
}

async def get_books_by_search_term(search_term, max_results=5):
    """Get books from Google Books API based on search term"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"https://www.googleapis.com/books/v1/volumes?q={search_term}&maxResults={max_results}"
            )
            
        if response.status_code != 200:
            print(f"Error from Google Books API: {response.text}")
            return []
            
        data = response.json()
        
        if not data.get("items"):
            return []
            
        books = []
        for item in data["items"]:
            volume_info = item.get("volumeInfo", {})
            book = Book(
                id=item["id"],
                title=volume_info.get("title", "Unknown Title"),
                author=volume_info.get("authors", ["Unknown Author"])[0] if volume_info.get("authors") else "Unknown Author",
                image_url=volume_info.get("imageLinks", {}).get("thumbnail", None),
                description=volume_info.get("description", "No description available")[:150] + "..." if volume_info.get("description") else "No description available"
            )
            books.append(book)
            
        return books
    except Exception as e:
        print(f"Error getting books: {str(e)}")
        return []

@router.get("/recommend-by-mood", response_description="Get book recommendations based on recent mood")
async def get_book_recommendations_by_mood(user_id: Optional[str] = None):
    """Get book recommendations based on the user's recent mood from journal entries"""
    try:
        # Get the most recent journal entry with mood analysis
        query = {"user_id": user_id} if user_id else {}
        
        # Add mood filter to find entries with mood analysis
        query["mood"] = {"$exists": True, "$ne": None}
        
        # Find the most recent journal with mood
        recent_journal = journal_collection.find_one(
            query, 
            sort=[("created_at", -1)]
        )
        
        if not recent_journal:
            # If no journals with mood are found, return recommendations for a balanced mood
            books = await get_books_by_search_term("mindfulness+wellbeing")
            return {
                "mood": "balanced",
                "mood_description": "Books selected to enhance your general well-being",
                "books": books,
                "message": "No recent journal entries found. Here are some general recommendations."
            }
            
        # Get the mood from the recent journal
        mood = recent_journal.get("mood", "").lower()
        
        # Get mood mapping or use default
        mood_mapping = MOOD_TO_BOOKS.get(mood, DEFAULT_MOOD)
        search_terms = mood_mapping["search_terms"]
        
        # Get book recommendations based on the mood
        all_books = []
        # Use 2 random search terms from the list to get a variety
        import random
        selected_terms = random.sample(search_terms, min(2, len(search_terms)))
        
        for term in selected_terms:
            books = await get_books_by_search_term(term)
            all_books.extend(books)
            
        # Remove duplicates based on book ID
        unique_books = []
        seen_ids = set()
        for book in all_books:
            if book.id not in seen_ids:
                seen_ids.add(book.id)
                unique_books.append(book)
        
        # Limit to 10 books
        unique_books = unique_books[:10]
        
        # Get mood description from journal if available
        mood_description = recent_journal.get("mood_analysis", {}).get("description", mood_mapping["description"])
        
        return {
            "mood": mood,
            "mood_description": mood_description,
            "books": unique_books,
            "journal_title": recent_journal.get("title", ""),
            "journal_date": recent_journal.get("created_at", datetime.now()).isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting book recommendations: {str(e)}")

@router.get("/recommend/{book_id}", response_description="Get book recommendations based on a specific book")
async def get_book_recommendations(book_id: str):
    """Get book recommendations similar to a specific book using Google Books API"""
    try:
        # First get the book details
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"https://www.googleapis.com/books/v1/volumes/{book_id}"
            )
            
        if response.status_code != 200:
            raise HTTPException(status_code=404, detail=f"Book with ID {book_id} not found")
            
        book_data = response.json()
        volume_info = book_data.get("volumeInfo", {})
        
        # Extract search terms from the book
        search_terms = []
        
        # Add categories/genres if available
        if volume_info.get("categories"):
            search_terms.extend(volume_info["categories"])
            
        # Add author
        if volume_info.get("authors"):
            search_terms.append(f"inauthor:{volume_info['authors'][0]}")
            
        # Add title keywords (excluding common words)
        if volume_info.get("title"):
            title_words = volume_info["title"].split()
            for word in title_words:
                if len(word) > 4 and word.lower() not in ["title", "book", "novel", "story", "the", "and", "that"]:
                    search_terms.append(word)
                    
        # Use the first search term if available, otherwise use a default
        search_query = search_terms[0] if search_terms else "similar+books"
        
        # Get recommendations
        all_books = await get_books_by_search_term(search_query, max_results=8)
        
        # Filter out the original book
        filtered_books = [book for book in all_books if book.id != book_id]
        
        return {
            "original_book": {
                "id": book_data["id"],
                "title": volume_info.get("title", "Unknown Title"),
                "author": volume_info.get("authors", ["Unknown Author"])[0] if volume_info.get("authors") else "Unknown Author",
                "image_url": volume_info.get("imageLinks", {}).get("thumbnail", None),
            },
            "recommended_books": filtered_books
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting book recommendations: {str(e)}")

@router.get("/search", response_description="Search for books")
async def search_books(q: str, max_results: int = 10):
    """Search for books using Google Books API"""
    try:
        books = await get_books_by_search_term(q, max_results)
        return {"books": books}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching books: {str(e)}")