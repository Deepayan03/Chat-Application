import { Box, Container, Text } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import React, { useEffect } from "react";
import Login from "../components/AuthComponents/Login.jsx"
import SignUp from "../components/AuthComponents/SignUp.jsx"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min.js";
const HomePage = () => {
    const history=useHistory();
    useEffect(()=>{
        const user=JSON.parse(localStorage.getItem("userInfo"));
        console.log(user)
        if(user){
            history.push("/chats")
        }
    },[history])
    return (
        <Container maxW="xl" centerContent>
            <Box
                d="flex"
                justifyContent="center"
                p={3}
                bg={"black"}
                w="100%"
                m="40px 0 15px 0"
                borderRadius="20px"
                borderWidth="1px"
            >
                <Text color="white" fontSize="4xl" fontFamily="Work sans">Simply Chat</Text>
            </Box>
            <Box bg="black" w="100%" p={4} borderRadius="20px" color="deeppink" borderWidth="1px">
                <Tabs variant='soft-rounded' colorScheme='green'>
                    <TabList mb="1em">
                        <Tab width="50%">Login</Tab>
                        <Tab width="50%">Sign Up</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Login />
                        </TabPanel>
                        <TabPanel>
                            <SignUp />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    )
}

export default HomePage;