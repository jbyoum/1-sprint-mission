const { NotificationType } = require('@prisma/client');

const mockUsers = [
  {
    id: 1,
    email: 'alice@example.com',
    nickname: 'Alice',
    password: '$2a$10$E4m0NYMYu9pVSf.Ppm/ejeuDvJSySzdOzWmO/EuKypdtudsfbmofu', //hashedpassword1
    image: null,
  },
  {
    id: 2,
    email: 'bob@example.com',
    nickname: 'Bob',
    password: '$2a$10$eJpjT2gRJWnWInHTccINsOjzn4xMlqXMAw/BEg1CMbOARSXkBqFpW', //hashedpassword2
    image: 'https://example.com/avatar.jpg',
  },
];

const mockArticles = [
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

const mockProducts = [
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

const mockComments = [
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

const mockLikeArticles = [
  {
    userId: 1,
    articleId: 2,
  },
];

const mockLikeProducts = [
  {
    userId: 2,
    productId: 1,
  },
];

const mockNotifications = [
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

module.exports = {
  mockUsers,
  mockArticles,
  mockProducts,
  mockComments,
  mockLikeArticles,
  mockLikeProducts,
  mockNotifications,
};
