import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { postAPI } from '@/service/request';
import type { PostType } from '@/store/usePostStore';
import Post from '@/components/Post/Post';
import { useAuthStore } from '@/store/useAuthStore';

export default function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState<PostType | null>(null);
  const { isHydrated } = useAuthStore();

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        const res = await postAPI.getSinglePost(id);
        if (res.data.success) {
          setPost(res.data.post);
        }
      } catch (err) {
        console.error('Failed to fetch post:', err);
      }
    };

    fetchPost();
  }, [id]);

  if (!isHydrated) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  if (!post) {
    return <div className="p-10 text-center">Loading post...</div>;
  }

  return (
    <div className="min-h-screen flex justify-center items-start p-4">
      <Post post={post} viewOnly/>
    </div>
  );
}
