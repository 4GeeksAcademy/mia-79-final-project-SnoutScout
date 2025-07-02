import { ChatBox } from "../components/ChatBox";
import { Contact } from "../components/Contact";


export const Messages = () => {

  // this basically renders 2 boxes and their compoenents: (1) conversations tabs (2) chatbox 

  return (
    <div className="container d-flex m-3 ms-5">

      {/* Conversations Tabs  */}

      <div 
        className="conversations-box border me-3"
        style={{
          color: "white",
          backgroundColor: "#FFE3BB",
        }}
      >
        <h1
          className="conversations-header p-1 d-flex justify-content-center"
          style={{ backgroundColor: "#FFA673" }}
        >
          Conversations
        </h1>
        
        {/* The contact component will take the data and render uniquely when user clicks "contact shelter" on  */}

        <div className="contacts">
          <Contact /> 
          <Contact />
        </div>

      </div>

      {/* ChatBox */}

      <div 
        className="chatbox-container border col-9"
        style={{ color: "white", backgroundColor: "#FFE3BB" }}
      >

        {/* Header with profile pic and name */}
        <div className="chatbox-header d-flex p-1" style={{ backgroundColor: "#FFA673", height: "95px" }}>
          <div className="image-container m-1 p-1">
            <img
              src="data:image/png;base64,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"
              class="rounded-circle"
              alt="..."
              width="70px"
              height="70px"
            ></img>
          </div>
          <div className="name-title mt-1 ps-1">
            <h3 className="name" style={{ color: "black" }}>
              Jenny Romero
            </h3>
            <h4 className="shelter-title" style={{ color: "#808080" }}>Animal Rescue Shelter - Manager</h4>
          </div>
        </div>
        <ChatBox />
      </div>
    </div>
  );
};
