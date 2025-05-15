import React from "react";
import { Box, Flex, VStack, Button, Input, Text, IconButton } from "@chakra-ui/react";
import { FaUserCircle, FaPlus, FaPaperPlane } from "react-icons/fa";

const Home = () => {
  return (
    <Flex h="100vh" p={4} gap={4}>
      {/* Left Sidebar: AI Model Selection & Chat History */}
      <VStack w="20%" p={4} spacing={4} borderRight="1px solid gray">
        <Text fontSize="xl" fontWeight="bold">AI Model</Text>
        <Button w="100%" colorScheme="blue">Ghost GPT</Button>
        <Button w="100%">Chat GPT</Button>
        <Button w="100%">Claude</Button>
        <Button w="100%">Gemini</Button>
        
        <Text fontSize="lg" mt={4}>Chat History</Text>
        <VStack w="100%" align="start" spacing={2}>
          <Button w="100%" variant="outline">Previous Chat 1</Button>
          <Button w="100%" variant="outline">Previous Chat 2</Button>
        </VStack>
      </VStack>
      
      {/* Main Chat Section */}
      <Flex w="60%" flexDir="column" p={4}>
        <Text fontSize="xl" fontWeight="bold">Good Evening, User</Text>
        <Box flex={1} p={4} border="1px solid gray" borderRadius="md" overflowY="auto">
          {/* Chat messages go here */}
        </Box>
        <Flex mt={2}>
          <Input placeholder="Type your message..." flex={1} />
          <IconButton icon={<FaPaperPlane />} colorScheme="blue" ml={2} />
        </Flex>
      </Flex>

      {/* Right Sidebar: User Profile & Ads */}
      <VStack w="20%" p={4} spacing={4} borderLeft="1px solid gray">
        <IconButton icon={<FaUserCircle />} isRound size="lg" />
        <Text>User Profile</Text>
        <Box h="50%" w="100%" bg="gray.200" borderRadius="md">
          <Text textAlign="center">Advertisement</Text>
        </Box>
      </VStack>
    </Flex>
  );
};

export default Home;
