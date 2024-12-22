"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const academicSearch_1 = require("./academicSearch");
const redditSearch_1 = require("./redditSearch");
const webSearch_1 = require("./webSearch");
const wolframAlpha_1 = require("./wolframAlpha");
const writingAssistant_1 = require("./writingAssistant");
const youtubeSearch_1 = require("./youtubeSearch");
exports.default = {
    webSearchResponsePrompt: webSearch_1.webSearchResponsePrompt,
    webSearchRetrieverPrompt: webSearch_1.webSearchRetrieverPrompt,
    academicSearchResponsePrompt: academicSearch_1.academicSearchResponsePrompt,
    academicSearchRetrieverPrompt: academicSearch_1.academicSearchRetrieverPrompt,
    redditSearchResponsePrompt: redditSearch_1.redditSearchResponsePrompt,
    redditSearchRetrieverPrompt: redditSearch_1.redditSearchRetrieverPrompt,
    wolframAlphaSearchResponsePrompt: wolframAlpha_1.wolframAlphaSearchResponsePrompt,
    wolframAlphaSearchRetrieverPrompt: wolframAlpha_1.wolframAlphaSearchRetrieverPrompt,
    writingAssistantPrompt: writingAssistant_1.writingAssistantPrompt,
    youtubeSearchResponsePrompt: youtubeSearch_1.youtubeSearchResponsePrompt,
    youtubeSearchRetrieverPrompt: youtubeSearch_1.youtubeSearchRetrieverPrompt,
};
