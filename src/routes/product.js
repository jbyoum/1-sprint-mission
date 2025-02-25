import express from "express";
import asyncHandler from "../async-handler.js";
import { PrismaClient } from "@prisma/client";
import { assert } from "superstruct";
import {
  CreateProductComment,
  CreateProduct,
  PatchProductComment,
  PatchProduct,
} from "../structs.js";

const prisma = new PrismaClient();
const productRouter = express.Router();

productRouter.route("/comments").get(
  asyncHandler(async (req, res) => {
    const { limit = 10, cursorId } = req.query;
    const comments = await prisma.productComment.findMany({
      skip: cursorId ? 1 : 0,
      take: parseInt(limit),
      ...(cursorId && { cursor: { id: cursorId } }),
    });
    res.send(comments);
  })
);

productRouter
  .route("/comment/:id")
  .post(
    asyncHandler(async (req, res) => {
      assert(req.body, CreateProductComment);
      const { id } = req.params;
      const comment = await prisma.productComment.create({
        data: {
          content: req.body.content,
          productId: id,
        },
      });
      res.status(201).send(comment);
    })
  )
  .patch(
    asyncHandler(async (req, res) => {
      assert(req.body, PatchProductComment);
      const { id } = req.params;
      const comment = await prisma.productComment.update({
        where: { id },
        data: {
          content: req.body.content,
        },
      });
      res.send(comment);
    })
  )
  .delete(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      await prisma.productComment.delete({
        where: { id },
      });
      res.sendStatus(204);
    })
  );

productRouter
  .route("/:id")
  .get(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const product = await prisma.product.findUnique({
        where: { id },
      });
      res.send(product);
    })
  )
  .patch(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      assert(req.body, PatchProduct);
      const product = await prisma.product.update({
        where: { id },
        data: req.body,
      });
      res.send(product);
    })
  )
  .delete(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      await prisma.product.delete({
        where: { id },
      });
      res.sendStatus(204);
    })
  );

productRouter
  .route("/")
  .get(
    asyncHandler(async (req, res) => {
      const {
        offset = 0,
        limit = 10,
        order,
        name = "",
        description = "",
      } = req.query;
      const orderBy =
        order === "recent" ? { createdAt: "desc" } : { createdAt: "asc" };
      const where =
        name === "" && description === ""
          ? {}
          : {
              AND: [
                { name: { contains: name } },
                { description: { contains: description } },
              ],
            };
      const products = await prisma.product.findMany({
        where,
        orderBy,
        skip: parseInt(offset),
        take: parseInt(limit),
      });
      res.send(products);
    })
  )
  .post(
    asyncHandler(async (req, res) => {
      assert(req.body, CreateProduct);
      const product = await prisma.product.create({
        data: req.body,
      });
      res.status(201).send(product);
    })
  );

export default productRouter;
