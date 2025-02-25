import express from "express";
import asyncHandler from "../async-handler.js";
import { PrismaClient } from "@prisma/client";
import { assert } from "superstruct";
import {
  CreateArticle,
  CreateArticleComment,
  PatchArticle,
  PatchArticleComment,
} from "../structs.js";

const prisma = new PrismaClient();
const articleRouter = express.Router();

articleRouter
  .route("/comment/:id")
  .post(
    asyncHandler(async (req, res) => {
      assert(req.body, CreateArticleComment);
      const comment = await prisma.articleComment.create({
        data: req.body,
      });
      res.status(201).send(comment);
    })
  )
  .patch(
    asyncHandler(async (req, res) => {
      assert(req.body, PatchArticleComment);
      const { id } = req.params;
      const comment = await prisma.articleComment.update({
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
      await prisma.articleComment.delete({
        where: { id },
      });
      res.sendStatus(204);
    })
  );

articleRouter.route("/comment").get(
  asyncHandler(async (req, res) => {
    const { limit = 10, cursorId } = req.query;
    const comment = await prisma.articleComment.findMany({
      skip: cursorId ? 1 : 0,
      take: parseInt(limit),
      ...(cursorId && { cursor: { id: cursorId } }),
    });
    res.send(comment);
  })
);

articleRouter
  .route("/:id")
  .get(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const article = await prisma.article.findUniqueOrThrow({
        where: { id },
      });
      res.send(article);
    })
  )
  .patch(
    asyncHandler(async (req, res) => {
      assert(req.body, PatchArticle);
      const { id } = req.params;
      const article = await prisma.article.update({
        where: { id },
        data: req.body,
      });
      res.send(article);
    })
  )
  .delete(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      await prisma.article.delete({
        where: { id },
      });
      res.sendStatus(204);
    })
  );

articleRouter
  .route("/")
  .get(
    asyncHandler(async (req, res) => {
      const {
        offset = 0,
        limit = 10,
        order,
        title = "",
        content = "",
      } = req.query;
      const orderBy =
        order === "recent" ? { createdAt: "desc" } : { createdAt: "asc" };
      const where =
        title === "" && content === ""
          ? {}
          : {
              AND: [
                { title: { contains: title } },
                { content: { contains: content } },
              ],
            };
      const articles = await prisma.article.findMany({
        where,
        orderBy,
        skip: parseInt(offset),
        take: parseInt(limit),
      });
      res.send(users);
    })
  )
  .post(
    asyncHandler(async (req, res) => {
      assert(req.body, CreateArticle);
      const article = await prisma.article.create({
        data: req.body,
      });
      res.status(201).send(article);
    })
  );

export default articleRouter;
