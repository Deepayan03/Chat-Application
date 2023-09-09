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
// import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChaModal";
import axios from "axios";
import "./style.css";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../assets/animation_llzlhaex.json";
import GroupInfo from "./miscellaneous/GroupInfo";
import UserProfile from "./miscellaneous/UserProfile";
const ENDPOINT = "http://127.0.0.1:5001";

let socket, selectedChatCompare;

const SingleChat = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const {
    user,
    selectedChat,
    setSelectedChat,
    loggedUser,
    refresh,
    setRefresh,
    notification,
    setNotification,
  } = ChatState();
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "XMidYMid slice",
    },
  };
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
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      // console.log(data);
      setMessages(data);
      setLoading(false);
      // console.log(selectedChat);
      socket.emit("join chat", selectedChat._id);
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
      socket.emit("stop typing", selectedChat._id);
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
        // console.log(data);
        socket.emit("new message", data);
        setMessages([...messages, data]);
        setRefresh(!refresh);
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
  useEffect(() => {
    // console.log(user.data);
    socket = io(ENDPOINT);
    socket.emit("setup", user.data);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
    socket.on("online users", (onlineUsers) => {
      setOnlineUsers(onlineUsers);
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchMessages();

    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  // console.log(notification);
  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setRefresh(!refresh);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
        setRefresh(!refresh);
      }
    });
  });
  const typingHandler = (e) => {
    // console.log(selectedChat);
    setNewMessage(e.target.value);
    //Typing indicator logic
    if (!socketConnected) {
      return;
    }
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };
  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "21px", md: "30px" }}
            pb={{ base: "1", md: "3" }}
            px={{ base: "1", md: "3" }}
            w="100%"
            fontFamily={"Work sans"}
            display={"flex"}
            color={"white"}
            justifyContent={{ base: "space-between" }}
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
              <div style={{display:"flex",flexDirection:"column"}}>
                {getSender(loggedUser, selectedChat.users)}
                {onlineUsers.includes(
                  getSenderFull(loggedUser, selectedChat.users)._id
                ) ? (
                  <span style={{ color: "red",fontSize:"20px",marginLeft:"25px",padding:"0px"}}>Online</span>
                ) : null}
                </div>
                <UserProfile
                  user={getSenderFull(loggedUser, selectedChat.users)}
                >
                  <Avatar
                    src={getSenderFull(loggedUser, selectedChat.users).avatar}
                    name={selectedChat.name}
                    cursor={"pointer"}
                  ></Avatar>
                </UserProfile>
                {console.log(onlineUsers)}
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                {/* <UpdateGroupChatModal fetchMessages={fetchMessages} /> */}
                <GroupInfo fetchMessages={fetchMessages}/>
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
            pos={"relative"}
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
              <>
                {
                  <div className="messages">
                    <ScrollableChat messages={messages} />
                  </div>
                }
              </>
            )}
            <FormControl onKeyDown={(event) => sendMessage(event)}>
              {!typing && isTyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}
              <InputGroup variant="custom" colorScheme="purple">
                <Input
                  onChange={typingHandler}
                  value={newMessage}
                  placeholder="Enter a Message"
                  borderRadius={"20px"}
                  bgColor={"white"}
                  color={"black"}
                />
                <InputRightElement
                  onClick={(event) => sendMessage(event)}
                  cursor={"pointer"}
                >
                  <i className="fa fa-paper-plane" aria-hidden="true"></i>
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
          bgColor={"blue.700"}
        >
          <Text fontSize={"3xl"} pb={3} fontFamily={"WorkSans"} color={"white"}>
            Click on users to start Chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
