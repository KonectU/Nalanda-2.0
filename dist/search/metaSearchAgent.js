"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prompts_1 = require("@langchain/core/prompts");
const runnables_1 = require("@langchain/core/runnables");
const output_parsers_1 = require("@langchain/core/output_parsers");
const listLineOutputParser_1 = __importDefault(require("../lib/outputParsers/listLineOutputParser"));
const lineOutputParser_1 = __importDefault(require("../lib/outputParsers/lineOutputParser"));
const documents_1 = require("../utils/documents");
const document_1 = require("langchain/document");
const searxng_1 = require("../lib/searxng");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const computeSimilarity_1 = __importDefault(require("../utils/computeSimilarity"));
const formatHistory_1 = __importDefault(require("../utils/formatHistory"));
const events_1 = __importDefault(require("events"));
class MetaSearchAgent {
    config;
    strParser = new output_parsers_1.StringOutputParser();
    constructor(config) {
        this.config = config;
    }
    async createSearchRetrieverChain(llm) {
        llm.temperature = 0;
        return runnables_1.RunnableSequence.from([
            prompts_1.PromptTemplate.fromTemplate(this.config.queryGeneratorPrompt),
            llm,
            this.strParser,
            runnables_1.RunnableLambda.from(async (input) => {
                const linksOutputParser = new listLineOutputParser_1.default({
                    key: 'links',
                });
                const questionOutputParser = new lineOutputParser_1.default({
                    key: 'question',
                });
                const links = await linksOutputParser.parse(input);
                let question = this.config.summarizer
                    ? await questionOutputParser.parse(input)
                    : input;
                if (question === 'not_needed') {
                    return { query: '', docs: [] };
                }
                if (links.length > 0) {
                    if (question.length === 0) {
                        question = 'summarize';
                    }
                    let docs = [];
                    const linkDocs = await (0, documents_1.getDocumentsFromLinks)({ links });
                    const docGroups = [];
                    linkDocs.map((doc) => {
                        const URLDocExists = docGroups.find((d) => d.metadata.url === doc.metadata.url &&
                            d.metadata.totalDocs < 10);
                        if (!URLDocExists) {
                            docGroups.push({
                                ...doc,
                                metadata: {
                                    ...doc.metadata,
                                    totalDocs: 1,
                                },
                            });
                        }
                        const docIndex = docGroups.findIndex((d) => d.metadata.url === doc.metadata.url &&
                            d.metadata.totalDocs < 10);
                        if (docIndex !== -1) {
                            docGroups[docIndex].pageContent =
                                docGroups[docIndex].pageContent + `\n\n` + doc.pageContent;
                            docGroups[docIndex].metadata.totalDocs += 1;
                        }
                    });
                    await Promise.all(docGroups.map(async (doc) => {
                        const res = await llm.invoke(`
            You are a web search summarizer, tasked with summarizing a piece of text retrieved from a web search. Your job is to summarize the 
            text into a detailed, 2-4 paragraph explanation that captures the main ideas and provides a comprehensive answer to the query.
            If the query is \"summarize\", you should provide a detailed summary of the text. If the query is a specific question, you should answer it in the summary.
            
            - **Journalistic tone**: The summary should sound professional and journalistic, not too casual or vague.
            - **Thorough and detailed**: Ensure that every key point from the text is captured and that the summary directly answers the query.
            - **Not too lengthy, but detailed**: The summary should be informative but not excessively long. Focus on providing detailed information in a concise format.

            The text will be shared inside the \`text\` XML tag, and the query inside the \`query\` XML tag.

            <example>
            1. \`<text>
            Docker is a set of platform-as-a-service products that use OS-level virtualization to deliver software in packages called containers. 
            It was first released in 2013 and is developed by Docker, Inc. Docker is designed to make it easier to create, deploy, and run applications 
            by using containers.
            </text>

            <query>
            What is Docker and how does it work?
            </query>

            Response:
            Docker is a revolutionary platform-as-a-service product developed by Docker, Inc., that uses container technology to make application 
            deployment more efficient. It allows developers to package their software with all necessary dependencies, making it easier to run in 
            any environment. Released in 2013, Docker has transformed the way applications are built, deployed, and managed.
            \`
            2. \`<text>
            The theory of relativity, or simply relativity, encompasses two interrelated theories of Albert Einstein: special relativity and general
            relativity. However, the word "relativity" is sometimes used in reference to Galilean invariance. The term "theory of relativity" was based
            on the expression "relative theory" used by Max Planck in 1906. The theory of relativity usually encompasses two interrelated theories by
            Albert Einstein: special relativity and general relativity. Special relativity applies to all physical phenomena in the absence of gravity.
            General relativity explains the law of gravitation and its relation to other forces of nature. It applies to the cosmological and astrophysical
            realm, including astronomy.
            </text>

            <query>
            summarize
            </query>

            Response:
            The theory of relativity, developed by Albert Einstein, encompasses two main theories: special relativity and general relativity. Special
            relativity applies to all physical phenomena in the absence of gravity, while general relativity explains the law of gravitation and its
            relation to other forces of nature. The theory of relativity is based on the concept of "relative theory," as introduced by Max Planck in
            1906. It is a fundamental theory in physics that has revolutionized our understanding of the universe.
            \`
            </example>

            Everything below is the actual data you will be working with. Good luck!

            <query>
            ${question}
            </query>

            <text>
            ${doc.pageContent}
            </text>

            Make sure to answer the query in the summary.
          `);
                        const document = new document_1.Document({
                            pageContent: res.content,
                            metadata: {
                                title: doc.metadata.title,
                                url: doc.metadata.url,
                            },
                        });
                        docs.push(document);
                    }));
                    return { query: question, docs: docs };
                }
                else {
                    const res = await (0, searxng_1.searchSearxng)(question, {
                        language: 'en',
                        engines: this.config.activeEngines,
                    });
                    const documents = res.results.map((result) => new document_1.Document({
                        pageContent: result.content ||
                            this.config.activeEngines.includes('youtube')
                            ? result.title
                            : '' /* Todo: Implement transcript grabbing using Youtubei (source: https://www.npmjs.com/package/youtubei) */,
                        metadata: {
                            title: result.title,
                            url: result.url,
                            ...(result.img_src && { img_src: result.img_src }),
                        },
                    }));
                    return { query: question, docs: documents };
                }
            }),
        ]);
    }
    async createAnsweringChain(llm, fileIds, embeddings, optimizationMode) {
        return runnables_1.RunnableSequence.from([
            runnables_1.RunnableMap.from({
                query: (input) => input.query,
                chat_history: (input) => input.chat_history,
                date: () => new Date().toISOString(),
                context: runnables_1.RunnableLambda.from(async (input) => {
                    const processedHistory = (0, formatHistory_1.default)(input.chat_history);
                    let docs = null;
                    let query = input.query;
                    if (this.config.searchWeb) {
                        const searchRetrieverChain = await this.createSearchRetrieverChain(llm);
                        const searchRetrieverResult = await searchRetrieverChain.invoke({
                            chat_history: processedHistory,
                            query,
                        });
                        query = searchRetrieverResult.query;
                        docs = searchRetrieverResult.docs;
                    }
                    const sortedDocs = await this.rerankDocs(query, docs ?? [], fileIds, embeddings, optimizationMode);
                    return sortedDocs;
                })
                    .withConfig({
                    runName: 'FinalSourceRetriever',
                })
                    .pipe(this.processDocs),
            }),
            prompts_1.ChatPromptTemplate.fromMessages([
                ['system', this.config.responsePrompt],
                new prompts_1.MessagesPlaceholder('chat_history'),
                ['user', '{query}'],
            ]),
            llm,
            this.strParser,
        ]).withConfig({
            runName: 'FinalResponseGenerator',
        });
    }
    async rerankDocs(query, docs, fileIds, embeddings, optimizationMode) {
        if (docs.length === 0 && fileIds.length === 0) {
            return docs;
        }
        const filesData = fileIds
            .map((file) => {
            const filePath = path_1.default.join(process.cwd(), 'uploads', file);
            const contentPath = filePath + '-extracted.json';
            const embeddingsPath = filePath + '-embeddings.json';
            const content = JSON.parse(fs_1.default.readFileSync(contentPath, 'utf8'));
            const embeddings = JSON.parse(fs_1.default.readFileSync(embeddingsPath, 'utf8'));
            const fileSimilaritySearchObject = content.contents.map((c, i) => {
                return {
                    fileName: content.title,
                    content: c,
                    embeddings: embeddings.embeddings[i],
                };
            });
            return fileSimilaritySearchObject;
        })
            .flat();
        if (query.toLocaleLowerCase() === 'summarize') {
            return docs.slice(0, 15);
        }
        const docsWithContent = docs.filter((doc) => doc.pageContent && doc.pageContent.length > 0);
        if (optimizationMode === 'speed' || this.config.rerank === false) {
            if (filesData.length > 0) {
                const [queryEmbedding] = await Promise.all([
                    embeddings.embedQuery(query),
                ]);
                const fileDocs = filesData.map((fileData) => {
                    return new document_1.Document({
                        pageContent: fileData.content,
                        metadata: {
                            title: fileData.fileName,
                            url: `File`,
                        },
                    });
                });
                const similarity = filesData.map((fileData, i) => {
                    const sim = (0, computeSimilarity_1.default)(queryEmbedding, fileData.embeddings);
                    return {
                        index: i,
                        similarity: sim,
                    };
                });
                let sortedDocs = similarity
                    .filter((sim) => sim.similarity > (this.config.rerankThreshold ?? 0.3))
                    .sort((a, b) => b.similarity - a.similarity)
                    .slice(0, 15)
                    .map((sim) => fileDocs[sim.index]);
                sortedDocs =
                    docsWithContent.length > 0 ? sortedDocs.slice(0, 8) : sortedDocs;
                return [
                    ...sortedDocs,
                    ...docsWithContent.slice(0, 15 - sortedDocs.length),
                ];
            }
            else {
                return docsWithContent.slice(0, 15);
            }
        }
        else if (optimizationMode === 'balanced') {
            const [docEmbeddings, queryEmbedding] = await Promise.all([
                embeddings.embedDocuments(docsWithContent.map((doc) => doc.pageContent)),
                embeddings.embedQuery(query),
            ]);
            docsWithContent.push(...filesData.map((fileData) => {
                return new document_1.Document({
                    pageContent: fileData.content,
                    metadata: {
                        title: fileData.fileName,
                        url: `File`,
                    },
                });
            }));
            docEmbeddings.push(...filesData.map((fileData) => fileData.embeddings));
            const similarity = docEmbeddings.map((docEmbedding, i) => {
                const sim = (0, computeSimilarity_1.default)(queryEmbedding, docEmbedding);
                return {
                    index: i,
                    similarity: sim,
                };
            });
            const sortedDocs = similarity
                .filter((sim) => sim.similarity > (this.config.rerankThreshold ?? 0.3))
                .sort((a, b) => b.similarity - a.similarity)
                .slice(0, 15)
                .map((sim) => docsWithContent[sim.index]);
            return sortedDocs;
        }
    }
    processDocs(docs) {
        return docs
            .map((_, index) => `${index + 1}. ${docs[index].metadata.title} ${docs[index].pageContent}`)
            .join('\n');
    }
    async handleStream(stream, emitter) {
        for await (const event of stream) {
            if (event.event === 'on_chain_end' &&
                event.name === 'FinalSourceRetriever') {
                ``;
                emitter.emit('data', JSON.stringify({ type: 'sources', data: event.data.output }));
            }
            if (event.event === 'on_chain_stream' &&
                event.name === 'FinalResponseGenerator') {
                emitter.emit('data', JSON.stringify({ type: 'response', data: event.data.chunk }));
            }
            if (event.event === 'on_chain_end' &&
                event.name === 'FinalResponseGenerator') {
                emitter.emit('end');
            }
        }
    }
    async searchAndAnswer(message, history, llm, embeddings, optimizationMode, fileIds) {
        const emitter = new events_1.default();
        const answeringChain = await this.createAnsweringChain(llm, fileIds, embeddings, optimizationMode);
        const stream = answeringChain.streamEvents({
            chat_history: history,
            query: message,
        }, {
            version: 'v1',
        });
        this.handleStream(stream, emitter);
        return emitter;
    }
}
exports.default = MetaSearchAgent;
