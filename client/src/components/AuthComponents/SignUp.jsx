import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import axios from "axios"
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import { ChatState } from '../../Context/ChatProvider'
const SignUp = () => {
  const[show,setShow]=useState();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [avatar, setAvatar] = useState();
  const[loading,setLoading]=useState(false);
  const {setUser,setUserProfile}=ChatState();
  const handleClick=()=>{setShow(!show)};
  const toast=useToast();
  const history=useHistory();
  const postDetails=async(avatar)=>{
    if(avatar===undefined){
      toast({
        title:"Please select an Image",
        status:"warning",
        duration:"5000",
        isClosable:true,
        position:'bottom'
      });
      return; 
    }
    if(avatar.type==="image/jpeg" || avatar.type==="image/png"){
      let data=new FormData();
      console.log(avatar);
      data.append("file",avatar);
      data.append("upload_preset","chat-app");
      data.append("cloud_name","dnymefrvq");
      setLoading(true);   
      try {
      const response=await fetch("https://api.cloudinary.com/v1_1/dnymefrvq/image/upload",{
      method:"post",
      body:data,
      });
      const res=await response.json();
      console.log(res);
      setAvatar(res.url.toString());
      setLoading(false);
      } catch (error) {
      console.log(error);
      }
    }else{
      toast({
        title:"Please select an Image",
        status:"warning",
        duration:"5000",
        isClosable:true,
        position:'bottom'
      });
      setLoading(false);
      return; 
    }
  }

  const submitHandler=async()=>{
    setLoading(true);
    if(!name || !email || !password || !confirmPassword){
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
    if(password!==confirmPassword){
      toast({
        title: "Passwords donot match",
        status:"warning",
        duration:5000,
        isClosable:true,
        position:'bottom',
      });
      return;
    }
    try {
      const {data}=await axios.post("/api/user/",{name,email,password,avatar});
      toast({
        title: "Registration Successful",
        status:"success",
        duration:5000,
        isClosable:true,
        position:'bottom',
      });
      localStorage.setItem("userInfo",JSON.stringify(data));
      setUser(data);
      setUserProfile(data);
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
      console.log(error)
      setLoading(false);
    }

  }
  return (
    <VStack spacing="5px">
      <FormControl id="name" isRequired>
        <FormLabel>
          Name
        </FormLabel>
        <Input placeholder="Enter your name" color="white" onChange={(e) => { setName(e.target.value) }}>
        </Input>
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>
          Email
        </FormLabel>
        <Input placeholder="Enter your email" color="white" onChange={(e) => { setEmail(e.target.value) }}>
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
          onChange={(e) => { setPassword(e.target.value) }}/>
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show?"Hide":"Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>


      <FormControl id="confirmPassword" isRequired>
        <FormLabel>
         Confirm password
        </FormLabel>
        <InputGroup>
          <Input type={show?"text":"password" }
          placeholder="Confirm password"
          color="white" 
          onChange={(e) => { setConfirmPassword(e.target.value) }}/>
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show?"Hide":"Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="avatar">
        <FormLabel>Upload your avatar</FormLabel>
        <Input type="file" 
        p={1.5} 
        accept='image/*'
        onChange={(e)=>{postDetails(e.target.files[0])}}
        ></Input>
      </FormControl>
      <FormControl id="button">
      <Button
      width="100%"
      _hover={{ bg: '#ebedf0' }}
      style={{marginTop:15}}
      onClick={submitHandler}
      isLoading={loading}>
        {/* {console.log(loading)} */}
        Sign Up
      </Button>
      {/* {console.log(avatar)} */}
      </FormControl>
    </VStack>
  )
}

export default SignUp