# PromptRefinery

PromptRefinery is a web application that takes vague, lazy prompts and converts them into highly optimized, detailed prompts for LLMs (like GPT-4, Claude, LLaMA).

## Tech Stack
- **Frontend**: React (Vite), TailwindCSS, Framer Motion
- **Backend**: Python FastAPI
- **Database**: Supabase (PostgreSQL)
- **AI**: Groq API (LLaMA 3)

## Setup

### Prerequisites
- Node.js & npm
- Python 3.9+
- Supabase Project
- Groq API Key
- Clerk Account (for Auth)

### Backend Setup
1. Navigate to `backend/`.
2. Create a `.env` file from `.env.example`.
3. Install dependencies: `pip install -r requirements.txt`
4. Run: `python -m uvicorn app.main:app --reload`

### Frontend Setup
1. Navigate to `frontend/`.
2. Create a `.env` file:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
   VITE_API_URL=http://localhost:8000
   ```
3. Install dependencies: `npm install`
4. Run: `npm run dev`

## 🚀 Deployment
For detailed deployment instructions for production, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## Architecture Decisions
- **FastAPI**: Chosen for speed and easy integration with AI libraries.
- **Supabase**: Managed Postgres for persistence without ops overhead.
- **Clerk Authentication**: Provides secure, enterprise-grade authentication with a consistent premium UI.
- **Groq**: Extremely fast inference for real-time prompt optimization.
