"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadGroqChatModels = void 0;
const openai_1 = require("@langchain/openai");
const config_1 = require("../../config");
const logger_1 = __importDefault(require("../../utils/logger"));
const loadGroqChatModels = async () => {
    const groqApiKey = (0, config_1.getGroqApiKey)();
    if (!groqApiKey)
        return {};
    try {
        const chatModels = {
            'llama-3.2-3b-preview': {
                displayName: 'Llama 3.2 3B',
                model: new openai_1.ChatOpenAI({
                    openAIApiKey: groqApiKey,
                    modelName: 'llama-3.2-3b-preview',
                    temperature: 0.7,
                }, {
                    baseURL: 'https://api.groq.com/openai/v1',
                }),
            },
            'llama-3.2-11b-vision-preview': {
                displayName: 'Llama 3.2 11B Vision',
                model: new openai_1.ChatOpenAI({
                    openAIApiKey: groqApiKey,
                    modelName: 'llama-3.2-11b-vision-preview',
                    temperature: 0.7,
                }, {
                    baseURL: 'https://api.groq.com/openai/v1',
                }),
            },
            'llama-3.2-90b-vision-preview': {
                displayName: 'Llama 3.2 90B Vision',
                model: new openai_1.ChatOpenAI({
                    openAIApiKey: groqApiKey,
                    modelName: 'llama-3.2-90b-vision-preview',
                    temperature: 0.7,
                }, {
                    baseURL: 'https://api.groq.com/openai/v1',
                }),
            },
            'llama-3.1-70b-versatile': {
                displayName: 'Llama 3.1 70B',
                model: new openai_1.ChatOpenAI({
                    openAIApiKey: groqApiKey,
                    modelName: 'llama-3.1-70b-versatile',
                    temperature: 0.7,
                }, {
                    baseURL: 'https://api.groq.com/openai/v1',
                }),
            },
            'llama-3.1-8b-instant': {
                displayName: 'Llama 3.1 8B',
                model: new openai_1.ChatOpenAI({
                    openAIApiKey: groqApiKey,
                    modelName: 'llama-3.1-8b-instant',
                    temperature: 0.7,
                }, {
                    baseURL: 'https://api.groq.com/openai/v1',
                }),
            },
            'llama3-8b-8192': {
                displayName: 'LLaMA3 8B',
                model: new openai_1.ChatOpenAI({
                    openAIApiKey: groqApiKey,
                    modelName: 'llama3-8b-8192',
                    temperature: 0.7,
                }, {
                    baseURL: 'https://api.groq.com/openai/v1',
                }),
            },
            'llama3-70b-8192': {
                displayName: 'LLaMA3 70B',
                model: new openai_1.ChatOpenAI({
                    openAIApiKey: groqApiKey,
                    modelName: 'llama3-70b-8192',
                    temperature: 0.7,
                }, {
                    baseURL: 'https://api.groq.com/openai/v1',
                }),
            },
            'mixtral-8x7b-32768': {
                displayName: 'Mixtral 8x7B',
                model: new openai_1.ChatOpenAI({
                    openAIApiKey: groqApiKey,
                    modelName: 'mixtral-8x7b-32768',
                    temperature: 0.7,
                }, {
                    baseURL: 'https://api.groq.com/openai/v1',
                }),
            },
            'gemma-7b-it': {
                displayName: 'Gemma 7B',
                model: new openai_1.ChatOpenAI({
                    openAIApiKey: groqApiKey,
                    modelName: 'gemma-7b-it',
                    temperature: 0.7,
                }, {
                    baseURL: 'https://api.groq.com/openai/v1',
                }),
            },
            'gemma2-9b-it': {
                displayName: 'Gemma2 9B',
                model: new openai_1.ChatOpenAI({
                    openAIApiKey: groqApiKey,
                    modelName: 'gemma2-9b-it',
                    temperature: 0.7,
                }, {
                    baseURL: 'https://api.groq.com/openai/v1',
                }),
            },
        };
        return chatModels;
    }
    catch (err) {
        logger_1.default.error(`Error loading Groq models: ${err}`);
        return {};
    }
};
exports.loadGroqChatModels = loadGroqChatModels;
