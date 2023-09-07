import React, { useRef } from "react";
import { CheckIcon, CloseIcon, EditIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Input,
  useDisclosure,
  useToast,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Text,
  Image,
} from "@chakra-ui/react";
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import UserListItem from "../UserAvatars/UserListItem";
// import UpdateGroupChatModal from "./UpdateGroupChaModal";
import AddUsersToGroup from "./AddUsersToGroup";
const GroupInfo = ({ fetchMessages }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  //   const [groupChatName, setGroupChatName] = useState("");

  //   const [renameLoading, setRenameLoading] = useState(false);
  const [editGroupChatName, setEditGroupChatName] = useState(false);
  const {
    selectedChat,
    setSelectedChat,
    loggedUser,
    user,
    refresh,
    setRefresh,
  } = ChatState();
  const toast = useToast();
  const handleRename = async (groupChatName) => {
    if (!groupChatName) {
      return;
    }
    try {
      //   setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      // console.log(user);
      const res = await axios.put(
        "/api/chat/rename-group",
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );
      const data = res.data.data;
      setSelectedChat(data);
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
      //   setRenameLoading(false);
    }
    // setGroupChatName("");
    // onClose();
  };
  const handleRemove = async (userToBeRemoved) => {
    // console.log(selectedChat.groupAdmin._id, user._id);
    if (selectedChat.groupAdmin._id === loggedUser._id) {
      toast({
        title: "Admin cannot leave the group",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (
      selectedChat.groupAdmin._id !== loggedUser._id &&
      userToBeRemoved._id !== loggedUser._id
    ) {
      toast({
        title: "Only admins can remove someone",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      //   setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const res = await axios.put(
        "/api/chat/group-remove",
        {
          chatId: selectedChat._id,
          userId: userToBeRemoved._id,
        },
        config
      );
      const data = res.data.data;
      userToBeRemoved._id === loggedUser._id
        ? setSelectedChat()
        : setSelectedChat(data);
      setRefresh(!refresh);
      fetchMessages();
      //   setLoading(false);
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
      //   setLoading(false);
    }
  };
  const handleAddUser = async (usersToBeAdded) => {
    let isArrayEmpty = (arr) => arr.length === 0;
    if (isArrayEmpty(usersToBeAdded)) {
      toast({
        title: `Select atleast one user`,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    const usersAlreadyInGroup = selectedChat.users.map((item) => item._id);

    for (const user of usersToBeAdded) {
      if (usersAlreadyInGroup.includes(user._id)) {
        toast({
          title: `${user.name} is already in the group`,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        return;
      }
    }

    // console.log(selectedChat.groupAdmin._id, loggedUser._id);
    if (selectedChat.groupAdmin._id !== loggedUser._id) {
      toast({
        title: "Only admins can add someone",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    console.log(usersToBeAdded);
    try {
      //   setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const res = await axios.put(
        "/api/chat/add-to-group",
        {
          chatId: selectedChat._id,
          userIds: usersToBeAdded,
        },
        config
      );
      const data = res.data.data;
      setSelectedChat(data);
      setRefresh(!refresh);
      //   setLoading(false);
      //   setSearchResult([]);
      onClose();
      toast({
        title: "Success",
        description: "User added successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      console.log(error);
    }
  };

  const updateGroupAvatar = async (avatar) => {};
  const GroupNameInputRef = useRef(null);
  return (
    <Avatar
      src={selectedChat.avatar}
      name={selectedChat.name}
      cursor={"pointer"}
      onClick={onOpen}
    >
      <Drawer
        placement={"right"}
        onClose={onClose}
        isOpen={isOpen}
        size={{ md: "full", lg: "sm" }}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader backgroundColor="blue" opacity={"50%"}>
            <Box display={"flex"} justifyContent={"space-between"}>
              <h1
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "30px",
                  color: "white",
                  background: "",
                }}
              >
                Group Info
              </h1>
              <CloseIcon cursor={"pointer"} onClick={onClose} color={"white"} />
            </Box>
          </DrawerHeader>
          <DrawerBody bgColor={"blue.900"}>
            <Box
              display={"flex"}
              justifyContent={"center"}
              padding={"5"}
              marginBottom={"5px"}
              alignItems={"center"}
            >
              <Avatar
                height={"200px"}
                width={"200px"}
                src={user.avatar}
                alt={user.name}
              />
            </Box>
            <Box display={"flex"} alignItems={"center"} justifyContent={"center"}  mb={5} >
            <Button  onClick={() => updateGroupAvatar()}>
              Update Group Avatar
            </Button>
            </Box>
            <Box>
              <Text fontFamily={"sans-serif"} color="white" fontSize={"16px"}>
                Group Name
              </Text>
              {!editGroupChatName && (
                <Box display={"flex"} justifyContent={"space-between"}>
                  <Text
                    ml="20px"
                    mb="25px"
                    color="white"
                    fontSize={"19px"}
                    fontFamily={"sans-serif"}
                    marginBottom={"-0.5"}
                    itemType="input"
                    width={"70%"}
                  >
                    {selectedChat.chatName}
                  </Text>
                  <EditIcon
                    color={"white"}
                    marginLeft={"5"}
                    cursor={"pointer"}
                    onClick={() => setEditGroupChatName(true)}
                  ></EditIcon>
                  <Box />
                </Box>
              )}

              {
                <>
                  {editGroupChatName && (
                    <>
                      <Input
                        type="text"
                        width={"70%"}
                        color={"white"}
                        ref={GroupNameInputRef}
                      ></Input>
                      <CloseIcon
                        color={"white"}
                        marginLeft={"5"}
                        cursor={"pointer"}
                        onClick={() => setEditGroupChatName(false)}
                      ></CloseIcon>
                      <CheckIcon
                        color={"white"}
                        marginLeft={"5"}
                        width={"25px"}
                        cursor={"pointer"}
                        onClick={() => {
                          setEditGroupChatName(false);
                          console.log(GroupNameInputRef.current.value);
                          handleRename(GroupNameInputRef.current.value);
                        }}
                      ></CheckIcon>
                    </>
                  )}
                </>
              }

              {
                <AddUsersToGroup handleAddUser={handleAddUser}>
                  <Box
                    mt={5}
                    mb={"3"}
                    bg={"blue.700"}
                    p={2}
                    borderRadius={"15px"}
                    _hover={{
                      backgroundColor: "blue.500",
                    }}
                    display={"flex"}
                    alignItems={"center"}
                  >
                    <Image
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDXME8MHD0oWdF0cL0Wol2AmsCJQhW5TWR2GO6OGsbbfkp1zys0z1WrfrYaLqt_wUtf2M&usqp=CAU"
                      height={"50px"}
                      width={"50px"}
                      borderRadius={"50%"}
                    ></Image>
                    <Text
                      fontSize={"20px"}
                      color={"white"}
                      fontWeight={"15px"}
                      ml="30px"
                    >
                      Add new Participants
                    </Text>
                  </Box>
                </AddUsersToGroup>
              }

              <Text fontSize={"16px"} color="white" fontFamily={"sans-serif"}>
                Users
              </Text>
              {selectedChat.users?.map((item) => (
                <UserListItem
                  key={item._id}
                  user={item}
                  handleFunction={() => handleAddUser(item)}
                />
              ))}
            </Box>
            <Box>
              <Button
                colorScheme="red"
                onClick={() => handleRemove(loggedUser)}
              >
                Exit Group
              </Button>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Avatar>
  );
};

export default GroupInfo;
