import * as s from "superstruct";
import isUuid from "is-uuid";
const Uuid = s.define("Uuid", (value) => isUuid.v4(value));

export const CreateProduct = s.object({
  name: s.size(s.string(), 1, 100),
  description: s.optional(s.string(), 0, 1000),
  price: s.min(s.number(), 0),
  tag: s.optional(s.string(), 0, 100),
});
export const PatchProduct = s.partial(CreateProduct);

export const CreateArticle = s.object({
  title: s.size(s.string(), 1, 100),
  content: s.size(s.string(), 1, 10000),
});
export const PatchArticle = s.partial(CreateArticle);

export const CreateProductComment = s.object({
  content: s.size(s.string(), 1, 100),
  productId: s.optional(Uuid),
});
export const PatchProductComment = s.partial(CreateProductComment);

export const CreateArticleComment = s.object({
  content: s.size(s.string(), 1, 100),
  articleId: s.optional(Uuid),
});
export const PatchArticleComment = s.partial(CreateArticleComment);
