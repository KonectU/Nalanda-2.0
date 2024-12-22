"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileDetails = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const getFileDetails = (fileId) => {
    const fileLoc = path_1.default.join(process.cwd(), './uploads', fileId + '-extracted.json');
    const parsedFile = JSON.parse(fs_1.default.readFileSync(fileLoc, 'utf8'));
    return {
        name: parsedFile.title,
        fileId: fileId,
    };
};
exports.getFileDetails = getFileDetails;
