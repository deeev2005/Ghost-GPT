import React, { useState } from "react";
import { ChakraProvider, Box, Flex, extendTheme } from "@chakra-ui/react";
import AIModelSelector from "./components/AIModelSelector";
import ChatHistory from "./components/ChatHistory";
import Chat from "./components/Chat";
import UserProfile from "./components/UserProfile";
import Advertisement from "./components/Advertisement";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "#121212",
        color: "white",
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

function AppLayout() {
  const [activeModel, setActiveModel] = useState(null); // Track active model
  const [messages, setMessages] = useState([]); // ✅ Chat messages state

  return (
    <ChakraProvider theme={theme}>
      <Flex direction="column" h="100vh" overflow="hidden">
        <Flex flexGrow={1} align="stretch">
          {/* Left Sidebar */}
          <Box w="20%" bg="background.secondary" p={2} h="100vh" ml="-50px"
           overflowY="auto">
            <AIModelSelector setActiveModel={setActiveModel} />
            <Box mt={6}>
              <ChatHistory />
            </Box>
          </Box>

          {/* Center Section */}
          <Flex flex="1" flexDirection="column" justify="center" align="center" bg="background.primary" p={6}>
            {/* ✅ Pass messages & setMessages to Chat */}
            <Chat activeModel={activeModel} messages={messages} setMessages={setMessages} />
          </Flex>

          {/* Right Sidebar */}
          <Flex w="20%" position="relative" flexDirection="column" alignItems="center">
            <Box w="100%" position="relative" zIndex="10" mb={4}>
              <Advertisement />
            </Box>

            <Box w="100%" bg="background.secondary" borderRadius="lg" boxShadow="md" p={4} position="relative" zIndex="1" mt={4}>
              <UserProfile />
            </Box>

            <Box
              w="80%"
              position="absolute"
              top="50%"
              transform="translateY(-50%)"
              zIndex="20"
              bg="gray.300"
              p={4}
              borderRadius="md"
              boxShadow="lg"
            >
              <Advertisement />
            </Box>
          </Flex>
        </Flex>
      </Flex>
    </ChakraProvider>
  );
}

export default AppLayout;
