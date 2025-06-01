import React, { useState } from "react";
import { VStack, Button, Select, Text, Alert, AlertIcon } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

const modelMappings = {
  
  "DeepSeek:R1": "deepseek/deepseek-r1:free",
  "DeepHermes": "nousresearch/deephermes-3-mistral-24b-preview:free",
  "Gemma": "google/gemma-3-27b-it:free",
  "Sarvam AI": "sarvamai/sarvam-m:free",
  "Qwen 3 (235B)": "qwen/qwen3-235b-a22b:free",
  "Qwen 3 (30B)": "qwen/qwen3-30b-a3b:free",
  "Llama": "meta-llama/llama-3.3-8b-instruct:free",
  "Olympric Coder": "open-r1/olympiccoder-32b:free",
  "Devstral": "mistralai/devstral-small:free",
  "Microsoft-Phi 4+": "microsoft/phi-4-reasoning-plus:free",
  "Intern": "opengvlab/internvl3-14b:free",
  "DeepSeek V2": "deepseek/deepseek-prover-v2:free",
  "MAI DS R1": "microsoft/mai-ds-r1:free",
  "Chimera R1T": "tngtech/deepseek-r1t-chimera:free",
  "GLM Z1 32B": "thudm/glm-z1-32b:free",
  "GLM 4 32B": "thudm/glm-4-32b:free",
  "Shisa V2": "shisa-ai/shisa-v2-llama3.3-70b:free",
  "Deepcoder": "agentica-org/deepcoder-14b-preview:free",
  "Kimi": "moonshotai/kimi-vl-a3b-thinking:free",
  "Llama Maverick": "meta-llama/llama-4-maverick:free",
  "Llama Scout": "meta-llama/llama-4-scout:free",
  "Reka Flash 3": "rekaai/reka-flash-3:free",
  "Mistral Nemo": "mistralai/mistral-nemo:free"
};

const availableModels = Object.keys(modelMappings);

function AIModelSelector({ userId }) {
  const [selectedModels, setSelectedModels] = useState([]);
  const [activeModel, setActiveModel] = useState(null);
  const [hoveredModel, setHoveredModel] = useState(null);
  const [selectedModel, setSelectedModel] = useState("");
  const [showNoModelWarning, setShowNoModelWarning] = useState(false);

  const handleAddModel = async (event) => {
    const model = event.target.value;
    if (model && !selectedModels.includes(model)) {
      const newSelectedModels = [...selectedModels, model];
      setSelectedModels(newSelectedModels);
      await updateActiveModel(model);
      setSelectedModel("");
      setShowNoModelWarning(false);
    }
  };

  const handleSelectModel = async (model) => {
    await updateActiveModel(model);
    setShowNoModelWarning(false);
  };

  const handleRemoveModel = async (model) => {
    const newSelectedModels = selectedModels.filter((m) => m !== model);
    setSelectedModels(newSelectedModels);
    
    if (activeModel === model) {
      if (newSelectedModels.length > 0) {
        await updateActiveModel(newSelectedModels[0]);
      } else {
        await updateBackendModel(null);
        setActiveModel(null);
        setShowNoModelWarning(true);
      }
    }
  };

  const updateActiveModel = async (model) => {
    setActiveModel(model);
    await updateBackendModel(model);
  };

  const updateBackendModel = async (model) => {
    const modelID = model ? modelMappings[model] : null;
    try {
      await fetch("https://ghost-gpt.onrender.com/set_model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          model: modelID,
          user_id: userId  // Include user_id in the request
        }),
      });
    } catch (error) {
      console.error("Error updating model:", error);
    }
  };

  return (
    <VStack spacing={3} align="stretch" w="100%">
      <Select
        placeholder="Select AI Model"
        onChange={handleAddModel}
        value={selectedModel}
        bg="background.secondary"
        color="white"
        borderColor="gray.500"
        _hover={{ borderColor: "white" }}
        _focus={{ borderColor: "white" }}
        sx={{
          option: {
            background: "black",
            color: "white",
          },
        }}
      >
        {availableModels
          .filter((model) => !selectedModels.includes(model))
          .map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
      </Select>

      {showNoModelWarning && (
        <Alert status="warning" borderRadius="md" color="black">
          <AlertIcon />
          Please select a model
        </Alert>
      )}

      {selectedModels.map((model) => (
        <Button
          key={model}
          w="full"
          border="1px solid"
          h="32px"
          py="1"
          borderColor={activeModel === model ? "blue.400" : "gray.500"}
          color="white"
          variant="outline"
          onClick={() => handleSelectModel(model)}
          _hover={{ background: "blue.400", color: "black" }}
          boxShadow={activeModel === model ? "0px 0px 10px #8AB4F8" : "none"}
          position="relative"
          display="flex"
          justifyContent="space-between"
          onMouseEnter={() => setHoveredModel(model)}
          onMouseLeave={() => setHoveredModel(null)}
        >
          <Text>{model}</Text>
          <CloseIcon
            w={3}
            h={3}
            color={hoveredModel === model ? "black" : "white"}
            transition="color 0.2s"
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveModel(model);
            }}
          />
        </Button>
      ))}
    </VStack>
  );
}

export default AIModelSelector;