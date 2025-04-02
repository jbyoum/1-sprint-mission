"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserBodyStruct = exports.CreateUserBodyStruct = exports.CreatePasswordStruct = exports.GetListParamsStruct = void 0;
const superstruct_1 = require("superstruct");
const commonStructs_1 = require("./commonStructs");
const emailPattern = (0, superstruct_1.pattern)((0, superstruct_1.string)(), /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i);
exports.GetListParamsStruct = commonStructs_1.PageParamsStruct;
exports.CreatePasswordStruct = (0, superstruct_1.object)({
    password: (0, superstruct_1.string)(),
});
exports.CreateUserBodyStruct = (0, superstruct_1.object)({
    email: emailPattern,
    nickname: (0, superstruct_1.nonempty)((0, superstruct_1.string)()),
    image: (0, superstruct_1.optional)((0, superstruct_1.string)()),
    password: (0, superstruct_1.nonempty)((0, superstruct_1.string)()),
});
exports.UpdateUserBodyStruct = (0, superstruct_1.partial)(exports.CreateUserBodyStruct);
