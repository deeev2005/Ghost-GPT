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
      h="595px"  // Fixed height
      boxShadow="lg"  // Adds subtle elevation
      position="relative"  // Allows z-index to work
      zIndex="2"  // Places it above User Profile
      w="120%"  // Ensures it takes full width
      left="-16px" 
      mt={6}
    >
      <Box mt={6}>
  <Text 
    fontSize="md" 
    fontWeight="bold"
    whiteSpace="pre-line"
  >
    🚀 If you don't get any response try 3-5 times and wait for some time to restart the server{"\n"}
    🚀 When no model is selected, we'll use the last active model
  </Text>
</Box>
    </Box>
  );
}
