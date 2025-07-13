import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import { extractHashtags } from "../utils/extractHashtags.js"; 
import { getReceiverSocketId, io } from "../socket/socket.js";


export const addNewPost = async (req, res) => {
  try {
   const { caption, locationText, locationUrl } = req.body;
    const image = req.file;
    const user = req.user;
    const authorId = user._id.toString();

    if (!image) {
      return res.status(400).json({ message: 'Image is required', success: false });
    }

    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: 'inside' })
      .toFormat('jpeg', { quality: 80 })
      .toBuffer();

    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
    const cloudResponse = await cloudinary.uploader.upload(fileUri);

    const hashtags = extractHashtags(caption);

   const post = await Post.create({
        caption,
        image: cloudResponse.secure_url,
        author: authorId,
        hashtags,
        locationText,
        locationUrl,
    });

    if (user) {
      user.posts.push(post._id);
      await user.save();
    }

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
    const {
      authorId, 
      sortLikes,
      hashtags,
      location,
      page,
      limit,
    } = req.query;

    const query = {};

    if (authorId) {
      const user = await User.findOne({ username: authorId }).select('_id');
      if (!user) {
        return res.status(404).json({ message: 'User not found', success: false });
      }
      query.author = user._id;
    }

    if (hashtags) {
      const hashtagArray = hashtags.split(',').map(tag => tag.trim().toLowerCase());
      query.hashtags = { $in: hashtagArray };
    }


    if (location) {
      query.locationText = { $regex: location, $options: 'i' };
    }

    const sortOptions =
      sortLikes === 'asc'
        ? { likesCount: 1 }
        : sortLikes === 'desc'
        ? { likesCount: -1 }
        : { createdAt: -1 };

    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);
    const skip = isNaN(parsedPage) || isNaN(parsedLimit) ? 0 : (parsedPage - 1) * parsedLimit;

    const aggregationPipeline = [
      { $match: query },
      {
        $addFields: {
          likesCount: { $size: '$likes' },
        },
      },
      { $sort: sortOptions },
    ];

    if (!isNaN(parsedPage) && !isNaN(parsedLimit)) {
      aggregationPipeline.push({ $skip: skip }, { $limit: parsedLimit });
    }

    const [posts, totalPosts] = await Promise.all([
      Post.aggregate(aggregationPipeline),
      Post.countDocuments(query),
    ]);

    const populatedPosts = await Post.populate(posts, [
      { path: 'author', select: 'username profilePicture followers' },
      {
        path: 'comments',
        options: { sort: { createdAt: -1 } },
        populate: { path: 'author', select: 'username profilePicture followers' },
      },
    ]);

    return res.status(200).json({
      posts: populatedPosts,
      totalPosts,
      success: true,
    });

  } catch (error) {
    console.error('Get All Posts Error:', error);
    return res.status(500).json({ message: 'Internal server error', success: false });
  }
};


