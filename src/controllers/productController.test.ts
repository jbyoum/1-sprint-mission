import request from 'supertest';
import app from '../app';
import likeProductService from '../services/likeProductService';
import path from 'path';
const seedPath = path.resolve(__dirname, '../../prisma/seed');
const { seedDatabase } = require(seedPath);
const mockPath = path.resolve(__dirname, '../../prisma/mock');
const { mockProducts, mockUsers, mockComments } = require(mockPath);

// //@ts-ignore
// import { seedDatabase } from '../../prisma/seed';
// //@ts-ignore
// import { mockProducts } from '../../prisma/mock';
// //@ts-ignore
// import { mockUsers } from '../../prisma/mock';
// //@ts-ignore
// import { mockComments } from '../../prisma/mock';

import TestAgent from 'supertest/lib/agent';

beforeEach(async () => {
  await seedDatabase();
});

describe('ProductController Guest', () => {
  describe('GET /products', () => {
    it('should return a list of products with total count', async () => {
      const response = await request(app)
        .get('/products')
        .query({ page: '1', pageSize: '10', orderBy: 'recent', keyword: '' });

      expect(response.status).toBe(200);
      expect(response.body.totalCount).toBe(mockProducts.length);
      expect(response.body.list).toHaveLength(mockProducts.length);
      expect(response.body.list[0]).toHaveProperty('name', mockProducts[0].name);
    });

    it('should filter products by keyword', async () => {
      const filteredProducts = mockProducts.filter((product: { name: string }) =>
        product.name.toLowerCase().includes('gad'),
      );
      const response = await request(app)
        .get('/products')
        .query({ page: '1', pageSize: '10', orderBy: 'recent', keyword: 'gad' });

      expect(response.status).toBe(200);
      expect(response.body.totalCount).toBe(filteredProducts.length);
      expect(response.body.list).toHaveLength(filteredProducts.length);
      expect(response.body.list[0].name).toContain('Gad');
    });
  });

  describe('GET /products/:id', () => {
    it('should return product without like info if user is not logged in', async () => {
      const productId = mockProducts[0].id;
      const response = await request(app).get(`/products/${productId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', productId);
      expect(response.body).toHaveProperty('name', mockProducts[0].name);
      expect(response.body).not.toHaveProperty('isLiked');
    });

    it('should return 404 if product not found', async () => {
      const response = await request(app).get(`/products/999`);

      expect(response.status).toBe(404);
    });
  });
});

describe('ProductController Logined', () => {
  let agent: {
    post: (url: string) => request.Test;
    get: (url: string) => request.Test;
    delete: (url: string) => request.Test;
    patch: (url: string) => request.Test;
  };
  function authAgent(agent: TestAgent, token: string) {
    return {
      post: (url: string) => agent.post(url).set('Authorization', `Bearer ${token}`),
      get: (url: string) => agent.get(url).set('Authorization', `Bearer ${token}`),
      delete: (url: string) => agent.delete(url).set('Authorization', `Bearer ${token}`),
      patch: (url: string) => agent.patch(url).set('Authorization', `Bearer ${token}`),
    };
  }

  beforeAll(async () => {
    const agentWithToken = request.agent(app);
    const loginResponse = await agentWithToken
      .post('/users/login')
      .send({ email: mockUsers[0].email, password: 'hashedpassword1' });
    agent = authAgent(agentWithToken, loginResponse.body.accessToken);
  });

  describe('POST /products/', () => {
    it('should create product and return 201 with product data', async () => {
      const validBody = {
        name: '테스트 제목',
        description: '테스트 내용',
        tags: ['test', 'product'],
        images: [],
        price: 10000,
      };
      const response = await agent.post('/products').send(validBody);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('name', validBody.name);
      expect(response.body).toHaveProperty('description', validBody.description);
    });
  });

  describe('GET /products/:id', () => {
    it('should return product with like info if user is logged in', async () => {
      const productId = mockProducts[0].id;
      const response = await agent.get(`/products/${productId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', productId);
      expect(response.body).toHaveProperty('name', mockProducts[0].name);
      expect(response.body).toHaveProperty('isLiked', false);
    });

    it('should return 404 if product not found', async () => {
      const response = await request(app).get(`/products/999`);

      expect(response.status).toBe(404);
    });
  });

  describe('PATCH /products/:id', () => {
    it('should update product and return 200 with updated product data', async () => {
      const productId = mockProducts[0].id;
      const validBody = {
        name: '테스트 제목2',
        description: '테스트 내용2',
        price: 100,
      };
      const response = await agent.patch(`/products/${productId}`).send(validBody);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name', validBody.name);
      expect(response.body).toHaveProperty('description', validBody.description);
    });

    it('should return 404 if product not found', async () => {
      const response = await agent.patch(`/products/999`).send({ name: '새 제목' });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /products/:id', () => {
    it('should delete product and return 204', async () => {
      const productId = mockProducts[0].id;
      const response = await agent.delete(`/products/${productId}`);

      expect(response.status).toBe(204);
    });

    it('should return 404 if product not found', async () => {
      const response = await agent.delete(`/products/999`);

      expect(response.status).toBe(404);
    });
  });

  describe('POST /products/:id/comments', () => {
    it('should create comment and return 201 with comment data', async () => {
      const productId = mockProducts[0].id;
      const validBody = { content: '테스트 댓글' };
      const response = await agent.post(`/products/${productId}/comments`).send(validBody);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('content', validBody.content);
    });

    it('should return 404 if product not found', async () => {
      const response = await agent.post(`/products/999/comments`).send({ content: '댓글' });

      expect(response.status).toBe(404);
    });
  });

  describe('GET /products/:id/comments', () => {
    it('should return comments for product', async () => {
      const productId = mockProducts[0].id;
      const response = await agent
        .get(`/products/${productId}/comments`)
        .query({ limit: '10', orderBy: 'recent' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('list');
      expect(response.body.list).toHaveLength(1);
    });

    it('should filter comments by keyword', async () => {
      const productId = mockProducts[0].id;
      const filteredComments = mockComments.filter((comment: { content: string }) =>
        comment.content.toLowerCase().includes('nice'),
      );
      const response = await request(app)
        .get(`/products/${productId}/comments`)
        .query({ limit: '10', orderBy: 'recent', keyword: 'nice' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('list');
      expect(response.body.list).toHaveLength(1);
    });

    it('should return 404 if product not found', async () => {
      const response = await agent.get(`/products/999/comments`);

      expect(response.status).toBe(404);
    });
  });

  describe('GET /products/:id/like', () => {
    it('should like product and return 200 with like info', async () => {
      const productId = mockProducts[0].id;
      const response = await agent.get(`/products/${productId}/like`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('userId', mockUsers[0].id);
      expect(response.body).toHaveProperty('productId', productId);
    });

    it('should return 422 if product already liked', async () => {
      const productId = mockProducts[0].id;
      await likeProductService.create({ userId: mockUsers[0].id, productId });
      const response = await agent.get(`/products/${productId}/like`);

      expect(response.status).toBe(422);
    });

    it('should return 404 if product not found', async () => {
      const response = await agent.get(`/products/999/like`);

      expect(response.status).toBe(404);
    });
  });

  describe('GET /products/:id/dislike', () => {
    it('should dislike product and return 204 with like info', async () => {
      const productId = mockProducts[0].id;
      await likeProductService.create({ userId: mockUsers[0].id, productId });
      const response = await agent.get(`/products/${productId}/dislike`);

      expect(response.status).toBe(204);
    });

    it('should return 404 if product not liked', async () => {
      const productId = mockProducts[0].id;
      const response = await agent.get(`/products/${productId}/dislike`);

      expect(response.status).toBe(404);
    });

    it('should return 404 if product not found', async () => {
      const response = await agent.get(`/products/999/dislike`);

      expect(response.status).toBe(404);
    });
  });
});
