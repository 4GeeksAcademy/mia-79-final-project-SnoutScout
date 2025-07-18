export const initialStore = () => {
  // check if the user is logged in
  let user = localStorage.getItem("user");
  if (user !== null) user = JSON.parse(user);
  let token = localStorage.getItem("token");
  if (token === null) token = undefined;
  return {
    currentUser: 0, // represents the logged-in user ID
    contacts: [],
    messages: {},
    activeContact: null,
    pets: [],
    user: null,
    token: undefined,
    questioinnaireAnswers: {}
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_current_user":
      return {
        ...store,
        currentUser: action.payload,
      };
    case "set_contacts":
      return {
        ...store,
        contacts: action.payload,
      };
    case "set_messages":
      return {
        ...store,
        messages: {
          ...store.messages,
          [action.payload.contactId]: action.payload.messages,
        },
      };
    case "add_message":
      const { contactId, message } = action.payload;
      return {
        ...store,
        messages: {
          ...store.messages,
          [contactId]: [...action(store.messages[contactId] || []), message],
        },
      };
    case "set_active_contact":
      return {
        ...store,
        activeContact: action.payload,
      };

    case "set_pets":
      return {
        ...store,
        pets: action.payload,
      };

      // #store user object
      case 'set_user':
      return {
        ...store,
        user: action.payload.user,
        token: action.payload.token,
      };

      // save an answer to a specific question
      case 'update_answer':
        return {
          ...store,
          questioinnaireAnswers: {
            ...store.questioinnaireAnswers,
            [`question${action.payload.step}`]: action.payload.answer
          }
        };

        // reseta all answers
        case 'clear_answers':
          return {
            ...store,
            questioinnaireAnswers: {}
          };

    default:
      return store;
  }
}
