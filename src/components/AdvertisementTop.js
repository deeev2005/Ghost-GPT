import React from "react";
import { Box, Text } from "@chakra-ui/react";

export default function AdvertisementTop() {
  return (
    <Box 
      w="100%"
      p={4}
      borderWidth="1px"
      borderRadius="md"
      textAlign="center"
      bg="gray.100"
      display="flex"
      justifyContent="center"
      alignItems="center"
      h="100px"  // Adjust height
      position="absolute" // Force it to be placed above
      top="0px"  // Align at the top
      zIndex="1000"  // Ensure it's above other elements
    >
      <Text fontSize="md" fontWeight="bold" color="gray.700">
        🚀 Limited Time Offer: Get 50% Off Now!  
      </Text>
    </Box>
  );
}
