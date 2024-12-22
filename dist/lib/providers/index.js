"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvailableEmbeddingModelProviders = exports.getAvailableChatModelProviders = void 0;
const groq_1 = require("./groq");
const ollama_1 = require("./ollama");
const openai_1 = require("./openai");
const anthropic_1 = require("./anthropic");
const transformers_1 = require("./transformers");
const gemini_1 = require("./gemini");
const chatModelProviders = {
    openai: openai_1.loadOpenAIChatModels,
    groq: groq_1.loadGroqChatModels,
    ollama: ollama_1.loadOllamaChatModels,
    anthropic: anthropic_1.loadAnthropicChatModels,
    gemini: gemini_1.loadGeminiChatModels,
};
const embeddingModelProviders = {
    openai: openai_1.loadOpenAIEmbeddingsModels,
    local: transformers_1.loadTransformersEmbeddingsModels,
    ollama: ollama_1.loadOllamaEmbeddingsModels,
    gemini: gemini_1.loadGeminiEmbeddingsModels,
};
const getAvailableChatModelProviders = async () => {
    const models = {};
    for (const provider in chatModelProviders) {
        const providerModels = await chatModelProviders[provider]();
        if (Object.keys(providerModels).length > 0) {
            models[provider] = providerModels;
        }
    }
    models['custom_openai'] = {};
    return models;
};
exports.getAvailableChatModelProviders = getAvailableChatModelProviders;
const getAvailableEmbeddingModelProviders = async () => {
    const models = {};
    for (const provider in embeddingModelProviders) {
        const providerModels = await embeddingModelProviders[provider]();
        if (Object.keys(providerModels).length > 0) {
            models[provider] = providerModels;
        }
    }
    return models;
};
exports.getAvailableEmbeddingModelProviders = getAvailableEmbeddingModelProviders;
