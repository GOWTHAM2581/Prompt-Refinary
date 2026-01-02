import React, { useState, useEffect, useRef } from 'react';
import { Send, Copy, Check, Sparkles, Loader2, Zap, ArrowRight, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { createChat, continueChat, getChatHistory } from '../lib/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatInterface({ userId, chatId, onChatCreated }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);

    const lastChatId = useRef(null);

    useEffect(() => {
        // Only load from API if switching chats (different chatId)
        // Avoid loading if we just created this chat locally
        if (chatId && chatId !== lastChatId.current) {
            loadMessages(chatId);
            lastChatId.current = chatId;
        } else if (!chatId) {
            setMessages([]);
            setError(null);
            lastChatId.current = null;
        }
    }, [chatId]);

    const loadMessages = async (id) => {
        setIsLoadingHistory(true);
        setError(null);
        try {
            const data = await getChatHistory(userId, id);
            if (data && data.messages) {
                setMessages(data.messages);
            }
        } catch (e) {
            console.error("Failed to load messages", e);
            setError("Failed to connect to backend. Is the server running?");
        } finally {
            setIsLoadingHistory(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isProcessing]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || isProcessing) return;

        const userContent = input;
        setInput('');
        setIsProcessing(true);
        setError(null);

        const tempUserMsg = { role: 'user', content: userContent, id: 'temp-user-' + Date.now() };
        setMessages(prev => [...prev, tempUserMsg]);

        try {
            let response;
            if (!chatId) {
                response = await createChat(userId, userContent);
                if (response.error) throw new Error(response.error);

                onChatCreated(response.chat_id);
                lastChatId.current = response.chat_id;
                const assistantMsg = { role: 'assistant', content: response.optimized_prompt, id: 'temp-assistant-' + Date.now() };
                setMessages([tempUserMsg, assistantMsg]);
            } else {
                response = await continueChat(userId, chatId, userContent);
                if (response.error) throw new Error(response.error);

                const assistantMsg = { role: 'assistant', content: response.optimized_prompt, id: 'temp-assistant-' + Date.now() };
                setMessages(prev => [...prev, assistantMsg]);
            }
        } catch (e) {
            console.error("Error sending message", e);
            setError("Connection error: Make sure the backend is running and .env keys are set.");
            // Keep the user message but maybe mark as failed?
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-zinc-950 relative overflow-hidden">
            {/* Dynamic Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 pt-24 pb-10 md:px-12 space-y-10 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                <AnimatePresence>
                    {messages.length === 0 && !isLoadingHistory && !isProcessing && !chatId && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8 pt-20"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 animate-pulse" />
                                <div className="relative w-24 h-24 bg-zinc-900 rounded-[2rem] flex items-center justify-center border border-zinc-800 shadow-2xl">
                                    <Zap className="text-indigo-500 fill-indigo-500" size={40} />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                                    Refine <span className="text-indigo-500">Everything.</span>
                                </h2>
                                <p className="max-w-md text-zinc-400 text-sm md:text-base leading-relaxed">
                                    Turn your "lazy" inputs into production-ready prompts optimized for LLaMA 3, GPT-4, and beyond.
                                </p>
                            </div>

                            <div className="flex flex-wrap justify-center gap-3">
                                {['Write a SaaS landing page', 'Fix my React code', 'Code an API in Python'].map(suggestion => (
                                    <button
                                        key={suggestion}
                                        onClick={() => setInput(suggestion)}
                                        className="px-4 py-2 bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800/80 rounded-full text-sm text-zinc-400 hover:text-white transition-all"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {messages.map((msg, idx) => (
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={msg.id || idx}
                            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-3xl w-full flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>

                                {msg.role === 'assistant' && (
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center">
                                            <Sparkles size={12} className="text-white" />
                                        </div>
                                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Refinery</span>
                                    </div>
                                )}

                                <div className={`
                  p-3 md:p-4 rounded-xl relative group border transition-all duration-300
                  ${msg.role === 'user'
                                        ? 'bg-zinc-900/40 text-zinc-300 border-zinc-800/50'
                                        : 'bg-zinc-900/80 text-zinc-100 border-indigo-500/20 shadow-md shadow-indigo-500/5 backdrop-blur-sm'}
                `}>
                                    <div className="prose prose-invert prose-indigo max-w-none">
                                        {msg.role === 'user' ? (
                                            <p className="whitespace-pre-wrap text-[15px] font-medium !text-zinc-200">{msg.content}</p>
                                        ) : (
                                            <div className="text-[15px] leading-relaxed">
                                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                                            </div>
                                        )}
                                    </div>

                                    {msg.role === 'assistant' && (
                                        <CopyButton content={msg.content} />
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isProcessing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start w-full max-w-4xl"
                    >
                        <div className="bg-zinc-900/50 px-6 py-4 rounded-full border border-zinc-800/50 flex items-center gap-3 backdrop-blur-sm">
                            <div className="flex space-x-1">
                                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                            </div>
                            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Processing</span>
                        </div>
                    </motion.div>
                )}

                {error && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex justify-center w-full"
                    >
                        <div className="bg-red-500/10 px-6 py-4 rounded-2xl border border-red-500/20 flex items-center gap-3 backdrop-blur-sm">
                            <AlertCircle className="text-red-500" size={20} />
                            <span className="text-sm font-medium text-red-200">{error}</span>
                        </div>
                    </motion.div>
                )}

                <div ref={messagesEndRef} className="h-20" />
            </div>

            {/* Input Area - Floating Bar */}
            <div className="px-4 pb-6 md:px-12 pointer-events-none">
                <div className="max-w-3xl mx-auto pointer-events-auto">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="p-1 bg-zinc-900/60 backdrop-blur-2xl border border-zinc-800/50 rounded-2xl shadow-xl ring-1 ring-white/5"
                    >
                        <form onSubmit={handleSubmit} className="relative flex items-end gap-2 px-3 py-1.5">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Drop your lazy idea here..."
                                className="flex-1 bg-transparent border-none p-2 text-white placeholder-zinc-500 focus:outline-none resize-none h-10 md:h-12 text-sm md:text-base leading-relaxed pt-2 scrollbar-none"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSubmit(e);
                                    }
                                }}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isProcessing}
                                className={`
                                   mb-1 p-2 rounded-xl transition-all flex items-center justify-center
                                   ${input.trim() && !isProcessing
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-white/20'
                                        : 'bg-zinc-800 text-zinc-600 opacity-50 cursor-not-allowed'}
                                 `}
                            >
                                <ArrowRight size={22} className={isProcessing ? 'animate-pulse' : ''} />
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

function CopyButton({ content }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className={`
        absolute top-6 right-6 p-2.5 rounded-xl transition-all border
        ${copied
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                    : 'bg-zinc-800/50 border-zinc-700/50 text-zinc-400 hover:text-white hover:bg-zinc-800 opacity-0 group-hover:opacity-100'}
      `}
            title="Copy to clipboard"
        >
            {copied ? <Check size={18} /> : <Copy size={18} />}
        </button>
    );
}
