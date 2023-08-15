import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import axios from "axios"
const Login = () => {
  const toast=useToast();
  const[show,setShow]=useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const[loading,setLoading]=useState(false);
  const handleClick=()=>{setShow(!show)};
  const history=useHistory();
  const submitHandler=async()=>{
    setLoading(true);
    if( !email || !password ){
      toast({
        title: "Please fill all the fields",
        status:"warning",
        duration:5000,
        isClosable:true,
        position:'bottom',
      });
      setLoading(false);
      return;
    }
    try {
      const config={
        headers:{
          "Content-type":"application/json"
        },
      };
      const {data}=await axios.post("/api/user/login",{email,password});
      toast({
        title: "LoggedIn Successfully",
        status:"success",
        duration:5000,
        isClosable:true,
        position:'bottom',
      });
      JSON.stringify(data)
      localStorage.setItem("userInfo",JSON.stringify(data));
      setLoading(false);
      history.push("/chats")
    } catch (error) {
      toast({
        title: "Error occured",
        description:error.response.data.message,
        status:"warning",
        duration:5000,
        isClosable:true,
        position:'bottom',
      });
      setLoading(false);
    }
  };
  return (
    <VStack spacing="5px">
      <FormControl id="email" isRequired>
        <FormLabel>
          Email
        </FormLabel>
        <Input placeholder="Enter your email" value={email} color="white" onChange={(e) => { setEmail(e.target.value) }}>
        </Input>
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>
          Password
        </FormLabel>
        <InputGroup>
          <Input type={show?"text":"password" }
          placeholder="Enter your password"
          color="white" 
          value={password}
          onChange={(e) => { setPassword(e.target.value) }}/>
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show?"Hide":"Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="button">
      <Button
      width="100%"
      _hover={{ bg: '#ebedf0' }}
      colorScheme='yellow'
      style={{marginTop:15}}
      onClick={submitHandler}
      isLoading={loading}>
        Login
      </Button>
      <Button
      width="100%"
      _hover={{ bg: '#ebedf0' }}
      colorScheme='yellow'
      style={{marginTop:15}}
      onClick={()=>{
        setEmail("johnnySinsAllRounder@gmail.com");
        setPassword("deepayan@2003");
      }}
      >
        Get Guest User Credentials
      </Button>
      </FormControl>
    </VStack>
  )
}

export default Login