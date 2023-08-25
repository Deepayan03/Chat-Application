import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import UserListItem from "../UserAvatars/UserListItem";
import UserBadgeItem from "../UserAvatars/UserBadgeItem";
const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setgroupChatName] = useState();
  const [selectedUsers, setselectedUsers] = useState([]);
  const [search, setsearch] = useState("");
  const [searchResult, setsearchResult] = useState([]);
  const [loading, setloading] = useState(false);
  const toast = useToast();
  const { user , chats, setChats , refresh,  setRefresh} = ChatState();

  const handleSearch = async (query) => {
    if (!query) {
      return;
    }
    setsearch(query);
    try {
      setloading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      // console.log(data);
      setloading(false);
      setsearchResult(data);
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
  const handleSubmit = async() => {
    if(!groupChatName || !selectedUsers){
      toast({
        title:"Please fill all the fields",
        status:"warning",
        duration:5000,
        isClosable:true,
        position:"top"
      });
      return
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const data=await axios.post("/api/chat/group",{
        name:groupChatName,
        users:JSON.stringify(selectedUsers.map((u)=>u._id)),
      },config);
      setChats([data,...chats]);
      onClose();
      toast({
        title:"Group Chat created",
        status:"success",
        duration:5000,
        isClosable:true,
        position:"bottom"
      });
      setRefresh(!refresh);
      setgroupChatName('');
      setselectedUsers([]);
      setsearch('');
      setsearchResult([]);
    } catch (error) {
      toast({
        title:"Couldn't create the group chat",
        status:"error",
        duration:5000,
        isClosable:true,
        position:"bottom"
      });
    }
  };
  const handleDelete = (delUser) => {
    setselectedUsers(
      selectedUsers.filter((selected) => selected._id !== delUser._id)
    );
  };
  const handleGroup = (addedUser) => {

    if (selectedUsers.includes(addedUser)) {
        console.log("Selected  "+selectedUsers)
        console.log(addedUser)
       toast({
        position:"top",
        isClosable:"true",
        status:"warning",
        title:"User already added",
        description:"Cannot add same user twice",
        duration:5000
        
      });
      return;
    } else 
    setselectedUsers([...selectedUsers, addedUser]);
  };
  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"35px"}
            display={"flex"}
            fontFamily={"Work sans"}
            justifyContent={"center"}
          >
            Create a group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDir={"column"} alignItems={"center"}>
            <FormControl>
              <Input
                placeholder="Chat name"
                mb={3}
                onChange={(e) => setgroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add users to group Chat"
                mb={3}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box w="100%" display={"flex"} flexWrap={"wrap"}>
              {selectedUsers.map((item) => (
                <UserBadgeItem
                  key={item._id}
                  item={item}
                  handleFunction={() => handleDelete(item)}
                />
              ))}
            </Box>
            {loading ? (
              <div>Loading....</div>
            ) : (
              searchResult
                ?.slice(0, 4)
                ?.map((item) => (
                  <UserListItem
                    key={item._id}
                    user={item}
                    handleFunction={() => 
                         handleGroup(item)
                    }
                  />
                ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Close
            </Button>
            <Button mr={3} onClick={handleSubmit}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
