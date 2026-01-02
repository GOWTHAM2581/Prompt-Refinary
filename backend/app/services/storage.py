from supabase import create_client, Client
from ..config import get_settings
from ..models import Chat, Message
from uuid import UUID
import uuid

def get_supabase():
    settings = get_settings()
    if settings.SUPABASE_URL == "MISSING" or settings.SUPABASE_KEY == "MISSING":
        return None
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

async def create_chat(user_id: str) -> str:
    db = get_supabase()
    if not db: return str(uuid.uuid4())
    
    chat_id = str(uuid.uuid4())
    try:
        # We don't have a title column yet, so we just create the chat
        db.table("chats").insert({"id": chat_id, "user_id": user_id}).execute()
        return chat_id
    except Exception as e:
        print(f"DB Error: {e}")
        return chat_id

async def add_message(chat_id: str, role: str, content: str):
    db = get_supabase()
    if not db: return
    
    try:
        db.table("messages").insert({
            "chat_id": chat_id,
            "role": role,
            "content": content
        }).execute()
    except Exception as e:
        print(f"Error saving message: {e}")

async def get_chat(chat_id: str):
    db = get_supabase()
    if not db: return []
    
    try:
        response = db.table("messages").select("*").eq("chat_id", chat_id).order("created_at").execute()
        return response.data
    except Exception as e:
        print(f"Error fetching chat: {e}")
        return []

async def get_all_chats_preview(user_id: str):
    db = get_supabase()
    if not db: return []
    
    try:
         # To get the first message as a 'title', we fetch chats and a preview of the first message
         # Supabase doesn't easily do 'limit 1' on joined messages in a single select query without functions.
         # So we'll fetch the chats, and the frontend will display the date/time unless we find a better way.
         # WAIT - I can modify the query to join messages and filter for the first one.
         response = db.table("chats").select("*, messages(content, role)").eq("user_id", user_id).order("created_at", desc=True).limit(20).execute()
         
         formatted_chats = []
         for chat in response.data:
             # Find the first user message
             first_user_msg = next((m['content'] for m in chat.get('messages', []) if m['role'] == 'user'), None)
             formatted_chats.append({
                 "id": chat['id'],
                 "created_at": chat['created_at'],
                 "title": first_user_msg or "Untitled Refinement"
             })
         return formatted_chats
    except Exception as e:
        print(f"Error fetching user chats: {e}")
        return []
