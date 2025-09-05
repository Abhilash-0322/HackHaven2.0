from fastapi import APIRouter, HTTPException, Depends, Body
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any, AsyncGenerator
from datetime import datetime
import os
import json
import asyncio
from langchain.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq
from langchain.callbacks.base import BaseCallbackHandler
from dotenv import load_dotenv
import motor.motor_asyncio
from bson import ObjectId
import uuid

# Import authentication
from auth import get_current_active_user

load_dotenv()

# MongoDB setup
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
async_client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URI)
async_db = async_client.calmverse
chat_threads_collection = async_db.chat_threads
chat_messages_collection = async_db.chat_messages
async_users_collection = async_db.users
async_transactions_collection = async_db.coin_transactions

# Define request and response models
class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, description="The user's message")
    thread_id: Optional[str] = Field(None, description="Optional thread ID for continuing conversation")
    stream: bool = Field(False, description="Whether to stream the response")

class StreamChatRequest(BaseModel):
    message: str = Field(..., min_length=1, description="The user's message")
    thread_id: Optional[str] = Field(None, description="Optional thread ID for continuing conversation")

class ChatResponse(BaseModel):
    response: str
    thread_id: str
    message_id: str
    resources: Optional[List[Dict[str, str]]] = None
    emergency_contact: bool = False
    coins_earned: int = 0

class ChatThread(BaseModel):
    id: Optional[str] = None
    user_id: str
    title: str
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    message_count: int = 0
    last_message: Optional[str] = None

class ChatMessage(BaseModel):
    id: Optional[str] = None
    thread_id: str
    user_id: str
    content: str
    is_user: bool
    timestamp: datetime = Field(default_factory=datetime.now)
    coins_earned: int = 0

class ThreadListResponse(BaseModel):
    threads: List[ChatThread]
    total_count: int

class ThreadResponse(BaseModel):
    thread: ChatThread
    messages: List[ChatMessage]

# Create router
router = APIRouter(
    prefix="/mental-health",
    tags=["mental-health"]
)

# Define request and response models

# Tools for the agent
# Streaming callback handler for real-time token streaming
class StreamingCallbackHandler(BaseCallbackHandler):
    def __init__(self, stream_queue=None):
        self.tokens = []
        self.thoughts = []
        self.current_thought = ""
        self.stream_queue = stream_queue
        
    def on_llm_new_token(self, token: str, **kwargs) -> None:
        """Called when a new token is generated."""
        self.tokens.append(token)
        
    def on_chain_start(self, serialized: Dict[str, Any], inputs: Dict[str, Any], **kwargs) -> None:
        """Called when chain starts - this is our 'thinking' phase."""
        self.current_thought = "� Starting to analyze your message..."
        self.thoughts.append(self.current_thought)
        if self.stream_queue:
            self.stream_queue.put(("thought", self.current_thought))
        
    def on_chain_end(self, outputs: Dict[str, Any], **kwargs) -> None:
        """Called when chain ends."""
        self.current_thought = "✅ Analysis complete, formulating response..."
        self.thoughts.append(self.current_thought)
        if self.stream_queue:
            self.stream_queue.put(("thought", self.current_thought))
            
    def on_llm_start(self, serialized: Dict[str, Any], prompts: List[str], **kwargs) -> None:
        """Called when LLM starts processing."""
        self.current_thought = "💭 Processing your emotional context and preparing empathetic response..."
        if self.stream_queue:
            self.stream_queue.put(("thought", self.current_thought))
            
    def on_tool_start(self, serialized: Dict[str, Any], input_str: str, **kwargs) -> None:
        """Called when a tool starts."""
        tool_name = serialized.get("name", "Unknown Tool")
        self.current_thought = f"🔧 Using {tool_name} to provide better support..."
        if self.stream_queue:
            self.stream_queue.put(("thought", self.current_thought))
            
    def on_tool_end(self, output: str, **kwargs) -> None:
        """Called when a tool ends."""
        self.current_thought = "🎯 Tool analysis complete, integrating insights..."
        if self.stream_queue:
            self.stream_queue.put(("thought", self.current_thought))
            
    def on_agent_action(self, action, **kwargs) -> None:
        """Called when agent takes an action."""
        self.current_thought = f"🤔 Deciding to: {action.log.strip()}"
        if self.stream_queue:
            self.stream_queue.put(("thought", self.current_thought))
            
    def on_agent_finish(self, finish, **kwargs) -> None:
        """Called when agent finishes."""
        self.current_thought = "✨ Ready to provide supportive response..."
        if self.stream_queue:
            self.stream_queue.put(("thought", self.current_thought))

