"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const customColors = {
    error: 'bold red',
    warn: 'bold yellow',
    info: 'bold green',
    debug: 'bold blue',
};
const winston_2 = __importDefault(require("winston"));
winston_2.default.addColors(customColors);
const logger = (0, winston_1.createLogger)({
    level: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
    format: winston_1.format.combine(winston_1.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.format.errors({ stack: true }), winston_1.format.splat(), winston_1.format.json()),
    transports: [
        new winston_1.transports.Console({
            format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.simple())
        }),
        new winston_1.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston_1.transports.File({ filename: 'logs/combined.log' })
    ]
});
if (process.env.NODE_ENV === 'production') {
    logger.add(new winston_1.transports.Console({
        format: winston_1.format.simple(),
    }));
}
exports.default = logger;
