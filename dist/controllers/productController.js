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
exports.createProduct = createProduct;
exports.getProduct = getProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
exports.getProductList = getProductList;
exports.createComment = createComment;
exports.getCommentList = getCommentList;
exports.likeProduct = likeProduct;
exports.dislikeProduct = dislikeProduct;
const superstruct_1 = require("superstruct");
const NotFoundError_1 = __importDefault(require("../lib/errors/NotFoundError"));
const commonStructs_1 = require("../structs/commonStructs");
const productStruct_1 = require("../structs/productStruct");
const commentStruct_1 = require("../structs/commentStruct");
const productService_1 = __importDefault(require("../services/productService"));
const commentService_1 = __importDefault(require("../services/commentService"));
const likeService_1 = __importDefault(require("../services/likeService"));
const AlreadyExstError_1 = __importDefault(require("../lib/errors/AlreadyExstError"));
const client_1 = require("@prisma/client");
function createProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = (0, superstruct_1.create)(req.body, productStruct_1.CreateProductBodyStruct);
        const reqUser = req.user;
        const { id: userId } = (0, superstruct_1.create)({ id: reqUser.id }, commonStructs_1.IdParamsStruct);
        const product = yield productService_1.default.create(Object.assign(Object.assign({}, data), { userId: userId }));
        res.status(201).send(product);
    });
}
function getProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = (0, superstruct_1.create)(req.params, commonStructs_1.IdParamsStruct);
        const product = yield productService_1.default.getById(id);
        if (!product) {
            throw new NotFoundError_1.default(productService_1.default.getEntityName(), id);
        }
        if (!req.user) {
            res.send(product);
        }
        else {
            const reqUser = req.user;
            const { id: userId } = (0, superstruct_1.create)({ id: reqUser.id }, commonStructs_1.IdParamsStruct);
            const like = yield likeService_1.default.getByProduct(userId, id);
            res.send(Object.assign(Object.assign({}, product), { isLiked: !!like }));
        }
    });
}
function updateProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = (0, superstruct_1.create)(req.params, commonStructs_1.IdParamsStruct);
        const data = (0, superstruct_1.create)(req.body, productStruct_1.UpdateProductBodyStruct);
        const updatedProduct = yield productService_1.default.update(id, data);
        res.send(updatedProduct);
    });
}
function deleteProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = (0, superstruct_1.create)(req.params, commonStructs_1.IdParamsStruct);
        yield productService_1.default.remove(id);
        res.status(204).send();
    });
}
function getProductList(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { page, pageSize, orderBy, keyword } = (0, superstruct_1.create)(req.query, productStruct_1.GetProductListParamsStruct);
        const search = {
            where: {
                OR: [
                    { name: { contains: keyword, mode: client_1.Prisma.QueryMode.insensitive } },
                    { description: { contains: keyword, mode: client_1.Prisma.QueryMode.insensitive } },
                ],
            },
        };
        const totalCount = yield productService_1.default.count({ where: keyword ? search.where : {} });
        const products = yield productService_1.default.getList({
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: orderBy === 'recent' ? { id: 'desc' } : { id: 'asc' },
            where: keyword ? search.where : {},
        });
        res.send({
            list: products,
            totalCount,
        });
    });
}
function createComment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id: productId } = (0, superstruct_1.create)(req.params, commonStructs_1.IdParamsStruct);
        const { content } = (0, superstruct_1.create)(req.body, commentStruct_1.CreateCommentBodyStruct);
        const reqUser = req.user;
        const { id: userId } = (0, superstruct_1.create)({ id: reqUser.id }, commonStructs_1.IdParamsStruct);
        const comment = yield commentService_1.default.create({
            productId: productId,
            content,
            userId: userId,
        });
        res.status(201).send(comment);
    });
}
function getCommentList(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id: productId } = (0, superstruct_1.create)(req.params, commonStructs_1.IdParamsStruct);
        const { cursor, limit } = (0, superstruct_1.create)(req.query, commentStruct_1.GetCommentListParamsStruct);
        const existingProduct = yield productService_1.default.getById(productId);
        if (!existingProduct) {
            throw new NotFoundError_1.default(productService_1.default.getEntityName(), productId);
        }
        const commentsWithCursorComment = yield commentService_1.default.getList({
            cursor: cursor ? { id: cursor } : undefined,
            take: limit + 1,
            where: { productId },
        });
        const comments = commentsWithCursorComment.slice(0, limit);
        const cursorComment = commentsWithCursorComment[comments.length - 1];
        const nextCursor = cursorComment ? cursorComment.id : null;
        res.send({
            list: comments,
            nextCursor,
        });
    });
}
function likeProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id: productId } = (0, superstruct_1.create)(req.params, commonStructs_1.IdParamsStruct);
        const reqUser = req.user;
        const { id: userId } = (0, superstruct_1.create)({ id: reqUser.id }, commonStructs_1.IdParamsStruct);
        const existedLike = yield likeService_1.default.getByProduct(userId, productId);
        if (existedLike) {
            throw new AlreadyExstError_1.default(likeService_1.default.getEntityName());
        }
        const like = yield likeService_1.default.create({
            userId: userId,
            productId: productId,
        });
        res.send(like);
    });
}
function dislikeProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id: productId } = (0, superstruct_1.create)(req.params, commonStructs_1.IdParamsStruct);
        const reqUser = req.user;
        const { id: userId } = (0, superstruct_1.create)({ id: reqUser.id }, commonStructs_1.IdParamsStruct);
        const existedLike = yield likeService_1.default.getByProduct(userId, productId);
        if (!existedLike) {
            throw new NotFoundError_1.default(likeService_1.default.getEntityName(), userId);
        }
        yield likeService_1.default.removeByProduct(userId, productId);
        res.status(204).send();
    });
}
