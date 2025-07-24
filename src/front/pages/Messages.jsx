import { useEffect, useState } from 'react';
import { ChatBox } from "../components/ChatBox";
import { Contact } from "../components/Contact";
import useGlobalReducer from '../hooks/useGlobalReducer';
import { useNavigate } from 'react-router-dom';

export const Messages = () => {
  const { store, dispatch } = useGlobalReducer();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_BACKEND_URL

  const fetchContacts = async (userId) => {
    const response = await fetch(`${apiUrl}api/contacts?user_id=${userId}`);
    if (!response.ok) console.log("Failed to fetch contacts")
    return await response.json();
  };

  const fetchMessages = async (userId, contactId) => {
    const response = await fetch(`${apiUrl}api/messages?user_id=${userId}&contact_id=${contactId}`);
    if (!response.ok) console.log('Failed to fetch messages');
    return await response.json();
  };

  const sendMessage = async (message) => {
    const response = await fetch(`${apiUrl}api/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
    if (!response.ok) console.log('Failed to send message');
    return await response.json();
  };

  useEffect(() => {
    if (!store.user || !store.token) return navigate("/login");
    const loadData = async () => {
      try {
        // Fetch contacts for current user 
        const contacts = await fetchContacts(store.user.id);
        dispatch({
          type: 'set_contacts',
          payload: contacts
        });

        // Set the first contact as active if not already set 
        if (contacts.length > 0 && !store.activeContact) {
          dispatch({
            type: 'set_active_contact',
            payload: contacts[0]
          });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [store.user]);

  useEffect(() => {
    if (store.activeContact) {
      const loadMessages = async () => {
        try {
          const messages = await fetchMessages(store.user, store.activeContact.id);
          dispatch({
            type: 'set_messages',
            payload: {
              contactId: store.activeContact.id,
              messages
            }
          });
        } catch (err) {
          setError(err.message);
        }
      };

      loadMessages();
    }
  }, [store.activeContact, store.user]);

  const handleSendMessage = async (content) => {
    if (!store.activeContact) return;

    const newMessage = {
      message_from: store.user.id,
      message_to: store.activeContact.id,
      content,
      created_at: new Date().toISOString()
    };

    try {
      // Optimistically update UI, meaning that the change is reflected before we know if it's successful. If it's not, it'll throw an error. 
      dispatch({
        type: 'add_message',
        payload: {
          contactId: store.activeContact.id,
          message: newMessage
        }
      });

      // Send to server
      await sendMessage(newMessage);
    } catch (err) {
      setError("Failed to send messages");
      
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="page-body" 
      style={{ background: 
        "linear-gradient(45deg, #F0FDFF 0%, #C2F5E9 50%, #E0F7FA 100%)"
        }}>
      <div className="contacts-chatbox-container d-flex m-3 ms-5" style={{
        maxWidth: "1200px",
        borderRadius: "20px",
        padding: "20px"
      }}>

        {/* Left Sidebar - Conversations - Contact Tabs */}

        <div className="conversations-box rounded-4 me-4 shadow"
          style={{
            backgroundColor: "#FFFFFF",
            minWidth: "300px",
            border: "2px solid #FFD6A5",
            background: "linear-gradient(to bottom, #FFF5E9 0%, #FFFFFF 100%)"
          }}>
          <h1 className="conversations-header p-3 rounded-top-4 d-flex justify-content-center fw-bold"
            style={{
              background: "linear-gradient(to right, #FF9B50, #FF7B54)",
              color: "#FFFFFF",
              fontSize: "1.5rem",
              letterSpacing: "1px",
              textShadow: "1px 1px 2px rgba(0,0,0,0.1)"
            }}>
            Conversations
          </h1>
          <div className="contacts p-2">
            {store.contacts.length > 0 ? (
              store.contacts.map(contact => (
                <Contact
                  key={contact.id}
                  contact={contact}
                  isActive={store.activeContact?.id === contact.id}
                  onClick={() => dispatch({
                    type: 'set_active_contact',
                    payload: contact
                  })}
                />
              ))
            ) : (
              <div className="default-contact-tab d-flex justify-content-center align-items-center rounded-3 p-3"
                style={{
                  height: "100px",
                  backgroundColor: "rgba(155, 229, 236, 0.2)", 
                  border: "2px dashed rgba(155, 229, 236, 0.5)"  
                }}>
                <p className="m-0 fw-medium" style={{ color: "#FF9B50" }}>No contacts yet!</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side - ChatBox */}

        <div className="chatbox-container rounded-4 shadow"
          style={{
            backgroundColor: "#FFFFFF",
            minHeight: "500px",
            border: "2px solid #FFD6A5",
            flex: 1,
            background: "linear-gradient(to bottom, #FFF5E9 0%, #FFFFFF 100%)"
          }}>
          {store.activeContact ? (
            <>
              <div className="chatbox-header d-flex align-items-center p-3 rounded-top-4"
                style={{
                  background: "linear-gradient(to right, #FF9B50, #FF7B54)",
                  height: "95px"
                }}>
                <div className="image-container me-3">
                  <img
                    src="data:image/png;base64,iVBORw0KGgo..."
                    className="rounded-circle border-3 border-white shadow-sm"
                    alt="..."
                    width="70px"
                    height="70px"
                  />
                </div>
                <div className="name-title">
                  <h3 className="m-0 fw-bold" style={{ color: "#FFFFFF" }}>{store.activeContact.name}</h3>
                  <h4 className="m-0 mt-1" style={{ color: "#9BE5EC" }}>{store.activeContact.title}</h4>  {/* Cyan accent */}
                </div>
              </div>
              <ChatBox
                messages={store.messages[store.activeContact.id] || []}
                currentUser={store.user}
                onSendMessage={handleSendMessage}
              />
            </>
          ) : (
            <div className="d-flex flex-column justify-content-center align-items-center h-100 p-5 text-center"
              style={{
                color: "#FF9B50",
                background: "radial-gradient(circle, rgba(155,229,236,0.1) 0%, rgba(255,255,255,0) 100%)"  
              }}>
              <div className="mb-3" style={{ fontSize: "3rem" }}>👋</div>
              <h3 className="fw-bold mb-2" style={{ color: "#FF7B54" }}>Start chatting!</h3>
              <p className="m-0" style={{ color: "#9BE5EC" }}>Select a contact to begin your conversation</p>  
            </div>
          )}
        </div>
      </div>
    </div>
  );
};