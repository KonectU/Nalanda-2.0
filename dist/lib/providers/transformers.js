"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadTransformersEmbeddingsModels = void 0;
const logger_1 = __importDefault(require("../../utils/logger"));
const huggingfaceTransformer_1 = require("../huggingfaceTransformer");
const loadTransformersEmbeddingsModels = async () => {
    try {
        const embeddingModels = {
            'xenova-bge-small-en-v1.5': {
                displayName: 'BGE Small',
                model: new huggingfaceTransformer_1.HuggingFaceTransformersEmbeddings({
                    modelName: 'Xenova/bge-small-en-v1.5',
                }),
            },
            'xenova-gte-small': {
                displayName: 'GTE Small',
                model: new huggingfaceTransformer_1.HuggingFaceTransformersEmbeddings({
                    modelName: 'Xenova/gte-small',
                }),
            },
            'xenova-bert-base-multilingual-uncased': {
                displayName: 'Bert Multilingual',
                model: new huggingfaceTransformer_1.HuggingFaceTransformersEmbeddings({
                    modelName: 'Xenova/bert-base-multilingual-uncased',
                }),
            },
        };
        return embeddingModels;
    }
    catch (err) {
        logger_1.default.error(`Error loading Transformers embeddings model: ${err}`);
        return {};
    }
};
exports.loadTransformersEmbeddingsModels = loadTransformersEmbeddingsModels;
