from fastapi import FastAPI, Query, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from pymongo import MongoClient
from datetime import datetime
from dotenv import load_dotenv
import requests
import os

# ✅ Load environment variables
load_dotenv()

app = FastAPI()

# ✅ Enable CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Add exception handler for debugging 422 errors
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    print(f"🚨 Validation Error Details:")
    print(f"   URL: {request.url}")
    print(f"   Method: {request.method}")
    print(f"   Headers: {dict(request.headers)}")
    
    # Try to get request body
    try:
        body = await request.body()
        print(f"   Request Body: {body.decode('utf-8')}")
    except Exception as e:
        print(f"   Could not read body: {e}")
    
    print(f"   Validation Errors: {exc.errors()}")
    
    return JSONResponse(
        status_code=422,
        content={
            "detail": exc.errors(),
            "message": "Validation failed - check server logs for details"
        }
    )

# ✅ Root check endpoint
@app.get("/")
def read_root():
    return {"message": "🚀 Backend is running!"}

# ✅ Static image hosting
os.makedirs("generated_images", exist_ok=True)
app.mount("/generated_images", StaticFiles(directory="generated_images"), name="generated_images")

# ✅ MongoDB setup
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client["AIChatDB"]
chat_collection = db["ChatHistory"]
user_settings = db["UserSettings"]

# ✅ API Key (use .env securely)
OPENROUTER_API_KEY = "s*********"

# ✅ Request Models
class ModelRequest(BaseModel):
    model: str

class ChatRequest(BaseModel):
    prompt: str
    user_id: str
    email: str

# ✅ Set AI model for a user
@app.post("/set_model")
async def set_model(request: ModelRequest, email: str = Query(...)):
    print(f"🔧 SET_MODEL called:")
    print(f"   Email: {email}")
    print(f"   Model from request: {request.model}")
    print(f"   Request dict: {request.dict()}")
    
    try:
        result = user_settings.update_one(
            {"email": email},
            {"$set": {"selected_model": request.model}},
            upsert=True
        )
        print(f"   MongoDB update result: matched={result.matched_count}, modified={result.modified_count}")
        print(f"✅ Model updated to: {request.model} for {email}")
        return {"message": f"Model updated to {request.model}"}
    except Exception as e:
        print(f"🚨 Database error in set_model: {e}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# ✅ Handle chat request
@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        print(f"🔧 CHAT called for email: {request.email}")
        
        # ✅ Get selected model for user
        user = user_settings.find_one({"email": request.email})
        print(f"   User document from DB: {user}")
        
        if not user or "selected_model" not in user:
            print(f"🚨 No model found for user: {request.email}")
            raise HTTPException(status_code=400, detail="No AI model selected!")

        selected_model = user["selected_model"]
        print(f"   Using model: {selected_model}")

        # ✅ Context: last 20 messages
        context_messages = list(
            chat_collection.find({"email": request.email}).sort("timestamp", -1).limit(20)
        )

        messages = [{"role": "system", "content": "You are an AI assistant."}]
        for msg in reversed(context_messages):
            messages.append({"role": "user", "content": msg["user_message"]})
            messages.append({"role": "assistant", "content": msg["ai_response"]})
        messages.append({"role": "user", "content": request.prompt})

        payload = {
            "model": selected_model,
            "messages": messages
        }

        # ✅ OpenRouter API call
        url = "https://openrouter.ai/api/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json"
        }

        response = requests.post(url, json=payload, headers=headers, timeout=30)
        print("🌐 OpenRouter response:", response.status_code, response.text)

        if response.status_code == 429:
            raise HTTPException(status_code=429, detail="API key limit reached.")
        response.raise_for_status()

        response_json = response.json()
        if "choices" not in response_json:
            raise HTTPException(status_code=500, detail="Invalid response from OpenRouter")

        ai_response = response_json["choices"][0]["message"]["content"]

        # ✅ Save to DB
        chat_collection.insert_one({
            "model": selected_model,
            "user_message": request.prompt,
            "ai_response": ai_response,
            "timestamp": datetime.utcnow(),
            "user_id": request.user_id,
            "email": request.email,
        })

        return {"response": ai_response}

    except requests.exceptions.RequestException as e:
        print("🚨 API request exception:", str(e))
        raise HTTPException(status_code=500, detail=f"API request failed: {str(e)}")
    except Exception as e:
        print("🚨 Server error:", str(e))
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")

# ✅ Get chat history
@app.get("/chat/history")
async def get_chat_history(email: str = Query(...)):
    try:
        history = list(chat_collection.find({"email": email}).sort("timestamp", 1))
        return [
            {
                "user_message": h["user_message"],
                "ai_response": h["ai_response"],
                "timestamp": h["timestamp"].isoformat() if "timestamp" in h else None,
            }
            for h in history
        ]
    except Exception as e:
        print("🚨 Chat history fetch error:", str(e))
        raise HTTPException(status_code=500, detail="Failed to fetch chat history.")