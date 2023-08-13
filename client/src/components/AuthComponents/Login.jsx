import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
const Login = () => {
  const[show,setShow]=useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const handleClick=()=>{setShow(!show)};
  const submitHandler=()=>{};
  return (
    <VStack spacing="5px">
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
      <FormControl id="button">
      <Button
      width="100%"
      _hover={{ bg: '#ebedf0' }}
      colorScheme='yellow'
      style={{marginTop:15}}
      onClick={submitHandler}>
        Login
      </Button>
      </FormControl>
    </VStack>
  )
}

export default Login