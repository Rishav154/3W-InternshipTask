const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const PostSchema = new mongoose.Schema({
  text: {
    type: String,
    trim: true
  },
  image: {
    type: String // Can be Base64 string or image URL
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  authorUsername: {
    type: String,
    required: true
  },
  avatarColor: {
    type: String,
    default: '#3b82f6'
  },
  likes: [{
    type: String // Usernames of people who liked the post
  }],
  comments: [CommentSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Custom validation to ensure either text or image is provided
PostSchema.pre('validate', function() {
  if (!this.text && !this.image) {
    this.invalidate('text', 'A post must contain either text or an image.');
    this.invalidate('image', 'A post must contain either text or an image.');
  }
});

module.exports = mongoose.model('Post', PostSchema);
