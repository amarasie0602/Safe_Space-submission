const express = require('express');
const { protect, staffOnly, requireActiveUser } = require('../middleware/authMiddleware');
const { contentLimiter, postCooldown } = require('../middleware/rateLimiters');
const {
  createPost,
  getPosts,
  adminGetPosts,
  updatePostStatus,
  adminDeletePost,
  toggleReaction,
  getCategoryCounts,
} = require('../controllers/postController');

const router = express.Router();

router.post('/posts', protect, requireActiveUser, contentLimiter, postCooldown, createPost);
router.get('/posts', getPosts);
router.get('/posts/category-counts', getCategoryCounts);
router.get('/admin/posts', protect, staffOnly, adminGetPosts);
router.patch('/admin/posts/:id/status', protect, staffOnly, updatePostStatus);
router.delete('/admin/posts/:id', protect, staffOnly, adminDeletePost);
router.patch('/posts/:id/react', protect, requireActiveUser, toggleReaction);

module.exports = router;
