import { ViewIcon } from '@chakra-ui/icons';
import { Box, Button, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react';
import React from 'react'
import { ChatState } from '../../Context/ChatProvider';

const ProfileModel = ({user,children}) => {
    const {isOpen,onOpen,onClose}=useDisclosure();
    const {loggedUser}=ChatState();
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
        <ModalOverlay/>
        <ModalContent
        height={"450px"}
        bgColor={"yellow"}
        >
          <ModalHeader
          fontSize={"40px"}
          fontFamily={"Work sans"}
          display={"flex"}
          justifyContent={"center"}
          alignContent={"center"}
          ><Box
          p={"10px"}
          bgColor={"deeppink"}
          borderRadius={"10px"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          >{loggedUser.name}</Box></ModalHeader>
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
           src={loggedUser.avatar}
           alt={loggedUser.name}
           />
           <Text
           fontSize={{base:"28px",md:"30px"}}
           >
            {loggedUser.email}
           </Text>
          </ModalBody>

          <ModalFooter>
            <Button bgColor="deeppink" mr={3} onClick={onClose}>
             Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
  
  </>
}

export default ProfileModel;