from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
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

# ✅ API Keys
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

# ✅ Request Models
class ModelRequest(BaseModel):
    model: str

class ChatRequest(BaseModel):
    prompt: str
    user_id: str
    email: str
    model: str  # ✅ Added model field

# ✅ Set AI model (kept for backward compatibility)
@app.post("/set_model")
async def set_model(request: ModelRequest):
    # This endpoint is kept for compatibility but doesn't affect global state
    print(f"✅ Model selection request received: {request.model}")
    return {"message": f"Model selection acknowledged: {request.model}"}

# ✅ Handle chat requests
@app.post("/chat")
async def chat(request: ChatRequest):
    if not request.model:
        raise HTTPException(status_code=400, detail="No AI model provided!")

    try:
        # Fetch last 20 messages for context
        context_messages = list(
            chat_collection.find({"email": request.email}).sort("timestamp", -1).limit(20)
        )

        messages = [{"role": "system", "content": "You are an AI assistant."}]
        for msg in reversed(context_messages):
            messages.append({"role": "user", "content": msg["user_message"]})
            messages.append({"role": "assistant", "content": msg["ai_response"]})
        messages.append({"role": "user", "content": request.prompt})

        # ✅ Debug: Show payload
        payload = {"model": request.model, "messages": messages}
        

        # OpenRouter API call
        url = "https://openrouter.ai/api/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
        }

        response = requests.post(url, json=payload, headers=headers, timeout=30)

        # ✅ Debug: Print raw response
        print("🌐 OpenRouter response:", response.status_code, response.text)

        if response.status_code == 429:
            raise HTTPException(
                status_code=429,
                detail="API key limit reached. Please try again later or upgrade your OpenRouter plan."
            )

        response.raise_for_status()
        response_json = response.json()

        if "choices" not in response_json:
            raise HTTPException(status_code=500, detail="Invalid response from OpenRouter")

        ai_response = response_json["choices"][0]["message"]["content"]

        # ✅ Debug: Print AI response
        

        # Save to DB
        chat_collection.insert_one({
            "model": request.model,  # ✅ Use request.model instead of global variable
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