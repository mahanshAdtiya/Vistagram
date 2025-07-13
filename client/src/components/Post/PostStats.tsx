import type { PostType } from '@/store/usePostStore';

interface Props {
  post: PostType;
  postLike: number;
  commentCount: number;
  onCommentClick: () => void;
}

const PostStats: React.FC<Props> = ({ post, postLike, commentCount, onCommentClick }) => {
  return (
    <>
      <span className="font-medium block mb-2">{postLike} likes</span>
      <p>
        <span className="font-medium mr-2">{post.author.username}</span>
        {post.caption}
      </p>

      {post.hashtags?.length > 0 && (
        <div className="text-blue-500 text-sm mt-1">
          {post.hashtags.map((tag, idx) => (
            <span key={idx} className="mr-2">#{tag}</span>
          ))}
        </div>
      )}

      {commentCount > 0 && (
        <span
          onClick={onCommentClick}
          className="cursor-pointer text-sm text-gray-400"
        >
          View all {commentCount} comments
        </span>
      )}
    </>
  );
};

export default PostStats;
