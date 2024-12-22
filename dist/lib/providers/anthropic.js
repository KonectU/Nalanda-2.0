"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadAnthropicChatModels = void 0;
const anthropic_1 = require("@langchain/anthropic");
const config_1 = require("../../config");
const logger_1 = __importDefault(require("../../utils/logger"));
const loadAnthropicChatModels = async () => {
    const anthropicApiKey = (0, config_1.getAnthropicApiKey)();
    if (!anthropicApiKey)
        return {};
    try {
        const chatModels = {
            'claude-3-5-sonnet-20241022': {
                displayName: 'Claude 3.5 Sonnet',
                model: new anthropic_1.ChatAnthropic({
                    temperature: 0.7,
                    anthropicApiKey: anthropicApiKey,
                    model: 'claude-3-5-sonnet-20241022',
                }),
            },
            'claude-3-5-haiku-20241022': {
                displayName: 'Claude 3.5 Haiku',
                model: new anthropic_1.ChatAnthropic({
                    temperature: 0.7,
                    anthropicApiKey: anthropicApiKey,
                    model: 'claude-3-5-haiku-20241022',
                }),
            },
            'claude-3-opus-20240229': {
                displayName: 'Claude 3 Opus',
                model: new anthropic_1.ChatAnthropic({
                    temperature: 0.7,
                    anthropicApiKey: anthropicApiKey,
                    model: 'claude-3-opus-20240229',
                }),
            },
            'claude-3-sonnet-20240229': {
                displayName: 'Claude 3 Sonnet',
                model: new anthropic_1.ChatAnthropic({
                    temperature: 0.7,
                    anthropicApiKey: anthropicApiKey,
                    model: 'claude-3-sonnet-20240229',
                }),
            },
            'claude-3-haiku-20240307': {
                displayName: 'Claude 3 Haiku',
                model: new anthropic_1.ChatAnthropic({
                    temperature: 0.7,
                    anthropicApiKey: anthropicApiKey,
                    model: 'claude-3-haiku-20240307',
                }),
            },
        };
        return chatModels;
    }
    catch (err) {
        logger_1.default.error(`Error loading Anthropic models: ${err}`);
        return {};
    }
};
exports.loadAnthropicChatModels = loadAnthropicChatModels;
