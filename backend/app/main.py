from fastapi import FastAPI, HTTPException, Path, Header, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List, Optional
from uuid import UUID

from .models import CreateChatRequest, CreateMessageRequest, Chat, Message
from .services import llm, storage

app = FastAPI(title="PromptRefinery API")

# CORS middleware - being explicit with localhost vs 127.0.0.1
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "*" 
    ], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc), "error": True}
    )

@app.get("/")
def read_root():
    return {"status": "ok", "message": "PromptRefinery Backend is running"}

@app.post("/chat", response_model=dict)
async def create_new_chat(request: CreateChatRequest, x_user_id: Optional[str] = Header(None, alias="X-User-ID")):
    if not x_user_id:
        raise HTTPException(status_code=400, detail="X-User-ID header required")
        
    # 1. Optimize the prompt
    optimized_text = await llm.optimize_prompt(request.content)
    
    if "Error:" in optimized_text:
        return JSONResponse(
            status_code=400,
            content={"error": optimized_text, "chat_id": None}
        )

    # 2. Create Chat Session
    chat_id = await storage.create_chat(user_id=x_user_id)
    
    # 3. Save Messages
    await storage.add_message(chat_id, "user", request.content)
    await storage.add_message(chat_id, "assistant", optimized_text)
    
    return {
        "chat_id": chat_id,
        "optimized_prompt": optimized_text
    }

@app.get("/chat/{chat_id}")
async def get_chat_history(chat_id: str):
    messages = await storage.get_chat(chat_id)
    return {"messages": messages}

@app.post("/chat/{chat_id}/message")
async def continue_chat(chat_id: str, request: CreateMessageRequest):
    existing_history = await storage.get_chat(chat_id)
    history_context = [{"role": msg['role'], "content": msg['content']} for msg in existing_history]
    history_context.append({"role": "user", "content": request.content})
    
    response_text = await llm.optimize_prompt(request.content, conversation_history=history_context)
    
    if "Error:" in response_text:
         return JSONResponse(status_code=400, content={"error": response_text})

    await storage.add_message(chat_id, "user", request.content)
    await storage.add_message(chat_id, "assistant", response_text)
    
    return {
        "chat_id": chat_id,
        "optimized_prompt": response_text
    }

@app.get("/chats")
async def list_chats(x_user_id: Optional[str] = Header(None, alias="X-User-ID")):
    if not x_user_id:
        return {"chats": []}
    chats = await storage.get_all_chats_preview(x_user_id)
    return {"chats": chats}
