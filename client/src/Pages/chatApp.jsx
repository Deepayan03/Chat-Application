import React, { useEffect, useState } from "react";
import axios from "axios";

const ChatPage = () => {
    const [chats, setChats] = useState([]);

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const response = await axios.get("/api/chats");
                if (response) {
                    console.log(response)
                    setChats(response.data.data); // Update the state with fetched data
                } else {
                    console.error("Error fetching chat data:", response.data.message);
                }
            } catch (error) {
                console.error("Error fetching chat data:", error);
            }
        };

        fetchChats();
    }, []);

    return (
        <div className="chat">
           {chats}
        </div>
    );
}

export { ChatPage };