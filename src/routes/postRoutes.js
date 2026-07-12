const express = require('express');
const router = express.Router();
const {
  getAllPosts,
  searchPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
} = require('../controllers/postController');

router.get('/search', searchPosts);
router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.post('/', createPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

module.exports = router;
