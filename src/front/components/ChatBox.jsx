import React, { useState, useEffect } from "react"


export const ChatBox = () => {
    const [newMessage, setNewMessage] = useState(""); // remembers what the user types in the chatbox
    const [conversation, setConversation] = useState([]); // remembers what the list of messages is aka the conversation


    return (
        <div className="container">
            <div className="chatbox">
                <div className="receieved-messsage border m-4 p-2" style={{ color: "black", backgroundColor: "#FFFFFF80", maxWidth: "400px", wordWrap: "break-word", borderRadius: "15px" }}>
                    <h5>Hi there! Is Charlie available for a first meeting on next Tuesday?</h5>
                    <h5>10:15am</h5>
                </div>
                <div className="sent-message float-end border m-4 p-2" style={{ color: "black", backgroundColor: "#FFA673", maxWidth: "400px", wordWrap: "break-word", borderRadius: "15px" }}>
                    <h5>Hi! Thank you so much for contacting our shelter! I can schedule your appointment for next Tuesday!</h5>
                    <h5>11:45am</h5>
                </div>
            </div >
            <div className="chat-input m-1 p-2">
                <div class="input-group">
                    <textarea class="form-control" aria-label="chat input" style={{ height: "100px", minHeight: "100px", maxHeight: "100px" }}></textarea>
                    <button type="button" class="btn align-self-center m-2" style={{ height: "50px", width: "80px", borderRadius: "15px", backgroundColor: "#03A6A1" }}>Send</button>
                </div>
            </div>
        </div>
    )
}




