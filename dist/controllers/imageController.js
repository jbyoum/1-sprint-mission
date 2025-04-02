"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
exports.uploadImage = uploadImage;
const constants_1 = require("../config/constants");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const file_type_1 = require("file-type");
const fs_1 = __importDefault(require("fs"));
const FileExtError_1 = __importDefault(require("../lib/errors/FileExtError"));
const EmptyUploadError_1 = __importDefault(require("../lib/errors/EmptyUploadError"));
const dirname = path_1.default.resolve();
const FILE_SIZE_LIMIT = 5 * 1024 * 1024;
const allowedExt = [
    'jpg',
    'j2c',
    'jp2',
    'jpm',
    'jpx',
    'png',
    'webp',
    'avif',
    'bmp',
    'gif',
    'icns',
    'ico',
];
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path_1.default.join(dirname, constants_1.UPLOAD_FOLDER));
    },
    filename: (req, file, cb) => {
        file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
        const ext = path_1.default.extname(file.originalname);
        const baseName = path_1.default.basename(file.originalname, ext);
        const timestamp = Date.now();
        const uniqueFileName = `${baseName}-${timestamp}${ext}`;
        cb(null, uniqueFileName);
    },
});
exports.upload = (0, multer_1.default)({
    storage: storage,
    limits: { fieldNameSize: 100, fileSize: FILE_SIZE_LIMIT },
});
function uploadImage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.file) {
            throw new EmptyUploadError_1.default();
        }
        const filePath = `${dirname}/${constants_1.UPLOAD_FOLDER}/${req.file.filename}`;
        const mimeType = yield (0, file_type_1.fileTypeFromFile)(filePath);
        const ext = mimeType ? mimeType['ext'] : null;
        if (!ext || !allowedExt.includes(ext)) {
            fs_1.default.unlink(filePath, (err) => {
                if (err)
                    console.error('Failed to delete file:', err);
            });
            throw new FileExtError_1.default();
        }
        const downloadPath = `${process.env.PROTOCOL}://${req.get('host')}/${constants_1.UPLOAD_FOLDER}/${req.file.filename}`;
        res.json({ downloadPath });
    });
}
