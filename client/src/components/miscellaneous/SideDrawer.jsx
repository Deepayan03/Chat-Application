import { Avatar, Box, Button, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text, Tooltip } from "@chakra-ui/react";
import React, { useState } from "react";
import {BellIcon , ChevronDownIcon} from "@chakra-ui/icons"
import { ChatState } from "../../Context/ChatProvider";
import ProfileModel from "./profileModel";
const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(null);
  const {user}=ChatState();
  const {name,avatar}=user.data;
  console.log(name,avatar);
  return (
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
        <Button variant="ghost" background="yellow">
          <i className="fa-sharp fa-solid fa-magnifying-glass fa-bounce"></i>
          <Text display={{ base: "none", md: "flex" }} px="4">
            Search User
          </Text>
        </Button>
      </Tooltip>
      <Text fontSize="2xl" fontFamily="Work Sans" fontWeight="bold" color="white">
        SUPER-CHAT
      </Text>
      <div className="menu">
        <Menu>
            <MenuButton p={1} color="yellow">
                <BellIcon fontSize="35px" focusable={true} m={1} />
            </MenuButton>
            {/* <MenuList/> */}
        </Menu>
        <Menu >
            <MenuButton as={Button} background="yellow" rightIcon={<ChevronDownIcon/>}>
                <Avatar size="sm" cursor="pointer" src={avatar ? avatar:" "} name={avatar ? " ":name}/>
            </MenuButton>
            <MenuList background="yellow" >
                <ProfileModel user={user}>
                <MenuItem background="yellow">My Profile</MenuItem>
                </ProfileModel>
                <MenuDivider h="5px"  />
                <MenuItem background="yellow">Logout</MenuItem>
            </MenuList>
        </Menu>
      </div>
    </Box>
  );
};

export default SideDrawer;
