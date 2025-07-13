import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import SuggestedUsers from '@/components/SuggestedUsers';

const RightSidebar: React.FC = () => {
  const user = useAuthStore((state) => state.user);

  if (!user) return null;

  return (
    <div className="w-fit my-10 pr-32">
      <div className="flex items-center gap-2">
        <Link to={`/account/${user._id}`}>
          <Avatar>
            <AvatarImage src={user.profilePicture || ''} alt="User Avatar" />
            <AvatarFallback>
              {user.username?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div>
          <h1 className="font-semibold text-sm">
            <Link to={`/account/${user._id}`}>{user.username}</Link>
          </h1>
          <span className="text-gray-600 text-sm">{user.bio || 'Bio here...'}</span>
        </div>
      </div>

      <SuggestedUsers />
    </div>
  );
};

export default RightSidebar;
