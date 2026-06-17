const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { protect } = require('../middleware/auth');

// @route   GET /api/posts
// @desc    Get all posts (with pagination)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const total = await Post.countDocuments();
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    res.json({
      success: true,
      count: posts.length,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        totalPosts: total
      },
      posts
    });
  } catch (error) {
    console.error('Fetch posts error:', error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @route   POST /api/posts
// @desc    Create a new post
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { text, image } = req.body;

    if (!text && !image) {
      return res.status(400).json({
        success: false,
        message: 'Please provide either text or an image for your post'
      });
    }

    const newPost = await Post.create({
      text,
      image,
      author: req.user._id,
      authorUsername: req.user.username,
      avatarColor: req.user.avatarColor
    });

    res.status(201).json({
      success: true,
      post: newPost
    });
  } catch (error) {
    console.error('Create post error:', error.message);
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
});

// @route   POST /api/posts/:id/like
// @desc    Toggle like/unlike on a post
// @access  Private
router.post('/:id/like', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.id || req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const username = req.user.username;

    // Check if the user has already liked this post
    const alreadyLikedIndex = post.likes.indexOf(username);

    if (alreadyLikedIndex !== -1) {
      // Unlike
      post.likes.splice(alreadyLikedIndex, 1);
    } else {
      // Like
      post.likes.push(username);
    }

    await post.save();

    res.json({
      success: true,
      likes: post.likes,
      post // Return the full updated post to allow instant updating
    });
  } catch (error) {
    console.error('Like toggle error:', error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @route   POST /api/posts/:id/comment
// @desc    Add a comment to a post
// @access  Private
router.post('/:id/comment', protect, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ success: false, message: 'Comment text cannot be empty' });
    }

    const post = await Post.findById(req.id || req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const newComment = {
      username: req.user.username,
      text: text.trim(),
      createdAt: new Date()
    };

    post.comments.push(newComment);
    await post.save();

    res.json({
      success: true,
      comments: post.comments,
      post // Return the full updated post to allow instant updating
    });
  } catch (error) {
    console.error('Add comment error:', error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;
