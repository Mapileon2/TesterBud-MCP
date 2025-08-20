"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiProvider = void 0;
const generative_ai_1 = require("@google/generative-ai");
const universal_llm_adapter_1 = require("./universal-llm-adapter");
const logger_1 = require("../utils/logger");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Define Gemini-specific model configurations
const GEMINI_MODELS = {
    'gemini-pro': {
        name: 'gemini-pro',
        displayName: 'Gemini Pro',
        maxTokens: 30720,
        outputTokens: 2048,
        supportsMultimodal: false,
        supportsFunctionCalling: false,
        supportsStreaming: true,
        costTier: 'low',
        speed: 'fast',
        bestFor: ['general_chat', 'text_generation'],
        reasoning_modes: ['balanced_reasoning', 'minimal_reasoning'],
        pricing: { inputPer1M: 0.5, outputPer1M: 1.5 }
    },
    'gemini-1.5-flash': {
        name: 'gemini-1.5-flash',
        displayName: 'Gemini 1.5 Flash',
        maxTokens: 1048576,
        outputTokens: 8192,
        supportsMultimodal: true,
        supportsFunctionCalling: false,
        supportsStreaming: true,
        costTier: 'ultra_low',
        speed: 'ultra_fast',
        bestFor: ['fast_summarization', 'long_context_chat'],
        reasoning_modes: ['minimal_reasoning'],
        experimental: true
    },
    'gemini-1.5-pro': {
        name: 'gemini-1.5-pro',
        displayName: 'Gemini 1.5 Pro',
        maxTokens: 1048576,
        outputTokens: 8192,
        supportsMultimodal: true,
        supportsFunctionCalling: false,
        supportsStreaming: true,
        costTier: 'medium',
        speed: 'fast',
        bestFor: ['complex_reasoning', 'multimodal_analysis', 'long_context_tasks'],
        reasoning_modes: ['high_reasoning', 'balanced_reasoning'],
        experimental: true
    },
    'gemini-2.0-flash-exp': {
        name: 'gemini-2.0-flash-exp',
        displayName: 'Gemini 2.0 Flash (Experimental)',
        maxTokens: 1048576,
        outputTokens: 8192,
        supportsMultimodal: true,
        supportsFunctionCalling: false,
        supportsStreaming: true,
        costTier: 'ultra_low',
        speed: 'ultra_fast',
        bestFor: ['rapid_prototyping', 'experimental_use'],
        reasoning_modes: ['minimal_reasoning'],
        experimental: true
    }
};
class GeminiProvider extends universal_llm_adapter_1.UniversalLLMAdapter {
    constructor() {
        super();
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            logger_1.logger.warn("GEMINI_API_KEY is not set. Gemini provider might not function correctly.");
            this.genAI = new generative_ai_1.GoogleGenerativeAI("");
        }
        else {
            this.genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
        }
        this.models = new Map();
        this.initializeModels();
    }
    initializeModels() {
        for (const modelName in GEMINI_MODELS) {
            try {
                this.models.set(modelName, this.genAI.getGenerativeModel({ model: modelName }));
            }
            catch (error) {
                logger_1.logger.error(`Failed to initialize Gemini model ${modelName}: ${error}`);
            }
        }
    }
    // Implement abstract methods from UniversalLLMAdapter
    registerAllProviders() {
        const geminiVariants = this.getProviderVariants();
        geminiVariants.forEach((variant) => this.registerProvider(variant));
    }
    registerProvider(provider) {
        this.providers.set(provider.name, provider);
    }
    async generateResponse(providerName, prompt, mode, sessionId) {
        const modelConfig = GEMINI_MODELS[providerName];
        if (!modelConfig) {
            throw new Error(`Gemini model configuration not found for: ${providerName}`);
        }
        const model = this.models.get(providerName);
        if (!model) {
            throw new Error(`Gemini model instance not found for: ${providerName}`);
        }
        const startTime = Date.now();
        const formattedPrompt = this.enhancePromptForProvider(this.providers.get(providerName), prompt, mode);
        try {
            const payload = this.buildProviderSpecificPayload(this.providers.get(providerName), formattedPrompt, mode);
            const response = await this.makeRequest(this.providers.get(providerName), payload);
            const processingTime = Date.now() - startTime;
            logger_1.logger.info(`Gemini Response for ${providerName} - mode: ${mode.id}, processingTime: ${processingTime}, sessionId: ${sessionId}, finishReason: ${response.finishReason}`);
            return {
                ...response,
                processingTime,
                usedProvider: providerName
            };
        }
        catch (error) {
            logger_1.logger.error(`Error generating response from Gemini (${providerName}): ${error}`);
            throw error;
        }
    }
    buildProviderSpecificPayload(provider, prompt, mode) {
        const modelConfig = GEMINI_MODELS[provider.name];
        if (!modelConfig) {
            throw new Error(`Gemini model configuration not found for: ${provider.name}`);
        }
        return {
            contents: [{
                    parts: [{ text: prompt }]
                }],
            generationConfig: {
                temperature: this.getTemperatureForMode(mode),
                maxOutputTokens: Math.min(mode.maxTokens, modelConfig.outputTokens),
                topK: 40,
                topP: 0.95,
            }
        };
    }
    async makeRequest(provider, payload) {
        const url = this.buildUrl(provider.modelName);
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY is required for Gemini models');
        }
        try {
            const response = await fetch(`${url}?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const data = await response.json();
            return this.parseProviderResponse(provider, data);
        }
        catch (error) {
            logger_1.logger.error(`Error making request to ${provider.name}: ${error}`);
            throw error;
        }
    }
    parseProviderResponse(provider, data) {
        const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const usage = data.usageMetadata ? {
            promptTokens: data.usageMetadata.promptTokenCount || 0,
            completionTokens: data.usageMetadata.candidatesTokenCount || 0,
            totalTokens: data.usageMetadata.totalTokenCount || 0,
        } : undefined;
        return {
            content,
            usage,
            finishReason: data.candidates?.[0]?.finishReason,
        };
    }
    enhancePromptForProvider(provider, prompt, mode) {
        const reasoningInstructions = this.getReasoningInstructions(mode);
        const providerOptimization = this.getProviderOptimization(provider);
        return `${reasoningInstructions}\n\n${prompt}\n\n${providerOptimization}`;
    }
    getReasoningInstructions(mode) {
        switch (mode.id) {
            case 'high_reasoning':
                return "Provide detailed, step-by-step reasoning with thorough analysis.";
            case 'balanced_reasoning':
                return "Provide clear reasoning with appropriate detail.";
            case 'minimal_reasoning':
                return "Provide concise reasoning with key points only.";
            default:
                return "Provide appropriate reasoning based on the context.";
        }
    }
    getProviderOptimization(provider) {
        return `Optimize response for ${provider.displayName || provider.name} model capabilities.`;
    }
    getTemperatureForMode(mode) {
        switch (mode.id) {
            case 'high_reasoning':
                return 0.3;
            case 'balanced_reasoning':
                return 0.7;
            case 'minimal_reasoning':
                return 0.9;
            default:
                return 0.7;
        }
    }
    buildUrl(modelName) {
        return `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`;
    }
    getAllProviders() {
        return Array.from(this.providers.keys());
    }
    getProvider(name) {
        return this.providers.get(name);
    }
    getProviderVariants() {
        return Object.keys(GEMINI_MODELS).map(modelName => {
            const config = GEMINI_MODELS[modelName];
            return {
                name: modelName,
                displayName: config.displayName,
                apiEndpoint: this.buildUrl(modelName),
                apiKey: process.env.GEMINI_API_KEY,
                modelName: modelName,
                maxTokens: config.maxTokens,
                supportsStreaming: config.supportsStreaming,
                supportsFunctionCalling: config.supportsFunctionCalling,
                costTier: config.costTier,
                speed: config.speed,
                bestFor: config.bestFor,
                reasoning_modes: config.reasoning_modes,
                experimental: config.experimental,
                pricing: config.pricing,
            };
        });
    }
    mapSpeedToEnum(speed) {
        switch (speed) {
            case 'ultra_fast': return 'ultra_fast';
            case 'fastest': return 'fastest';
            case 'very_fast': return 'very_fast';
            case 'fast': return 'fast';
            case 'medium': return 'medium';
            case 'slow': return 'slow';
            default: return 'medium';
        }
    }
}
exports.GeminiProvider = GeminiProvider;
//# sourceMappingURL=gemini-provider.js.map