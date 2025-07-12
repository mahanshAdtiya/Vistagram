import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from './ui/dialog';
import { MessageCircle, MoreHorizontal, Send } from 'lucide-react';
import { Button } from './ui/button';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import CommentDialog from './CommentDialog';
import { toast } from 'sonner';
import { Badge } from './ui/badge';
import { postAPI } from '@/service/request';
import { usePostStore } from '@/store/usePostStore';
import { useAuthStore } from '@/store/useAuthStore';
import type { PostType, CommentType } from '@/store/usePostStore';

interface PostProps {
  post: PostType;
}

const Post: React.FC<PostProps> = ({ post }) => {
  const [text, setText] = useState('');
  const [open, setOpen] = useState(false);
  const { user } = useAuthStore();
  const { posts, setPosts, setSelectedPost } = usePostStore();
  const [liked, setLiked] = useState(post.likes.includes(user?._id || ''));
  const [postLike, setPostLike] = useState(post.likes.length);
  const [comment, setComment] = useState<CommentType[]>(post.comments || []);

  const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value.trim());
  };

  const likeOrDislikeHandler = async () => {
    try {
      let res = liked
        ? await postAPI.dislikePost(post._id)
        : await postAPI.likePost(post._id);

      if (res.data.success) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes);
        setLiked(!liked);

        const updatedPostData = posts.map(p =>
          p._id === post._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter(id => id !== user?._id)
                  : [...p.likes, user!._id],
              }
            : p
        );

        setPosts(updatedPostData);
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update like status');
    }
  };

  const commentHandler = async () => {
    try {
      const res = await postAPI.addComment(post._id, { commentText: text });
      if (res.data.success) {
        const newComment: CommentType = res.data.comment;
        const updatedCommentData = [...comment, newComment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map(p =>
          p._id === post._id ? { ...p, comments: updatedCommentData } : p
        );
        setPosts(updatedPostData);
        toast.success(res.data.message);
        setText('');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to add comment');
    }
  };

  const deletePostHandler = async () => {
    try {
      const res = await postAPI.deletePost(post._id);
      if (res.data.success) {
        const updatedPostData = posts.filter(p => p._id !== post._id);
        setPosts(updatedPostData);
        toast.success(res.data.message);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  const openCommentDialog = () => {
    setSelectedPost(post);
    setOpen(true);
  };

  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={post.author.profilePicture} alt="post_image" />
            <AvatarFallback>
              {post.author.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-3">
            <h1 className="font-bold text-indigo-500 text-lg">
              {post.author.username}
            </h1>
            {user?._id === post.author._id && (
              <Badge
                className="bg-indigo-500 text-white text-[9px]"
                variant="secondary"
              >
                Author
              </Badge>
            )}
          </div>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center">
            <DialogTitle className="sr-only">Post Options</DialogTitle>
            {post.author._id !== user?._id && (
              <Button
                variant="ghost"
                className="cursor-pointer w-fit text-[#ED4956] font-bold"
              >
                Unfollow
              </Button>
            )}
            {user && user._id === post.author._id && (
              <Button
                onClick={deletePostHandler}
                variant="ghost"
                className="m-4 cursor-pointer w-full bg-[#ff828d] hover:bg-[#ED4956] font-bold rounded-lg"

              >
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <img
        className="rounded-sm my-2 w-full aspect-square object-cover"
        src={post.image}
        alt="post_img"
      />

      <div className="flex items-center justify-between my-2">
        <div className="flex items-center gap-3">
          {liked ? (
            <FaHeart
              onClick={likeOrDislikeHandler}
              size={24}
              className="cursor-pointer text-red-600"
            />
          ) : (
            <FaRegHeart
              onClick={likeOrDislikeHandler}
              size={22}
              className="cursor-pointer hover:text-gray-600"
            />
          )}
          <MessageCircle
            onClick={openCommentDialog}
            className="cursor-pointer hover:text-gray-600"
          />
          <Send className="cursor-pointer hover:text-gray-600" />
        </div>
      </div>

      <span className="font-medium block mb-2">{postLike} likes</span>
      <p>
        <span className="font-medium mr-2">{post.author.username}</span>
        {post.caption}
      </p>

      {comment.length > 0 && (
        <span
          onClick={openCommentDialog}
          className="cursor-pointer text-sm text-gray-400"
        >
          View all {comment.length} comments
        </span>
      )}

      <CommentDialog open={open} setOpen={setOpen} />

      <div className="flex items-center justify-between">
        <input
          type="text"
          placeholder="Add a comment..."
          value={text}
          onChange={changeEventHandler}
          className="outline-none text-sm w-full"
        />
        {text && (
          <span
            onClick={commentHandler}
            className="text-[#3BADF8] cursor-pointer"
          >
            Post
          </span>
        )}
      </div>
    </div>
  );
};

export default Post;
