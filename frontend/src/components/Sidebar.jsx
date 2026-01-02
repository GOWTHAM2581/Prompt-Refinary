import React, { useEffect, useState } from 'react';
import { Plus, MessageSquare, Menu, Settings2, Ghost } from 'lucide-react';
import { getChatsList } from '../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser, UserButton } from '@clerk/clerk-react';

export default function Sidebar({ userId, currentChatId, onSelectChat, onNewChat }) {
    const { user } = useUser();
    const [chats, setChats] = useState([]);
    const [isOpen, setIsOpen] = useState(true);

    const loadChats = async () => {
        if (!userId) return;
        try {
            const data = await getChatsList(userId);
            if (data && data.chats) {
                setChats(data.chats);
            }
        } catch (e) {
            console.error("Failed to load chats", e);
        }
    };

    useEffect(() => {
        loadChats();
    }, [userId, currentChatId]);

    return (
        <div className={`
      relative h-full border-r border-zinc-800/50 bg-zinc-950 flex flex-col
      ${isOpen ? 'w-64' : 'w-16'} 
      transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
      hidden md:flex
    `}>
            {/* Header */}
            <div className={`p-4 flex items-center ${isOpen ? 'justify-between' : 'justify-center'}`}>
                <AnimatePresence mode="wait">
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="flex items-center gap-2"
                        >
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                <span className="font-black text-white italic">R</span>
                            </div>
                            <h1 className="font-bold text-lg text-zinc-100 tracking-tight">Refinery</h1>
                        </motion.div>
                    )}
                </AnimatePresence>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 hover:bg-zinc-900 rounded-xl text-zinc-500 hover:text-zinc-200 transition-all border border-transparent hover:border-zinc-800"
                >
                    <Menu size={20} />
                </button>
            </div>

            {/* Action Button */}
            <div className="px-4 mb-6">
                <button
                    onClick={onNewChat}
                    className={`
                        flex items-center justify-center gap-2 bg-zinc-100 hover:bg-white text-zinc-950 rounded-xl font-semibold transition-all shadow-xl shadow-white/5 active:scale-95 group
                        ${isOpen ? 'w-full p-2.5' : 'w-10 h-10 p-0'}
                    `}
                    title="New Prompt"
                >
                    <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                    {isOpen && <span>New Prompt</span>}
                </button>
            </div>

            {/* History List */}
            <div className="flex-1 overflow-y-auto px-3 space-y-2 scrollbar-none">
                {isOpen && (
                    <>
                        {chats.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-10 text-zinc-600">
                                <Ghost size={32} className="opacity-20 mb-2" />
                                <p className="text-xs">No previous refinings</p>
                            </div>
                        )}

                        {chats.map((chat) => (
                            <button
                                key={chat.id}
                                onClick={() => onSelectChat(chat.id)}
                                className={`
                                    w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-all relative group
                                    ${currentChatId === chat.id
                                        ? 'bg-zinc-900 text-zinc-100 border border-zinc-700/50 shadow-lg'
                                        : 'text-zinc-500 hover:bg-zinc-900/50 hover:text-zinc-300 border border-transparent hover:border-zinc-800/50'}
                                `}
                            >
                                <div className={`
                                    p-1.5 rounded-lg transition-colors
                                    ${currentChatId === chat.id ? 'bg-indigo-600/10 text-indigo-400' : 'bg-zinc-900 text-zinc-600 group-hover:text-zinc-400'}
                                `}>
                                    <MessageSquare size={14} />
                                </div>

                                <div className="overflow-hidden flex-1">
                                    <p className="truncate text-[13px] font-semibold text-zinc-200">
                                        {chat.title || "New Refinement"}
                                    </p>
                                    <p className="truncate text-[9px] text-zinc-500 font-medium">
                                        {new Date(chat.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </p>
                                </div>

                                {currentChatId === chat.id && (
                                    <motion.div
                                        layoutId="active-pill"
                                        className="absolute left-0 w-1 h-4 bg-indigo-500 rounded-r-full"
                                    />
                                )}
                            </button>
                        ))}
                    </>
                )}
            </div>

            {/* Footer */}
            <div className="p-4 mt-auto flex justify-center">
                <div className={`
                    flex items-center gap-3 p-2 rounded-xl bg-zinc-900/30 border border-zinc-800/50
                    ${isOpen ? 'w-full' : 'w-10 h-10 justify-center'}
                `}>
                    <UserButton appearance={{
                        elements: {
                            userButtonAvatarBox: "w-6 h-6"
                        }
                    }} />
                    {isOpen && (
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-[10px] text-zinc-100 font-bold truncate">
                                {user?.fullName || user?.username || 'User'}
                            </span>
                            <span className="text-[8px] text-zinc-500 font-mono truncate">
                                {user?.primaryEmailAddress?.emailAddress}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
