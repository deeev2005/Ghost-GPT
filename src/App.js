import React, { useState, useEffect } from "react";
import {
  ChakraProvider,
  Box,
  extendTheme,
  Button,
  Avatar,
  Flex,
  Container,
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
    global: { body: { bg: "#121212", color: "white", overflow: "hidden" } },
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
      <Box p={4} minH="100vh" maxW="100vw" overflow="hidden">
        {/* Fixed width container with consistent proportions */}
        <Container maxW="1400px" p={0} h="100vh" position="relative">
          {/* Login Section - Fixed position relative to container */}
          <Box position="absolute" top="45px" right="20px" zIndex="10">
            {!user ? (
              <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={() => console.log("Login Failed")}
              />
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

          {/* Main Content Layout with Flex */}
          <Flex h="90vh" mt={8} gap={4}>
            {/* Left Sidebar - Fixed width */}
            <Box
              w="200px"
              h="full"
              bg="background.secondary"
              p={4}
              borderRadius="md"
              flexShrink={0}
            >
              <AIModelSelector />
              <Box mb={8}></Box>
              <ChatHistory />
            </Box>

            {/* Central Chat Area - Flex grow to take available space */}
            <Flex 
              direction="column" 
              flex="1" 
              h="full" 
              justify="space-between"
              px={4}
              overflowY="hidden"
            >
              {/* AI Response Box - Takes top part */}
              <Box 
                h="60%" 
                mb={4} 
                w="full"
              >
                <AIResponseBox messages={messages} />
              </Box>
              
              {/* Prompt Box - Fixed at bottom */}
              <Box 
                h="40%" 
                w="full" 
                bg="background.chatBox"
              >
                <PromptBox setMessages={setMessages} user={user} />
              </Box>
            </Flex>

            {/* Right Sidebar (Ads) - Fixed width */}
            <Box
              w="300px"
              h="full"
              p={4}
              borderRadius="md"
              flexShrink={0}
            >
              <Advertisement />
            </Box>
          </Flex>
        </Container>
      </Box>
    </ChakraProvider>
  );
}

export default App;