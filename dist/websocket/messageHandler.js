"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMessage = exports.searchHandlers = void 0;
const messages_1 = require("@langchain/core/messages");
const logger_1 = __importDefault(require("../utils/logger"));
const db_1 = __importDefault(require("../db"));
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const crypto_1 = __importDefault(require("crypto"));
const files_1 = require("../utils/files");
const metaSearchAgent_1 = __importDefault(require("../search/metaSearchAgent"));
const prompts_1 = __importDefault(require("../prompts"));
exports.searchHandlers = {
    webSearch: new metaSearchAgent_1.default({
        activeEngines: [],
        queryGeneratorPrompt: prompts_1.default.webSearchRetrieverPrompt,
        responsePrompt: prompts_1.default.webSearchResponsePrompt,
        rerank: true,
        rerankThreshold: 0.3,
        searchWeb: true,
        summarizer: true,
    }),
    academicSearch: new metaSearchAgent_1.default({
        activeEngines: ['arxiv', 'google scholar', 'pubmed'],
        queryGeneratorPrompt: prompts_1.default.academicSearchRetrieverPrompt,
        responsePrompt: prompts_1.default.academicSearchResponsePrompt,
        rerank: true,
        rerankThreshold: 0,
        searchWeb: true,
        summarizer: false,
    }),
    writingAssistant: new metaSearchAgent_1.default({
        activeEngines: [],
        queryGeneratorPrompt: '',
        responsePrompt: prompts_1.default.writingAssistantPrompt,
        rerank: true,
        rerankThreshold: 0,
        searchWeb: false,
        summarizer: false,
    }),
    wolframAlphaSearch: new metaSearchAgent_1.default({
        activeEngines: ['wolframalpha'],
        queryGeneratorPrompt: prompts_1.default.wolframAlphaSearchRetrieverPrompt,
        responsePrompt: prompts_1.default.wolframAlphaSearchResponsePrompt,
        rerank: false,
        rerankThreshold: 0,
        searchWeb: true,
        summarizer: false,
    }),
    youtubeSearch: new metaSearchAgent_1.default({
        activeEngines: ['youtube'],
        queryGeneratorPrompt: prompts_1.default.youtubeSearchRetrieverPrompt,
        responsePrompt: prompts_1.default.youtubeSearchResponsePrompt,
        rerank: true,
        rerankThreshold: 0.3,
        searchWeb: true,
        summarizer: false,
    }),
    redditSearch: new metaSearchAgent_1.default({
        activeEngines: ['reddit'],
        queryGeneratorPrompt: prompts_1.default.redditSearchRetrieverPrompt,
        responsePrompt: prompts_1.default.redditSearchResponsePrompt,
        rerank: true,
        rerankThreshold: 0.3,
        searchWeb: true,
        summarizer: false,
    }),
};
const handleEmitterEvents = (emitter, ws, messageId, chatId) => {
    let recievedMessage = '';
    let sources = [];
    emitter.on('data', (data) => {
        const parsedData = JSON.parse(data);
        if (parsedData.type === 'response') {
            ws.send(JSON.stringify({
                type: 'message',
                data: parsedData.data,
                messageId: messageId,
            }));
            recievedMessage += parsedData.data;
        }
        else if (parsedData.type === 'sources') {
            ws.send(JSON.stringify({
                type: 'sources',
                data: parsedData.data,
                messageId: messageId,
            }));
            sources = parsedData.data;
        }
    });
    emitter.on('end', () => {
        ws.send(JSON.stringify({ type: 'messageEnd', messageId: messageId }));
        db_1.default.insert(schema_1.messages)
            .values({
            content: recievedMessage,
            chatId: chatId,
            messageId: messageId,
            role: 'assistant',
            metadata: JSON.stringify({
                createdAt: new Date(),
                ...(sources && sources.length > 0 && { sources }),
            }),
        })
            .execute();
    });
    emitter.on('error', (data) => {
        const parsedData = JSON.parse(data);
        ws.send(JSON.stringify({
            type: 'error',
            data: parsedData.data,
            key: 'CHAIN_ERROR',
        }));
    });
};
const handleMessage = async (message, ws, llm, embeddings) => {
    try {
        const parsedWSMessage = JSON.parse(message);
        const parsedMessage = parsedWSMessage.message;
        if (parsedWSMessage.files.length > 0) {
            /* TODO: Implement uploads in other classes/single meta class system*/
            parsedWSMessage.focusMode = 'webSearch';
        }
        const humanMessageId = parsedMessage.messageId ?? crypto_1.default.randomBytes(7).toString('hex');
        const aiMessageId = crypto_1.default.randomBytes(7).toString('hex');
        if (!parsedMessage.content)
            return ws.send(JSON.stringify({
                type: 'error',
                data: 'Invalid message format',
                key: 'INVALID_FORMAT',
            }));
        const history = parsedWSMessage.history.map((msg) => {
            if (msg[0] === 'human') {
                return new messages_1.HumanMessage({
                    content: msg[1],
                });
            }
            else {
                return new messages_1.AIMessage({
                    content: msg[1],
                });
            }
        });
        if (parsedWSMessage.type === 'message') {
            const handler = exports.searchHandlers[parsedWSMessage.focusMode];
            if (handler) {
                try {
                    const emitter = await handler.searchAndAnswer(parsedMessage.content, history, llm, embeddings, parsedWSMessage.optimizationMode, parsedWSMessage.files);
                    handleEmitterEvents(emitter, ws, aiMessageId, parsedMessage.chatId);
                    const chat = await db_1.default.query.chats.findFirst({
                        where: (0, drizzle_orm_1.eq)(schema_1.chats.id, parsedMessage.chatId),
                    });
                    if (!chat) {
                        await db_1.default
                            .insert(schema_1.chats)
                            .values({
                            id: parsedMessage.chatId,
                            title: parsedMessage.content,
                            createdAt: new Date().toString(),
                            focusMode: parsedWSMessage.focusMode,
                            files: parsedWSMessage.files.map(files_1.getFileDetails),
                        })
                            .execute();
                    }
                    const messageExists = await db_1.default.query.messages.findFirst({
                        where: (0, drizzle_orm_1.eq)(schema_1.messages.messageId, humanMessageId),
                    });
                    if (!messageExists) {
                        await db_1.default
                            .insert(schema_1.messages)
                            .values({
                            content: parsedMessage.content,
                            chatId: parsedMessage.chatId,
                            messageId: humanMessageId,
                            role: 'user',
                            metadata: JSON.stringify({
                                createdAt: new Date(),
                            }),
                        })
                            .execute();
                    }
                    else {
                        await db_1.default
                            .delete(schema_1.messages)
                            .where((0, drizzle_orm_1.gt)(schema_1.messages.id, messageExists.id))
                            .execute();
                    }
                }
                catch (err) {
                    console.log(err);
                }
            }
            else {
                ws.send(JSON.stringify({
                    type: 'error',
                    data: 'Invalid focus mode',
                    key: 'INVALID_FOCUS_MODE',
                }));
            }
        }
    }
    catch (err) {
        ws.send(JSON.stringify({
            type: 'error',
            data: 'Invalid message format',
            key: 'INVALID_FORMAT',
        }));
        logger_1.default.error(`Failed to handle message: ${err}`);
    }
};
exports.handleMessage = handleMessage;
