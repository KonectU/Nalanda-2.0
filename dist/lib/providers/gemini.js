"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadGeminiEmbeddingsModels = exports.loadGeminiChatModels = void 0;
const google_genai_1 = require("@langchain/google-genai");
const config_1 = require("../../config");
const logger_1 = __importDefault(require("../../utils/logger"));
const loadGeminiChatModels = async () => {
    const geminiApiKey = (0, config_1.getGeminiApiKey)();
    if (!geminiApiKey)
        return {};
    try {
        const chatModels = {
            'gemini-1.5-flash': {
                displayName: 'Gemini 1.5 Flash',
                model: new google_genai_1.ChatGoogleGenerativeAI({
                    modelName: 'gemini-1.5-flash',
                    temperature: 0.7,
                    apiKey: geminiApiKey,
                }),
            },
            'gemini-1.5-flash-8b': {
                displayName: 'Gemini 1.5 Flash 8B',
                model: new google_genai_1.ChatGoogleGenerativeAI({
                    modelName: 'gemini-1.5-flash-8b',
                    temperature: 0.7,
                    apiKey: geminiApiKey,
                }),
            },
            'gemini-1.5-pro': {
                displayName: 'Gemini 1.5 Pro',
                model: new google_genai_1.ChatGoogleGenerativeAI({
                    modelName: 'gemini-1.5-pro',
                    temperature: 0.7,
                    apiKey: geminiApiKey,
                }),
            },
        };
        return chatModels;
    }
    catch (err) {
        logger_1.default.error(`Error loading Gemini models: ${err}`);
        return {};
    }
};
exports.loadGeminiChatModels = loadGeminiChatModels;
const loadGeminiEmbeddingsModels = async () => {
    const geminiApiKey = (0, config_1.getGeminiApiKey)();
    if (!geminiApiKey)
        return {};
    try {
        const embeddingModels = {
            'text-embedding-004': {
                displayName: 'Text Embedding',
                model: new google_genai_1.GoogleGenerativeAIEmbeddings({
                    apiKey: geminiApiKey,
                    modelName: 'text-embedding-004',
                }),
            },
        };
        return embeddingModels;
    }
    catch (err) {
        logger_1.default.error(`Error loading Gemini embeddings model: ${err}`);
        return {};
    }
};
exports.loadGeminiEmbeddingsModels = loadGeminiEmbeddingsModels;
