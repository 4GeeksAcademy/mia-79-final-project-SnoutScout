import { useState } from "react";

export const ChatBox = ({ messages, currentUser, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="container">
      
      <div className="chatbox">
        {messages.map((msg) => (
          <div
            key={msg.id || msg.created_at}
            className={`message ${msg.message_from === currentUser ? 'sent' : 'received'} border m-4 p-2`}
            style={{
              textAlign: msg.message_from === currentUser ? 'right' : 'left',
              textColor: "black",
              backgroundColor: msg.message_from === 0 ? "#FFA673" : "#FFFFFF80",
              maxWidth: "400px",
              wordWrap: "break-word",
              borderRadius: "15px"
            }}
          >
            <p style={{ margin: 0 }}>{msg.content}</p>
            <small style={{ color: '#666' }}>
              {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </small>
          </div>
        ))}
      </div>

      {/* Chat Input */}

      <form onSubmit={handleSubmit} className="message-input d-flex" style={{ padding: '10px' }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message here!"
          style={{ flex: 1, padding: '8px', borderRadius: '20px', border: '1px solid #ccc' }}
        />
        <button
          type="submit"
          style={{
            marginLeft: '10px',
            padding: '8px 15px',
            borderRadius: '20px',
            border: 'none',
            backgroundColor: "#FFA673",
            color: 'white'
          }}
        > Send
        </button>
      </form>
    </div>
  );
};