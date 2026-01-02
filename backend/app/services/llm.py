from groq import Groq
from ..config import get_settings

SYSTEM_PROMPT = """You are a Senior Prompt Engineer. Your goal is to transform "lazy" user inputs into world-class, high-density LLM prompts.

STRICT RULES:
1. NEVER answer the user's request.
2. Output ONLY the optimized prompt. No preamble, no "Here is your prompt:", no conversational filler.
3. Be strategic: Infer the best role, use professional constraints, and specify clear output requirements.
4. Avoid generic tutorial instructions (e.g., "Provide imports, CSS, etc."). Instead, focus on architectural requirements and technical excellence.
5. Do not use code blocks for your output unless the prompt itself requires one.

Structure the optimized prompt with these clear sections (or equivalent logical flow):
- PERSONA: A high-level professional identity.
- OBJECTIVE: A precise description of the goal.
- CONTEXT/CONSTRAINTS: Specific rules, technologies (infer if missing), and edge cases.
- FORMAT: The exact structure of the response.

Example input: "todo app react"
Example output: "As a Senior Frontend Architect, develop a high-performance, accessible Todo Application using React 19 and Tailwind CSS. The solution must implement state management via the Context API, support persistence with localStorage, and include a 'low-friction' task entry UX. Deliver the solution as a single-file component for easy prototyping, ensuring clean variable naming and strict adherence to modern React hooks patterns."
"""

def get_groq_client():
    settings = get_settings()
    if settings.GROQ_API_KEY == "MISSING":
        return None
    return Groq(api_key=settings.GROQ_API_KEY)

async def optimize_prompt(user_content: str, conversation_history: list = None) -> str:
    client = get_groq_client()
    if not client:
        return "Error: GROQ_API_KEY is not configured in backend/.env"
    
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT}
    ]
    
    if conversation_history:
        # Filter out IDs or other metadata if present
        cleaned_history = [{"role": m["role"], "content": m["content"]} for m in conversation_history]
        messages.extend(cleaned_history)
    else:
        messages.append({"role": "user", "content": user_content})

    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            temperature=0.6,
            max_tokens=2048,
        )
        return completion.choices[0].message.content.strip()
    except Exception as e:
        print(f"Error calling Groq: {e}")
        return f"Error generating optimized prompt: {str(e)}"
