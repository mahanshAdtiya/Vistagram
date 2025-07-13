import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash, MapPin } from 'lucide-react';
import { useSocketStore } from '@/store/useSocketStore';

import type { PostType } from '@/store/usePostStore';

interface Props {
  post: PostType;
  user: any;
  onDelete: () => void;
  onFollowToggle: () => void;
}

const PostHeader: React.FC<Props> = ({ post, user, onDelete, onFollowToggle }) => {
  const isOnline = useSocketStore((s) => s.isUserOnline(post.author._id));

  return (
    <div className="flex items-center justify-between flex-wrap gap-y-2">
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src={post.author.profilePicture} alt="author avatar" />
          <AvatarFallback>{post.author.username.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>

        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="font-bold text-indigo-500 text-lg flex items-center gap-1">
            {post.author.username}
            <span
              className={`h-2 w-2 rounded-full ${
                isOnline ? 'bg-green-500' : 'bg-gray-400'
              }`}
              title={isOnline ? 'Online' : 'Offline'}
            />
          </h1>

          {user?._id === post.author._id ? (
            <Badge className="bg-indigo-500 text-white text-[9px]">Author</Badge>
          ) : user ? (
            <Button
              onClick={onFollowToggle}
              variant="ghost"
              className={`text-xs px-2 h-6 rounded-full ${
                post.author.followers?.includes(user._id)
                  ? 'bg-red-100 text-red-600 hover:bg-red-200'
                  : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
              }`}
            >
              {post.author.followers?.includes(user._id) ? 'Unfollow' : 'Follow'}
            </Button>
          ) : null}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {post.locationText && post.locationUrl && (
          <a
            href={post.locationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-500 flex items-center gap-1 hover:underline"
          >
            <MapPin size={14} />
            {post.locationText}
          </a>
        )}
        {user?._id === post.author._id && (
          <Button
            onClick={onDelete}
            variant="ghost"
            className="flex items-center gap-1 bg-red-100 text-red-600 hover:bg-red-200 px-2 py-1 rounded-full text-sm"
          >
            <Trash size={14} />
            Delete
          </Button>
        )}
      </div>
    </div>
  );
};

export default PostHeader;
