// Configuration for different LLM providers
export const LLMProviderConfigs = {
  gemini: {
    modelName: "gemini-pro", // Or other suitable model
    // Add other Gemini-specific configurations here
  },
  // Add configurations for other providers like OpenAI, Anthropic, etc.
  // openai: {
  //   modelName: "gpt-3.5-turbo",
  //   apiKeyEnvVar: "OPENAI_API_KEY",
  // },
};

export type LLMProviderName = keyof typeof LLMProviderConfigs;
