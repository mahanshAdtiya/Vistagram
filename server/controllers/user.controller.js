import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields (username, email, password) are required.",
            });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
        return res.status(409).json({
            success: false,
            message: "Email already in use. Please use a different one.",
        });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            username,
            email,
            password: hashedPassword
        });
        return res.status(201).json({
            message: "Account created successfully.",
            success: true,
        });
    } catch (error) {
        console.log(error);
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                message: "Something is missing, please check!",
                success: false,
            });
        }
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false,
            });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false,
            });
        };

        const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });

        const populatedPosts = (
            await Promise.all(
                user.posts.map(async (postId) => {
                    const post = await Post.findById(postId);
                    if (post && post.author && post.author.equals(user._id)) {
                        return post;
                    }
                    return null;
                })
            )
        ).filter(Boolean);

        user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            posts: populatedPosts
        }
        return res.cookie('token', token, {httpOnly: true,sameSite: 'lax',secure: false,maxAge: 1 * 24 * 60 * 60 * 1000}).json({
            message: `Welcome back ${user.username}`,
            success: true,
            user
        });

    } catch (error) {
        console.log(error);
    }
};

export const logout = async (_, res) => {
    try {
        return res.cookie("token", "", { maxAge: 0 }).json({
            message: 'Logged out successfully.',
            success: true
        });
    } catch (error) {
        console.log(error);
    }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    let user = await User.findById(userId)
      .populate({ path: 'posts', options: { sort: { createdAt: -1 } } })
      .populate('bookmarks');

    return res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const editProfile = async (req, res) => {
  try {
    const user = req.user;
    const { username, email, bio } = req.body;
    const profilePicture = req.file;
    let cloudResponse;

    if (profilePicture) {
      const fileUri = getDataUri(profilePicture);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (bio) user.bio = bio;
    if (profilePicture) user.profilePicture = cloudResponse.secure_url;

    await user.save();

    return res.status(200).json({
      message: 'Profile updated.',
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Profile update failed',
    });
  }
};

export const followOrUnfollow = async (req, res) => {
    try {
       const currentUser = req.user;
       const currentUserId = currentUser._id.toString();
        const targetUserId = req.params.id;

        if (currentUserId === targetUserId) {
            return res.status(400).json({
                message: 'You cannot follow or unfollow yourself.',
                success: false
            });
        }

        const targetUser = await User.findById(targetUserId);

        if (!currentUser || !targetUser) {
            return res.status(404).json({
                message: 'User not found.',
                success: false
            });
        }

        const alreadyFollowing = currentUser.following.includes(targetUserId);

        if (alreadyFollowing) {
            await Promise.all([
                User.updateOne({ _id: currentUserId }, { $pull: { following: targetUserId } }),
                User.updateOne({ _id: targetUserId }, { $pull: { followers: currentUserId } }),
            ]);
            return res.status(200).json({
                message: 'Unfollowed user successfully.',
                success: true
            });
        } else {
            await Promise.all([
                User.updateOne({ _id: currentUserId }, { $push: { following: targetUserId } }),
                User.updateOne({ _id: targetUserId }, { $push: { followers: currentUserId } }),
            ]);
            return res.status(200).json({
                message: 'Followed user successfully.',
                success: true
            });
        }
    } catch (error) {
        console.error('Follow/unfollow error:', error);
        return res.status(500).json({
            message: 'An error occurred while processing your request.',
            success: false
        });
    }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const currUser = req.user;
    const currentUserId = currUser._id.toString();

    const currentUser = await User.findById(currentUserId).select('following');

    if (!currentUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const followingList = currentUser.following;

    let suggestedUserIdsSet = new Set();

    if (followingList.length > 0) {
      const secondDegreeUsers = await User.find({
        _id: { $in: followingList }
      }).select('followers following');

      for (const user of secondDegreeUsers) {
        user.followers.forEach(f => suggestedUserIdsSet.add(f.toString()));
        user.following.forEach(f => suggestedUserIdsSet.add(f.toString()));
      }

      // Remove current user and already-followed users
      suggestedUserIdsSet.delete(currentUserId);
      followingList.forEach(id => suggestedUserIdsSet.delete(id.toString()));
    }

    let suggestedUsers = [];

    if (suggestedUserIdsSet.size > 0) {
      const suggestedUserIds = Array.from(suggestedUserIdsSet);

      suggestedUsers = await User.aggregate([
        { $match: { _id: { $in: suggestedUserIds.map(id => new mongoose.Types.ObjectId(id)) } } },
        { $sample: { size: 10 } }, // Randomize
        { $project: { password: 0 } }
      ]);
    }

    // 🔁 Fallback: show random users if none found
    if (suggestedUsers.length === 0) {
      suggestedUsers = await User.aggregate([
        { $match: { _id: { $ne: new mongoose.Types.ObjectId(currentUserId) } } },
        { $sample: { size: 10 } },
        { $project: { password: 0 } }
      ]);
    }

    return res.status(200).json({
      success: true,
      users: suggestedUsers
    });
  } catch (error) {
    console.error('Suggestion Error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

