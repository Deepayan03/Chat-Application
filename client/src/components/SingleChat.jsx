import React from "react";
import { ChatState } from "../Context/ChatProvider";
import { Box, IconButton, Text } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender } from "../config/ChatLogic";
import ProfileModel from "./miscellaneous/profileModel";

const SingleChat = () => {
  const { user, selectedChat, setSelectedChat, refresh, setRefresh, loggedUser } = ChatState();
  return (
    <Box>
      {selectedChat ? (
        <>
            <Text
            fontSize={{base:"28px",md:"30px"}}
            pb={3}
            px={2}
            w="100%"
            fontFamily={"Work sans"}
            display={"flex"}
            justifyContent={"space-between"}
            >
                <IconButton
                display={{ md:"none"}}
                icon={<ArrowBackIcon/>}
                onClick={()=>setSelectedChat("")}
                />
                {
                    !selectedChat.isGroupChat?(
                        <>
                            {getSender(loggedUser,selectedChat.users)}
                            <ProfileModel user={getSender(loggedUser,selectedChat.users)}/>
                        </>
                    ):(
                       <>
                         {selectedChat.chatName.toUpperCase()}
                       </>
                    )
                }
            </Text>
        </>
      ) : (
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          h="100%"
          bgColor={"yellow"}
        >
            <Text fontSize={"3xl"} pb={3} fontFamily={"WorkSans"} color={"black"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                Click on users to start Chatting
            </Text>
        </Box>
       )} 
    </Box>
  );
};

export default SingleChat;
