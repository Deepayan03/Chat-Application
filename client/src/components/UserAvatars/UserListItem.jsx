import { Avatar } from "@chakra-ui/avatar";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { Box, Text } from "@chakra-ui/layout";
import { Button, Checkbox, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";

const UserListItem = ({
  user,
  handleFunction,
  forGroupChat = false,
  setAddedUsers,
  addedUsers,
  groupInfo = false,
  handleRemove
}) => {
  const handleCheckboxChange = (userId) => {
    if (addedUsers.includes(userId)) {
      // If the user ID is already in the array, remove it
      setAddedUsers(addedUsers.filter((id) => id !== userId));
    } else {
      // If the user ID is not in the array, add it
      setAddedUsers([...addedUsers, userId]);
      console.log(addedUsers);
    }
  };
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
        <Text>{user.name}</Text>
        <Text fontSize="xs">
          <b>Email : </b>
          {user.email}
        </Text>
      </Box>
      {forGroupChat && (
        <Checkbox
          size="md"
          colorScheme="green"
          isChecked={addedUsers.includes(user._id)}
          onChange={() => handleCheckboxChange(user._id)}
        />
      )}
      {
        groupInfo && (
          <Box>
          <Menu placement="bottom-end">
            <MenuButton as={Button} rightIcon={<ChevronDownIcon/>} borderRadius="35px"/>
            <MenuList
              bg="blue.300"
              borderRadius="15px"
              cursor="pointer"
              color="black"
              p={2}
            >
              <MenuItem  bg="blue.300" _hover={{
                bg:"blue.500",
                color:"white",
                borderRadius:"15px"
              }} >Promote as admin</MenuItem>
              <MenuItem  
              bg="blue.300" 
              _hover={{
                bg:"blue.500",
                color:"white",
                borderRadius:"15px"
              }}
              onClick={()=>handleRemove(user)}
              >Remove participant</MenuItem>
            </MenuList>
          </Menu>
        </Box>
        )
      }
    </Box>
  );
};

export default UserListItem;
