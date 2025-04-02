"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EMAIL_STRING = exports.NONE_STRING = exports.REFRESH_tOKEN_STRING = exports.HOST_STRING = exports.EXT_STRING = exports.ASC_STRING = exports.DESC_STRING = exports.RECENT_STRING = exports.ID_STRING = exports.REFRESH_STRING = exports.LOCAL_STRING = exports.REFRESH_TOKEN_STRATEGY = exports.ACCESS_TOKEN_STRATEGY = exports.FILE_NAME_TOSTRING = exports.FILE_NAME_ENCODING = exports.PERIOD_REFRESH_TOKEN = exports.PERIOD_ACCESS_TOKEN = exports.JWT_SECRET = exports.STATIC_PATH = exports.UPLOAD_FOLDER = exports.PORT = exports.DATABASE_URL = void 0;
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
exports.PERIOD_ACCESS_TOKEN = '6h';
exports.PERIOD_REFRESH_TOKEN = '2d';
exports.FILE_NAME_ENCODING = 'latin1';
exports.FILE_NAME_TOSTRING = 'utf8';
exports.ACCESS_TOKEN_STRATEGY = 'access-token';
exports.REFRESH_TOKEN_STRATEGY = 'refresh-token';
exports.LOCAL_STRING = 'local';
exports.REFRESH_STRING = 'refresh';
exports.ID_STRING = 'id';
exports.RECENT_STRING = 'recent';
exports.DESC_STRING = 'desc';
exports.ASC_STRING = 'asc';
exports.EXT_STRING = 'ext';
exports.HOST_STRING = 'host';
exports.REFRESH_tOKEN_STRING = 'refreshToken';
exports.NONE_STRING = 'none';
exports.EMAIL_STRING = 'email';