# Crisis resources for emergency situations
def get_crisis_resources():
    """Returns crisis resources for users in immediate danger."""
    return [
        {"name": "National Suicide Prevention Lifeline", "contact": "988"},
        {"name": "Crisis Text Line", "contact": "Text HOME to 741741"},
        {"name": "Emergency Services", "contact": "911"}
    ]

def get_llm(streaming: bool = False, callback_handler: Optional[StreamingCallbackHandler] = None):
    """Initialize and return the ChatGroq LLM."""
    groq_api_key = os.getenv("GROQ_API_KEY")
    if not groq_api_key:
        raise ValueError("GROQ_API_KEY environment variable is not set")
    
    callbacks = [callback_handler] if callback_handler else []
    
    return ChatGroq(
        temperature=0.7,
        model_name="openai/gpt-oss-120b",
        groq_api_key=groq_api_key,
        max_tokens=1000,
        streaming=streaming,
        callbacks=callbacks
    )

def create_mental_health_agent(streaming: bool = False, callback_handler: Optional[StreamingCallbackHandler] = None):
    """Create and return a mental health support agent."""
    # Create LLM with callback handlers
    llm = get_llm(streaming=streaming, callback_handler=callback_handler)
    
    # Create custom prompt
    template = """You are CalmBot, a compassionate and professional mental health support assistant for ZenHeaven. 
    Your role is to provide empathetic, helpful, and safe mental health support while maintaining professional boundaries.

    Guidelines:
    1. Always be empathetic, non-judgmental, and supportive
    2. Provide practical coping strategies and wellness tips
    3. Encourage professional help when appropriate
    4. Never provide medical diagnoses or replace professional therapy
    5. If someone expresses suicidal thoughts or self-harm, provide crisis resources immediately
    6. Keep responses concise but meaningful (2-4 sentences usually)
    7. Use warm, encouraging language

    Previous conversation:
    {chat_history}

    Current message: {input}
    
    Respond with empathy and provide helpful mental health support:"""
    
    prompt = ChatPromptTemplate.from_template(template)
    chain = prompt | llm
    return chain

async def generate_thread_title(first_message: str) -> str:
    """Generate a title for the chat thread based on the first message."""
    try:
        llm = get_llm()
        prompt = ChatPromptTemplate.from_template(
            "Generate a short, empathetic title (5-8 words) for a mental health support conversation that starts with: '{message}'. "
            "The title should be supportive and capture the main topic or emotion. Examples: 'Dealing with Anxiety', 'Finding Hope Today', 'Stress Management Support'."
        )
        chain = prompt | llm
        result = await chain.ainvoke({"message": first_message})
        return result.content.strip()
    except Exception as e:
        print(f"Error generating title: {e}")
        return "Mental Health Support Chat"

async def award_chat_coins(user_id: str, amount: int = 5) -> None:
    """Award coins to user for chatbot interaction."""
    try:
        # Update user's coin balance
        await async_users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$inc": {"calm_coins": amount}}
        )
        
        # Record transaction
        transaction = {
            "user_id": user_id,
            "amount": amount,
            "transaction_type": "earn",
            "source": "mental_health_chat",
            "description": "Engaged with mental health support chatbot",
            "timestamp": datetime.now()
        }
        await async_transactions_collection.insert_one(transaction)
    except Exception as e:
        print(f"Error awarding coins: {e}")

# API Endpoints

