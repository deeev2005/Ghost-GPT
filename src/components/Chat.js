import React from "react";
import { Box, VStack, Text } from "@chakra-ui/react";
import PromptBox from "./PromptBox";

function Chat({ activeModel, messages, setMessages }) {
  return (
    <VStack spacing={4} w="100%" h="100%" justify="center">
      <Box w="100%" h="60vh" overflowY="auto" p={4} bg="background.chatBox" borderRadius="md">
        {messages.length === 0 ? (
          <Text color="gray.400" align="center">Start chatting with your AI model...</Text>
        ) : (
          messages.map((msg, index) => (
            <Text key={index} textAlign={msg.role === "user" ? "right" : "left"} color={msg.role === "user" ? "blue.300" : "gray.200"}>
              {msg.content}
            </Text>
          ))
        )}
      </Box>

      {/* ✅ Pass setMessages to PromptBox */}
      <PromptBox messages={messages} setMessages={setMessages} />
    </VStack>
  );
}

export default Chat;
