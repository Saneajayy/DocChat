import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { Send, User, Bot, Loader2, AlertCircle } from 'lucide-react';
import api from '../lib/api';

export default function ChatPage() {
  const { documentId } = useParams();
  const { getToken } = useAuth();
  
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchHistory = async () => {
    try {
      const token = await getToken();
      const res = await api.get(`/api/chat/${documentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.chat && res.data.chat.messages) {
        setMessages(res.data.chat.messages);
      } else {
        setMessages([{ role: 'assistant', content: 'Hello! I have read this document. What would you like to know?' }]);
      }
    } catch (err) {
      console.error('Failed to load chat history', err);
      setError('Could not load chat history.');
      setMessages([{ role: 'assistant', content: 'Hello! I have read this document. What would you like to know?' }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [documentId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;
    
    const userMsg = input.trim();
    setInput('');
    
    // Optimistic UI update
    const newMessages = [...messages, { role: 'user', content: userMsg }];
    setMessages(newMessages);
    setIsSending(true);
    
    try {
      const token = await getToken();
      const res = await api.post('/api/chat', {
        documentId,
        question: userMsg,
        history: newMessages // send context if needed, but backend manages it ideally
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMessages([...newMessages, { role: 'assistant', content: res.data.answer }]);
    } catch (err) {
      console.error('Failed to send message:', err);
      setMessages([...newMessages, { role: 'assistant', content: "Sorry, I couldn't process your request right now." }]);
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col w-full bg-white h-[calc(100vh-73px)] relative">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 flex items-center justify-center gap-2 text-sm font-bold border-b border-black shrink-0">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto px-4 py-8 pb-32 w-full">
        <div className="max-w-4xl mx-auto space-y-8">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center shrink-0 border border-black
                ${msg.role === 'user' ? 'bg-black text-white' : 'bg-[var(--color-referrd-light)] text-black'}
              `}>
                {msg.role === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
              </div>
              
              <div className={`
                max-w-[85%] px-6 py-4 leading-relaxed text-[16px] font-medium border border-black
                ${msg.role === 'user' 
                  ? 'bg-black text-white rounded-l-md rounded-br-md' 
                  : 'bg-[var(--color-referrd-light)] text-black rounded-r-md rounded-bl-md'}
              `}>
                {msg.content}
              </div>
            </div>
          ))}
          {isSending && (
            <div className="flex gap-4 flex-row">
               <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 border border-black bg-[var(--color-referrd-light)] text-black">
                  <Bot className="h-5 w-5" />
              </div>
              <div className="bg-[var(--color-referrd-light)] border border-black text-black rounded-r-md rounded-bl-md px-6 py-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-black animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-black animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-2 h-2 rounded-full bg-black animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="fixed bottom-0 left-0 w-full bg-gradient-to-t from-white via-white to-transparent pt-12 pb-8 px-4">
        <form onSubmit={handleSend} className="flex gap-3 max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Message DocChat..."
            className="flex-1 bg-white border-2 border-black text-black text-base font-medium rounded-md focus:ring-0 focus:outline-none block p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] placeholder:text-black/40"
            disabled={isSending}
          />
          <button
            type="submit"
            disabled={!input.trim() || isSending}
            className="bg-black hover:bg-neutral-800 text-white px-6 py-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] border-2 border-black"
          >
            <Send className="h-6 w-6" />
          </button>
        </form>
      </div>
    </div>
  );
}
