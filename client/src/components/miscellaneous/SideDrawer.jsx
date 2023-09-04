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
import { useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/toast";
import ChatLoading from "../ChatLoading";
import { Spinner } from "@chakra-ui/spinner";
import ProfileModel from "../miscellaneous/profileModel.jsx";
import { ChatState } from "../../Context/ChatProvider";
import UserListItem from "../UserAvatars/UserListItem.jsx";
import { getSender } from "../../config/ChatLogic";
import { Badge } from "@chakra-ui/react";
function SideDrawer() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const {
    setSelectedChat,
    user,
    chats,
    setChats,
    loggedUser,
    notification,
    setNotification,
    selectedChat,
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
    history.push("/");
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

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="black"
        w="100%"
        p="10px 10px 10px 10px"
        borderRadius={"35px"}
        borderWidth="5px"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button
            variant="ghost"
            bg={"yellow"}
            borderRadius={"30px"}
            onClick={onOpen}
          >
            <i className="fas fa-search"></i>
            <Text d={{ base: "none", md: "flex" }} px={4}>
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
              <BellIcon fontSize="2xl" m={0} color={"yellow"} />
              {notification.length && (
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
                    setNotification(notification.filter((n)=>n!==item))
                  }}
                >
                  {item.chat.isGroupChat
                    ? ` ${item.chat.chatName}`
                    : `${
                        getSender(user, item.chat.users)?.split(" ")[0]
                      }: \n ${truncateString(item.content, 3)}`}
                </MenuItem>
              ))}
              {notification.length > 0 && (
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
              bg="yellow"
              rightIcon={<ChevronDownIcon />}
              borderRadius={"35px"}
              ml={"5"}
            >
              {/* {console.log(user)} */}
              <Avatar
                size="sm"
                cursor="pointer"
                name={loggedUser.name}
                src={loggedUser.avatar}
              />
            </MenuButton>
            <MenuList bg="yellow" borderRadius={"15px"}>
              <ProfileModel user={loggedUser} bg="yellow">
                <MenuItem bg="yellow">My Profile</MenuItem>{" "}
              </ProfileModel>
              <MenuDivider color={"black"} />
              <MenuItem bg="yellow" onClick={logoutHandler}>
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
        <DrawerContent bgColor="black">
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
              <Button bgColor="yellow" onClick={handleSearch}>
                Search
              </Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult.map((res) => {
                console.log(res);
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
    </>
  );
}

export default SideDrawer;
