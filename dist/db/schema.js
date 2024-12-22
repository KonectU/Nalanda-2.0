"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chats = exports.messages = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const sqlite_core_1 = require("drizzle-orm/sqlite-core");
exports.messages = (0, sqlite_core_1.sqliteTable)('messages', {
    id: (0, sqlite_core_1.integer)('id').primaryKey(),
    content: (0, sqlite_core_1.text)('content').notNull(),
    chatId: (0, sqlite_core_1.text)('chatId').notNull(),
    messageId: (0, sqlite_core_1.text)('messageId').notNull(),
    role: (0, sqlite_core_1.text)('type', { enum: ['assistant', 'user'] }),
    metadata: (0, sqlite_core_1.text)('metadata', {
        mode: 'json',
    }),
});
exports.chats = (0, sqlite_core_1.sqliteTable)('chats', {
    id: (0, sqlite_core_1.text)('id').primaryKey(),
    title: (0, sqlite_core_1.text)('title').notNull(),
    createdAt: (0, sqlite_core_1.text)('createdAt').notNull(),
    focusMode: (0, sqlite_core_1.text)('focusMode').notNull(),
    files: (0, sqlite_core_1.text)('files', { mode: 'json' })
        .$type()
        .default((0, drizzle_orm_1.sql) `'[]'`),
});
