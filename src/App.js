import React, { useState } from "react";
import { VStack, Button, Select, Text, Box } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

const modelMappings = {
  "TARS": "bytedance-research/ui-tars-72b:free",
  "DeepSeek:R1": "deepseek/deepseek-r1:free",
  "DeepHermes": "nousresearch/deephermes-3-mistral-24b-preview:free",
  "Gemma": "google/gemma-3-27b-it:free",
  "Llama": "nvidia/llama-3.1-nemotron-70b-instruct:free",
  "Qwen 3 (235B)": "qwen/qwen3-235b-a22b:free",
  "Qwen 3 (30B)":"qwen/qwen3-30b-a3b:free",
  "Qwen 3 (0.6B)":"qwen/qwen3-0.6b-04-28:free",
  "Mistral 24B": "mistralai/mistral-small-3.1-24b-instruct:free",
  "Olympric Coder": "open-r1/olympiccoder-32b:free",
  "ArliAI":"arliai/qwq-32b-arliai-rpr-v1:free",
  "Microsoft-Phi 4+":"microsoft/phi-4-reasoning-plus:free",
  "Intern":"opengvlab/internvl3-14b:free",
  "DeepSeek V2":"deepseek/deepseek-prover-v2:free",
  "MAI DS R1":"microsoft/mai-ds-r1:free",
  "Chimera R1T":"tngtech/deepseek-r1t-chimera:free",
  "GLM Z1 32B":"thudm/glm-z1-32b:free",
  "GLM 4 32B":"thudm/glm-4-32b:free",
  "Shisa V2 ":"shisa-ai/shisa-v2-llama3.3-70b:free",
  "Deepcoder ":"agentica-org/deepcoder-14b-preview:free",
  "Kimi ":"moonshotai/kimi-vl-a3b-thinking:free",
  "Llama Maverick":"meta-llama/llama-4-maverick:free",
  "Llama Scout":"meta-llama/llama-4-scout:free",
  "Reka Flash 3":"rekaai/reka-flash-3:free",
  "Mistral Nemo":"mistralai/mistral-nemo:free"
};

const availableModels = Object.keys(modelMappings);

function AIModelSelector() {
  const [selectedModels, setSelectedModels] = useState([]);
  const [activeModel, setActiveModel] = useState(null);
  const [hoveredModel, setHoveredModel] = useState(null);
  const [selectedModel, setSelectedModel] = useState("");

  const handleAddModel = (event) => {
    const selectedModel = event.target.value;
    if (selectedModel && !selectedModels.includes(selectedModel)) {
      setSelectedModels([...selectedModels, selectedModel]);
      updateActiveModel(selectedModel);
      setSelectedModel(""); // Reset dropdown selection
    }
  };

  const handleSelectModel = (model) => {
    updateActiveModel(model);
  };

  const handleRemoveModel = (model) => {
    setSelectedModels(selectedModels.filter((m) => m !== model));
    if (activeModel === model) {
      setActiveModel(null);
    }
  };

  const updateActiveModel = async (model) => {
    setActiveModel(model);
    const modelID = modelMappings[model];

    if (modelID) {
      try {
        await fetch("https://ghost-gpt.onrender.com/set_model", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ model: modelID }),
        });
      } catch (error) {
        console.error("Error updating model:", error);
      }
    }
  };

  return (
    <Box 
      maxW="900px"  // wider container for zoom out
      mx="auto" 
      w="100%" 
      px={4}       // more padding inside container 
      py={6}       // vertical padding
      boxSizing="border-box"
    >
      <VStack spacing={4} align="stretch" w="100%">
        <Select
          placeholder="Select AI Model"
          onChange={handleAddModel}
          value={selectedModel}
          bg="background.secondary"
          color="white"
          borderColor="gray.500"
          fontSize="md" // bigger font for zoom out
          _hover={{ borderColor: "white" }}
          _focus={{ borderColor: "white" }}
          sx={{
            option: {
              background: "black",
              color: "white",
              fontSize: "md",
            },
          }}
          boxSizing="border-box"
          h="40px"  // taller select box for zoom out
        >
          {availableModels
            .filter((model) => !selectedModels.includes(model))
            .map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
        </Select>

        {selectedModels.map((model) => (
          <Button
            key={model}
            w="100%"
            border="1px solid"
            h="40px"       // taller buttons
            py={2}         // more padding
            borderColor={activeModel === model ? "blue.400" : "gray.500"}
            color="white"
            variant="outline"
            fontSize="md"  // bigger font
            onClick={() => handleSelectModel(model)}
            _hover={{ background: "blue.400", color: "black" }}
            boxShadow={activeModel === model ? "0px 0px 10px #8AB4F8" : "none"}
            position="relative"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            onMouseEnter={() => setHoveredModel(model)}
            onMouseLeave={() => setHoveredModel(null)}
            boxSizing="border-box"
          >
            <Text
              flex="1"
              minWidth={0}
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
              mr={3}
              userSelect="none"
            >
              {model}
            </Text>
            <CloseIcon
              w={4}
              h={4}
              color={hoveredModel === model ? "black" : "white"}
              transition="color 0.2s"
              cursor="pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveModel(model);
              }}
            />
          </Button>
        ))}
      </VStack>
    </Box>
  );
}

export default AIModelSelector;
