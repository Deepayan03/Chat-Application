import { Box } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import ChatBox from "../components/ChatBox";
import MyChats from "../components/MyChats";
import { useState } from "react";
const ChatPage = () => {
    const {user}=ChatState(); 
    // Destructure the userInfo stored from the state defined in the context api
    const [singleChatActive, setSingleChatActive] = useState(false);

    return (
    <div style={{width:"100%",overflowY:"hidden"}} >
     { user && <SideDrawer setSingleChatActive={setSingleChatActive} singleChatActive={singleChatActive}/>}
        <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
        >
        {user && <MyChats />}
        {user && (
          <ChatBox />
        )}
        </Box>
    </div>        
    );
}

export { ChatPage };