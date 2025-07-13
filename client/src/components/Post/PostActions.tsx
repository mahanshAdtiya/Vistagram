// components/Post/PostActions.tsx

import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { FiBookmark } from 'react-icons/fi';
import { BsBookmarkFill } from 'react-icons/bs';
import { MessageCircle } from 'lucide-react';
import SharePopover from '../SharePopover';
import type { PostType, CommentType } from '@/store/usePostStore';

interface Props {
  post: PostType;
  liked: boolean;
  bookmarked: boolean;
  onLike: () => void;
  onBookmark: () => void;
  onCommentClick: () => void;
  postLike: number;
  comment: CommentType[];
}

const PostActions: React.FC<Props> = ({
  post,
  liked,
  bookmarked,
  onLike,
  onBookmark,
  onCommentClick,
  postLike,
  comment
}) => {
  return (
    <div className="flex items-center justify-between my-2">
      <div className="flex items-center gap-3">
        {liked ? (
          <FaHeart onClick={onLike} size={24} className="cursor-pointer text-red-600" />
        ) : (
          <FaRegHeart onClick={onLike} size={22} className="cursor-pointer hover:text-gray-600" />
        )}
        <MessageCircle onClick={onCommentClick} className="cursor-pointer hover:text-gray-600" />
        <SharePopover post={post} postLike={postLike} comment={comment} />
      </div>

      {bookmarked ? (
        <BsBookmarkFill
          onClick={onBookmark}
          className="cursor-pointer text-red-600"
          size={20}
        />
      ) : (
        <FiBookmark
          onClick={onBookmark}
          className="cursor-pointer hover:text-gray-600"
          size={20}
        />
      )}
    </div>
  );
};

export default PostActions;
