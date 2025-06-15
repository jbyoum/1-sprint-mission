import request from 'supertest';
import app from '../app';
import path from 'path';
const seedPath = path.resolve(__dirname, '../../prisma/seed');
const { seedDatabase } = require(seedPath);
const mockPath = path.resolve(__dirname, '../../prisma/mock');
const { mockUsers } = require(mockPath);

// //@ts-ignore
// import { seedDatabase } from '../../prisma/seed';
// //@ts-ignore
// import { mockUsers } from '../../prisma/mock';

import TestAgent from 'supertest/lib/agent';

beforeEach(async () => {
  await seedDatabase();
});

describe('UserController Guest', () => {
  describe('POST /users/signup', () => {
    it('should validate body and return 201 with user', async () => {
      const newUser = { email: 'email@example.com', nickname: 'John', password: 'hashedpassword' };
      const response = await request(app).post('/users/signup').send(newUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('email', newUser.email);
      expect(response.body).toHaveProperty('nickname', newUser.nickname);
    });

    it('should return 422 if email already exists', async () => {
      const existingUser = mockUsers[0];
      const response = await request(app)
        .post('/users/signup')
        .send({ email: existingUser.email, nickname: 'NewUser', password: 'hashedpassword' });

      expect(response.status).toBe(422);
    });
  });

  describe('POST /users/login', () => {
    it('should set refresh token cookie and respond with accessToken', async () => {
      const response = await request(app)
        .post('/users/login')
        .send({ email: mockUsers[0].email, password: 'hashedpassword1' });

      expect(response.status).toBe(200);
      expect(response.headers['set-cookie']).toBeDefined();
      expect(response.headers['set-cookie'][0]).toMatch(/refreshToken=/);
      expect(response.body.accessToken).toBeDefined();
    });
  });
});

describe('UserController Logined', () => {
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

  describe('POST /users/token/refresh', () => {
    it('should refresh access token and set new refresh token cookie', async () => {
      const response = await agent.post('/users/token/refresh');

      expect(response.status).toBe(200);
      expect(response.headers['set-cookie']).toBeDefined();
      expect(response.headers['set-cookie'][0]).toMatch(/refreshToken=/);
      expect(response.body.accessToken).toBeDefined();
    });
  });

  describe('GET /users/info', () => {
    it('should return user info', async () => {
      const response = await agent.get('/users/info');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('email', mockUsers[0].email);
      expect(response.body).toHaveProperty('nickname', mockUsers[0].nickname);
    });
  });

  describe('PATCH /users/info', () => {
    it('should update user info and return updated user', async () => {
      const validBody = { nickname: 'UpdatedNickname' };
      const response = await agent.patch('/users/info').send(validBody);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('nickname', validBody.nickname);
    });
  });

  describe('PATCH /users/password', () => {
    it('should update user password and return updated user', async () => {
      const validBody = { password: 'newhashedpassword' };
      const response = await agent.patch('/users/password').send(validBody);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('email', mockUsers[0].email);
    });
  });

  describe('GET /users/notifications', () => {
    it('should return user notifications', async () => {
      const response = await agent.get('/users/notifications');

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });
});
