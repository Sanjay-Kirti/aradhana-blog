const Like = require('../models/Like');
const User = require('../models/User');

exports.toggleLike = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;
    const existing = await Like.findOne({ user: userId, post: postId });
    if (existing) {
      await existing.deleteOne();
      return res.json({ liked: false, message: 'Post unliked' });
    } else {
      await Like.create({ user: userId, post: postId });
      return res.json({ liked: true, message: 'Post liked' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getLikesByPost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const likes = await Like.find({ post: postId }).populate('user', 'username email');
    res.json({ count: likes.length, users: likes.map(l => l.user) });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 