import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/user.model.js';
import { Post } from '../models/post.model.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

const clearDatabase = async () => {
  try {
    const users = await User.deleteMany({});
    const posts = await Post.deleteMany({});
    console.log(`🧹 Deleted ${users.deletedCount} users`);
    console.log(`🧹 Deleted ${posts.deletedCount} posts`);
    console.log('✅ Database cleared!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to clear data:', err);
    process.exit(1);
  }
};

clearDatabase();
