import React, { useState, useEffect } from 'react';
import { FiSend, FiMessageSquare } from 'react-icons/fi';
import axios from 'axios';

export default function ChatWindow({ activeChatId, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (!activeChatId) return;
    const fetchChatLog = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/v1/chats/${activeChatId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        });
        setMessages(res.data.data);
      } catch (err) { console.error(err); }
    };
    fetchChatLog();
  }, [activeChatId]);

  const handlePostMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const res = await axios.post(`http://localhost:5000/api/v1/chats/message`, {
        content: newMessage,
        chatId: activeChatId
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      setMessages([...messages, res.data]);
      setNewMessage('');
    } catch (err) { console.error(err); }
  };

  if (!activeChatId) {
    return (
      <div className="h-[500px] glass-panel rounded-3xl flex flex-col items-center justify-center text-slate-400 space-y-2">
        <FiMessageSquare className="text-4xl animate-bounce text-slate-500" />
        <p className="text-sm font-semibold">Select a terminal connection point node to initiate communication.</p>
      </div>
    );
  }

  return (
    <div className="h-[500px] glass-panel rounded-3xl flex flex-col justify-between overflow-hidden">
      <div className="p-4 border-b border-white/10 bg-white/20 dark:bg-darkSurface/20">
        <h3 className="text-sm font-bold tracking-wide">Duplex Tunnel Real-Time Link</h3>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isMe = msg.sender?._id === currentUser?.id;
          return (
            <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs p-3.5 rounded-2xl text-xs font-medium leading-relaxed ${isMe ? 'bg-brand-600 text-white rounded-tr-none' : 'glass-card text-slate-800 dark:text-slate-100 rounded-tl-none'}`}>
                {msg.content}
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={handlePostMessage} className="p-4 border-t border-white/10 bg-white/20 dark:bg-darkSurface/20 flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Transmit a secure data stream payload packet..."
          className="flex-1 p-3 bg-slate-100/50 dark:bg-darkBg/50 rounded-xl text-xs font-medium border border-transparent focus:outline-none focus:border-brand-500"
        />
        <button type="submit" className="p-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl transition-colors">
          <FiSend />
        </button>
      </form>
    </div>
  );
}
