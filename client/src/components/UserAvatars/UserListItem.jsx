import { Avatar } from "@chakra-ui/avatar";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { Box, Text } from "@chakra-ui/layout";
import {
  Button,
  Checkbox,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";

const UserListItem = ({
  user,
  handleFunction,
  forGroupChat = false,
  setAddedUsers,
  addedUsers,
  groupInfo = false,
  handleRemove,
  groupAdmin,
  currentUser,
  handleAdminRemoval,
  handleAdminPromotion
}) => {
  const {selectedChat}=ChatState();
  const handleCheckboxChange = (userId) => {
    if (addedUsers.includes(userId)) {
      setAddedUsers(addedUsers.filter((id) => id !== userId));
    } else {
      setAddedUsers([...addedUsers, userId]);
      console.log(addedUsers);
    }
  };
  const checkIfAdmin=(groupAdmin,user)=>{return groupAdmin.some((item) => item._id === user._id)}
  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bg="blue.200"
      _hover={{
        background: "#38B2AC",
        color: "white",
      }}
      w="100%"
      display="flex"
      alignItems="center"
      color="black"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={user.name}
        src={user.avatar}
      />
      <Box flex="1">
        {/* {groupInfo ? console.log(groupAdmin._id,currentUser._id):""} */}
        {!groupInfo && <Text>{user.name}</Text>}
        {groupInfo && (
          <Text>
            {user._id !== currentUser._id ? `${user.name}` : "You"}{" "}
            {groupInfo
              ? checkIfAdmin(groupAdmin,user)
                ? "(Admin)"
                : ""
              : ""}
          </Text>
        )}
        <Text fontSize="xs">
          <b>Email : </b>
          {user.email}
        </Text>
      </Box>
      {forGroupChat && currentUser._id !== user._id && (
        <Checkbox
          size="md"
          colorScheme="green"
          isChecked={addedUsers.includes(user._id)}
          onChange={() => handleCheckboxChange(user._id)}
        />
      )}
      {groupInfo && (
        <Box>
          {checkIfAdmin(groupAdmin,currentUser) && currentUser._id!==user._id && <Menu placement="bottom-end">
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              borderRadius="35px"
            />
            <MenuList
              bg="blue.300"
              borderRadius="15px"
              cursor="pointer"
              color="black"
              p={2}
            >
              <MenuItem
                bg="blue.300"
                _hover={{
                  bg: "blue.500",
                  color: "white",
                  borderRadius: "15px",
                }}
                onClick={()=>handleAdminPromotion(user._id,selectedChat._id)}
              >
                Promote as admin
              </MenuItem>
              <MenuItem
                bg="blue.300"
                _hover={{
                  bg: "blue.500",
                  color: "white",
                  borderRadius: "15px",
                }}
                onClick={()=>handleAdminRemoval(user._id,selectedChat._id)}
              >
                Remove as admin
              </MenuItem>

              <MenuItem
                bg="blue.300"
                _hover={{
                  bg: "blue.500",
                  color: "white",
                  borderRadius: "15px",
                }}
                onClick={() => handleRemove(user)}
              >
                Remove participant
              </MenuItem>
            </MenuList>
          </Menu>}
        </Box>
      )}
    </Box>
  );
};

export default UserListItem;
