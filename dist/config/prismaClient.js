"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient().$extends({
    model: {
        $allModels: {
            getEntityName() {
                const context = client_1.Prisma.getExtensionContext(this);
                return (context === null || context === void 0 ? void 0 : context.$name) || '(Table Name)';
            },
        },
    },
});
exports.default = prisma;
