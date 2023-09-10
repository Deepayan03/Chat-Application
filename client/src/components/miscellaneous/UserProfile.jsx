import { CloseIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useRef } from "react";
const UserProfile = ({ children,user,changeAvatar,isLoading,self=false }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const fileInputRef = useRef(null);
  return (
    <Box >
      <span onClick={onOpen}>{children} </span>
      <Drawer
        placement={"right"}
        onClose={onClose}
        isOpen={isOpen}
        size={{ md: "full", lg: "sm" }}
        
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader backgroundColor="blue" opacity={"50%"}>
            <Box
              display={"flex"}
              justifyContent={"space-between"}
            >
              <h1
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "30px",
                  color: "white",
                }}
              >
              {  self ? "My Profile":"UserInfo"}
              </h1>
              <CloseIcon onClick={onClose} color={"white"} />
            </Box>
          </DrawerHeader>
          <DrawerBody bgColor={"blue.900"}>
            <Box
              display={"flex"}
              justifyContent={"center"}
              padding={"5"}
              marginBottom={"5px"}
              alignItems={"center"}
            >
              <Avatar height={"200px"} width={"200px"}  src={user.avatar}
              alt={user.name} />
            </Box>
            {self && <Box
              display={"flex"}
              justifyContent={"center"}
              alignSelf={"center"}
              mb={"5"}
            >
              <Input
                display={"none"}
                type="file"
                p={1.5}
                accept="image/*"
                ref={fileInputRef}
                onChange={(e) => changeAvatar(e.target.files[0])}
              ></Input>
              <Button
                onClick={(e) => {
                  return fileInputRef.current.click();
                }}
                isLoading={isLoading}
                cursor={"pointer"}
              >
                Change Profile Picture
              </Button>
            </Box>}
            <Box>
              <Text fontFamily={"sans-serif"} color="white" fontSize={"16px"}>
                Your Name:
              </Text>
              <Text
                ml="20px"
                mb="25px"
                color="white"
                fontSize={"19px"}
                fontFamily={"sans-serif"}
              >
                {user.name}
              </Text>
              <Text fontSize={"16px"} color="white" fontFamily={"sans-serif"}>
                Your email:
              </Text>
              <Text
                ml="20px"
                fontSize={"19px"}
                color="white"
                fontFamily={"sans-serif"}
              >
                {user.email}
              </Text>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default UserProfile;
