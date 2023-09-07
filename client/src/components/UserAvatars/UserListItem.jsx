import { Avatar } from "@chakra-ui/avatar";
import { Box, Text } from "@chakra-ui/layout";
import { Checkbox } from "@chakra-ui/react";

const UserListItem = ({ user,handleFunction, forGroupChat=false,setAddedUsers,addedUsers }) => {
  // console.log(user);
  const handleCheckboxChange = (userId) => {
    if (addedUsers.includes(userId)) {
      // If the user ID is already in the array, remove it
      setAddedUsers(addedUsers.filter((id) => id !== userId));
    } else {
      // If the user ID is not in the array, add it
      setAddedUsers([...addedUsers, userId]);
      console.log(addedUsers)
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
      {forGroupChat && <Checkbox size='md' colorScheme='green' 
         isChecked={addedUsers.includes(user._id)} 
         onChange={() => handleCheckboxChange(user._id)} 
      />}
    </Box>
  );
};

export default UserListItem;