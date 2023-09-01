import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  checkIfSenderIsUser,
  getSender,
  getSenderFull,
} from "../config/ChatLogic.js";
import ChatLoading from "./ChatLoading";
// import GroupChatModal from "./miscellaneous/GroupChatModal";
import { Avatar, Button } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider.js";
import GroupChatModal from "./miscellaneous/GroupChatModal.jsx";
import ScrollableFeed from "react-scrollable-feed";
const MyChats = () => {
  const {
    selectedChat,
    setSelectedChat,
    user,
    chats,
    setChats,
    refresh,
    loggedUser,
    setLoggedUser,
  } = ChatState();

  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      console.log("Fetch Chats------");
      console.log(data);
      setChats(data);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  const truncateString = (str, maxWords) =>
    str.split(" ").length > maxWords
      ? str.split(" ").slice(0, maxWords).join(" ") + " ....."
      : str;
  useEffect(() => {
    const lg = JSON.parse(localStorage.getItem("userInfo"));
    setLoggedUser(lg.data);
    fetchChats();
    // console.log("I am being fetched")
    // console.log("This is logged user"+loggedUser);
    // eslint-disable-next-line
  }, [refresh]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="black"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
        color={"white"}
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
            bgColor={"deeppink"}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bgColor={"greenyellow"}
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="scroll"
      >
        <ScrollableFeed>
          {chats ? (
            <Stack overflowY="hidden">
              {chats.map((chat) => {
                console.log("Chats-----");
                console.log(chat);
                return (
                  <Box
                    onClick={() => setSelectedChat(chat)}
                    cursor="pointer"
                    bg={selectedChat === chat ? "deeppink" : "black"}
                    color={selectedChat === chat ? "black" : "white"}
                    px={5}
                    py={4}
                    borderRadius="lg"
                    key={chat._id}
                    display={"flex"}
                    alignItems="center"
                  >
                    <Avatar
                      src={getSenderFull(loggedUser, chat.users).avatar}
                      name={chat.name}
                      display={"flex"}
                      mr={"15px"}
                    ></Avatar>
                    <Box display={"flex"} flexDirection="column">
                      <Text key={chat._id} fontSize={"20px"}>
                        {!chat.isGroupChat
                          ? getSender(loggedUser, chat.users)
                          : chat.chatName}
                      </Text>
                      <Text
                        whiteSpace="nowrap" // Prevent text from wrapping
                        overflow="hidden"
                        textOverflow="ellipsis" // Show ellipsis when content overflows
                        flexBasis="10%"
                      >
                        {chat.latestMessage &&
                          `${checkIfSenderIsUser(
                            loggedUser,
                            chat.latestMessage.sender
                          )} :  ${truncateString(
                            chat.latestMessage.content,
                            4
                          )}`}
                      </Text>
                    </Box>
                  </Box>
                );
              })}
            </Stack>
          ) : (
            <ChatLoading />
          )}
        </ScrollableFeed>
      </Box>
    </Box>
  );
};

export default MyChats;
