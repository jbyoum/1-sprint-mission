import { NotificationType } from '@prisma/client';

interface User {
  id: number;
  email: string;
  nickname: string;
  password: string;
  image: string | null;
}

interface Article {
  id: number;
  title: string;
  content: string;
  image: string | null;
  userId: number;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  tags: string[];
  images: string[];
  userId: number;
}

interface Comment {
  id: number;
  content: string;
  articleId: number | null;
  productId: number | null;
  userId: number;
}

interface LikeArticle {
  userId: number;
  articleId: number;
}

interface LikeProduct {
  userId: number;
  productId: number;
}

interface Notification {
  id: number;
  type: NotificationType;
  read: boolean;
  payload: Record<string, number>;
  userId: number;
}

const mockUsers: User[] = [
  {
    id: 1,
    email: 'alice@example.com',
    nickname: 'Alice',
    password: '$2a$10$E4m0NYMYu9pVSf.Ppm/ejeuDvJSySzdOzWmO/EuKypdtudsfbmofu',
    image: null,
  },
  {
    id: 2,
    email: 'bob@example.com',
    nickname: 'Bob',
    password: '$2a$10$eJpjT2gRJWnWInHTccINsOjzn4xMlqXMAw/BEg1CMbOARSXkBqFpW',
    image: 'https://example.com/avatar.jpg',
  },
];

const mockArticles: Article[] = [
  {
    id: 1,
    title: 'First Article',
    content: 'This is the first article.',
    image: null,
    userId: 1,
  },
  {
    id: 2,
    title: 'Second Article',
    content: 'Another great article.',
    image: 'https://example.com/image.jpg',
    userId: 2,
  },
];

const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Gadget',
    description: 'A useful gadget.',
    price: 9900,
    tags: ['tech', 'gadget'],
    images: ['https://example.com/product.jpg'],
    userId: 1,
  },
];

const mockComments: Comment[] = [
  {
    id: 1,
    content: 'Nice article!',
    articleId: 1,
    productId: null,
    userId: 2,
  },
  {
    id: 2,
    content: 'I want to buy this.',
    articleId: null,
    productId: 1,
    userId: 1,
  },
];

const mockLikeArticles: LikeArticle[] = [
  {
    userId: 1,
    articleId: 2,
  },
];

const mockLikeProducts: LikeProduct[] = [
  {
    userId: 2,
    productId: 1,
  },
];

const mockNotifications: Notification[] = [
  {
    id: 1,
    type: NotificationType.NEW_COMMENT,
    read: false,
    payload: { articleId: 1, commentId: 1 },
    userId: 1,
  },
  {
    id: 2,
    type: NotificationType.PRICE_CHANGE,
    read: true,
    payload: { productId: 1 },
    userId: 2,
  },
];

export {
  mockUsers,
  mockArticles,
  mockProducts,
  mockComments,
  mockLikeArticles,
  mockLikeProducts,
  mockNotifications,
};
