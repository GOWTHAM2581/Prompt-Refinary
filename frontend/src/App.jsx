import React, { useState } from 'react';
import { SignedIn, SignedOut, SignIn, useUser, SignInButton } from '@clerk/clerk-react';
import { ArrowRight, Zap, Sparkles, ShieldCheck } from 'lucide-react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';

function AuthenticatedApp() {
  const { user } = useUser();
  const [currentChatId, setCurrentChatId] = useState(null);

  if (!user) return null;

  return (
    <div className="flex h-screen w-full bg-zinc-950 text-zinc-50 overflow-hidden text-sm">
      <Sidebar
        userId={user.id}
        currentChatId={currentChatId}
        onSelectChat={setCurrentChatId}
        onNewChat={() => setCurrentChatId(null)}
      />
      <main className="flex-1 h-full flex flex-col relative overflow-hidden">
        <ChatInterface
          userId={user.id}
          chatId={currentChatId}
          onChatCreated={setCurrentChatId}
        />
      </main>
    </div>
  );
}

function App() {
  return (
    <>
      <SignedIn>
        <AuthenticatedApp />
      </SignedIn>
      <SignedOut>
        <div className="min-h-screen bg-[#09090b] text-white selection:bg-indigo-500/30 overflow-x-hidden relative">
          {/* Background Glows */}
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

          {/* Navigation */}
          <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-6xl z-50">
            <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/50 rounded-2xl px-6 py-4 flex items-center justify-between shadow-2xl">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <span className="font-black text-white italic">R</span>
                </div>
                <span className="font-bold text-lg tracking-tight">Refinery</span>
              </div>
              <SignInButton mode="modal">
                <button className="px-5 py-2 bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold rounded-full transition-all active:scale-95 cursor-pointer">
                  Sign In
                </button>
              </SignInButton>
            </div>
          </nav>

          {/* Hero Content */}
          <main className="relative pt-44 pb-20 px-4 min-h-screen flex flex-col items-center justify-center text-center">
            <div className="space-y-8 max-w-4xl mx-auto">
              {/* Version Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900/80 border border-zinc-800 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-400">AI Prompt Engineer V1.2</span>
              </div>

              {/* Main Heading */}
              <div className="space-y-4">
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-white">
                  Refine Your <br />
                  <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent animate-gradient-x underline decoration-indigo-500/20">
                    Lazy Ideas.
                  </span>
                </h1>
                <p className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
                  Stop writing low-effort prompts. Transform your basic thoughts into high-density,
                  architectural instructions using our protected, senior-grade AI refinery.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <SignInButton mode="modal">
                  <button className="px-8 py-4 bg-white hover:bg-zinc-100 text-zinc-950 font-black rounded-2xl transition-all shadow-2xl shadow-white/10 flex items-center gap-2 group cursor-pointer">
                    Start Refining
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </SignInButton>
                <SignInButton mode="modal">
                  <button className="px-8 py-4 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 text-white font-bold rounded-2xl transition-all cursor-pointer">
                    Login
                  </button>
                </SignInButton>
              </div>
            </div>

            {/* Feature Cards Grid */}
            <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl px-4">
              <div className="p-8 bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 rounded-3xl text-left space-y-4 hover:border-indigo-500/30 transition-all group">
                <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                  <Zap size={24} />
                </div>
                <h3 className="text-xl font-bold text-white">Instant Refining</h3>
                <p className="text-zinc-500 leading-relaxed text-sm">
                  Powered by LLaMA 3.3 and Groq for lightning-fast inference. Get your optimized prompts in milliseconds.
                </p>
              </div>

              <div className="p-8 bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 rounded-3xl text-left space-y-4 hover:border-purple-500/30 transition-all group">
                <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                  <Sparkles size={24} />
                </div>
                <h3 className="text-xl font-bold text-white">Senior Engineering</h3>
                <p className="text-zinc-500 leading-relaxed text-sm">
                  Our system prompt is tuned to act as a Senior Architect, ensuring structure, persona, and constraints are perfect.
                </p>
              </div>

              <div className="p-8 bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 rounded-3xl text-left space-y-4 hover:border-indigo-500/30 transition-all group">
                <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="text-xl font-bold text-white">Secure History</h3>
                <p className="text-zinc-500 leading-relaxed text-sm">
                  Your prompt history is private and tied to your Clerk account. Access your best refinements anytime, anywhere.
                </p>
              </div>
            </div>
          </main>
        </div>
      </SignedOut>
    </>
  );
}

export default App;
