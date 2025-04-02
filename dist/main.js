"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_1 = __importDefault(require("./config/passport"));
const constants_1 = require("./config/constants");
const userRouter_1 = __importDefault(require("./routers/userRouter"));
const articleRouter_1 = __importDefault(require("./routers/articleRouter"));
const productRouter_1 = __importDefault(require("./routers/productRouter"));
const commentRouter_1 = __importDefault(require("./routers/commentRouter"));
const imageRouter_1 = __importDefault(require("./routers/imageRouter"));
const errorController_1 = require("./controllers/errorController");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(passport_1.default.initialize());
app.use(constants_1.STATIC_PATH, express_1.default.static(path_1.default.resolve(process.cwd(), constants_1.UPLOAD_FOLDER)));
app.use('/users', userRouter_1.default);
app.use('/articles', articleRouter_1.default);
app.use('/products', productRouter_1.default);
app.use('/comments', commentRouter_1.default);
app.use('/images', imageRouter_1.default);
app.use(errorController_1.defaultNotFoundHandler);
app.use(errorController_1.globalErrorHandler);
app.listen(constants_1.PORT, () => {
    console.log(`Server started on port ${constants_1.PORT}`);
});
