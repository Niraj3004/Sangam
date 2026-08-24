"use client";

import { useState, useEffect, useRef } from "react";
import { api } from "@/lib/api";
import { getSocket, disconnectSocket } from "@/lib/socket";
import { useAuthStore } from "@/store/auth.store";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { Loader2, MessageSquare, Send, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function MessagesPage() {
  const { user } = useAuthStore();
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<any>(null);

  // Initialize and Fetch Conversations
  useEffect(() => {
    fetchConversations();
    
    // Connect to Socket
    socketRef.current = getSocket();
    
    if (socketRef.current) {
      socketRef.current.on('newMessage', (message: any) => {
        // If the message belongs to the active chat, append it
        setActiveChat((currentChat: any) => {
          if (currentChat && message.conversation === currentChat._id) {
            setMessages(prev => [...prev, message]);
            scrollToBottom();
          }
          return currentChat;
        });

        // Update the latestMessage in the conversation list
        setConversations(prev => prev.map(conv => {
          if (conv._id === message.conversation) {
            return { ...conv, latestMessage: message, unreadCount: conv.unreadCount + 1 };
          }
          return conv;
        }));
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off('newMessage');
        disconnectSocket();
      }
    };
  }, []);

  const fetchConversations = async () => {
    setIsLoadingChats(true);
    try {
      const { data } = await api.get('/messages/conversations');
      setConversations((Array.isArray(data.data) ? data.data : (Object.values(data.data || {}).find(Array.isArray) || [])));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingChats(false);
    }
  };

  const loadChat = async (conversation: any) => {
    setActiveChat(conversation);
    setIsLoadingMessages(true);
    try {
      const { data } = await api.get(`/messages/${conversation._id}`);
      setMessages((Array.isArray(data.data) ? data.data : (Object.values(data.data || {}).find(Array.isArray) || [])));
      scrollToBottom();
      
      // Mark as read
      await api.post(`/messages/${conversation._id}/read`);
      setConversations(prev => prev.map(conv => conv._id === conversation._id ? { ...conv, unreadCount: 0 } : conv));
      
      // Join socket room
      if (socketRef.current) {
        socketRef.current.emit('joinRoom', conversation._id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !activeChat) return;

    const payload = {
      conversationId: activeChat._id,
      content: text,
      type: 'text'
    };

    setText(""); // Optimistic clear

    try {
      // Send via REST fallback (or Socket if implemented backend side, but REST is reliable)
      const { data } = await api.post('/messages/send', payload);
      
      // Update local state immediately for snappy UI
      setMessages(prev => [...prev, data.data]);
      setConversations(prev => prev.map(conv => 
        conv._id === activeChat._id ? { ...conv, latestMessage: data.data } : conv
      ));
      scrollToBottom();
    } catch (err) {
      console.error(err);
      alert("Failed to send message. You may be blocked or restricted.");
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const getChatName = (conversation: any) => {
    if (conversation.isGroup) return conversation.groupName || "Group Chat";
    const otherUser = conversation.participants.find((p: any) => p._id !== user?._id);
    return otherUser?.handle || "Unknown User";
  };

  const getChatAvatar = (conversation: any) => {
    if (conversation.isGroup) return null; // Can render group icon
    const otherUser = conversation.participants.find((p: any) => p._id !== user?._id);
    return otherUser?.profilePic;
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)] bg-white rounded-3xl border border-border shadow-sm flex overflow-hidden">
      
      {/* Sidebar: Conversations List */}
      <div className="w-full md:w-80 lg:w-96 border-r border-border flex flex-col h-full flex-shrink-0">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" /> Messages
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoadingChats ? (
            <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-10 px-4">
              <p className="text-sm text-muted">No conversations yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {conversations.map(conv => {
                const isActive = activeChat?._id === conv._id;
                const name = getChatName(conv);
                const avatar = getChatAvatar(conv);
                
                return (
                  <button 
                    key={conv._id}
                    onClick={() => loadChat(conv)}
                    className={`w-full text-left p-4 hover:bg-slate-50 transition-colors flex items-center gap-3 relative ${isActive ? 'bg-indigo-50/50' : ''}`}
                  >
                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />}
                    
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-lg font-bold text-primary flex-shrink-0 overflow-hidden">
                      {avatar ? (
                        <img src={avatar} alt={name} className="w-full h-full object-cover" />
                      ) : (
                        name.charAt(0).toUpperCase()
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="text-sm font-bold text-foreground truncate pr-2">{name}</h3>
                        {conv.latestMessage && (
                          <span className="text-[10px] text-muted whitespace-nowrap">
                            {new Date(conv.latestMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                      <p className={`text-xs truncate ${conv.unreadCount > 0 ? 'text-foreground font-semibold' : 'text-muted'}`}>
                        {conv.latestMessage?.content || "No messages yet"}
                      </p>
                    </div>

                    {conv.unreadCount > 0 && (
                      <div className="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                        {conv.unreadCount}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col h-full bg-slate-50/30 ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
        {!activeChat ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
              <MessageSquare className="w-8 h-8 text-slate-300" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Your Messages</h2>
            <p className="text-muted max-w-sm">
              Select a conversation from the sidebar or start a new connection from the Discover page.
            </p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="h-20 px-6 border-b border-border bg-white flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-primary overflow-hidden">
                  {getChatAvatar(activeChat) ? (
                    <img src={getChatAvatar(activeChat)} alt="" className="w-full h-full object-cover" />
                  ) : (
                    getChatName(activeChat).charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-foreground leading-tight">{getChatName(activeChat)}</h3>
                  <p className="text-xs text-muted">
                    {activeChat.isGroup ? "Group Chat" : "Private Message"}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {isLoadingMessages ? (
                <div className="flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
              ) : messages.length === 0 ? (
                <div className="text-center py-10 text-sm text-muted">This is the beginning of your conversation.</div>
              ) : (
                messages.map((msg, idx) => {
                  const isMe = msg.sender === user?._id || msg.sender._id === user?._id;
                  
                  return (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={msg._id || idx} 
                      className={`flex flex-col max-w-[75%] ${isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                    >
                      <div className={`px-4 py-2.5 rounded-2xl ${isMe ? 'bg-primary text-white rounded-tr-sm' : 'bg-white border border-border text-foreground rounded-tl-sm shadow-sm'}`}>
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                      </div>
                      <span className="text-[10px] text-muted mt-1.5 px-1">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </motion.div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white border-t border-border flex-shrink-0">
              <form onSubmit={sendMessage} className="relative flex items-center">
                <input 
                  type="text" 
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type a message..."
                  className="w-full pl-5 pr-14 py-3.5 bg-slate-50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all text-sm"
                />
                <button 
                  type="submit"
                  disabled={!text.trim()}
                  className="absolute right-2 p-2 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50 disabled:hover:bg-primary transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </>
        )}
      </div>

    </div>
  );
}
