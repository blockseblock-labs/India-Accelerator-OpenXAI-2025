'use client';

import { useEffect, useState } from 'react';

export function Chat() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false); // hydration fix

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      style={{
        height: '100vh',
        background: 'linear-gradient(-45deg, #e0eafc, #cfdef3, #e0eafc)',
        backgroundSize: '400% 400%',
        animation: 'gradientBG 15s ease infinite',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '600px',
          width: '90%',
          padding: '30px',
          borderRadius: '15px',
          backgroundColor: '#fff',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
        }}
      >
        <h1 style={{ fontSize: '28px', marginBottom: '20px', color: '#333' }}>
          💬 <strong>CogNet</strong>
        </h1>

        {error && (
          <div
            style={{
              backgroundColor: '#ffe6e6',
              color: '#cc0000',
              padding: '10px',
              borderRadius: '8px',
              marginBottom: '15px',
            }}
          >
            {error}
          </div>
        )}

        {response && (
          <div
            style={{
              backgroundColor: '#e6f7ff',
              color: '#006699',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '15px',
              textAlign: 'left',
            }}
          >
            {response}
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
          <input
            disabled={loading}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            style={{
              flex: 1,
              padding: '12px',
              border: '1px solid #ccc',
              borderRadius: '8px',
              fontSize: '16px',
            }}
          />
          <button
            disabled={loading}
            onClick={() => {
              setLoading(true);
              setMessage('');
              fetch('/api/chat', {
                method: 'POST',
                body: JSON.stringify({ message }),
              })
                .then(async (res) => {
                  if (res.ok) {
                    const data = await res.json();
                    setResponse(data.message);
                    setError('');
                  } else {
                    const data = await res.json();
                    setError(data.error || 'Something went wrong');
                    setResponse('');
                  }
                })
                .catch(() => {
                  setError('Something went wrong');
                  setResponse('');
                })
                .finally(() => setLoading(false));
            }}
            style={{
              backgroundColor: loading ? '#ccc' : '#4a90e2',
              color: '#fff',
              padding: '12px 20px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes gradientBG {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}
