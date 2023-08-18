import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModel from "./profileModel";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatars/UserListItem";
const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const[loadingChat,setLoadingChat]=useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user,setUser,selectedChat, setSelectedChat,chats,setChats } = ChatState();
  const { name, avatar, _id } = user.data;
  const { token } = user;
  // console.log(name, avatar, token);
  const history = useHistory();
  const toast = useToast();
  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please enter some thing to search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`/api/user?search=${search}`, config);
      // console.log(response);
      const { data } = response.data;
      // console.log(data);
      setLoading(false);
      setSearchResult(data);
      // console.log(searchResult);
    } catch (error) {
      toast({
        title: "Error Occured!!...Failed to fetch Search results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      // console.log(error);
    }
  };
  const logOutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };
  const accessChat = async(userId) => {
    try {
      setLoading(true);
      const config={
        headers:{
          "Content-type":"application/json",
          Authorization: `Bearer ${token}`,
        }
      }
      const {data}= await axios.post("/api/chat",{userId},config);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error Occured!!...Failed to fetch chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="black"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
        borderRadius="20px"
      >
        <Tooltip label="Search users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" background="yellow" onClick={onOpen}>
            <i className="fa-sharp fa-solid fa-magnifying-glass fa-bounce"></i>
            <Text display={{ base: "none", md: "flex" }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text
          fontSize="2xl"
          fontFamily="Work Sans"
          fontWeight="bold"
          color="white"
        >
          SUPER-CHAT
        </Text>
        <div className="menu">
          <Menu>
            <MenuButton p={1} color="yellow">
              <BellIcon fontSize="35px" focusable={true} m={1} />
            </MenuButton>
            {/* <MenuList/> */}
          </Menu>
          <Menu>
            <MenuButton
              as={Button}
              background="yellow"
              rightIcon={<ChevronDownIcon />}
            >
              <Avatar
                size="sm"
                cursor="pointer"
                src={avatar ? avatar : " "}
                name={avatar ? " " : name}
              />
            </MenuButton>
            <MenuList background="yellow">
              <ProfileModel user={user}>
                <MenuItem background="yellow">My Profile</MenuItem>
              </ProfileModel>
              <MenuDivider h="5px" />
              <MenuItem onClick={logOutHandler} background="yellow">
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent bgColor={"black"}>
          <DrawerHeader color={"yellow"} borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
              color={"yellow"}
                placeholder="Search users by email or name"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Search</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={_id}
                  user={user}
                  handleUser={(user) => accessChat(user.data._id)}
                />
              ))
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
