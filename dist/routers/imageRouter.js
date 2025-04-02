"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const withAsync_1 = require("../lib/withAsync");
const imageController_1 = require("../controllers/imageController");
const imagesRouter = express_1.default.Router();
imagesRouter.post('/upload', imageController_1.upload.single('image'), (0, withAsync_1.withAsync)(imageController_1.uploadImage));
exports.default = imagesRouter;
