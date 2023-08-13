import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'

const SignUp = () => {
  const[show,setShow]=useState();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [pic, setPic] = useState();
  const handleClick=()=>{setShow(!show)};
  const postDetails=(avatar)=>{

  }

  const submitHandler=()=>{


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
      colorScheme='yellow'
      style={{marginTop:15}}
      onClick={submitHandler}>
        Sign Up
      </Button>
      </FormControl>
    </VStack>
  )
}

export default SignUp