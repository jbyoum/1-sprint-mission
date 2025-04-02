"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultNotFoundHandler = defaultNotFoundHandler;
exports.globalErrorHandler = globalErrorHandler;
const superstruct_1 = require("superstruct");
const NotFoundError_1 = __importDefault(require("../lib/errors/NotFoundError"));
const AlreadyExstError_1 = __importDefault(require("../lib/errors/AlreadyExstError"));
const UnauthError_1 = __importDefault(require("../lib/errors/UnauthError"));
const ForbiddenError_1 = __importDefault(require("../lib/errors/ForbiddenError"));
const FileExtError_1 = __importDefault(require("../lib/errors/FileExtError"));
const EmptyUploadError_1 = __importDefault(require("../lib/errors/EmptyUploadError"));
const multer_1 = __importDefault(require("multer"));
const client_1 = require("@prisma/client");
function defaultNotFoundHandler(_req, res, next) {
    res.status(404).send({ message: 'Not found' });
}
function globalErrorHandler(err, _req, res, next) {
    /** From superstruct or application error */
    if (err instanceof superstruct_1.StructError) {
        res.status(400).send({ message: err.message });
    }
    else if (
    /** From express.json middleware, bad prisma data */
    (err instanceof SyntaxError && 'status' in err && err.status === 400 && 'body' in err) ||
        err instanceof client_1.Prisma.PrismaClientValidationError) {
        res.status(400).send({ message: 'Invalid JSON' });
    }
    else if (err instanceof FileExtError_1.default) {
        /** From imageController */
        res.status(400).send({ message: 'Make sure you are uploading an image type.' });
    }
    else if (err instanceof EmptyUploadError_1.default) {
        /** From imageController */
        res.status(400).send({ message: 'No file uploaded.' });
    }
    else if (err instanceof multer_1.default.MulterError) {
        /** From imageController */
        if (err.code === 'LIMIT_FILE_SIZE') {
            res.status(400).send({ message: 'File size exceeds the 5MB limit.' });
        }
        else
            res.status(500).send({ message: 'File upload failed.' });
    }
    else if (err instanceof UnauthError_1.default) {
        /** From userService */
        res.status(401).send({ message: 'Unauthorized' });
    }
    else if (err instanceof ForbiddenError_1.default) {
        /** From ~~Auth */
        res.status(403).send({ message: 'Forbidden' });
    }
    else if (
    /** From ~~Service */
    err instanceof AlreadyExstError_1.default ||
        (err instanceof client_1.Prisma.PrismaClientKnownRequestError && err.code === 'P2002')) {
        res.status(422).send({ message: 'Already Exist' });
    }
    else if (err instanceof Error && 'code' in err) {
        /** Prisma error codes */
        console.error(err);
        res.status(500).send({ message: 'Failed to process data' });
    }
    else if (
    /** Application error */
    err instanceof NotFoundError_1.default ||
        (err instanceof client_1.Prisma.PrismaClientKnownRequestError &&
            (err.code === 'P2001' || err.code === 'P2025'))) {
        res.status(404).send({ message: 'Not Found' });
    }
    else {
        console.error(err);
        res.status(500).send({ message: 'Internal server error' });
    }
}
