import React, { useState } from 'react';
import { SignedIn, SignedOut, SignIn, useUser } from '@clerk/clerk-react';
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
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-md space-y-8 text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl shadow-2xl shadow-indigo-500/20 mb-4">
              <span className="text-white text-3xl font-bold">R</span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter">Prompt Refinery</h1>
            <p className="text-zinc-500">Sign in to start refining your logic into excellence.</p>
          </div>
          <SignIn appearance={{
            elements: {
              card: "bg-zinc-900 border border-zinc-800 shadow-2xl",
              headerTitle: "text-white",
              headerSubtitle: "text-zinc-400",
              socialButtonsBlockButton: "bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700",
              formFieldLabel: "text-zinc-400",
              formFieldInput: "bg-zinc-950 border-zinc-800 text-white focus:ring-indigo-500",
              footerActionText: "text-zinc-500",
              footerActionLink: "text-indigo-400 hover:text-indigo-300"
            }
          }} />
        </div>
      </SignedOut>
    </>
  );
}

export default App;
