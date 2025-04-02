"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticatePartial = authenticatePartial;
const passport_1 = __importDefault(require("./passport"));
function authenticatePartial(strategyName) {
    return (req, res, next) => {
        passport_1.default.authenticate(strategyName, { session: false }, (_err, _user, _info) => {
            // if (err) {
            //   return next(err);
            // }
            next();
        })(req, res, next);
    };
}
