import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import Comment from './Comment';
import { toast } from 'sonner';
import { usePostStore, type CommentType } from '@/store/usePostStore';
import { postAPI } from '@/service/request';

interface CommentDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const CommentDialog: React.FC<CommentDialogProps> = ({ open, setOpen }) => {
  const [text, setText] = useState('');
  const [comment, setComment] = useState<CommentType[]>([]);
  const { selectedPost, posts, setPosts } = usePostStore();

  useEffect(() => {
    if (selectedPost) {
      setComment(selectedPost.comments || []);
    }
  }, [selectedPost]);

  const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const sendMessageHandler = async () => {
    if (!selectedPost || !text.trim()) return;

    try {
      const res = await postAPI.addComment(selectedPost._id, { commentText: text });

      if (res.data.success) {
        const newComment: CommentType = res.data.comment;
        const updatedComments = [...comment, newComment];
        setComment(updatedComments);

        const updatedPosts = posts.map(p =>
          p._id === selectedPost._id
            ? { ...p, comments: updatedComments }
            : p
        );
        setPosts(updatedPosts);

        toast.success(res.data.message || 'Comment added');
        setText('');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to add comment');
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="max-w-5xl p-0 flex flex-col"
      >
        <DialogTitle className="sr-only">Post Comments Dialog</DialogTitle>

        <div className="flex flex-1">
          <div className="w-1/2">
            <img
              src={selectedPost?.image}
              alt="post_img"
              className="w-full h-full object-cover rounded-l-lg"
            />
          </div>

          <div className="w-1/2 flex flex-col justify-between">
            {/* Author Info */}
            <div className="flex items-center justify-between p-4">
              <div className="flex gap-3 items-center">
                <Link to={`/user/${selectedPost?.author._id}`}>
                  <Avatar>
                    <AvatarImage src={selectedPost?.author?.profilePicture} />
                    <AvatarFallback>
                      {selectedPost?.author?.username?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link
                    to={`/user/${selectedPost?.author._id}`}
                    className="font-semibold text-xs"
                  >
                    {selectedPost?.author?.username}
                  </Link>
                </div>
              </div>
            </div>

            <hr />

            {/* Comment List */}
            <div className="flex-1 overflow-y-auto max-h-96 p-4">
              {comment.filter(Boolean).map(cmt => (
                <Comment key={cmt._id} comment={cmt} />
              ))}
            </div>

            {/* Input Box */}
            <div className="p-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={text}
                  onChange={changeEventHandler}
                  placeholder="Add a comment..."
                  className="w-full outline-none border text-sm border-gray-300 p-2 rounded"
                />
                <Button
                  disabled={!text.trim()}
                  onClick={sendMessageHandler}
                  variant="outline"
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
