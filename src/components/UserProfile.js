import React from "react";
import { Box, Avatar, Text, HStack } from "@chakra-ui/react";

const UserProfile = () => {
  return (
    <Box 
      p={4} 
      bg="background.secondary" 
      borderRadius="lg" 
      boxShadow="md"
      h="500px"  // Increased height but content stays at the top
      w="100%"
      display="flex"
      flexDirection="column"  // Keeps profile info at the top
      alignItems="start"  // Aligns items to the left (instead of center)
      justifyContent="start"  // Keeps everything at the top
    >
      {/* Name, Email, and Avatar in one row */}
      <HStack spacing={3} align="center">
        <Avatar size="md" name="User" src="https://via.placeholder.com/150" />
        <Box>
          <Text fontWeight="bold" color="white">John Doe</Text>
          <Text fontSize="sm" color="gray.400">john.doe@example.com</Text>
        </Box>
      </HStack>
    </Box>
  );
};

export default UserProfile;
