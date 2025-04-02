"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const withAsync_1 = require("../lib/withAsync");
const userController_1 = require("../controllers/userController");
const passport_1 = __importDefault(require("../config/passport"));
const constants_1 = require("../config/constants");
const usersRouter = express_1.default.Router();
usersRouter.post('/signup', (0, withAsync_1.withAsync)(userController_1.createUser));
usersRouter.post('/login', passport_1.default.authenticate(constants_1.LOCAL_STRING, { session: false }), (0, withAsync_1.withAsync)(userController_1.login));
usersRouter.post('/token/refresh', passport_1.default.authenticate(constants_1.REFRESH_TOKEN_STRING, { session: false }), (0, withAsync_1.withAsync)(userController_1.refreshToken));
usersRouter.get('/info', passport_1.default.authenticate(constants_1.ACCESS_TOKEN_STRING, { session: false }), (0, withAsync_1.withAsync)(userController_1.getInfo));
usersRouter.patch('/info', passport_1.default.authenticate(constants_1.ACCESS_TOKEN_STRING, { session: false }), (0, withAsync_1.withAsync)(userController_1.editInfo));
usersRouter.patch('/password', passport_1.default.authenticate(constants_1.ACCESS_TOKEN_STRING, { session: false }), (0, withAsync_1.withAsync)(userController_1.editPassword));
usersRouter.get('/products', passport_1.default.authenticate(constants_1.ACCESS_TOKEN_STRING, { session: false }), (0, withAsync_1.withAsync)(userController_1.getOwnProducts));
exports.default = usersRouter;
