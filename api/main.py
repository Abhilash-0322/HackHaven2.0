
# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# import uvicorn
# import os

# # Import your existing app modules
# from app import app as music_app
# from chatbot import router as chatbot_router
# from journal import router as journal_router
# from therapist import router as therapist_router, seed_therapists

# # Import the book recommender module

# # Modify main.py to include the coins router
# from coins import router as coins_router

# # Create main application
# app = FastAPI(
#     title="CalmVerse API",
#     description="API for music recommendations, journaling, mental health support, therapist appointments, and book recommendations",
#     version="1.0.0"
# )

# # Add CORS middleware
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Include routers
# app.include_router(coins_router)  # Include the Calm Coins routes
# app.include_router(music_app.router)          # Include your existing music app routes
# app.include_router(chatbot_router)            # Include the mental health chatbot routes
# app.include_router(journal_router)            # Include the journal routes
# app.include_router(therapist_router)          # Include the therapist appointment routes

#  # Include the book recommender routes

# @app.get("/", tags=["Root"])
# async def read_root():
#     """Welcome endpoint with API information"""
#     return {
#         "message": "Welcome to the CalmVerse API",
#         "features": [
#             "Music Recommendations - Get personalized music suggestions based on your preferences",
#             "Mental Health Support - Chat with our AI assistant for mental wellness guidance",
#             "Journaling - Express thoughts, track moods, and receive guided prompts for reflection",
#             "Therapist Appointments - Book sessions with mental health professionals",
#             "Book Recommendations - Get personalized book suggestions based on similarity"
#         ],
#         "endpoints": {
#             "music": "/songs, /recommend, /song_details",
#             "mental_health": "/mental-health/chat",
#             "journal": "/journal/entries, /journal/prompts, /journal/insights",
#             "therapists": "/therapists, /therapists/appointments",
#             "books": "/books, /books/recommend/{book_title}"
#         }
#     }

# # Startup event to seed database
# @app.on_event("startup")
# async def startup_db_client():
#     await seed_therapists()
#     print("API startup complete - database seeded")

# if __name__ == "__main__":
#     # Set environment variables
#     # os.environ["GROQ_API_KEY"] = "" # For testing only, use proper env variables
#     # os.environ["MONGODB_URI"] = "mongodb://localhost:27017" # For testing, use proper env variables
#     # Run the application
#     uvicorn.run("mai    n:app", host="0.0.0.0", port=8000, reload=True)



from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from fastapi.responses import JSONResponse
import os
# Import your existing app modules
from app import app as music_app
from chatbot import router as chatbot_router
from journal import router as journal_router
from therapist import router as therapist_router, seed_therapists
# Import the book recommender module
from books import router as books_router  # Added this import for book recommendations
# Import the coins router
from coins import router as coins_router

# Create main application
app = FastAPI(
    title="CalmVerse API",
    description="API for music recommendations, journaling, mental health support, therapist appointments, and book recommendations",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Error handling middleware
@app.middleware("http")
async def error_handling_middleware(request: Request, call_next):
    try:
        return await call_next(request)
    except Exception as e:
        return JSONResponse(
            status_code=500, 
            content={"detail": f"Internal server error: {str(e)}"}
        )

# Include routers
app.include_router(coins_router)  # Include the Calm Coins routes
app.include_router(music_app.router)  # Include your existing music app routes
app.include_router(chatbot_router)  # Include the mental health chatbot routes
app.include_router(journal_router)  # Include the journal routes
app.include_router(therapist_router)  # Include the therapist appointment routes
app.include_router(books_router)  # Include the book recommender routes  - Added this line


@app.get("/", tags=["Root"])
async def read_root():
    """Welcome endpoint with API information"""
    return {
        "message": "Welcome to the CalmVerse API",
        "features": [
            "Music Recommendations - Get personalized music suggestions based on your preferences",
            "Mental Health Support - Chat with our AI assistant for mental wellness guidance",
            "Journaling - Express thoughts, track moods, and receive guided prompts for reflection",
            "Therapist Appointments - Book sessions with mental health professionals",
            "Book Recommendations - Get personalized book suggestions based on your mood or similar books"
        ],
        "endpoints": {
            "music": "/songs, /recommend, /song_details",
            "mental_health": "/mental-health/chat",
            "journal": "/journal/entries, /journal/prompts, /journal/insights",
            "therapists": "/therapists, /therapists/appointments",
            "books": "/books/recommend-by-mood, /books/recommend/{book_id}, /books/search"
        }
    }

# Startup event to seed database
@app.on_event("startup")
async def startup_db_client():
    await seed_therapists()
    print("API startup complete - database seeded")

if __name__ == "__main__":
    # Set environment variables
    # os.environ["GROQ_API_KEY"] = ""  # For testing only, use proper env variables
    # os.environ["MONGODB_URI"] = "mongodb://localhost:27017"  # For testing, use proper env variables
    # Run the application
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)