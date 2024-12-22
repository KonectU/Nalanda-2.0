"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const suggestionGeneratorAgent_1 = __importDefault(require("../chains/suggestionGeneratorAgent"));
const providers_1 = require("../lib/providers");
const messages_1 = require("@langchain/core/messages");
const logger_1 = __importDefault(require("../utils/logger"));
const openai_1 = require("@langchain/openai");
const router = express_1.default.Router();
router.post('/', async (req, res) => {
    try {
        let body = req.body;
        const chatHistory = body.chatHistory.map((msg) => {
            if (msg.role === 'user') {
                return new messages_1.HumanMessage(msg.content);
            }
            else if (msg.role === 'assistant') {
                return new messages_1.AIMessage(msg.content);
            }
        });
        const chatModelProviders = await (0, providers_1.getAvailableChatModelProviders)();
        const chatModelProvider = body.chatModel?.provider || Object.keys(chatModelProviders)[0];
        const chatModel = body.chatModel?.model ||
            Object.keys(chatModelProviders[chatModelProvider])[0];
        let llm;
        if (body.chatModel?.provider === 'custom_openai') {
            if (!body.chatModel?.customOpenAIBaseURL ||
                !body.chatModel?.customOpenAIKey) {
                return res
                    .status(400)
                    .json({ message: 'Missing custom OpenAI base URL or key' });
            }
            llm = new openai_1.ChatOpenAI({
                modelName: body.chatModel.model,
                openAIApiKey: body.chatModel.customOpenAIKey,
                temperature: 0.7,
                configuration: {
                    baseURL: body.chatModel.customOpenAIBaseURL,
                },
            });
        }
        else if (chatModelProviders[chatModelProvider] &&
            chatModelProviders[chatModelProvider][chatModel]) {
            llm = chatModelProviders[chatModelProvider][chatModel]
                .model;
        }
        if (!llm) {
            return res.status(400).json({ message: 'Invalid model selected' });
        }
        const suggestions = await (0, suggestionGeneratorAgent_1.default)({ chat_history: chatHistory }, llm);
        res.status(200).json({ suggestions: suggestions });
    }
    catch (err) {
        res.status(500).json({ message: 'An error has occurred.' });
        logger_1.default.error(`Error in generating suggestions: ${err.message}`);
    }
});
exports.default = router;
