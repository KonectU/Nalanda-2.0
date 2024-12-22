"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadOllamaEmbeddingsModels = exports.loadOllamaChatModels = void 0;
const ollama_1 = require("@langchain/community/embeddings/ollama");
const config_1 = require("../../config");
const logger_1 = __importDefault(require("../../utils/logger"));
const ollama_2 = require("@langchain/community/chat_models/ollama");
const loadOllamaChatModels = async () => {
    const ollamaEndpoint = (0, config_1.getOllamaApiEndpoint)();
    const keepAlive = (0, config_1.getKeepAlive)();
    if (!ollamaEndpoint)
        return {};
    try {
        const response = await fetch(`${ollamaEndpoint}/api/tags`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const { models: ollamaModels } = (await response.json());
        const chatModels = ollamaModels.reduce((acc, model) => {
            acc[model.model] = {
                displayName: model.name,
                model: new ollama_2.ChatOllama({
                    baseUrl: ollamaEndpoint,
                    model: model.model,
                    temperature: 0.7,
                    keepAlive: keepAlive,
                }),
            };
            return acc;
        }, {});
        return chatModels;
    }
    catch (err) {
        logger_1.default.error(`Error loading Ollama models: ${err}`);
        return {};
    }
};
exports.loadOllamaChatModels = loadOllamaChatModels;
const loadOllamaEmbeddingsModels = async () => {
    const ollamaEndpoint = (0, config_1.getOllamaApiEndpoint)();
    if (!ollamaEndpoint)
        return {};
    try {
        const response = await fetch(`${ollamaEndpoint}/api/tags`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const { models: ollamaModels } = (await response.json());
        const embeddingsModels = ollamaModels.reduce((acc, model) => {
            acc[model.model] = {
                displayName: model.name,
                model: new ollama_1.OllamaEmbeddings({
                    baseUrl: ollamaEndpoint,
                    model: model.model,
                }),
            };
            return acc;
        }, {});
        return embeddingsModels;
    }
    catch (err) {
        logger_1.default.error(`Error loading Ollama embeddings model: ${err}`);
        return {};
    }
};
exports.loadOllamaEmbeddingsModels = loadOllamaEmbeddingsModels;
