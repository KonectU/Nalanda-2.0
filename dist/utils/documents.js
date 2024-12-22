"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDocumentsFromLinks = void 0;
const axios_1 = __importDefault(require("axios"));
const html_to_text_1 = require("html-to-text");
const text_splitter_1 = require("langchain/text_splitter");
const documents_1 = require("@langchain/core/documents");
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const logger_1 = __importDefault(require("./logger"));
const getDocumentsFromLinks = async ({ links }) => {
    const splitter = new text_splitter_1.RecursiveCharacterTextSplitter();
    let docs = [];
    await Promise.all(links.map(async (link) => {
        link =
            link.startsWith('http://') || link.startsWith('https://')
                ? link
                : `https://${link}`;
        try {
            const res = await axios_1.default.get(link, {
                responseType: 'arraybuffer',
            });
            const isPdf = res.headers['content-type'] === 'application/pdf';
            if (isPdf) {
                const pdfText = await (0, pdf_parse_1.default)(res.data);
                const parsedText = pdfText.text
                    .replace(/(\r\n|\n|\r)/gm, ' ')
                    .replace(/\s+/g, ' ')
                    .trim();
                const splittedText = await splitter.splitText(parsedText);
                const title = 'PDF Document';
                const linkDocs = splittedText.map((text) => {
                    return new documents_1.Document({
                        pageContent: text,
                        metadata: {
                            title: title,
                            url: link,
                        },
                    });
                });
                docs.push(...linkDocs);
                return;
            }
            const parsedText = (0, html_to_text_1.htmlToText)(res.data.toString('utf8'), {
                selectors: [
                    {
                        selector: 'a',
                        options: {
                            ignoreHref: true,
                        },
                    },
                ],
            })
                .replace(/(\r\n|\n|\r)/gm, ' ')
                .replace(/\s+/g, ' ')
                .trim();
            const splittedText = await splitter.splitText(parsedText);
            const title = res.data
                .toString('utf8')
                .match(/<title>(.*?)<\/title>/)?.[1];
            const linkDocs = splittedText.map((text) => {
                return new documents_1.Document({
                    pageContent: text,
                    metadata: {
                        title: title || link,
                        url: link,
                    },
                });
            });
            docs.push(...linkDocs);
        }
        catch (err) {
            logger_1.default.error(`Error at generating documents from links: ${err.message}`);
            docs.push(new documents_1.Document({
                pageContent: `Failed to retrieve content from the link: ${err.message}`,
                metadata: {
                    title: 'Failed to retrieve content',
                    url: link,
                },
            }));
        }
    }));
    return docs;
};
exports.getDocumentsFromLinks = getDocumentsFromLinks;
