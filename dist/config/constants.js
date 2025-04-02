"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PERIOD_REFRESH_TOKEN = exports.PERIOD_ACCESS_TOKEN = exports.REFRESH_STRING = exports.LOCAL_STRING = exports.REFRESH_TOKEN_STRING = exports.ACCESS_TOKEN_STRING = exports.JWT_SECRET = exports.STATIC_PATH = exports.UPLOAD_FOLDER = exports.PORT = exports.DATABASE_URL = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const EnvVarError_1 = __importDefault(require("../lib/errors/EnvVarError"));
dotenv_1.default.config();
if (!process.env.JWT_SECRET || !process.env.DATABASE_URL) {
    throw new EnvVarError_1.default();
}
exports.DATABASE_URL = process.env.DATABASE_URL;
exports.PORT = process.env.PORT || 3000;
exports.UPLOAD_FOLDER = 'public';
exports.STATIC_PATH = '/public';
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.ACCESS_TOKEN_STRING = 'access-token';
exports.REFRESH_TOKEN_STRING = 'refresh-token';
exports.LOCAL_STRING = 'local';
exports.REFRESH_STRING = 'refresh';
exports.PERIOD_ACCESS_TOKEN = '6h';
exports.PERIOD_REFRESH_TOKEN = '2d';
