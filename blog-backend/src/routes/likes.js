const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');
const auth = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Likes
 *   description: Blog post likes
 */

/**
 * @swagger
 * /api/likes/{postId}:
 *   get:
 *     summary: Get like count and users for a post
 *     tags: [Likes]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID
 *     responses:
 *       200:
 *         description: Like info
 *   post:
 *     summary: Like or unlike a post (toggle)
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID
 *     responses:
 *       200:
 *         description: Like toggled
 *       401:
 *         description: Unauthorized
 */
router.get('/:postId', likeController.getLikesByPost);
router.post('/:postId', auth, likeController.toggleLike);

module.exports = router; 