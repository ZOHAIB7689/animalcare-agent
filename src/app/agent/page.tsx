'use client';

import { useState } from 'react';
import { FaPaperPlane, FaSpinner } from 'react-icons/fa';

type ChatMessage = {
  role: 'user' | 'agent';
  content: string;
};

export default function AgentPage() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMsg: ChatMessage = { role: 'user', content: message };
    setMessages((prev) => [...prev, userMsg]);
    setMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) throw new Error(data.error || 'Failed to get response');

      const agentMsg: ChatMessage = { role: 'agent', content: String(data.res) };
      setMessages((prev) => [...prev, agentMsg]);
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f9fafb] to-[#eef1f5] flex justify-center items-center p-4">
      <div className="w-full max-w-3xl h-[85vh] bg-white rounded-xl shadow-xl flex flex-col overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 bg-white">
          <h2 className="text-xl font-semibold text-gray-800">🐾 PetCare AI Assistant</h2>
          <p className="text-sm text-gray-500">Your personal guide for caring for your animals</p>
        </div>

        {/* Chat window */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#f9fafb]">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`rounded-lg px-4 py-3 max-w-[75%] text-sm shadow-sm transition-all duration-300
                  ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-800'
                  }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start text-gray-500 items-center gap-2 text-sm">
              <FaSpinner className="animate-spin" /> PetCare AI is thinking...
            </div>
          )}

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center text-amber-500 text-2xl gap-3 px-4 py-3 border-t border-gray-200 bg-white"
        >
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask something about your pet..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium disabled:opacity-50 transition"
          >
            <FaPaperPlane />
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
