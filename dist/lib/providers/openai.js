"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadOpenAIEmbeddingsModels = exports.loadOpenAIChatModels = void 0;
const openai_1 = require("@langchain/openai");
const config_1 = require("../../config");
const logger_1 = __importDefault(require("../../utils/logger"));
const loadOpenAIChatModels = async () => {
    const openAIApiKey = (0, config_1.getOpenaiApiKey)();
    if (!openAIApiKey)
        return {};
    try {
        const chatModels = {
            'gpt-3.5-turbo': {
                displayName: 'GPT-3.5 Turbo',
                model: new openai_1.ChatOpenAI({
                    openAIApiKey,
                    modelName: 'gpt-3.5-turbo',
                    temperature: 0.7,
                }),
            },
            'gpt-4': {
                displayName: 'GPT-4',
                model: new openai_1.ChatOpenAI({
                    openAIApiKey,
                    modelName: 'gpt-4',
                    temperature: 0.7,
                }),
            },
            'gpt-4-turbo': {
                displayName: 'GPT-4 turbo',
                model: new openai_1.ChatOpenAI({
                    openAIApiKey,
                    modelName: 'gpt-4-turbo',
                    temperature: 0.7,
                }),
            },
            'gpt-4o': {
                displayName: 'GPT-4 omni',
                model: new openai_1.ChatOpenAI({
                    openAIApiKey,
                    modelName: 'gpt-4o',
                    temperature: 0.7,
                }),
            },
            'gpt-4o-mini': {
                displayName: 'GPT-4 omni mini',
                model: new openai_1.ChatOpenAI({
                    openAIApiKey,
                    modelName: 'gpt-4o-mini',
                    temperature: 0.7,
                }),
            },
        };
        return chatModels;
    }
    catch (err) {
        logger_1.default.error(`Error loading OpenAI models: ${err}`);
        return {};
    }
};
exports.loadOpenAIChatModels = loadOpenAIChatModels;
const loadOpenAIEmbeddingsModels = async () => {
    const openAIApiKey = (0, config_1.getOpenaiApiKey)();
    if (!openAIApiKey)
        return {};
    try {
        const embeddingModels = {
            'text-embedding-3-small': {
                displayName: 'Text Embedding 3 Small',
                model: new openai_1.OpenAIEmbeddings({
                    openAIApiKey,
                    modelName: 'text-embedding-3-small',
                }),
            },
            'text-embedding-3-large': {
                displayName: 'Text Embedding 3 Large',
                model: new openai_1.OpenAIEmbeddings({
                    openAIApiKey,
                    modelName: 'text-embedding-3-large',
                }),
            },
        };
        return embeddingModels;
    }
    catch (err) {
        logger_1.default.error(`Error loading OpenAI embeddings model: ${err}`);
        return {};
    }
};
exports.loadOpenAIEmbeddingsModels = loadOpenAIEmbeddingsModels;
