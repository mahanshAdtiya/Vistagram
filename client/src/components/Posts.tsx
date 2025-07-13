import { useEffect} from 'react';
import {Post} from '@/components';
import { usePostStore } from '@/store/usePostStore';
import { postAPI } from '@/service/request';
import { toast } from 'sonner';

const Posts = () => {
  const { posts, setPosts } = usePostStore();

  useEffect(() => {
    const fetchFeedPosts = async () => {
      try {
        const res = await postAPI.getFeedPosts();
        if (res.data.success) {
          setPosts(res.data.posts);
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to load feed posts');
      }
    };

    fetchFeedPosts();
  }, []);


  if (posts.length === 0) return <p className="text-center mt-4">No posts found.</p>;

  return (
    <div className="flex flex-wrap gap-10 justify-between px-10">
      {posts.map(post => (
        <Post key={post._id} post={post} />
      ))}
    </div>
  );
};

export default Posts;