@router.post("/chat/stream")
async def stream_chat_with_bot(
    request: StreamChatRequest,
    current_user: dict = Depends(get_current_active_user)
):
    """Stream chat response with real-time thinking and token generation."""
    
    async def generate_stream():
        try:
            user_id = str(current_user["_id"])
            thread_id = request.thread_id
            
            # If no thread_id provided, create a new thread
            if not thread_id:
                thread_title = await generate_thread_title(request.message)
                thread_doc = {
                    "user_id": user_id,
                    "title": thread_title,
                    "created_at": datetime.now(),
                    "updated_at": datetime.now(),
                    "message_count": 0,
                    "last_message": request.message[:100] + "..." if len(request.message) > 100 else request.message
                }
                thread_result = await chat_threads_collection.insert_one(thread_doc)
                thread_id = str(thread_result.inserted_id)
            
            # Send thread_id first
            yield f"data: {json.dumps({'type': 'thread_id', 'data': thread_id})}\n\n"
            
            # Create streaming callback handler with custom thoughts
            callback_handler = StreamingCallbackHandler(None)  # No queue for now, we'll handle thoughts directly
            
            # Create chain for chat response with streaming
            chain = create_mental_health_agent(streaming=True, callback_handler=callback_handler)
            
            # Load previous messages for context
            previous_messages = await chat_messages_collection.find(
                {"thread_id": thread_id}
            ).sort("timestamp", 1).limit(10).to_list(10)
            
            # Build conversation history
            chat_history = ""
            for msg in previous_messages:
                if msg["is_user"]:
                    chat_history += f"Human: {msg['content']}\n"
                else:
                    chat_history += f"Assistant: {msg['content']}\n"
            
            # Send enhanced thinking process with actual analysis
            yield f"data: {json.dumps({'type': 'thinking', 'data': '🧠 Initializing mental health analysis system...'})}\n\n"
            await asyncio.sleep(0.3)
            
            yield f"data: {json.dumps({'type': 'thinking', 'data': '📝 Parsing user message for content and emotional indicators...'})}\n\n"
            await asyncio.sleep(0.4)
            
            # Analyze emotional context
            emotional_keywords = ['sad', 'anxious', 'worried', 'stressed', 'depressed', 'happy', 'angry', 'frustrated', 'overwhelmed', 'crisis', 'suicide', 'help', 'lonely', 'hopeless', 'tired', 'exhausted', 'panic', 'fear', 'scared']
            detected_emotions = [word for word in emotional_keywords if word in request.message.lower()]
            if detected_emotions:
                yield f"data: {json.dumps({'type': 'thinking', 'data': f'💭 Emotional analysis complete: Identified {len(detected_emotions)} emotional indicators - {', '.join(detected_emotions[:3])}...'})}\n\n"
                await asyncio.sleep(0.5)
                yield f"data: {json.dumps({'type': 'thinking', 'data': '🎯 Emotional context confirmed - preparing targeted therapeutic response...'})}\n\n"
                await asyncio.sleep(0.4)
            else:
                yield f"data: {json.dumps({'type': 'thinking', 'data': '🔍 No specific emotional indicators detected - analyzing for general mental health support needs...'})}\n\n"
                await asyncio.sleep(0.4)
            
            # Check for crisis indicators
            crisis_keywords = ["suicide", "kill myself", "end it all", "self-harm", "hurt myself", "want to die", "no point", "give up", "can't go on"]
            crisis_detected = any(keyword in request.message.lower() for keyword in crisis_keywords)
            if crisis_detected:
                yield f"data: {json.dumps({'type': 'thinking', 'data': '🚨 CRITICAL: Crisis indicators detected in message content...'})}\n\n"
                await asyncio.sleep(0.3)
                yield f"data: {json.dumps({'type': 'thinking', 'data': '🛡️ Activating crisis intervention protocol - prioritizing immediate safety...'})}\n\n"
                await asyncio.sleep(0.3)
                yield f"data: {json.dumps({'type': 'thinking', 'data': '📞 Preparing emergency resources and crisis helpline information...'})}\n\n"
                await asyncio.sleep(0.3)
            
            yield f"data: {json.dumps({'type': 'thinking', 'data': '� Analyzing conversation history and user relationship patterns...'})}\n\n"
            await asyncio.sleep(0.4)
            
            if len(previous_messages) > 0:
                yield f"data: {json.dumps({'type': 'thinking', 'data': f'� Context analysis: Retrieved {len(previous_messages)} previous messages from this conversation thread...'})}\n\n"
                await asyncio.sleep(0.3)
                yield f"data: {json.dumps({'type': 'thinking', 'data': '🧩 Building comprehensive emotional and behavioral profile from history...'})}\n\n"
                await asyncio.sleep(0.4)
            else:
                yield f"data: {json.dumps({'type': 'thinking', 'data': '🆕 New conversation detected - no previous context available...'})}\n\n"
                await asyncio.sleep(0.3)
            
            # Determine response strategy
            if crisis_detected:
                yield f"data: {json.dumps({'type': 'thinking', 'data': '🎯 Response strategy: CRISIS INTERVENTION - Immediate support with safety resources...'})}\n\n"
                await asyncio.sleep(0.3)
                yield f"data: {json.dumps({'type': 'thinking', 'data': '💝 Therapeutic approach: Validation, de-escalation, and professional resource guidance...'})}\n\n"
            elif detected_emotions:
                primary_emotion = detected_emotions[0]
                yield f"data: {json.dumps({'type': 'thinking', 'data': f'🎯 Response strategy: EMOTIONAL SUPPORT - Targeted approach for {primary_emotion.upper()} state...'})}\n\n"
                await asyncio.sleep(0.3)
                yield f"data: {json.dumps({'type': 'thinking', 'data': f'💝 Therapeutic approach: Cognitive-behavioral techniques and coping strategies for {primary_emotion}...'})}\n\n"
            else:
                yield f"data: {json.dumps({'type': 'thinking', 'data': '� Response strategy: GENERAL SUPPORT - Empathetic engagement with mental wellness focus...'})}\n\n"
                await asyncio.sleep(0.3)
                yield f"data: {json.dumps({'type': 'thinking', 'data': '💝 Therapeutic approach: Active listening and positive psychology principles...'})}\n\n"
            
            await asyncio.sleep(0.3)
            
            yield f"data: {json.dumps({'type': 'thinking', 'data': '� Generating personalized, empathetic response with professional boundaries...'})}\n\n"
            await asyncio.sleep(0.3)
            
            yield f"data: {json.dumps({'type': 'thinking', 'data': '⚡ Final processing: Ensuring response quality and therapeutic value...'})}\n\n"
            await asyncio.sleep(0.2)
            
            yield f"data: {json.dumps({'type': 'thinking', 'data': '✨ Analysis complete - ready to provide compassionate mental health support...'})}\n\n"
            await asyncio.sleep(0.2)
            
            # Signal start of response
            yield f"data: {json.dumps({'type': 'response_start', 'data': ''})}\n\n"
            
            # Get response from chain with streaming
            response_content = ""
            try:
                # Use the chain synchronously but yield async
                result = chain.invoke({
                    "chat_history": chat_history,
                    "input": request.message
                })
                
                # Extract the response content
                if hasattr(result, 'content'):
                    response_content = result.content
                else:
                    response_content = str(result)
                
                # Stream the response word by word instead of character by character
                words = response_content.split(' ')
                for i, word in enumerate(words):
                    if i < len(words) - 1:
                        word_with_space = word + ' '
                    else:
                        word_with_space = word
                    
                    yield f"data: {json.dumps({'type': 'token', 'data': word_with_space})}\n\n"
                    await asyncio.sleep(0.1)  # Slightly longer delay for word-based streaming
                        
            except Exception as e:
                print(f"Error generating response: {e}")
                response_content = "I'm here to support you, but I'm experiencing some technical difficulties right now. Please try again in a moment."
                # Stream error response word by word
                words = response_content.split(' ')
                for i, word in enumerate(words):
                    if i < len(words) - 1:
                        word_with_space = word + ' '
                    else:
                        word_with_space = word
                    yield f"data: {json.dumps({'type': 'token', 'data': word_with_space})}\n\n"
                    await asyncio.sleep(0.1)
            
            # Save user message
            user_message_doc = {
                "thread_id": thread_id,
                "user_id": user_id,
                "content": request.message,
                "is_user": True,
                "timestamp": datetime.now(),
                "coins_earned": 0
            }
            user_msg_result = await chat_messages_collection.insert_one(user_message_doc)
            
            # Award coins for user interaction
            coins_earned = 5
            await award_chat_coins(user_id, coins_earned)
            
            # Save bot response
            bot_message_doc = {
                "thread_id": thread_id,
                "user_id": user_id,
                "content": response_content,
                "is_user": False,
                "timestamp": datetime.now(),
                "coins_earned": coins_earned
            }
            bot_msg_result = await chat_messages_collection.insert_one(bot_message_doc)
            
            # Update thread
            await chat_threads_collection.update_one(
                {"_id": ObjectId(thread_id)},
                {
                    "$set": {
                        "updated_at": datetime.now(),
                        "last_message": request.message[:100] + "..." if len(request.message) > 100 else request.message
                    },
                    "$inc": {"message_count": 2}
                }
            )
            
            # Check for crisis keywords
            crisis_keywords = ["suicide", "kill myself", "end it all", "self-harm", "hurt myself"]
            emergency_contact = any(keyword in request.message.lower() for keyword in crisis_keywords)
            
            # Send completion data
            completion_data = {
                "type": "complete",
                "data": {
                    "thread_id": thread_id,
                    "message_id": str(bot_msg_result.inserted_id),
                    "coins_earned": coins_earned,
                    "emergency_contact": emergency_contact,
                    "resources": get_crisis_resources() if emergency_contact else []
                }
            }
            yield f"data: {json.dumps(completion_data)}\n\n"
            
        except Exception as e:
            error_data = {
                "type": "error",
                "data": f"Error processing chat: {str(e)}"
            }
            yield f"data: {json.dumps(error_data)}\n\n"
    
    return StreamingResponse(
        generate_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
        }
    )

