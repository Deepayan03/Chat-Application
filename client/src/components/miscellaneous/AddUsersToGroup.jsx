import { Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import UserListItem from '../UserAvatars/UserListItem'
import { ChatState } from '../../Context/ChatProvider';
import axios from 'axios';

const AddUsersToGroup = ({children,handleAddUser}) => {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState();
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        selectedChat,
        user,
      } = ChatState();
      const [addedUsers,setAddedUsers]=useState([]);
    const handleSearch = async (query) => {
        if (!query) {
          return;
        }
        setSearch(query);
        try {
          setLoading(true);
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          const { data } = await axios.get(`/api/user?search=${search}`, config);
          // console.log(data);
          setLoading(false);
          const userIds = selectedChat.users.map(item => item._id);
          console.log(userIds);
          setSearchResult(data.filter(item => !userIds.includes(item._id)));
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

      
  return (
    <>
    {children ? (
      <span onClick={onOpen}>{children}</span>
    ):(<></>) }

    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{selectedChat.chatName}</ModalHeader>
        <ModalCloseButton onClick={()=>setAddedUsers([])}/>
        <ModalBody>
            
          <FormControl>
            <Input
              placeholder={"Add Participants"}
              mb={1}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </FormControl>
          {loading ? (
            <Spinner color="blue" />
          ) : (
            searchResult
              ?.slice(0, 4)
              ?.map((item) => (
                <UserListItem
                  key={item._id}
                  user={item}
                  forGroupChat={true}
                  setAddedUsers={setAddedUsers}
                  addedUsers={addedUsers}
                  currentUser={user.data}
                />
              ))
          )}
        </ModalBody>

        <ModalFooter>

          <Button colorScheme="blue" mr={3} onClick={()=>{
            onClose();
            setSearchResult([]);
            setAddedUsers([]);
          }}>
            Close
          </Button>
          <Button colorScheme="blue"  onClick={()=>{
            handleAddUser(addedUsers);
          }}>
            Add User
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  </>
  )
}

export default AddUsersToGroup