const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const Post = require('../models/Post');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Post.deleteMany();
});

describe('POST /posts', () => {
  it('deve criar um novo post', async () => {
    const res = await request(app).post('/posts').send({
      titulo: 'Título de Teste',
      conteudo: 'Conteúdo de teste',
      autor: 'Professor Teste'
    });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.titulo).toBe('Título de Teste');
  });

  it('deve retornar erro 400 se título estiver faltando', async () => {
    const res = await request(app).post('/posts').send({
      conteudo: 'Conteúdo sem título',
      autor: 'Professor'
    });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe('GET /posts', () => {
  it('deve retornar lista de posts', async () => {
    await Post.create({ titulo: 'Post 1', conteudo: 'Conteúdo 1', autor: 'Autor 1' });
    await Post.create({ titulo: 'Post 2', conteudo: 'Conteúdo 2', autor: 'Autor 2' });
    const res = await request(app).get('/posts');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBe(2);
  });

  it('deve retornar lista vazia quando não há posts', async () => {
    const res = await request(app).get('/posts');
    expect(res.status).toBe(200);
    expect(res.body.count).toBe(0);
  });
});

describe('GET /posts/:id', () => {
  it('deve retornar um post pelo ID', async () => {
    const post = await Post.create({ titulo: 'Post Teste', conteudo: 'Conteúdo', autor: 'Autor' });
    const res = await request(app).get(`/posts/${post._id}`);
    expect(res.status).toBe(200);
    expect(res.body.data.titulo).toBe('Post Teste');
  });

  it('deve retornar 404 para ID inexistente', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/posts/${fakeId}`);
    expect(res.status).toBe(404);
  });
});

describe('PUT /posts/:id', () => {
  it('deve atualizar um post existente', async () => {
    const post = await Post.create({ titulo: 'Título Original', conteudo: 'Conteúdo', autor: 'Autor' });
    const res = await request(app).put(`/posts/${post._id}`).send({ titulo: 'Título Atualizado', conteudo: 'Conteúdo', autor: 'Autor' });
    expect(res.status).toBe(200);
    expect(res.body.data.titulo).toBe('Título Atualizado');
  });

  it('deve retornar 404 para ID inexistente', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).put(`/posts/${fakeId}`).send({ titulo: 'Teste', conteudo: 'Teste', autor: 'Teste' });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /posts/:id', () => {
  it('deve excluir um post existente', async () => {
    const post = await Post.create({ titulo: 'Post para excluir', conteudo: 'Conteúdo', autor: 'Autor' });
    const res = await request(app).delete(`/posts/${post._id}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('deve retornar 404 para ID inexistente', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).delete(`/posts/${fakeId}`);
    expect(res.status).toBe(404);
  });
});

describe('GET /posts/search', () => {
  it('deve buscar posts por palavra-chave no título', async () => {
    await Post.create({ titulo: 'Matemática Básica', conteudo: 'Conteúdo', autor: 'Autor' });
    await Post.create({ titulo: 'História do Brasil', conteudo: 'Conteúdo', autor: 'Autor' });
    const res = await request(app).get('/posts/search?q=Matemática');
    expect(res.status).toBe(200);
    expect(res.body.count).toBe(1);
  });

  it('deve retornar 400 se parâmetro q estiver faltando', async () => {
    const res = await request(app).get('/posts/search');
    expect(res.status).toBe(400);
  });
});
