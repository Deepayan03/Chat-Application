import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/menu";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/modal";
import { Tooltip } from "@chakra-ui/tooltip";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/avatar";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/toast";
import ChatLoading from "../ChatLoading";
import { Spinner } from "@chakra-ui/spinner";
import { ChatState } from "../../Context/ChatProvider";
import UserListItem from "../UserAvatars/UserListItem.jsx";
import { getSender } from "../../config/ChatLogic";
import { Badge, } from "@chakra-ui/react";
import UserProfile from "./UserProfile";
function SideDrawer({setSingleChatActive,singleChatActive}) {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [profilePictureLoading, setProfilePictureLoading] = useState(false);
  const {
    setSelectedChat,
    user,
    chats,
    setChats,
    notification,
    setNotification,
    userProfile,
    setUserProfile,
    selectedChat
  } = ChatState();

  const truncateString = (str, maxWords) =>
    str.split(" ").length > maxWords
      ? str.split(" ").slice(0, maxWords).join(" ") + "........"
      : str;
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const history = useHistory();
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    sessionStorage.clear();
    setChats([]);
    setSelectedChat("");
    history.push("/");
  };
  const handleChangeAvatar = async (avatar) => {
    if (!avatar) {
      toast({
        title: "Please upload a picture first",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
    if (avatar.type === "image/jpeg" || avatar.type === "image/png") {
      let data = new FormData();
      // console.log(avatar);
      data.append("file", avatar);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "dnymefrvq");
      setProfilePictureLoading(true);
      let oldAvatarUrl = userProfile.data.avatar;
      let OldpublicId = oldAvatarUrl.split('/').pop().split('.')[0];
      // console.log(OldpublicId);
      try {
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dnymefrvq/image/upload",
          {
            method: "post",
            body: data,
          }
        );
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const res = await response.json();
        // console.log(res);
        let id = user.data._id;
        let url = res.url.toString();
        const modifiedData = await axios.put("/api/user/", { id, url , OldpublicId }, config);
        const userData = modifiedData.data;
        setUserProfile(userData);
        setProfilePictureLoading(false);
        let existingData = JSON.parse(localStorage.getItem('userInfo'));
        existingData.data.avatar=userData.data.avatar;
        localStorage.setItem("userInfo", JSON.stringify(existingData));
        toast({
          title: "Profile picture updated successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom-right",
        });
      } catch (e) {
        console.log(e);
        setProfilePictureLoading(false);
      }
    }
  };
  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
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
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChat = async (userId) => {
    // console.log(userId);
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);
      const recieved = data.chats;
      if (!chats.find((c) => c._id === data._id)) {
        // console.log(data, ...chats);
        setChats([...chats, recieved]);
      }
      setSelectedChat(recieved);
      // console.log("SearchResult---->"+searchResult[0].name);
      setLoadingChat(false);
      onClose();
      setSearchResult([]);
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      console.log(error);
    }
  };

  useEffect(() => {
    // When SingleChat component is active
    if (selectedChat &&  window.screen.width < 450) {
      setSingleChatActive(true);
     
    } else {
      setSingleChatActive(false);
      // console.log(window.screen.width)
    }
    //eslint-disable-next-line
  }, [selectedChat]);
  return (
    <Box
    style={{display: singleChatActive ? 'none' : 'block'}}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="blue.600"
        w="100%"
        p="7px"
        borderRadius={"35px"}
        borderWidth="5px"
        mb={0}
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button
            variant="ghost"
            bg={"blue.100"}
            _hover={{bgColor:"white",color:"black"}}
            color={"blue.900"}
            borderRadius={"30px"}
            onClick={onOpen}
          >
            <i className="fas fa-search"></i>
            <Text display={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans" color={"white"}>
          CHIT CHAT
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon fontSize="2xl" m={0}  color={"blue.50"} />
              {notification.length>0 && (
                <Badge
                  position="absolute"
                  colorScheme="red"
                  borderRadius="50%"
                  ml={0}
                >
                  {notification.length}
                </Badge>
              )}
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No new messages"}
              {notification.map((item) => (
                <MenuItem
                  key={item._id}
                  onClick={() => {
                    setSelectedChat(item.chat);
                    setNotification(notification.filter((n) => n !== item));
                  }}
                >
                  {item.chat.isGroupChat
                    ? ` ${item.chat.chatName}`
                    : `${
                        getSender(user, item.chat.users)?.split(" ")[0]
                      }: \n ${truncateString(item.content, 3)}`}
                </MenuItem>
              ))}
              {notification.length !==0 && (
                <MenuItem display={"flex"} alignItems={"flex-start"}>
                  {notification.length > 0 && (
                    <Button
                      height={"auto"}
                      width={"auto"}
                      onClick={() => setNotification([])}
                    >
                      Clear All
                    </Button>
                  )}
                </MenuItem>
              )}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton
              as={Button}
              bg="blue.100"
              rightIcon={<ChevronDownIcon />}
              borderRadius={"35px"}
              ml={"5"}
            >
              {/* {console.log(userProfile)} */}
              <Avatar
                size="sm"
                cursor="pointer"
                name={userProfile.data.name || user.data.name}
                src={userProfile.data.avatar || user.data.avatar}
              />
            </MenuButton>
            <MenuList bg="gray.300" borderRadius={"15px"}>
              <UserProfile
              user={userProfile.data || user.data}
              changeAvatar={(avatar) => handleChangeAvatar(avatar)}
              isLoading={profilePictureLoading}
              >
                <MenuItem bg="gray.300">My Profile</MenuItem>{" "}
                </UserProfile>
              {/* </ProfileModel> */}
              <MenuDivider color={"black"} />
              <MenuItem bg="gray.300" onClick={logoutHandler}>
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer
        placement="left"
        onClose={onClose}
        isOpen={isOpen}
        bgColor="yellow"
      >
        <DrawerOverlay />
        <DrawerContent bgColor="blue.900">
          <DrawerHeader color="white" borderBottomWidth="1px">
            Search Users
          </DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                bgColor={"white"}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button bgColor="blue.500" _hover={{color:"black", bg:"white"}} onClick={handleSearch} color={"white"}>
                Search
              </Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult.map((res) => {
                // console.log(res);
                return (
                  <UserListItem
                    key={res._id}
                    user={res}
                    handleFunction={() => accessChat(res._id)}
                  />
                );
              })
            )}
            {loadingChat && <Spinner ml="auto" display="flex" color="blue" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}

export default SideDrawer;
