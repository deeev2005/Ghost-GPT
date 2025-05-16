import React, { useState, useEffect } from "react";
import {
  ChakraProvider,
  Box,
  extendTheme,
  Button,
  Avatar,
  Flex,
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
  colors: {
    background: {
      primary: "#121212",
      secondary: "#1E1E1E",
      chatBox: "#232323",
      accent: "#8AB4F8",
      border: "#3A3A3A",
      buttonBg: "#2E2E2E",
      buttonBorder: "#3A3A3A",
    },
  },
});

function App() {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);

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
          {/* AI Model Selector - Using the original component */}
          <Box mb={6} mt={6}>
            <AIModelSelector />
          </Box>
          
          {/* Original Chat History Component */}
          <Box mt={8}>
            <ChatHistory />
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
            {/* Messages display area with the original AIResponseBox */}
            <Box h="full" w="full" position="relative">
              {messages.length === 0 && (
                <Flex 
                  justify="center" 
                  align="center" 
                  h="full"
                >
                  <Text color="gray.500">Ghost GPT</Text>
                </Flex>
              )}
              <AIResponseBox messages={messages} />
            </Box>
          </Box>

          {/* Message input - Using the original PromptBox component */}
          <Box 
            mb={5}
            mx="auto"
            w="80%" 
            position="relative"
            pointerEvents="auto"
          >
            <Box
              sx={{
                ".prompt-box-wrapper": {
                  background: "#2a2a2a",
                  borderRadius: "full",
                  padding: "6px 16px",
                  display: "flex",
                  alignItems: "center",
                }
              }}
            >
              <PromptBox setMessages={setMessages} user={user} />
            </Box>
          </Box>
        </Box>

        {/* Right sidebar with original Advertisement component - adjusted width */}
        <Box 
          w="240px" 
          h="100vh" 
          bg="#1a1a1a" 
          borderLeft="1px solid #2a2a2a"
          p={4}
        >
          {/* Login button moved to top of right sidebar */}
          <Box  mt={6} mb={4}>
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
                  left="-10px" 
                  variant="outline"
                  size="md"
                >
                  Logout
                </Button>
              </Flex>
            )}
          </Box>
          
          <Advertisement />
        </Box>
      </Box>
    </ChakraProvider>
  );
}

export default App;