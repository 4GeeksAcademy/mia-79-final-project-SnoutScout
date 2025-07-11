import { useEffect, useState } from 'react';
import { ChatBox } from "../components/ChatBox";
import { Contact } from "../components/Contact";
import useGlobalReducer from '../hooks/useGlobalReducer';

export const Messages = () => {
  const { store, dispatch } = useGlobalReducer();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    const loadData = async () => {
      try {
        // Fetch contacts for current user 
        const contacts = await fetchContacts(store.currentUser);
        dispatch({
          type: 'set_contacts',
          payload: contacts[0]
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
  }, [store.currentUser, dispatch]);

  useEffect(() => {
    if (store.activeContact) {
      const loadMessages = async () => {
        try {
          const messages = await fetchMessages(store.currentUser, store.activeContact.id);
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
  }, [store.activeContact, store.currentUser, dispatch]);

  const handleSendMessage = async (content) => {
    if (!store.activeContact) return;

    const newMessage = {
      message_from: store.currentUser,
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
      // TODO: Handle error (maybe revert optimistic update)
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container d-flex m-3 ms-5">
      {/* Left Sidebar - Contact Tabs - Contact */}
      <div className="conversations-box border me-3"
        style={{ color: "white", backgroundColor: "#FFE3BB" }}>
        <h1 className="conversations-header p-1 d-flex justify-content-center"
          style={{ backgroundColor: "#FFA673" }}>
          Conversations
        </h1>
        <div className="contacts">
          {store.contacts.map(contact => (
            <Contact
              key={contact.id}
              contact={contact}
              isActive={store.activeContact?.id === contact.id}
              onClick={() => dispatch({
                type: 'set_active_contact',
                payload: contact
              })}
            />
          ))}
        </div>
      </div>

      {/* Right Side - Conversations - Chatbox */}
      {store.activeContact && (
        <div className="chatbox-container border col-9"
          style={{ color: "white", backgroundColor: "#FFE3BB" }}>
          <div className="chatbox-header d-flex p-1"
            style={{ backgroundColor: "#FFA673", height: "95px" }}>
            <div className="image-container m-1 p-1">
              <img
                src="data:image/png;base64,iVBORw0KGgo..."
                className="rounded-circle"
                alt="..."
                width="70px"
                height="70px"
              />
            </div>
            <div className="name-title mt-1 ps-1">
              <h3 style={{ color: "black" }}>{store.activeContact.name}</h3>
              <h4 style={{ color: "#808080" }}>{store.activeContact.title}</h4>
            </div>
          </div>
          {/* ChatBox with messages prop */}
          <ChatBox
            messages={store.messages[store.activeContact.id] || []}
            currentUser={store.currentUser}
            onSendMessage={handleSendMessage}
          />
        </div>
      )}
    </div>
  );
};