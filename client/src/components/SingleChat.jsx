import React from "react";
import { ChatState } from "../Context/ChatProvider";
import { Box, IconButton, Text } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../config/ChatLogic";
import ProfileModel from "./miscellaneous/profileModel";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChaModal";

const SingleChat = () => {
  const {
    user,
    selectedChat,
    setSelectedChat,
    refresh,
    setRefresh,
    loggedUser,
  } = ChatState();
  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily={"Work sans"}
            display={"flex"}
            justifyContent={{base:"space-between"}}
          >
            <IconButton
              display={{ base:"flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {console.log(selectedChat)}
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(loggedUser, selectedChat.users)}
                <ProfileModel
                  user={getSenderFull(loggedUser, selectedChat.users)}
                />
              </>
            ) : (
              <>{selectedChat.chatName.toUpperCase()}
              <UpdateGroupChatModal/>
              </>
            )}
          </Text>
          <Box
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"flex-end"}
            p={3}
            backgroundColor={"green.100"}
            w="100%"
            h={"100%"}
            borderRadius={"lg"}
            overflowY={"hidden"}
          >
            Messages here
          </Box>
        </>
      ) : (
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          h="100%"
          bgColor={"yellow"}
        >
          <Text
            fontSize={"3xl"}
            pb={3}
            fontFamily={"WorkSans"}
            color={"black"}
          >
            Click on users to start Chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
