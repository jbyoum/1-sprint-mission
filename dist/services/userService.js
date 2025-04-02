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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const constants_1 = require("../config/constants");
const userRepository_1 = __importDefault(require("../repositories/userRepository"));
const NotFoundError_1 = __importDefault(require("../lib/errors/NotFoundError"));
const UnauthError_1 = __importDefault(require("../lib/errors/UnauthError"));
function hashingPassword(password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.hash(password, 10);
    });
}
function createUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const hashedPassword = yield hashingPassword(user.password);
        const createdUser = yield userRepository_1.default.create(Object.assign(Object.assign({}, user), { password: hashedPassword }));
        return filterSensitiveUserData(createdUser);
    });
}
function getUser(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield userRepository_1.default.findByEmail(email);
        if (!user) {
            throw new UnauthError_1.default();
        }
        yield verifyPassword(password, user.password);
        return filterSensitiveUserData(user);
    });
}
function getUserById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield userRepository_1.default.findById(id);
        if (!user) {
            throw new NotFoundError_1.default(userRepository_1.default.getEntityName(), id);
        }
        return filterSensitiveUserData(user);
    });
}
function updateUser(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const updatedUser = yield userRepository_1.default.update(id, data);
        return filterSensitiveUserData(updatedUser);
    });
}
function updatePassword(id, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const hashedPassword = yield hashingPassword(password);
        const updatedUser = yield userRepository_1.default.update(id, { password: hashedPassword });
        return filterSensitiveUserData(updatedUser);
    });
}
function refreshToken(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield userRepository_1.default.findById(userId);
        if (!user) {
            throw new UnauthError_1.default();
        }
        const accessToken = createToken(user);
        const newRefreshToken = createToken(user, constants_1.REFRESH_STRING);
        return { accessToken, newRefreshToken };
    });
}
function verifyPassword(inputPassword, savedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        const isValid = yield bcrypt_1.default.compare(inputPassword, savedPassword);
        if (!isValid) {
            throw new UnauthError_1.default();
        }
    });
}
function filterSensitiveUserData(user = {}) {
    const { password } = user, rest = __rest(user, ["password"]);
    return rest;
}
function createToken(userWithId, type) {
    const payload = { userId: userWithId.id };
    const options = {
        expiresIn: type === constants_1.REFRESH_STRING ? constants_1.PERIOD_REFRESH_TOKEN : constants_1.PERIOD_ACCESS_TOKEN,
    };
    const token = jsonwebtoken_1.default.sign(payload, constants_1.JWT_SECRET, options);
    return token;
}
exports.default = {
    createUser,
    getUser,
    getUserById,
    updateUser,
    createToken,
    refreshToken,
    updatePassword,
};
