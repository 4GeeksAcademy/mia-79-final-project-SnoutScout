import { useState } from 'react';
import { ChatBox } from "../components/ChatBox";
import { Contact } from "../components/Contact";

export const Messages = () => {
  // Dummy data - stays inside component to preserve your structure
  const dummyContacts = [
    {
      id: 1,
      name: "Jenny Romero",
      lastMessage: "Hi there! Is Charlie available...",
      title: "Animal Rescue Shelter - Manager"
    },
    {
      id: 2, 
      name: "Alex Johnson",
      lastMessage: "About the paperwork...",
      title: "Adoption Coordinator"
    }
  ];

  const dummyMessages = {
    1: [
      {
        id: 1,
        message_from: 1,
        content: "Hi there! Is Charlie available for a first meeting next Tuesday?",
        created_at: "10:15am"
      },
      {
        id: 2,
        message_from: 0, // 0 represents current user
        content: "Hi! Thank you for contacting our shelter! I can schedule your appointment.",
        created_at: "11:45am"
      }
    ],
    2: [
      {
        id: 1,
        message_from: 2,
        content: "Hello! I need help with the adoption paperwork.",
        created_at: "9:30am"
      }
    ]
  };

  // State with minimal additions
  const [activeContact, setActiveContact] = useState(dummyContacts[0]);
  const [messages, setMessages] = useState(dummyMessages[1]);

  // Keep all your original styling
  return (
    <div className="container d-flex m-3 ms-5">
      {/* Left Sidebar - unchanged except onClick */}
      <div className="conversations-box border me-3"
           style={{ color: "white", backgroundColor: "#FFE3BB" }}>
        <h1 className="conversations-header p-1 d-flex justify-content-center"
            style={{ backgroundColor: "#FFA673" }}>
          Conversations
        </h1>
        <div className="contacts">
          {dummyContacts.map(contact => (
            <Contact 
              key={contact.id}
              contact={contact}
              isActive={activeContact.id === contact.id}
              onClick={() => {
                setActiveContact(contact);
                setMessages(dummyMessages[contact.id]);
              }}
            />
          ))}
        </div>
      </div>

      {/* Right Side - unchanged except dynamic header */}
      <div className="chatbox-container border col-9"
           style={{ color: "white", backgroundColor: "#FFE3BB" }}>
        <div className="chatbox-header d-flex p-1" 
             style={{ backgroundColor: "#FFA673", height: "95px" }}>
          <div className="image-container m-1 p-1">
            <img
              src="data:image/png;base64,iVBORw0KGgo..." // Your original base64
              className="rounded-circle"
              alt="..."
              width="70px"
              height="70px"
            />
          </div>
          <div className="name-title mt-1 ps-1">
            <h3 style={{ color: "black" }}>{activeContact.name}</h3>
            <h4 style={{ color: "#808080" }}>{activeContact.title}</h4>
          </div>
        </div>
        {/* Updated ChatBox with messages prop */}
        <ChatBox messages={messages} />
      </div>
    </div>
  );
};