export const initialStore=()=>{
  return{
    currentUser: 0, // represents the logged-in user ID
    contacts: [],
    messages: {},
    activeContact: null
  }
}

export default function storeReducer(store, action = {}) {
  switch(action.type){
    case 'set_current_user':
      return {
        ...store,
        currentUser: action.payload
      };
    case 'set_contacts':
      return {
        ...store,
        contacts: action.payload
      };
    case 'set_messages':
      return {
        ...store,
        messages: {
          ...store.messages,
          [action.payload.contactId]: action.payload.messages
        }
      };
    case 'add_message':
      const { contactId, message} = action.payload;
      return {
        ...store,
        messages: {
          ...store.messages,
          [contactId]: [...action(store.messages[contactId] || []), message]
        }
      };
      case 'set_active_contact':
        return {
          ...store,
          activeContact: action.payload
        };
      default: 
        return store;
      }
    };
