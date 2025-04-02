"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ForbiddenError extends Error {
    constructor() {
        super();
        this.name = 'ForbiddenError';
    }
}
exports.default = ForbiddenError;
