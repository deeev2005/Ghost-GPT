import React from "react";
import { VStack, Box, Text } from "@chakra-ui/react";

export default function Messages({ messages }) {
  return (
    <VStack spacing={4} align="stretch" width="100%">
      {messages.map((msg, index) => (
        <Box key={index} p={3} borderRadius="md" bg="gray.700">
          <Text fontWeight="bold" color="blue.300">
            You: {msg.user}
          </Text>
          <Text mt={2} color="white">
            AI: {msg.ai}
          </Text>
        </Box>
      ))}
    </VStack>
  );
}
