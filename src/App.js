import React, { useState, useEffect } from "react";
import {
  ChakraProvider,
  Box,
  extendTheme,
  Button,
  Avatar,
  Flex,
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
      <Box p={4} minH="100vh" overflow="hidden">
        {/* Login Section */}
        {!user ? (
          <Box position="absolute" top="45px" right="48px" zIndex="10">
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={() => console.log("Login Failed")}
            />
          </Box>
        ) : (
          <Box position="absolute" top="45px" right="48px" zIndex="10">
            <Avatar name={user.name} src={user.picture} />
            <Button
              ml={3}
              top="5px"
              onClick={handleLogout}
              colorScheme="red"
              variant="outline"
            >
              Logout
            </Button>
          </Box>
        )}

        {/* Main Layout using Flex */}
        <Flex maxW="1200px" mx="auto" h="90vh" pt={12}>
          {/* Left Sidebar */}
          <Box
            w="200px"
            bg="background.secondary"
            p={4}
            borderRadius="md"
            mr={4}
            flexShrink={0}
          >
            <AIModelSelector />
            <Box mt={8}>
              <ChatHistory />
            </Box>
          </Box>

          {/* Chat Area */}
          <Flex direction="column" flex="1" px={2}>
            <Box
              flex="1"
              mb={4}
              bg="background.chatBox"
              borderRadius="md"
              p={4}
              overflowY="auto"
            >
              <AIResponseBox messages={messages} />
            </Box>
            <Box bg="background.chatBox" borderRadius="md" p={4}>
              <PromptBox setMessages={setMessages} user={user} />
            </Box>
          </Flex>

          {/* Right Sidebar (Ads) */}
          <Box
            w="260px"
            ml={4}
            p={4}
            borderRadius="md"
            flexShrink={0}
            bg="transparent"
          >
            <Advertisement />
          </Box>
        </Flex>
      </Box>
    </ChakraProvider>
  );
}

export default App;
