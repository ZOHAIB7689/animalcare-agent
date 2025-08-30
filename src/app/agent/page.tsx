"use client"

import { useState } from 'react';

export default function AgentPage() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse('');

    const res = await fetch('/api/agents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userMessage: input }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setResponse(data.reply);
    } else {
      setResponse(`Error: ${data.message}`);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>AI Agent</h1>
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
          style={{ width: '300px', marginRight: '10px' }}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Thinking...' : 'Send'}
        </button>
      </form>

      {response && (
        <div style={{ marginTop: '1rem', whiteSpace: 'pre-wrap' }}>
          <strong>Agent:</strong> {response}
        </div>
      )}
    </div>
  );
}
