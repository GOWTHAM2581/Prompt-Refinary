# ⚡ Prompt Refinery

**Transform lazy inputs into production-ready prompts.**

Prompt Refinery is a professional-grade prompt engineering tool designed to bridge the gap between "lazy" user ideas and world-class LLM outputs. It uses a high-density, strategic AI agent to reconstruct intent, add technical constraints, and optimize for models like LLaMA 3.3, GPT-4, and Claude.

---

## ✨ Key Features

- **Strategic Optimization**: Actively infers professional personas, architectural requirements, and clear formatting constraints.
- **Enterprise-Grade Auth**: Secured by **Clerk** with a premium, focused login experience.
- **High-Density UI**: A compact, professional workspace designed for power users, featuring a collapsible sidebar and clean message history.
- **Blazing Fast Inference**: Powered by **Groq** for near-instant response times.
- **Persistent History**: Chat history is securely stored on **Supabase** and tied to your user account.
- **Refinement Flow**: Continue conversation with the "Refinery" to iterate on and polish your results.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS v4 (Modern, utility-first)
- **Animations**: Framer Motion (Subtle, premium transitions)
- **Icons**: Lucide React
- **Authentication**: Clerk

### Backend
- **Framework**: FastAPI (High-performance Python)
- **AI Integration**: Groq SDK (LLaMA 3.3 70B Versatile)
- **Database**: Supabase (PostgreSQL + Real-time)
- **Deployment Strategy**: Dockerized for Hugging Face Spaces

---

## 🚀 Getting Started

### Prerequisites
- Node.js & npm (v18+)
- Python 3.9+
- Clerk Account
- Supabase Account
- Groq API Key

### 1. Backend Setup
```bash
cd backend
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Update .env with your GROQ_API_KEY, SUPABASE_URL, and SUPABASE_KEY

# Run the server
python -m uvicorn app.main:app --reload
```

### 2. Frontend Setup
```bash
cd frontend
# Install dependencies
npm install

# Configure environment
# Create a .env file with:
# VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
# VITE_API_URL=http://localhost:8000

# Run development server
npm run dev
```

---

## 📁 Project Structure

```text
PromptRefinery/
├── backend/            # FastAPI Application
│   ├── app/            # Core logic, services, & models
│   ├── Dockerfile      # Production deployment config
│   └── requirements.txt
├── frontend/           # React Application
│   ├── src/            # Components, API client, & styling
│   └── package.json
├── database/           # SQL Schemas
└── README.md           # Documentation
```

---

## 🌎 Deployment

For production deployment instructions to Hugging Face and Vercel, please refer to the **[DEPLOYMENT.md](./DEPLOYMENT.md)** guide.

---

## 📝 Architecture Decisions

- **Senior Prompt Engineer Persona**: The system prompt is specifically tuned to avoid conversational filler and output only high-value, architectural prompts.
- **Micro-Animation Logic**: Used Framer Motion `AnimatePresence` to ensure the UI feels fluid when switching between chat states.
- **Information Density**: Prioritized information density by reducing font sizes and padding to create a tool-like aesthetic rather than a consumer chat app.

Developed with ❤️ by [GOWTHAM](https://github.com/GOWTHAM2581)
