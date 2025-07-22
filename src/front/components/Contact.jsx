export const Contact = ({ contact, isActive, onClick }) => {

  return (
    <div 
      className={`container d-flex p-1 mt-3 ${isActive ? 'active-contact' : ''}`}
      style={{ 
        backgroundColor: isActive ? "#FF8C5A" : "#FFA673", 
        borderRadius: "15px",
        cursor: "pointer" 
      }}
      onClick={onClick}
    >
      <div className="image-container m-1 p-1">
        <img
          src="data:image/png;base64,iVBORw0KGgo..." // 
          className="rounded-circle"
          alt="..."
          width="70px"
          height="70px"
        />
      </div>
      <div className="messages-header mt-1 ps-1">
        <h3 style={{ color: "black" }}><b>{contact.name}</b></h3>
        <h4 style={{ color: "black" }}>{contact.lastMessage}</h4>
      </div>
    </div>
  );
};