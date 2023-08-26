import { CloseIcon } from '@chakra-ui/icons'
import { Box, } from '@chakra-ui/react'

const UserBadgeItem = ({item,handleFunction}) => {
  return (
    <Box
    px={2}
    py={1}
    borderRadius={"lg"}
    m={1}
    mb={2}
    bgColor={"purple"}
    color={"white"}
    variant={"solid"}
    fontSize={12}
    cursor={"pointer"}
    >
    { item.name }
    <CloseIcon onClick={handleFunction}/>
    </Box>
  )
}

export default UserBadgeItem;