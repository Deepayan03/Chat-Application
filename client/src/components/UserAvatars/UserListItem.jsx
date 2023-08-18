import { Avatar, Box, Text } from '@chakra-ui/react'
import React from 'react'

const UserListItem = ({user,handleUser}) => {
    console.log(user);
  return (
    <Box
    onClick={handleUser}
    cursor={'pointer'}
    _hover={
        {
            background:"white",
            color:"black"
        }
    }
    width={"100%"}
    display={"flex"}
    alignItems={"center"}
    color="yellow"
    background={"black"}
    px={3}
    py={2}
    mb={2}
    borderRadius={"lg"}
    overflow={"hidden"}
    >
    <Avatar
    mr={2}
    size="sm"
    cursor="pointer"
    name={user.name}
    src={user.avatar}
    />
    <Box>
        <Text>
            {user.name}
        </Text>
        <Text fontSize={"xs"}>
            <b>Email:</b>
            {user.email}
        </Text>
    </Box>

    </Box>
  )
}

export default UserListItem;