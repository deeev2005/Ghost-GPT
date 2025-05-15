import React, { useState, useEffect } from "react";
import {
  ChakraProvider,
  Box,
  extendTheme,
  Button,
  Avatar,
  Flex,
  Input,
  IconButton,
  Text,
} from "@chakra-ui/react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

import AIModelSelector from "./components/AIModelSelector";
import ChatHistory from "./components/ChatHistory";
import PromptBox from "./components/PromptBox";
import Advertisement from "./components/Advertisement";
import AIResponseBox from "./components/AIResponseBox";

const theme = extendTheme({
  styles: {
    global: { 
      body: { 
        bg: "#121212", 
        color: "white", 
        overflow: "hidden",
      },
    },
  },
});

function App() {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLoginSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    console.log("✅ Logged in user:", decoded);
    setUser(decoded);
    localStorage.setItem("user", JSON.stringify(decoded));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const handleSubmit = () => {
    if (inputValue.trim()) {
      setMessages([...messages, { role: "user", content: inputValue }]);
      setInputValue("");
    }
  };

  return (
    <ChakraProvider theme={theme}>
      <Box 
        bg="#121212" 
        minH="100vh" 
        position="relative" 
        mx="auto"
        display="flex"
      >
        {/* Left sidebar */}
        <Box 
          w="250px" 
          h="100vh" 
          bg="#1a1a1a" 
          borderRight="1px solid #2a2a2a"
          p={4}
        >
          {/* AI Model Selector */}
          <Box 
            mb={6} 
            mt={2}
          >
            <Button
              variant="outline"
              borderColor="#444"
              borderWidth="1px"
              borderRadius="md"
              color="white"
              bg="transparent"
              _hover={{ bg: "#333" }}
              w="full"
              justifyContent="space-between"
              rightIcon={<Text as="span">▼</Text>}
            >
              Select AI Model
            </Button>
          </Box>

          {/* Info Button */}
          <Box mt={6}>
            <Button
              variant="outline"
              borderColor="#444"
              borderWidth="1px"
              borderRadius="md"
              color="white"
              bg="transparent"
              _hover={{ bg: "#333" }}
              leftIcon={<Text as="span">ℹ️</Text>}
            >
              Info
            </Button>
          </Box>
        </Box>

        {/* Main content area */}
        <Box 
          flex="1" 
          display="flex" 
          flexDirection="column" 
          position="relative"
          mx={4}
        >
          {/* AI Response Area */}
          <Box 
            flex="1" 
            borderWidth="1px" 
            borderColor="#333" 
            borderRadius="md"
            bg="#1a1a1a" 
            my={4}
            position="relative"
            overflow="hidden"
          >
            {/* Login button */}
            <Box position="absolute" top={4} right={4}>
              {!user ? (
                <Box bg="white" borderRadius="md" overflow="hidden">
                  <GoogleLogin
                    onSuccess={handleLoginSuccess}
                    onError={() => console.log("Login Failed")}
                  />
                </Box>
              ) : (
                <Flex align="center">
                  <Avatar name={user.name} src={user.picture} />
                  <Button
                    ml={3}
                    onClick={handleLogout}
                    colorScheme="red"
                    variant="outline"
                  >
                    Logout
                  </Button>
                </Flex>
              )}
            </Box>

            {/* Ghost GPT centered text */}
            <Flex 
              justify="center" 
              align="center" 
              h="full"
            >
              <Text color="gray.500">Ghost GPT</Text>
            </Flex>
          </Box>

          {/* Message input */}
          <Box 
            mb={5}
            mx="auto"
            w="80%" 
          >
            <Flex
              bg="#2a2a2a"
              borderRadius="full"
              align="center"
              px={4}
              py={2}
            >
              <Input
                flex="1"
                border="none"
                bg="transparent"
                color="gray.300"
                placeholder="Type your message..."
                _focus={{ boxShadow: "none" }}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <IconButton
                icon={<Text as="span" fontSize="xl">🐬</Text>}
                aria-label="Send message"
                bg="black"
                color="white"
                borderRadius="full"
                size="sm"
                onClick={handleSubmit}
              />
            </Flex>
          </Box>
        </Box>

        {/* Right sidebar */}
        <Box 
          w="250px" 
          h="100vh" 
          bg="#1a1a1a" 
          borderLeft="1px solid #2a2a2a"
          p={4}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <Flex 
            direction="column" 
            align="center" 
            justify="center"
          >
            <Text fontSize="md" color="pink.400" mb={2}>🚀</Text>
            <Text color="gray.300" textAlign="center">
              We make working<br />
              happier
            </Text>
          </Flex>
        </Box>
      </Box>
    </ChakraProvider>
  );
}

export default App;