import React, { useState, useRef, useEffect } from "react";
import { Box, Button, HStack, Image, Textarea } from "@chakra-ui/react";

export default function PromptBox({ setMessages, user }) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  }, [prompt]);

  // ✅ Fetch previous chat messages using email
  useEffect(() => {
    const fetchMessages = async () => {
      if (!user?.email) return;

      try {
        const response = await fetch(
          `https://ghost-gpt.onrender.com/chat/history?email=${encodeURIComponent(user.email)}`
        );
        const data = await response.json();

        const formattedMessages = data.map((msg) => [
          { sender: "user", text: msg.user_message },
          { sender: "ai", text: msg.ai_response },
        ]).flat();

        setMessages(formattedMessages);
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
      }
    };

    fetchMessages();
  }, [user?.email, setMessages]);

  const handleSend = async () => {
    if (!prompt.trim()) return;
    setLoading(true);

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: prompt },
      { sender: "ai", text: "Thinking... ⏳" },
    ]);

    try {
      const response = await fetch("https://ghost-gpt.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          user_id: user?.sub || "anonymous",
          email: user?.email || "unknown",
        }),
      });

      const data = await response.json();
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { sender: "ai", text: data.response || "❌ No response received" },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { sender: "ai", text: "❌ Network error. Try again." },
      ]);
    }

    setLoading(false);
    setPrompt("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <Box
      p={4}
      borderRadius="lg"
      bg="background.chatBox"
      boxShadow="md"
      border="1px solid"
      borderColor="background.border"
      w="100%"
      maxW="700px"
      position="absolute"
      bottom="23px"
      left="50%"
      transform="translateX(-50%)"
    >
      <HStack spacing={3} align="flex-end">
        <Textarea
          ref={textareaRef}
          placeholder="Type your message..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          size="lg"
          pointerEvents="auto"
          variant="unstyled"
          px={4}
          py={2}
          borderRadius="0"
          bg="transparent"
          color="white"
          _placeholder={{ color: "gray.400" }}
          isDisabled={loading}
          minH="50px"
          maxH="200px"
          overflowY="auto"
          resize="none"
          rows={1}
          sx={{
            "&::-webkit-scrollbar": { width: "6px" },
            "&::-webkit-scrollbar-track": { background: "transparent" },
            "&::-webkit-scrollbar-thumb": {
              background: "gray.600",
              borderRadius: "3px",
            },
          }}
        />
        <Button
          bg="black"
          borderRadius="full"
          p={2}
          _hover={{ bg: "gray.800" }}
          onClick={handleSend}
          isLoading={loading}
          mb={1}
        >
          <Image src="/logo.png" alt="Send" width="40px" height="40px" />
        </Button>
      </HStack>
    </Box>
  );
}
