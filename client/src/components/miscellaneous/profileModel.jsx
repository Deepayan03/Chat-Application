import { ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  IconButton,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useRef } from "react";
const ProfileModel = ({ user, children, self, changeAvatar,isLoading }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const fileInputRef = useRef(null);
  // const {user}=ChatState();
  console.log(user);
  return (
    user && ( <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
      )}
      <Modal size={"lg"} isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent height={"450px"} bgColor={"yellow"}>
          <ModalHeader
            fontSize={"40px"}
            fontFamily={"Work sans"}
            display={"flex"}
            justifyContent={"center"}
            alignContent={"center"}
          >
            <Box
              p={"10px"}
              bgColor={"deeppink"}
              borderRadius={"10px"}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              {user.name}
            </Box>
          </ModalHeader>
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
              src={user.avatar}
              alt={user.name}
            />
            {self && (
               <div>
              <Input
                display={"none"}
                type="file"
                p={1.5}
                accept="image/*"
                ref={fileInputRef}
                onChange={(e) => changeAvatar(e.target.files[0])}
              >
              </Input>
               <Button variant={"ghost"} bgColor={"black"} color="white" _hover={{
                color:"black",
                background:"white"
                
               }} onClick={(e) => {
                return fileInputRef.current.click();
               }}
               isLoading={isLoading}
               >
                Change Profile Picture
               </Button>
                </div>
            )}
           
            <Text fontSize={{ base: "28px", md: "30px" }}>{user.email}</Text>
          </ModalBody>

          <ModalFooter>
            <Button bgColor="deeppink" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>)
  );
};

export default ProfileModel;
