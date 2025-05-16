import React, { useEffect, useRef } from "react";
import { Box, Text, Flex, IconButton, useToast, Image } from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";
import ReactMarkdown from "react-markdown";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

const AIResponseBox = ({ messages }) => {
  const messagesEndRef = useRef(null);
  const toast = useToast();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      status: "success",
      duration: 1500,
      isClosable: true,
      position: "top-right",
    });
  };

  const renderers = {
    p: ({ node, children }) => {
      const content = children.join("");
      const isBlockMath = /^\$\$.*\$\$$/.test(content);
      const isInlineMath = /^\$.*\$/.test(content);

      if (isBlockMath) {
        const math = content.replace(/^\$\$|\$\$$/g, "");
        return <BlockMath math={math} />;
      } else if (isInlineMath) {
        const math = content.replace(/^\$|\$$/g, "");
        return <InlineMath math={math} />;
      } else {
        return <Text fontSize="sm" mb={1}>{children}</Text>;
      }
    }
  };

  return (
    <Box
      w="100%"
      maxW="1012px"
      bg="background.chatBox"
      p={2}
      borderRadius="md"
      border="1px solid"
      borderColor="background.border"
      minH="655px"
      maxH="655px"
      overflowY="auto"
      display="flex"
      flexDirection="column"
      gap={2}
      mt={0}
      sx={{
        "&::-webkit-scrollbar": { width: "8px" },
        "&::-webkit-scrollbar-track": { background: "background.secondary", borderRadius: "8px" },
        "&::-webkit-scrollbar-thumb": { background: "gray.600", borderRadius: "8px", border: "2px solid background.secondary" },
        "&::-webkit-scrollbar-thumb:hover": { background: "gray.500" },
      }}
    >
      {messages.length > 0 ? (
        messages.map((msg, index) => (
          <Flex 
            key={index} 
            justify={msg.sender === "user" ? "flex-end" : "flex-start"}
            width="100%"
          >
            <Box
              bg={msg.sender === "user" ? "blue.500" : "gray.700"}
              color="white"
              px={3}
              py={1}
              borderRadius="md"
              maxW="90%"
              width="fit-content"
              position="relative"
              _hover={msg.sender === "ai" ? { ".copy-btn": { display: "flex" } } : {}}
            >
              {msg.sender === "ai" ? (
                <Box position="relative">
                  <ReactMarkdown components={renderers}>
                    {msg.text}
                  </ReactMarkdown>

                  {msg.image && (
                    <Image
                      src={msg.image}
                      alt="Generated Image"
                      maxW="100%"
                      mt={2}
                      borderRadius="md"
                    />
                  )}
                  <IconButton
                    icon={<CopyIcon />}
                    aria-label="Copy response"
                    size="xs"
                    className="copy-btn"
                    display="flex"
                    position="absolute"
                    bottom={0}
                    right={1}
                    variant="ghost"
                    colorScheme="whiteAlpha"
                    onClick={() => handleCopy(msg.text)}
                  />
                </Box>
              ) : (
                <Text fontSize="sm" whiteSpace="pre-wrap">{msg.text}</Text>
              )}
            </Box>
          </Flex>
        ))
      ) : (
        <Flex flex="1" justify="center" align="center">
          <Text color="gray.500" fontSize="sm">
            Ghost GPT
          </Text>
        </Flex>
      )}
      <div ref={messagesEndRef} />
    </Box>
  );
};

export default AIResponseBox;
