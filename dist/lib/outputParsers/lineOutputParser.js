"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const output_parsers_1 = require("@langchain/core/output_parsers");
class LineOutputParser extends output_parsers_1.BaseOutputParser {
    key = 'questions';
    constructor(args) {
        super();
        this.key = args.key ?? this.key;
    }
    static lc_name() {
        return 'LineOutputParser';
    }
    lc_namespace = ['langchain', 'output_parsers', 'line_output_parser'];
    async parse(text) {
        const regex = /^(\s*(-|\*|\d+\.\s|\d+\)\s|\u2022)\s*)+/;
        const startKeyIndex = text.indexOf(`<${this.key}>`);
        const endKeyIndex = text.indexOf(`</${this.key}>`);
        if (startKeyIndex === -1 || endKeyIndex === -1) {
            return '';
        }
        const questionsStartIndex = startKeyIndex === -1 ? 0 : startKeyIndex + `<${this.key}>`.length;
        const questionsEndIndex = endKeyIndex === -1 ? text.length : endKeyIndex;
        const line = text
            .slice(questionsStartIndex, questionsEndIndex)
            .trim()
            .replace(regex, '');
        return line;
    }
    getFormatInstructions() {
        throw new Error('Not implemented.');
    }
}
exports.default = LineOutputParser;
