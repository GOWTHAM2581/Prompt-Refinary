from pydantic import BaseModel
from typing import List, Optional, Literal
from datetime import datetime
from uuid import UUID

class Message(BaseModel):
    id: Optional[UUID] = None
    role: Literal['user', 'assistant']
    content: str
    created_at: Optional[datetime] = None

class Chat(BaseModel):
    id: UUID
    created_at: datetime
    messages: List[Message] = []

class CreateChatRequest(BaseModel):
    content: str  # The initial vague prompt

class CreateMessageRequest(BaseModel):
    content: str

class OptimizationResponse(BaseModel):
    optimized_prompt: str
