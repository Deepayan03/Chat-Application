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
  const { user } = ChatState();

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
  const handleSubmit = () => {};
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
      console.log("I am causing this error")
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
            {console.log(selectedUsers)}
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
