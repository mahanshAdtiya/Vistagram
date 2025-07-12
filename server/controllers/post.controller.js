import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import { extractHashtags } from "../utils/extractHashtags.js"; 

export const addNewPost = async (req, res) => {
    try {
        const { caption } = req.body;
        const image = req.file;
        const authorId = req.id;

        if (!image) return res.status(400).json({ message: 'Image is required', success: false });

        // Optimize and resize image
        const optimizedImageBuffer = await sharp(image.buffer)
            .resize({ width: 800, height: 800, fit: 'inside' })
            .toFormat('jpeg', { quality: 80 })
            .toBuffer();

        // Convert buffer to Data URI for Cloudinary upload
        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
        const cloudResponse = await cloudinary.uploader.upload(fileUri);

        // Extract hashtags from caption
        const hashtags = extractHashtags(caption);

        // Create new post
        const post = await Post.create({
            caption,
            image: cloudResponse.secure_url,
            author: authorId,
            hashtags
        });

        // Update user’s post list
        const user = await User.findById(authorId);
        if (user) {
            user.posts.push(post._id);
            await user.save();
        }

        // Populate author details
        await post.populate({ path: 'author', select: '-password' });

        return res.status(201).json({
            message: 'New post added successfully',
            post,
            success: true,
        });

    } catch (error) {
        console.error('Add Post Error:', error);
        return res.status(500).json({ message: 'Internal server error', success: false });
    }
};

export const getAllPost = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 })
            .populate({ path: 'author', select: 'username profilePicture' })
            .populate({
                path: 'comments',
                sort: { createdAt: -1 },
                populate: { path: 'author', select: 'username profilePicture' }
            });

        return res.status(200).json({ posts, success: true });

    } catch (error) {
        console.error('Get All Posts Error:', error);
        return res.status(500).json({ message: 'Internal server error', success: false });
    }
};

export const getUserPost = async (req, res) => {
    try {
        const authorId = req.id;
        const posts = await Post.find({ author: authorId }).sort({ createdAt: -1 })
            .populate({ path: 'author', select: 'username profilePicture' })
            .populate({
                path: 'comments',
                sort: { createdAt: -1 },
                populate: { path: 'author', select: 'username profilePicture' }
            });

        return res.status(200).json({ posts, success: true });

    } catch (error) {
        console.error('Get User Posts Error:', error);
        return res.status(500).json({ message: 'Internal server error', success: false });
    }
};

export const likePost = async (req, res) => {
    try {
        const userId = req.id;
        const postId = req.params.id;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found', success: false });

        await post.updateOne({ $addToSet: { likes: userId } });
        await post.save();

        // Real-time notification (via socket.io)
        const postOwnerId = post.author.toString();
        if (postOwnerId !== userId) {
            const user = await User.findById(userId).select('username profilePicture');
            const notification = {
                type: 'like',
                userId,
                userDetails: user,
                postId,
                message: 'Your post was liked'
            };

            const postOwnerSocketId = getReceiverSocketId(postOwnerId);
            io.to(postOwnerSocketId).emit('notification', notification);
        }

        return res.status(200).json({ message: 'Post liked successfully', success: true });

    } catch (error) {
        console.error('Like Post Error:', error);
        return res.status(500).json({ message: 'Internal server error', success: false });
    }
};

export const dislikePost = async (req, res) => {
    try {
        const userId = req.id;
        const postId = req.params.id;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found', success: false });

        await post.updateOne({ $pull: { likes: userId } });
        await post.save();

        // Real-time notification (optional)
        const postOwnerId = post.author.toString();
        if (postOwnerId !== userId) {
            const user = await User.findById(userId).select('username profilePicture');
            const notification = {
                type: 'dislike',
                userId,
                userDetails: user,
                postId,
                message: 'Your post was disliked'
            };

            const postOwnerSocketId = getReceiverSocketId(postOwnerId);
            io.to(postOwnerSocketId).emit('notification', notification);
        }

        return res.status(200).json({ message: 'Post disliked successfully', success: true });

    } catch (error) {
        console.error('Dislike Post Error:', error);
        return res.status(500).json({ message: 'Internal server error', success: false });
    }
};

export const addComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.id;
        const { text } = req.body;

        if (!text) return res.status(400).json({ message: 'Comment text is required', success: false });

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found', success: false });

        const comment = await Comment.create({
            text,
            author: userId,
            post: postId
        });

        await comment.populate({ path: 'author', select: 'username profilePicture' });

        post.comments.push(comment._id);
        await post.save();

        return res.status(201).json({ message: 'Comment added successfully', comment, success: true });

    } catch (error) {
        console.error('Add Comment Error:', error);
        return res.status(500).json({ message: 'Internal server error', success: false });
    }
};

export const getCommentsOfPost = async (req, res) => {
    try {
        const postId = req.params.id;

        const comments = await Comment.find({ post: postId }).populate('author', 'username profilePicture');

        return res.status(200).json({ success: true, comments });

    } catch (error) {
        console.error('Get Comments Error:', error);
        return res.status(500).json({ message: 'Internal server error', success: false });
    }
};

export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.id;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found', success: false });

        if (post.author.toString() !== userId)
            return res.status(403).json({ message: 'You are not authorized to delete this post', success: false });

        await Post.findByIdAndDelete(postId);
        await Comment.deleteMany({ post: postId });

        const user = await User.findById(userId);
        user.posts = user.posts.filter(id => id.toString() !== postId);
        await user.save();

        return res.status(200).json({ message: 'Post deleted successfully', success: true });

    } catch (error) {
        console.error('Delete Post Error:', error);
        return res.status(500).json({ message: 'Internal server error', success: false });
    }
};