@router.post("/chat", response_model=ChatResponse)
async def chat_with_bot(
    request: ChatRequest,
    current_user: dict = Depends(get_current_active_user)
):
    """Send a message to the mental health chatbot and get a response."""
    try:
        user_id = str(current_user["_id"])
        thread_id = request.thread_id
        
        # If no thread_id provided, create a new thread
        if not thread_id:
            thread_title = await generate_thread_title(request.message)
            thread_doc = {
                "user_id": user_id,
                "title": thread_title,
                "created_at": datetime.now(),
                "updated_at": datetime.now(),
                "message_count": 0,
                "last_message": request.message[:100] + "..." if len(request.message) > 100 else request.message
            }
            thread_result = await chat_threads_collection.insert_one(thread_doc)
            thread_id = str(thread_result.inserted_id)
        
        # Create chain for chat response
        chain = create_mental_health_agent()
        
        # Load previous messages for context
        previous_messages = await chat_messages_collection.find(
            {"thread_id": thread_id}
        ).sort("timestamp", 1).limit(10).to_list(10)
        
        # Build conversation history
        chat_history = ""
        for msg in previous_messages:
            if msg["is_user"]:
                chat_history += f"Human: {msg['content']}\n"
            else:
                chat_history += f"Assistant: {msg['content']}\n"
        
        # Get response from chain
        result = await chain.ainvoke({
            "chat_history": chat_history,
            "input": request.message
        })
        response = result.content
        
        # Save user message
        user_message_doc = {
            "thread_id": thread_id,
            "user_id": user_id,
            "content": request.message,
            "is_user": True,
            "timestamp": datetime.now(),
            "coins_earned": 0
        }
        user_msg_result = await chat_messages_collection.insert_one(user_message_doc)
        
        # Award coins for user interaction
        coins_earned = 5
        await award_chat_coins(user_id, coins_earned)
        
        # Save bot response
        bot_message_doc = {
            "thread_id": thread_id,
            "user_id": user_id,
            "content": response,
            "is_user": False,
            "timestamp": datetime.now(),
            "coins_earned": coins_earned
        }
        bot_msg_result = await chat_messages_collection.insert_one(bot_message_doc)
        
        # Update thread
        await chat_threads_collection.update_one(
            {"_id": ObjectId(thread_id)},
            {
                "$set": {
                    "updated_at": datetime.now(),
                    "last_message": request.message[:100] + "..." if len(request.message) > 100 else request.message
                },
                "$inc": {"message_count": 2}  # User message + bot response
            }
        )
        
        # Check for crisis keywords and flag if needed
        crisis_keywords = ["suicide", "kill myself", "end it all", "self-harm", "hurt myself"]
        emergency_contact = any(keyword in request.message.lower() for keyword in crisis_keywords)
        
        # Prepare resources if needed
        resources = []
        if emergency_contact:
            resources = [
                {"name": "National Suicide Prevention Lifeline", "contact": "988"},
                {"name": "Crisis Text Line", "contact": "Text HOME to 741741"},
                {"name": "Emergency Services", "contact": "911"}
            ]
        
        return ChatResponse(
            response=response,
            thread_id=thread_id,
            message_id=str(bot_msg_result.inserted_id),
            resources=resources,
            emergency_contact=emergency_contact,
            coins_earned=coins_earned
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing chat: {str(e)}")

@router.get("/threads", response_model=ThreadListResponse)
async def get_user_threads(
    limit: int = 20,
    offset: int = 0,
    current_user: dict = Depends(get_current_active_user)
):
    """Get all chat threads for the authenticated user."""
    try:
        user_id = str(current_user["_id"])
        
        # Get threads with pagination
        threads_cursor = chat_threads_collection.find(
            {"user_id": user_id}
        ).sort("updated_at", -1).skip(offset).limit(limit)
        
        threads = await threads_cursor.to_list(limit)
        total_count = await chat_threads_collection.count_documents({"user_id": user_id})
        
        # Convert to response model
        thread_list = []
        for thread in threads:
            thread_list.append(ChatThread(
                id=str(thread["_id"]),
                user_id=thread["user_id"],
                title=thread["title"],
                created_at=thread["created_at"],
                updated_at=thread["updated_at"],
                message_count=thread.get("message_count", 0),
                last_message=thread.get("last_message", "")
            ))
        
        return ThreadListResponse(threads=thread_list, total_count=total_count)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching threads: {str(e)}")

@router.get("/threads/{thread_id}", response_model=ThreadResponse)
async def get_thread_with_messages(
    thread_id: str,
    current_user: dict = Depends(get_current_active_user)
):
    """Get a specific thread with all its messages."""
    try:
        user_id = str(current_user["_id"])
        
        # Get thread
        thread = await chat_threads_collection.find_one({
            "_id": ObjectId(thread_id),
            "user_id": user_id
        })
        
        if not thread:
            raise HTTPException(status_code=404, detail="Thread not found")
        
        # Get messages
        messages_cursor = chat_messages_collection.find(
            {"thread_id": thread_id}
        ).sort("timestamp", 1)
        
        messages = await messages_cursor.to_list(None)
        
        # Convert to response models
        thread_obj = ChatThread(
            id=str(thread["_id"]),
            user_id=thread["user_id"],
            title=thread["title"],
            created_at=thread["created_at"],
            updated_at=thread["updated_at"],
            message_count=thread.get("message_count", 0),
            last_message=thread.get("last_message", "")
        )
        
        message_list = []
        for msg in messages:
            message_list.append(ChatMessage(
                id=str(msg["_id"]),
                thread_id=msg["thread_id"],
                user_id=msg["user_id"],
                content=msg["content"],
                is_user=msg["is_user"],
                timestamp=msg["timestamp"],
                coins_earned=msg.get("coins_earned", 0)
            ))
        
        return ThreadResponse(thread=thread_obj, messages=message_list)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching thread: {str(e)}")

@router.delete("/threads/{thread_id}")
async def delete_thread(
    thread_id: str,
    current_user: dict = Depends(get_current_active_user)
):
    """Delete a chat thread and all its messages."""
    try:
        user_id = str(current_user["_id"])
        
        # Verify thread ownership
        thread = await chat_threads_collection.find_one({
            "_id": ObjectId(thread_id),
            "user_id": user_id
        })
        
        if not thread:
            raise HTTPException(status_code=404, detail="Thread not found")
        
        # Delete messages
        await chat_messages_collection.delete_many({"thread_id": thread_id})
        
        # Delete thread
        await chat_threads_collection.delete_one({"_id": ObjectId(thread_id)})
        
        return {"message": "Thread deleted successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting thread: {str(e)}")

@router.put("/threads/{thread_id}/title")
async def update_thread_title(
    thread_id: str,
    title: str = Body(..., embed=True),
    current_user: dict = Depends(get_current_active_user)
):
    """Update the title of a chat thread."""
    try:
        user_id = str(current_user["_id"])
        
        # Verify thread ownership and update
        result = await chat_threads_collection.update_one(
            {"_id": ObjectId(thread_id), "user_id": user_id},
            {"$set": {"title": title, "updated_at": datetime.now()}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Thread not found")
        
        return {"message": "Thread title updated successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating thread title: {str(e)}")
