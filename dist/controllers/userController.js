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
exports.createUser = createUser;
exports.login = login;
exports.refreshToken = refreshToken;
exports.getInfo = getInfo;
exports.editInfo = editInfo;
exports.editPassword = editPassword;
const superstruct_1 = require("superstruct");
const userService_1 = __importDefault(require("../services/userService"));
const commonStructs_1 = require("../structs/commonStructs");
const userStructs_1 = require("../structs/userStructs");
const constants_1 = require("../config/constants");
function createUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = (0, superstruct_1.create)(req.body, userStructs_1.CreateUserBodyStruct);
        const user = yield userService_1.default.createUser(data);
        res.status(201).send(user);
    });
}
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const reqUser = req.user;
        const accessToken = userService_1.default.createToken(reqUser);
        const refreshToken = userService_1.default.createToken(reqUser, constants_1.REFRESH_STRING);
        res.cookie(constants_1.REFRESH_tOKEN_STRING, refreshToken, {
            path: '/users/token/refresh',
            httpOnly: true,
            sameSite: constants_1.NONE_STRING,
            secure: false,
        });
        res.json({ accessToken });
    });
}
function refreshToken(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const reqUser = req.user;
        const { id: userId } = (0, superstruct_1.create)({ id: reqUser.id }, commonStructs_1.IdParamsStruct);
        const { accessToken, newRefreshToken } = yield userService_1.default.refreshToken(userId);
        res.cookie(constants_1.REFRESH_tOKEN_STRING, newRefreshToken, {
            path: '/users/token/refresh',
            httpOnly: true,
            sameSite: constants_1.NONE_STRING,
            secure: false,
        });
        res.json({ accessToken });
    });
}
function getInfo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const reqUser = req.user;
        const { id: userId } = (0, superstruct_1.create)({ id: reqUser.id }, commonStructs_1.IdParamsStruct);
        const user = yield userService_1.default.getUserById(userId);
        res.send(user);
    });
}
function editInfo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const reqUser = req.user;
        const { id: userId } = (0, superstruct_1.create)({ id: reqUser.id }, commonStructs_1.IdParamsStruct);
        const data = (0, superstruct_1.create)(req.body, userStructs_1.UpdateUserBodyStruct);
        const user = yield userService_1.default.updateUser(userId, data);
        res.status(201).send(user);
    });
}
function editPassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const reqUser = req.user;
        const { id: userId } = (0, superstruct_1.create)({ id: reqUser.id }, commonStructs_1.IdParamsStruct);
        const { password: password } = (0, superstruct_1.create)(req.body, userStructs_1.CreatePasswordStruct);
        const user = yield userService_1.default.updatePassword(userId, password);
        res.status(201).send(user);
    });
}
