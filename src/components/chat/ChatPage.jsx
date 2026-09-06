import React, { useState, useRef, useEffect } from 'react';
import { useArogyam } from '../../context/ArogyamContext';
import { Bot, Send, User, Sparkles, ArrowLeft, RefreshCw, HeartPulse } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ChatPage() {
    const { chatHistory, addChatMessage, userToken } = useArogyam();
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory, isTyping]);

    const handleSend = async (e) => {
        if (e) e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input.trim();
        setInput('');
        addChatMessage(userMsg, true);
        setIsTyping(true);

        setTimeout(() => {
            let botReply = "Thank you for reaching out to ArogyaBuddy! ";
            const lower = userMsg.toLowerCase();
            if (lower.includes("paracetamol") || lower.includes("fever") || lower.includes("headache")) {
                botReply += "For fever or mild pain, Paracetamol (500mg) is commonly used. Ensure you follow prescribed dosage instructions and consult your doctor if symptoms persist.";
            } else if (lower.includes("dosage") || lower.includes("time") || lower.includes("schedule")) {
                botReply += "Your medicine schedule is configured in your Arogyam dispenser. Make sure to take morning doses after breakfast and evening doses after dinner.";
            } else if (lower.includes("side effect") || lower.includes("allergy")) {
                botReply += "If you experience dizziness, nausea, or allergic reactions, contact your physician immediately or trigger the SOS alert on your Arogyam portal.";
            } else {
                botReply += "I am here to assist with medicine reminders, dosage guidelines, and general health inquiries. Please consult a certified doctor for medical diagnoses.";
            }
            addChatMessage(botReply, false);
            setIsTyping(false);
        }, 800);
    };

    const suggestedPrompts = [
        "What should I do if I miss a dose?",
        "Tell me about Paracetamol dosage",
        "How do I set medicine reminders?",
        "Emergency health advice"
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
            {/* Header */}
            <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 p-4 sticky top-0 z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <a href="/login" className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors text-slate-300">
                        <ArrowLeft size={18} />
                    </a>
                    <div className="w-10 h-10 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
                        <Bot size={22} />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg text-white flex items-center gap-2">
                            ArogyaBuddy <Sparkles size={16} className="text-teal-400" />
                        </h1>
                        <p className="text-xs text-slate-400">Public Medical AI Assistant • Always Active</p>
                    </div>
                </div>
                <div>
                    {!userToken ? (
                        <a href="/login" className="px-4 py-2 text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition-colors">
                            Sign In / Login
                        </a>
                    ) : (
                        <a href="/" className="px-4 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors">
                            Dashboard
                        </a>
                    )}
                </div>
            </header>

            {/* Chat Container */}
            <main className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col">
                <div className="flex-1 space-y-4 mb-4 overflow-y-auto min-h-[400px]">
                    {/* Welcome Card */}
                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 mb-6">
                        <div className="flex items-center gap-3 text-teal-400 font-bold mb-2">
                            <HeartPulse size={20} />
                            Welcome to ArogyaBuddy Health Chat
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed">
                            Hi! I'm ArogyaBuddy 👋 Your personal health and medicine assistant. Ask me questions about medicine dosage, side effects, reminders, or health tips.
                        </p>
                    </div>

                    {/* Chat Messages */}
                    {chatHistory.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-xs text-slate-500 mb-4 uppercase tracking-wider font-semibold">Suggested Questions</p>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {suggestedPrompts.map((prompt, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setInput(prompt)}
                                        className="text-xs bg-slate-900 border border-slate-800 hover:border-teal-500/50 hover:bg-slate-800/80 text-slate-300 px-3 py-2 rounded-full transition-all"
                                    >
                                        {prompt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {chatHistory.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex items-start gap-3 ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                        >
                            {!msg.isUser && (
                                <div className="w-8 h-8 rounded-full bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 shrink-0 mt-1">
                                    <Bot size={16} />
                                </div>
                            )}
                            <div
                                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                                    msg.isUser
                                        ? 'bg-teal-600 text-white rounded-tr-none'
                                        : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                                }`}
                            >
                                {msg.text}
                            </div>
                            {msg.isUser && (
                                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-1">
                                    <User size={16} />
                                </div>
                            )}
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 shrink-0">
                                <Bot size={16} />
                            </div>
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-slate-400 flex items-center gap-2">
                                <RefreshCw className="animate-spin w-3 h-3 text-teal-400" /> ArogyaBuddy is thinking...
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Form */}
                <form onSubmit={handleSend} className="sticky bottom-4 bg-slate-900 border border-slate-800 rounded-2xl p-2 flex items-center gap-2 shadow-2xl">
                    <Input
                        type="text"
                        placeholder="Ask me anything about your medicines..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="bg-transparent border-none text-white focus-visible:ring-0 placeholder:text-slate-500 text-sm"
                    />
                    <Button type="submit" disabled={!input.trim()} className="bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl px-4">
                        <Send size={16} />
                    </Button>
                </form>
            </main>
        </div>
    );
}
