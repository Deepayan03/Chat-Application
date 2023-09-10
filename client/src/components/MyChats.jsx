import { AddIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect } from "react";
import {
  checkIfSenderIsUser,
  getSender,
  getSenderFull,
} from "../config/ChatLogic.js";
import ChatLoading from "./ChatLoading";
import { Avatar, Button, Menu, MenuButton, MenuList } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider.js";
import GroupChatModal from "./miscellaneous/GroupChatModal.jsx";
import ScrollableFeed from "react-scrollable-feed";
import { useRef } from "react";
import { createPortal } from "react-dom";
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
    setRefresh,
  } = ChatState();

  const toast = useToast();
  const chatContainerRef = useRef(null);
  const portalRoot = document.createElement("div");
  portalRoot.setAttribute("id", "portal-root");
  document.body.appendChild(portalRoot);

  const deleteGroupChat = async (currentUser) => {
    if (selectedChat.groupAdmin._id === currentUser._id) {
      toast({
        title: "Admin cannot leave the group",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.put(
        "/api/chat/group-remove",
        {
          chatId: selectedChat._id,
          userId: currentUser._id,
        },
        config
      );
      setRefresh(!refresh);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error Occured !",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      // console.log("Fetch Chats------");
      // console.log(data);
      setChats(data);
      setSelectedChat((prev) => prev);
      chatContainerRef.current.lastElementChild.scrollIntoView();
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
  const deleteChats = async (chatId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.delete(`/api/chat?chatId=${chatId}`, config);
      setRefresh(!refresh);
      toast({
        title: `Chat  deleted successfully`,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (e) {
      console.log(e);
      toast({
        title: "Error Occured!",
        description: "Failed to delete the chat",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  const truncateString = (str, maxWords) =>
    str.split(" ").length > maxWords
      ? str.split(" ").slice(0, maxWords).join(" ") + "........"
      : str;
  useEffect(() => {
    const lg = JSON.parse(localStorage.getItem("userInfo"));
    setLoggedUser(lg.data);
    fetchChats();
    // eslint-disable-next-line
  }, [refresh]);
  return (
    <>
      <Box
        display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
        flexDir="column"
        alignItems="center"
        p={3}
        bg="gray.600"
        w={{ base: "100%", md: "31%" }}
        borderRadius="lg"
        borderWidth="1px"
      >
        <Box
          pb={3}
          px={3}
          fontSize={{ base: "28px", md: "30px" }}
          // font-family= {"Poppins, sans-serif"}
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
              borderRadius={"30px"}
            >
              New Group Chat
            </Button>
          </GroupChatModal>
        </Box>
        <Box
          display="flex"
          flexDir="column"
          p={3}
          bgColor={"blue.200"}
          w="100%"
          h="100%"
          borderRadius="lg"
          overflowY="hidden"
          ref={chatContainerRef}
        >
          <ScrollableFeed>
            {chats ? (
              <Stack overflowY="hidden">
                {chats.map((chat) => {
                  return (
                    <Box
                      onClick={() => setSelectedChat(chat)}
                      cursor="pointer"
                      bg={
                        selectedChat && selectedChat._id === chat._id
                          ? "blue.500"
                          : "blue.900"
                      }
                      color={
                        selectedChat && selectedChat._id === chat._id
                          ? "black"
                          : "white"
                      }
                      px={5}
                      py={4}
                      borderRadius="35px"
                      key={chat._id}
                      display={"flex"}
                      alignItems="center"
                      justifyContent={"space-between"}
                      font-family={"Poppins, sans-serif"}
                      fontSize={{base:"15px",lg:"18px"}}
                      overflow={"hidden"}
                      position="relative"
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          flexGrow: 1,
                        }}
                      >
                         {chat.isGroupChat && <Avatar
                          src={chat.avatar && chat.avatar}
                          name={chat.name}
                          display={"flex"}
                          mr={"15px"}
                        ></Avatar>}
                       { !chat.isGroupChat && <Avatar
                          src={getSenderFull(loggedUser, chat.users).avatar}
                          name={chat.name}
                          display={"flex"}
                          mr={"15px"}
                        ></Avatar>}
                        <Box
                          display={"flex"}
                          flexDirection="column"
                          font-family={"Poppins, sans-serif"}
                        >
                          <Text key={chat._id}  fontSize={{base:"16px",lg:"20px"}}>
                            {!chat.isGroupChat
                              ? getSender(loggedUser, chat.users)
                              : chat.chatName}
                          </Text>
                          <Text
                            whiteSpace="nowrap" // Prevent text from wrapping
                            overflow="hidden"
                            textOverflow="ellipsis" // Show ellipsis when content overflows
                            flexBasis="10%"
                            fontSize={{base:"12px",lg:"15px"}}
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
                      </div>
                      <Box >
                        <Menu
                          style={{
                            position: "absolute",
                            right: "0",
                            top: "100%",
                            zIndex: "3",
                          }}
                          placement="bottom-end"
                        >
                          <MenuButton
                            as={Button}
                            rightIcon={<ChevronDownIcon />}
                            borderRadius={"35px"}
                            display={"flex"}
                            justifySelf={"flex-end"}
                          >
                            {createPortal(
                              <MenuList
                                bg="blue.100"
                                borderRadius={"15px"}
                                cursor={"pointer"}
                                onClick={() =>
                                  chat.isGroupChat
                                    ? deleteGroupChat(user.data)
                                    : deleteChats(chat._id)
                                }
                                p={3}
                              >
                                Delete Chat
                              </MenuList>,
                              portalRoot
                            )}
                          </MenuButton>
                        </Menu>
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
    </>
  );
};

export default MyChats;
