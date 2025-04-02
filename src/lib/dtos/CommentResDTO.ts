export class CommentListWithCursorDTO {
  list!: {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    content: string;
    userId: number;
    articleId: number | null;
    productId: number | null;
  }[];
  nextCursor!: number | null;

  constructor(
    comments: {
      id: number;
      createdAt: Date;
      updatedAt: Date;
      content: string;
      userId: number;
      articleId: number | null;
      productId: number | null;
    }[],
    nextCursor: number | null,
  ) {
    this.list = comments;
    this.nextCursor = nextCursor;
  }
}
