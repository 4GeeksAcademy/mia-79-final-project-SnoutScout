export const ChatBox = ({ messages }) => {
    
  // Changed to use dynamic messages
  return (
    <div className="container">
      <div className="chatbox">
        {messages.map((msg) => (
          <div 
            key={msg.id}
            className={`${msg.message_from === 0 ? 'sent-message float-end' : 'received-message'} border m-4 p-2`}
            style={{ 
              color: "black",
              backgroundColor: msg.message_from === 0 ? "#FFA673" : "#FFFFFF80",
              maxWidth: "400px",
              wordWrap: "break-word",
              borderRadius: "15px"
            }}
          >
            <h5>{msg.content}</h5>
            <h5>{msg.created_at}</h5>
          </div>
        ))}
      </div>
      {/* Rest remains exactly the same */}
      <div className="chat-input m-1 p-2">
        <div className="input-group">
          <textarea 
            className="form-control" 
            aria-label="chat input" 
            style={{ height: "100px", minHeight: "100px", maxHeight: "100px" }}
          />
          <button 
            type="button" 
            className="btn align-self-center m-2" 
            style={{ height: "50px", width: "80px", borderRadius: "15px", backgroundColor: "#03A6A1" }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};