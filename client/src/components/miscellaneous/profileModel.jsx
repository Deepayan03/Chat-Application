import { ViewIcon } from '@chakra-ui/icons';
import { Button, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react';
import React from 'react'

const ProfileModel = ({user,children}) => {
    const {isOpen,onOpen,onClose}=useDisclosure();
  return <>
  {
    children?<span onClick={onOpen}>{children}</span>:
    (<IconButton
        d={
        {base:"flex"}}
        icon={<ViewIcon/>}
        onClick={onOpen}
        />
    )
  }
  <Modal 
  size={"lg"}
  isCentered
  isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
        height={"450px"}
        >
          <ModalHeader
          fontSize={"40px"}
          fontFamily={"Work sans"}
          display={"flex"}
          justifyContent={"center"}
          alignContent={"center"}
          >{user.data.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          justifyContent={"space-between"}
          >
           <Image
           borderRadius="full"
           boxSize={"150px"}
           src={user.data.avatar}
           alt={user.data.name}
           />
           <Text
           fontSize={{base:"28px",md:"30px"}}
           >
            {user.data.email}
           </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
             Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
  
  </>
 
  
}

export default ProfileModel;