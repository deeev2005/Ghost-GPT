import React, { useState, useEffect } from "react";
import {
  ChakraProvider,
  Box,
  extendTheme,
  Button,
  Avatar,
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
      <Box p={4} minH="100vh">
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

        {/* Main Container */}
        <Box position="relative" maxW="1200px" mx="auto" h="100vh">
          {/* Left Sidebar */}
          <Box
            position="absolute"
            top="6"
            left="-20"
            w="200px"
            h="90vh"
            bg="background.secondary"
            p={4}
            borderRadius="md"
          >
            <AIModelSelector />
            <Box mb={8}></Box>
            <ChatHistory />
          </Box>

          {/* Central Chat Area */}
          <Box
            position="absolute"
            top="1"
            left="320px"
            right="320px"
            h="90vh"
            px={4}
          >
            {/* Prompt Box */}
            <Box
              position="relative"
              mb={2}
              h="50%"
              top="360px"
              zIndex="1"
              width="600%"
              left="-250%"
              pointerEvents="none"
            >
              <Box bg="background.chatBox">
                <div style={{ pointerEvents: 'auto' }}>
                  <PromptBox setMessages={setMessages} user={user} />
                </div>
              </Box>
            </Box>

            {/* AI Response Box */}
            <Box
              position="relative"
              h="50%"
              top="-310px"
              w="170%"
              left="-210px"
            >
              <AIResponseBox messages={messages} />
            </Box>
          </Box>

          {/* Right Sidebar (Ads) */}
          <Box
            position="absolute"
            top="-4"
            right="-10"
            w="300px"
            h="90vh"
            p={4}
            borderRadius="md"
          >
            <Advertisement />
          </Box>
        </Box>
      </Box>
    </ChakraProvider>
  );
}

export default App;