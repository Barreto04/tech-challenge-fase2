const Post = require('../models/Post');

// GET /posts — lista todos os posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: posts.length, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /posts/search — busca por palavra-chave
const searchPosts = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ success: false, message: 'Parâmetro de busca "q" é obrigatório' });
    }
    const posts = await Post.find({
      $or: [
        { titulo: { $regex: q, $options: 'i' } },
        { conteudo: { $regex: q, $options: 'i' } }
      ]
    }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: posts.length, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /posts/:id — busca post por ID
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post não encontrado' });
    }
    res.status(200).json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /posts — cria novo post
const createPost = async (req, res) => {
  try {
    const { titulo, conteudo, autor } = req.body;
    const post = await Post.create({ titulo, conteudo, autor });
    res.status(201).json({ success: true, data: post });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /posts/:id — edita post existente
const updatePost = async (req, res) => {
  try {
    const { titulo, conteudo, autor } = req.body;
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { titulo, conteudo, autor },
      { new: true, runValidators: true }
    );
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post não encontrado' });
    }
    res.status(200).json({ success: true, data: post });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /posts/:id — exclui post
const deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post não encontrado' });
    }
    res.status(200).json({ success: true, message: 'Post excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllPosts, searchPosts, getPostById, createPost, updatePost, deletePost };
