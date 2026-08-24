"use client";

import { useState, useEffect, useRef } from "react";
import { api } from "@/lib/api";
import { Loader2, Bot, Send, Sparkles, Target, CheckCircle2, Circle } from "lucide-react";
import { motion } from "framer-motion";
import ReactMarkdown from 'react-markdown';

export default function CopilotPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [isChatting, setIsChatting] = useState(false);
  
  const [plan, setPlan] = useState<any>(null);
  const [isLoadingPlan, setIsLoadingPlan] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchPlan();
    // Initial welcome message
    setMessages([
      { role: 'assistant', content: "Hi! I'm Sangam Copilot, your personal AI career coach. How can I help you today?" }
    ]);
  }, []);

  const fetchPlan = async () => {
    setIsLoadingPlan(true);
    try {
      const { data } = await api.get('/copilot/plan');
      setPlan(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingPlan(false);
    }
  };

  const toggleActionItem = async (itemId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
      
      // Optimistic update
      setPlan((prev: any) => ({
        ...prev,
        items: prev.items.map((item: any) => 
          item._id === itemId ? { ...item, status: newStatus } : item
        )
      }));

      await api.patch(`/copilot/plan/${itemId}`, { status: newStatus });
    } catch (err) {
      console.error(err);
      // Revert on fail
      fetchPlan();
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = { role: 'user', content: inputText };
    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsChatting(true);
    scrollToBottom();

    try {
      const { data } = await api.post('/copilot/chat', {
        message: userMsg.content,
        // Pass recent context if needed, but backend usually keeps track of a session or uses stateless LLM calls with passed history
        history: messages.slice(-5) 
      });

      setMessages(prev => [...prev, { role: 'assistant', content: data.data.reply }]);
      
      // If the AI updated the plan behind the scenes, we could refetch it
      if (data.data.planUpdated) {
        fetchPlan();
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error. Please try again later." }]);
    } finally {
      setIsChatting(false);
      scrollToBottom();
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)] bg-white rounded-3xl border border-border shadow-sm flex flex-col md:flex-row overflow-hidden">
      
      {/* Left Pane: Chat Interface */}
      <div className="flex-1 flex flex-col h-full border-r border-border bg-slate-50/30 relative">
        <div className="h-16 border-b border-border bg-white flex items-center px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Bot className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-foreground">AI Career Copilot</h2>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-slate-200' : 'bg-primary text-white'}`}>
                {msg.role === 'user' ? <div className="w-full h-full bg-slate-300 rounded-full" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`max-w-[80%] rounded-2xl px-5 py-3 ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-sm' : 'bg-white border border-border text-foreground rounded-tl-sm shadow-sm'}`}>
                {msg.role === 'user' ? (
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                ) : (
                  <div className="text-sm prose prose-sm max-w-none prose-p:leading-relaxed prose-a:text-primary">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          {isChatting && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
              <div className="w-8 h-8 flex-shrink-0 rounded-full bg-primary text-white flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-border rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-border flex-shrink-0">
          <form onSubmit={handleSendMessage} className="relative flex items-center">
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask for resume advice, interview prep, or career guidance..."
              className="w-full pl-5 pr-14 py-3.5 bg-slate-50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all text-sm"
              disabled={isChatting}
            />
            <button 
              type="submit"
              disabled={!inputText.trim() || isChatting}
              className="absolute right-2 p-2 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50 disabled:hover:bg-primary transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Right Pane: Action Plan */}
      <div className="w-full md:w-96 flex-shrink-0 bg-white flex flex-col h-full hidden md:flex">
        <div className="h-16 border-b border-border bg-slate-50/50 flex items-center px-6 flex-shrink-0">
          <h2 className="font-bold text-foreground flex items-center gap-2">
            <Target className="w-5 h-5 text-rose-500" /> My Action Plan
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {isLoadingPlan ? (
            <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : !plan || !plan.items || plan.items.length === 0 ? (
            <div className="text-center py-10">
              <Sparkles className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-foreground mb-1">No active plan</h3>
              <p className="text-xs text-muted">Chat with the AI Copilot to generate a personalized career action plan.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Recommended Steps</p>
              {plan.items?.map((item: any, idx: number) => {
                const isCompleted = item.status === 'completed';
                return (
                  <motion.div 
                    key={item._id || idx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`p-4 rounded-xl border ${isCompleted ? 'bg-slate-50 border-border opacity-70' : 'bg-white border-primary/20 shadow-sm'}`}
                  >
                    <div className="flex items-start gap-3">
                      <button 
                        onClick={() => toggleActionItem(item._id, item.status)}
                        className={`mt-0.5 flex-shrink-0 ${isCompleted ? 'text-emerald-500' : 'text-slate-300 hover:text-primary transition-colors'}`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                      </button>
                      <div>
                        <h4 className={`text-sm font-bold ${isCompleted ? 'text-slate-600 line-through' : 'text-foreground'}`}>
                          {item.title}
                        </h4>
                        {item.description && (
                          <p className={`text-xs mt-1 leading-relaxed ${isCompleted ? 'text-slate-500' : 'text-foreground/80'}`}>
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
