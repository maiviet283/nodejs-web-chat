import { useState, useEffect } from 'react';
import socket from '../services/socket.service';
import fetchWithAuth from '../services/auth.service';

function HomePage() {
  const [user, setUser] = useState(null);
  const [receiver, setReceiver] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy thông tin user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await fetchWithAuth('/customers/me');
        setUser(data.user);
        socket.emit('join', data.user.username);
      } catch (err) {
        alert('🚫 Không thể xác thực. Vui lòng đăng nhập lại.');
        window.location.href = '/login';
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Nhận tin nhắn
  useEffect(() => {
    const handleReceiveMessage = (data) => {
      setMessages((prev) => [...prev, data]);
    };

    socket.on('receiveMessage', handleReceiveMessage);
    return () => socket.off('receiveMessage', handleReceiveMessage);
  }, []);

  // Gửi tin nhắn
  const handleSendMessage = () => {
    if (!message.trim() || !receiver.trim()) return;

    const msgData = {
      conversationId: 'test-conv',
      senderId: user.username,
      receiverIds: [receiver],
      message,
    };

    socket.emit('sendMessage', msgData);
    setMessage('');
  };


  if (loading) {
    return <div style={{ padding: 30 }}>⏳ Đang xác thực người dùng...</div>;
  }

  if (!user) {
    return <div style={{ padding: 30, color: 'red' }}>⚠ Không thể lấy thông tin người dùng.</div>;
  }

  return (
    <div style={{ padding: 30, fontFamily: 'Arial, sans-serif', maxWidth: 800, margin: 'auto' }}>
      <h1>🔌 Ứng dụng Chat</h1>
      <p>🧑 Đăng nhập với: <strong>{user.username}</strong></p>

      <div style={{ marginBottom: 15 }}>
        <input
          type="text"
          placeholder="Người nhận"
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
          style={{ padding: 10, width: '100%', maxWidth: 400, borderRadius: 6, border: '1px solid #ccc' }}
        />
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 15 }}>
        <input
          type="text"
          placeholder="Tin nhắn"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ flex: 1, padding: 10, borderRadius: 6, border: '1px solid #ccc' }}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button
          onClick={handleSendMessage}
          style={{
            padding: '10px 20px',
            borderRadius: 6,
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Gửi
        </button>
      </div>

      <div
        style={{
          borderTop: '1px solid #ccc',
          marginTop: 20,
          paddingTop: 10,
          backgroundColor: '#f9f9f9',
          borderRadius: 8,
          maxHeight: 500,
          overflowY: 'auto',
          padding: 15,
        }}
      >
        <h3>💬 Tin nhắn:</h3>
        {messages.length === 0 ? (
          <p style={{ color: '#777' }}>📭 Chưa có tin nhắn nào.</p>
        ) : (
          messages.map((m, i) => {
            const isMe = m.senderId === user.username;
            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: isMe ? 'flex-end' : 'flex-start',
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    backgroundColor: isMe ? '#007bff' : '#e5e5ea',
                    color: isMe ? 'white' : 'black',
                    padding: '10px 15px',
                    borderRadius: 20,
                    maxWidth: '70%',
                    wordWrap: 'break-word',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 5 }}>
                    {isMe ? 'Bạn' : m.senderId}
                  </div>
                  <div>{m.message}</div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );

}

export default HomePage;
