import React, { useState } from 'react';
import {useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { usePostStore } from '@/store/usePostStore';
import { toast } from 'sonner';
import { showLoginPrompt } from '@/components';
import { postAPI, userAPI } from '@/service/request';

import PostHeader from './PostHeader';
import PostImage from './PostImage';
import PostActions from './PostActions';
import PostStats from './PostStats';
import PostCommentInput from './PostCommentInput';
import CommentDialog from '@/components/CommentDialog';

import type { PostType, CommentType } from '@/store/usePostStore';

interface PostProps {
  post: PostType;
  viewOnly?: boolean;
}

const Post: React.FC<PostProps> = ({ post, viewOnly = false }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { posts, setPosts, setSelectedPost } = usePostStore();

  const [text, setText] = useState('');
  const [open, setOpen] = useState(false);
  const [liked, setLiked] = useState(post.likes.includes(user?._id || ''));
  const [postLike, setPostLike] = useState(post.likes.length);
  const [comment, setComment] = useState<CommentType[]>(post.comments || []);
  const [bookmarked, setBookmarked] = useState(
    user?.bookmarks?.some((b: any) => b === post._id) || false
  );

  const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (viewOnly || !user) return showLoginPrompt(toast, navigate);
    setText(e.target.value);
  };

  const likeOrDislikeHandler = async () => {
    if (viewOnly || !user) return showLoginPrompt(toast, navigate);
    try {
      const res = liked ? await postAPI.dislikePost(post._id) : await postAPI.likePost(post._id);
      if (res.data.success) {
        setLiked(!liked);
        setPostLike(liked ? postLike - 1 : postLike + 1);
        const updated = posts.map(p =>
          p._id === post._id
            ? { ...p, likes: liked ? p.likes.filter(id => id !== user!._id) : [...p.likes, user!._id] }
            : p
        );
        setPosts(updated);
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update like status');
    }
  };

  const commentHandler = async () => {
    if (viewOnly || !user) return showLoginPrompt(toast, navigate);
    try {
      const res = await postAPI.addComment(post._id, { commentText: text });
      if (res.data.success) {
        const newComment: CommentType = res.data.comment;
        const updatedComments = [...comment, newComment];
        setComment(updatedComments);
        setText('');
        setPosts(posts.map(p => p._id === post._id ? { ...p, comments: updatedComments } : p));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to add comment');
    }
  };

  const deletePostHandler = async () => {
    if (viewOnly || !user) return showLoginPrompt(toast, navigate);
    try {
      const res = await postAPI.deletePost(post._id);
      if (res.data.success) {
        setPosts(posts.filter(p => p._id !== post._id));
        toast.success(res.data.message);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  const bookmarkHandler = async () => {
    if (viewOnly || !user) return showLoginPrompt(toast, navigate);
    try {
      const res = await postAPI.bookmarkPost(post._id);
      if (res.data.success) {
        setBookmarked(!bookmarked);
        toast.success(res.data.message);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Bookmark failed');
    }
  };

  const followOrUnfollowHandler = async () => {
    if (!user) return showLoginPrompt(toast, navigate);
    try {
      const res = await userAPI.followOrUnfollow(post.author._id);
      if (res.data.success) toast.success(res.data.message);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Follow/unfollow failed');
    }
  };

  const openCommentDialog = () => {
    setSelectedPost(post);
    setOpen(true);
  };

  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      <PostHeader
        post={post}
        user={user}
        onDelete={deletePostHandler}
        onFollowToggle={followOrUnfollowHandler}
      />
      <PostImage postId={post._id} image={post.image} />
      <PostActions
        post={post}
        liked={liked}
        onLike={likeOrDislikeHandler}
        onBookmark={bookmarkHandler}
        onCommentClick={openCommentDialog}
        bookmarked={bookmarked}
        postLike={postLike}
        comment={comment}
      />
      <PostStats post={post} postLike={postLike} commentCount={comment.length} onCommentClick={openCommentDialog} />
      <CommentDialog open={open} setOpen={setOpen} />
      <PostCommentInput
        text={text}
        onChange={changeEventHandler}
        onPost={commentHandler}
      />
    </div>
  );
};

export default Post;
