# 🚀 Deployment Guide: Prompt Refinery

This guide outlines the steps to deploy the Prompt Refinery application to production using **Hugging Face Spaces** for the backend and **Vercel** for the frontend.

---

## 🏗️ Part 1: Backend Deployment (Hugging Face Spaces)

Hugging Face Spaces is excellent for hosting FastAPI applications for free.

### 1. Prepare your files
Ensure your `backend` directory contains:
- `app/` (the application code)
- `requirements.txt` (dependencies)
- `Dockerfile` (see below)

### 2. Create the Dockerfile
Create a file named `Dockerfile` in the `backend/` directory:

```dockerfile
FROM python:3.11-slim

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY ./app /code/app

# Command to run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
```

### 3. Create a Hugging Face Space
1. Go to [Hugging Face Spaces](https://huggingface.co/spaces) and click **"Create new Space"**.
2. Name your space (e.g., `prompt-refinery-api`).
3. Select **Docker** as the SDK and use the **Blank** template.
4. Once created, go to **Settings > Variables and secrets**.
5. Add the following **Secrets**:
   - `GROQ_API_KEY`: Your Groq API Key.
   - `SUPABASE_URL`: Your Supabase Project URL.
   - `SUPABASE_KEY`: Your Supabase Service Role Key.
6. Upload your backend files (or push via Git) to the Space.

---

## 🎨 Part 2: Frontend Deployment (Vercel)

Vercel is the best platform for hosting React/Vite applications.

### 1. Update the API URL
In `frontend/src/lib/api.js`, ensure the `API_URL` uses the environment variable:
```javascript
const API_URL = import.meta.env.VITE_API_URL;
```

### 2. Deploy to Vercel
1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com/) and click **"Add New > Project"**.
3. Import your GitHub repository.
4. Set the **Root Directory** to `frontend`.
5. Under **Environment Variables**, add the following:
   - `VITE_CLERK_PUBLISHABLE_KEY`: Your Clerk Publishable Key.
   - `VITE_API_URL`: The URL of your Hugging Face Space (e.g., `https://your-username-space-name.hf.space`).
6. Click **Deploy**.

---

## 🔐 Part 3: Configuration Check

### Clerk Redirects
In your Clerk Dashboard (**Settings > Path Settings**), ensure your production URLs are added to the allowed origins.

### Supabase CORS
Ensure your production frontend URL is added to the CORS allow-list in Supabase if you are making direct calls (though here we go through the FastAPI backend).

### FastAPI CORS
Update `backend/app/main.py` to include your production frontend URL in the `CORSMiddleware` configuration.

---

## ✅ Summary of Environment Variables

| Variable | Location | Source |
| :--- | :--- | :--- |
| `GROQ_API_KEY` | Backend Secrets | Groq Console |
| `SUPABASE_URL` | Backend Secrets | Supabase Settings |
| `SUPABASE_KEY` | Backend Secrets | Supabase Settings |
| `VITE_CLERK_PUBLISHABLE_KEY` | Frontend Env | Clerk Dashboard |
| `VITE_API_URL` | Frontend Env | Hugging Face Space URL |

---

Developed with ❤️ by the Prompt Refinery Team.
