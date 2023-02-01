"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const cors_1 = __importDefault(require("cors"));
const dotenv_flow_1 = require("dotenv-flow");
const express_1 = __importDefault(require("express"));
const routes_1 = require("./routes");
(0, dotenv_flow_1.config)({ silent: true });
const app = (0, express_1.default)();
exports.app = app;
app.use((0, cors_1.default)({
    exposedHeaders: ['x-total-count', 'Content-Type', 'Content-Length'],
}));
app.use(express_1.default.json({
    type: ['application/json', 'text/plain'],
}));
app.use(routes_1.router);
