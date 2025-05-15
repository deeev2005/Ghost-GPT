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
      <Box minH="100vh" width="100vw" bg="#121212" position="relative">
        {/* Three column layout */}
        <Flex h="100vh">
          {/* Left sidebar */}
          <Box 
            w="240px" 
            h="100vh" 
            bg="#121212" 
            p={4} 
            borderRight="1px solid #333"
          >
            <Box mb={4}>
              <AIModelSelector />
            </Box>
            
            <Box mt={10}>
              <ChatHistory />
            </Box>
          </Box>

          {/* Main chat area */}
          <Box flex="1" position="relative" h="100vh">
            {/* Login button at top right of middle section */}
            <Box position="absolute" top="20px" right="20px" zIndex={10}>
              {!user ? (
                <Box 
                  p={2} 
                  borderRadius="md" 
                  bg="white"
                >
                  <GoogleLogin
                    onSuccess={handleLoginSuccess}
                    onError={() => console.log("Login Failed")}
                  />
                </Box>
              ) : (
                <Flex align="center">
                  <Avatar size="sm" name={user.name} src={user.picture} />
                  <Button
                    ml={3}
                    size="sm"
                    onClick={handleLogout}
                    colorScheme="red"
                    variant="outline"
                  >
                    Logout
                  </Button>
                </Flex>
              )}
            </Box>
            
            {/* Message display area */}
            <Box 
              pt="70px" 
              pb="80px" 
              px={6} 
              h="100%" 
              overflowY="auto"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
            >
              <Box textAlign="center" color="gray.500">
                Ghost GPT
              </Box>
              <AIResponseBox messages={messages} />
            </Box>
            
            {/* Input area fixed at bottom */}
            <Box 
              position="absolute" 
              bottom={4} 
              left={0} 
              right={0} 
              px={6}
            >
              <Box 
                bg="#232323" 
                borderRadius="full" 
                p={2} 
                display="flex" 
                alignItems="center"
              >
                <Input 
                  flex="1"
                  border="none"
                  bg="transparent"
                  placeholder="Type your message..."
                  _focus={{ boxShadow: "none" }}
                  color="white"
                />
                <IconButton
                  icon={<Box as="span" fontSize="xl">🚀</Box>}
                  bg="black"
                  color="white"
                  borderRadius="full"
                  size="sm"
                  ml={2}
                />
              </Box>
            </Box>
          </Box>

          {/* Right sidebar */}
          <Box 
            w="260px" 
            h="100vh" 
            bg="#121212" 
            p={4} 
            borderLeft="1px solid #333"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Flex 
              direction="column" 
              align="center" 
              justify="center"
              color="gray.400"
              p={4}
            >
              <Box as="span" fontSize="xl" mb={2}>
                🚀
              </Box>
              <Box textAlign="center">
                We make working<br />
                happier
              </Box>
            </Flex>
          </Box>
        </Flex>
      </Box>
    </ChakraProvider>
  );
}

export default App;