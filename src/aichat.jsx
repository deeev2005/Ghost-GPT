import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Button,
  Container,
  Text,
  Input,
  VStack,
  HStack,
  Divider,
  useColorModeValue,
  IconButton,
  Textarea,
  Badge,
} from '@chakra-ui/react';
import { AddIcon, ArrowForwardIcon } from '@chakra-ui/icons';

// Mock data for chat history
const initialChatHistory = [
  { sender: 'user', message: 'Hello, how can you help me today?' },
  { sender: 'ai', message: 'I can assist with information, creative tasks, and more. What would you like to know?' },
];

const ghostgpt = () => {
  const [selectedModel, setSelectedModel] = useState('GPT Model');
  const [chatHistory, setChatHistory] = useState(initialChatHistory);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const aiModels = ['AI Model', 'GPT Model', 'Claude', 'Chat GPT', 'Ghost GPT'];

  const handleModelSelect = (model) => {
    setSelectedModel(model);
    // Here you would typically fetch the chat history for the selected model
    // fetchChatHistory(model, userId);
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    
    // Add user message to chat
    setChatHistory([...chatHistory, { sender: 'user', message: userInput }]);
    
    // Clear input and set loading state
    setUserInput('');
    setIsLoading(true);
    
    try {
      // Here you would make an API call to the selected AI model
      // const response = await callAIModel(selectedModel, userInput);
      
      // Mock AI response
      setTimeout(() => {
        const aiResponse = `This is a response from ${selectedModel}. In a real implementation, this would be the response from the API.`;
        setChatHistory(prev => [...prev, { sender: 'ai', message: aiResponse }]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error calling AI model:', error);
      setChatHistory(prev => [...prev, { 
        sender: 'system', 
        message: 'Sorry, there was an error processing your request.' 
      }]);
      setIsLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Container maxW="container.xl" py={4}>
      <Flex direction={{ base: 'column', md: 'row' }} h="90vh">
        {/* AI Models Selection */}
        <VStack 
          w={{ base: '100%', md: '250px' }} 
          bg={useColorModeValue('gray.50', 'gray.700')} 
          p={4} 
          spacing={4}
          align="stretch"
          borderRightWidth={{ base: 0, md: 1 }}
        >
          <Text fontSize="lg" fontWeight="bold">AI Models</Text>
          <Divider />
          {aiModels.map((model) => (
            <Button
              key={model}
              variant={selectedModel === model ? 'solid' : 'outline'}
              colorScheme={selectedModel === model ? 'blue' : 'gray'}
              onClick={() => handleModelSelect(model)}
              justifyContent="flex-start"
              borderRadius="full"
            >
              {model}
            </Button>
          ))}
          <Text fontSize="sm" mt={2}>
            *Ghost GPT uses NLP model
          </Text>
        </VStack>

        {/* Chat Area */}
        <Flex flex={1} direction="column" borderRadius="md" overflow="hidden">
          {/* Chat History */}
          <Box
            flex={1}
            p={4}
            overflowY="auto"
            bg={useColorModeValue('white', 'gray.800')}
          >
            <Text fontSize="lg" fontWeight="bold">Chat History: {selectedModel}</Text>
            <Divider my={2} />
            <VStack spacing={4} align="stretch">
              {chatHistory.map((chat, index) => (
                <Box
                  key={index}
                  alignSelf={chat.sender === 'user' ? 'flex-end' : 'flex-start'}
                  bg={chat.sender === 'user' ? 'blue.100' : 'gray.100'}
                  color={chat.sender === 'user' ? 'blue.800' : 'black'}
                  p={3}
                  borderRadius="lg"
                  maxW="70%"
                >
                  <Text>{chat.message}</Text>
                </Box>
              ))}
              {isLoading && (
                <Box alignSelf="flex-start" bg="gray.100" p={3} borderRadius="lg">
                  <Text>Thinking...</Text>
                </Box>
              )}
            </VStack>
          </Box>

          {/* Input Area */}
          <Box p={4} bg={useColorModeValue('gray.50', 'gray.700')}>
            <Flex>
              <Textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                resize="none"
                rows={2}
                mr={2}
                flex={1}
              />
              <IconButton
                colorScheme="blue"
                aria-label="Send message"
                icon={<ArrowForwardIcon />}
                onClick={handleSendMessage}
                isLoading={isLoading}
                alignSelf="flex-end"
              />
            </Flex>
          </Box>
        </Flex>

        {/* Advertisement Area */}
        <Box
          w={{ base: '100%', md: '200px' }}
          bg={useColorModeValue('gray.50', 'gray.700')}
          p={4}
          borderLeftWidth={{ base: 0, md: 1 }}
          display={{ base: 'none', lg: 'block' }}
        >
          <Text fontSize="lg" fontWeight="bold">Advertisement</Text>
          <Divider my={2} />
          <Box
            h="300px"
            bg="gray.200"
            borderRadius="md"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text>Ad Space</Text>
          </Box>
        </Box>
      </Flex>
    </Container>
  );
};

export default aichat;