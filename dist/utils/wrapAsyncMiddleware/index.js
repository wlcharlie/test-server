"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wrapAsyncMiddleware = (fn) => (...args) => fn(...args).catch(args[2]);
exports.default = wrapAsyncMiddleware;
