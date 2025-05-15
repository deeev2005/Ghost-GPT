import React from "react";
import {
  Box,
  Text,
  VStack,
  UnorderedList,
  ListItem,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";

const modelSections = [


  {
    title: "🖥️ GUI Automation & Interaction",
    models: [
      "TARS",
     
    ],
  },
  {
    title: "🧠 Reasoning & Knowledge",
    models: [
      "Qwen 3 235B (ADV)",
      "DeepSeek R1",
      "Microsoft Phi-4 Reasoning +",
      "Meta Llama Scout",
      "DeepSeek Prover V2",
    ],
  },
  {
    title: "🧮 Mathematics",
    models: [
      "Qwen 3 235B (ADV)",
      "DeepSeek R1",
      "DeepSeek Prover V2",
      "Microsoft Phi-4 Reasoning +",
      "Meta Llama 4 Scout",
    ],
  },
  {
    title: "💻 Coding",
    models: [
      " Deepcoder ",
      "Olympric Coder",
      "DeepSeek R1",
      "DeepSeek Prover V2",
      "Meta Llama 4 Scout",
      
    ],
  },
  {
    title: "⚡ Speed",
    models: [
      "DeepSeek R1 Distill Qwen 14B",
      "Meta Llama  Maverick",
      "Qwen 3 0.6B ",
      "Mistral  24B",
      "Reka Flash 3",
    ],
  },
  {
    title: "💬 General Chat",
    models: [
      "DeepSeek R1",
      "Meta Llama 4 Scout",
      "GLM Z1 32B",
      "Qwen 3 235B ",
      "ArliAI",
      "Mistral  24B",
    ],
  },
  {
    title: "📊 Data Analysis",
    models: [
      "DeepSeek R1",
      "Microsoft Phi-4 Reasoning +",
      "Meta Llama 4 Scout",
      "Qwen 3 235B",
      "DeepSeek Prover V2",
    ],
  },
  {
    title: "🌐 Translation",
    models: [
      "Mistral Nemo",
      "Meta Llama 4 Scout",
      "GLM 4 32B",
      "DeepSeek R1",
      "Mistral  24B",
    ],
  },
  {
    title: "📝 Summarization",
    models: [
      "DeepSeek R1",
      "Microsoft Phi-4 Reasoning +",
      "Meta Llama  Scout",
      "Qwen 3 235B ",
      "Mistral  24B",
    ],
  },
  {
    title: "🧠 Medium to Tough Coding & DSA",
    models: [
      " Deepcoder ",
      "DeepSeek R1",
      "DeepSeek Prover V2",
      "Meta Llama  Scout",
      "Microsoft Phi-4 Reasoning +",
    ],
  },
  {
    title: "📈 SEO & Presentation",
    models: [
      "Microsoft Phi-4 Reasoning +",
      "Meta Llama  Scout",
      "DeepSeek R1",
      "Qwen 3 235B ",
      "Mistral 24B",
    ],
  },
  {
    title: "🤖 Automation",
    models: [
      "DeepSeek R1",
      "Microsoft Phi-4 Reasoning +",
      "Meta Llama  Scout",
      "Qwen 3 235B",
      "DeepSeek Prover V2",
    ],
  },
   {
    title: "🧠 Multimodal & Visual Reasoning",
    models: [
      "Intern",
      "Kimi",
      "Meta Llama  Scout",
      "Qwen 3 235B ",
      "DeepSeek Prover V2",
    ],
  },
  {
    title: "🧩 Specialized & Experimental Models",
    models: [
      "Shisa V2",
      "Reka Flash 3",
      "Mistral Nemo",
      
    ],
  },
];

const ChatHistory = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {/* Info Button */}
    <Button
        leftIcon={<InfoIcon />}
        onClick={onOpen}
        colorScheme="blue"
        size="md"
        bg="transparent" // Transparent background to inherit UI theme
        border="2px solid white" // White border around the button
        color="white" // White text color
        _hover={{ bg: "gray.700" }} // Slightly lighter background on hover
        mt={2}
        right="-35px"
      >
        Info
      </Button>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
        <ModalOverlay />
        <ModalContent bg="black" color="white" borderRadius="lg" p={4}>
          <ModalHeader fontWeight="bold">INFO</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="start">
              {modelSections.map((section, idx) => (
                <Box key={idx}>
                  <Text fontWeight="semibold" mb={1}>
                    {section.title}
                  </Text>
                  <UnorderedList spacing={1} pl={4}>
                    {section.models.map((model, index) => (
                      <ListItem key={index}>{model}</ListItem>
                    ))}
                  </UnorderedList>
                </Box>
              ))}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ChatHistory;
