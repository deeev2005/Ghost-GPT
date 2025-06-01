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

function AIModelSelector({ userId, userEmail }) {
  const [selectedModels, setSelectedModels] = useState([]);
  const [activeModel, setActiveModel] = useState(null);
  const [selectedModel, setSelectedModel] = useState("");
  const [showNoModelWarning, setShowNoModelWarning] = useState(false);

  const updateActiveModel = async (modelName) => {
    const apiModel = modelMappings[modelName];
    try {
      console.log("🔄 Updating model to:", apiModel, "for user:", userEmail);
      
      const requestBody = { model: apiModel };
      console.log("📤 Request body:", JSON.stringify(requestBody));
      console.log("📤 Full URL:", `https://your-backend-url.com/set_model?email=${encodeURIComponent(userEmail)}`);
      
      const response = await fetch(
        `https://your-backend-url.com/set_model?email=${encodeURIComponent(userEmail)}`,
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(requestBody)
        }
      );
      
      console.log("📥 Response status:", response.status);
      console.log("📥 Response headers:", Object.fromEntries(response.headers.entries()));
      
      if (response.ok) {
        const responseData = await response.json();
        console.log("✅ Success response:", responseData);
        setActiveModel(modelName);
        console.log("✅ Model successfully updated to:", modelName);
      } else {
        const errorText = await response.text();
        console.error("❌ Failed to update model. Status:", response.status);
        console.error("❌ Error response body:", errorText);
        
        // Try to parse as JSON to see validation errors
        try {
          const errorJson = JSON.parse(errorText);
          console.error("❌ Parsed error details:", errorJson);
        } catch (e) {
          console.error("❌ Could not parse error as JSON");
        }
      }
    } catch (error) {
      console.error("❌ Network/Request error:", error);
    }
  };

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

  const handleRemoveModel = (model) => {
    const newSelectedModels = selectedModels.filter((m) => m !== model);
    setSelectedModels(newSelectedModels);
    if (activeModel === model) {
      const fallback = newSelectedModels[0] || null;
      setActiveModel(fallback);
      if (fallback) updateActiveModel(fallback);
    }
  };

  return (
    <VStack spacing={3}>
      <Select placeholder="Select AI model" value={selectedModel} onChange={handleAddModel}>
        {availableModels.map((model) => (
          <option key={model} value={model}>
            {model}
          </option>
        ))}
      </Select>

      {selectedModels.map((model) => (
        <Button
          key={model}
          variant={activeModel === model ? "solid" : "outline"}
          colorScheme="teal"
          onClick={() => handleSelectModel(model)}
          rightIcon={<CloseIcon boxSize={2.5} onClick={(e) => {
            e.stopPropagation();
            handleRemoveModel(model);
          }} />}
          width="100%"
        >
          {model}
        </Button>
      ))}

      {showNoModelWarning && (
        <Alert status="warning">
          <AlertIcon />
          Please select a model before sending a message.
        </Alert>
      )}
    </VStack>
  );
}

export default AIModelSelector;