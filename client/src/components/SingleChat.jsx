import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import {
  Avatar,
  Box,
  FormControl,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../config/ChatLogic";
import ProfileModel from "./miscellaneous/profileModel";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChaModal";
import axios from "axios";
import "./style.css"
import ScrollableChat from "./ScrollableChat";
const SingleChat = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [refreshMessages,setRefreshMessages]=useState(0);
  const {
    user,
    selectedChat,
    setSelectedChat,
    refresh,
    setRefresh,
    loggedUser,
  } = ChatState();
  const toast = useToast();
  const fetchMessages = async () => {
    if (!selectedChat) {
      return;
    }
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    };
    try {
      !refreshMessages && setLoading(true);
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      console.log(data);
      setMessages(data);
      setLoading(false);
      // setRefreshMessages(!refreshMessages);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };
  const sendMessage = async (event) => {
    if ((event.type === "click" || event.key === "Enter") && newMessage) {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        console.log(data);
        setMessages([...messages, data]);
        setRefreshMessages(refreshMessages+1);
      } catch (error) {
        toast({
          title: "Error Occured",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  useEffect(()=>{
    setLoading(true);
    fetchMessages();
    console.log(messages);
    // eslint-disable-next-line
  },[selectedChat]);

  useEffect(()=>{
    // setLoading(true);
    fetchMessages();
    console.log(messages);
    // eslint-disable-next-line
  },[refreshMessages]);
  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    //Typing indicator logic
  };
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
            justifyContent={{ base: "space-between" }}
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(loggedUser, selectedChat.users)}
                <ProfileModel
                  user={getSenderFull(loggedUser, selectedChat.users)}
                >
                  <Avatar
                    src={getSenderFull(loggedUser, selectedChat.users).avatar}
                    name={selectedChat.name}
                    cursor={"pointer"}
                  ></Avatar>
                </ProfileModel>
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal  fetchMessages={fetchMessages} />
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
            {loading ? (
              <Spinner
                size={"xl"}
                w={20}
                h={20}
                alignSelf={"center"}
                margin={"auto"}
              />
            ) : (
              <>{ <div className="messages">
                <ScrollableChat messages={messages}/>
              </div> }</>
            )}
            <FormControl onKeyDown={(event) => sendMessage(event)}>
              <InputGroup variant="custom" colorScheme="purple">
                <Input
                  onChange={typingHandler}
                  value={newMessage}
                  placeholder="Enter a Message"
                  borderRadius={"20px"}
                  bgColor={"yellow"}
                  color={"black"}
                />
                <InputRightElement
                  onClick={(event) => sendMessage(event)}
                  cursor={"pointer"}
                >
                  <i class="fa fa-paper-plane" aria-hidden="true"></i>
                </InputRightElement>
              </InputGroup>
            </FormControl>
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
          <Text fontSize={"3xl"} pb={3} fontFamily={"WorkSans"} color={"black"}>
            Click on users to start Chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