export const getUserPost = async (req, res) => {
    try {
        const user = req.user;
        const authorId = user._id.toString();
        
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
        const user = req.user;
        const userId = user._id.toString();
        const postId = req.params.id;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: "Post not found", success: false });

        await post.updateOne({ $addToSet: { likes: userId } });
        await post.save();

        const postOwnerId = post.author.toString();
        if (postOwnerId !== userId) {
        const liker = await User.findById(userId).select("username profilePicture");
        const notification = {
            type: "like",
            userId,
            postId,
            userDetails: liker,
            message: "liked your post",
        };

        const receiverSocketId = getReceiverSocketId(postOwnerId);
        if (receiverSocketId) io.to(receiverSocketId).emit("receiveNotification", notification);
        }

        return res.status(200).json({ message: "Post liked", success: true });
    } catch (error) {
        console.error("Like Post Error:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

export const dislikePost = async (req, res) => {
    try {
        const user = req.user;
        const userId = user._id.toString();
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

            // const postOwnerSocketId = getReceiverSocketId(postOwnerId);
            // io.to(postOwnerSocketId).emit('notification', notification);
        }

        return res.status(200).json({ message: 'Post disliked successfully', success: true });

    } catch (error) {
        console.error('Dislike Post Error:', error);
        return res.status(500).json({ message: 'Internal server error', success: false });
    }
};

export const addComment = async (req, res) => {
  try {
    const { commentText } = req.body;
    const user = req.user;
    const userId = user._id.toString();
    const postId = req.params.id;

    if (!commentText) return res.status(400).json({ message: "Comment text is required", success: false });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found", success: false });

    const comment = await Comment.create({ text: commentText, author: userId, post: postId });
    await comment.populate({ path: "author", select: "username profilePicture" });

    post.comments.push(comment._id);
    await post.save();

    const postOwnerId = post.author.toString();
    if (postOwnerId !== userId) {
      const commenter = await User.findById(userId).select("username profilePicture");
      const notification = {
        type: "comment",
        userId,
        postId,
        userDetails: commenter,
        message: "commented on your post",
      };

      const receiverSocketId = getReceiverSocketId(postOwnerId);
      if (receiverSocketId) io.to(receiverSocketId).emit("receiveNotification", notification);
    }

    return res.status(201).json({ message: "Comment added", comment, success: true });
  } catch (error) {
    console.error("Add Comment Error:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
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
        const user = req.user;
        const userId = user._id.toString();

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found', success: false });

        if (post.author.toString() !== userId)
            return res.status(403).json({ message: 'You are not authorized to delete this post', success: false });

        await Post.findByIdAndDelete(postId);
        await Comment.deleteMany({ post: postId });

        user.posts = user.posts.filter(id => id.toString() !== postId);
        await user.save();

        return res.status(200).json({ message: 'Post deleted successfully', success: true });

    } catch (error) {
        console.error('Delete Post Error:', error);
        return res.status(500).json({ message: 'Internal server error', success: false });
    }
};

export const getFeedPosts = async (req, res) => {
  try {
    const currUser = req.user;
    const userId = currUser._id.toString();

    const user = await User.findById(userId).select('following');
    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false });
    }

    const authors = [...user.following.map(id => id.toString()), userId];

    const posts = await Post.find({ author: { $in: authors } })
      .sort({ createdAt: -1 })
      .populate({ path: 'author', select: 'username profilePicture followers' })
      .populate({
        path: 'comments',
        options: { sort: { createdAt: -1 } },
        populate: { path: 'author', select: 'username profilePicture followers' }
      });

    return res.status(200).json({ posts, success: true });

  } catch (error) {
    console.error('Get Feed Posts Error:', error);
    return res.status(500).json({ message: 'Internal server error', success: false });
  }
};

export const bookmarkPost = async (req,res) => {
    try {
        const postId = req.params.id;
        const user = req.user;
        const post = await Post.findById(postId);
        if(!post) return res.status(404).json({message:'Post not found', success:false});
        
        if(user.bookmarks.includes(post._id)){
            await user.updateOne({$pull:{bookmarks:post._id}});
            await user.save();
            return res.status(200).json({type:'unsaved', message:'Post removed from bookmark', success:true});

        }else{
            await user.updateOne({$addToSet:{bookmarks:post._id}});
            await user.save();
            return res.status(200).json({type:'saved', message:'Post bookmarked', success:true});
        }

    } catch (error) {
        console.log(error);
    }
}

export const getSinglePost = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await Post.findById(postId)
      .populate({ path: 'author', select: 'username profilePicture' })
      .populate({
        path: 'comments',
        options: { sort: { createdAt: -1 } },
        populate: { path: 'author', select: 'username profilePicture' }
      });

    if (!post) {
      return res.status(404).json({ message: 'Post not found', success: false });
    }

    return res.status(200).json({ post, success: true });
  } catch (error) {
    console.error('Get Single Post Error:', error);
    return res.status(500).json({ message: 'Internal server error', success: false });
  }
};