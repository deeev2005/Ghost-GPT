import React from "react";
import { Box, Text } from "@chakra-ui/react";

export default function Advertisement() {
  return (
    <Box 
      p={6} 
      borderWidth="0px" 
      borderRadius="md" 
      textAlign="center" 
      bg="background.chatBox"  // Greyish background
      color="gray.300"
      display="flex"
      justifyContent="center"
      alignItems="center"
      h="575px"  // Fixed height
      boxShadow="lg"  // Adds subtle elevation
      position="relative"  // Allows z-index to work
      zIndex="2"  // Places it above User Profile
      w="130%"  // Ensures it takes full width
      left="-13px" 
      mt={6}
    >
      <Text fontSize="md" fontWeight="bold">
        🚀 We make working happier
      </Text>
    </Box>
  );
}
