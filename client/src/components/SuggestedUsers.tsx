import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { userAPI } from '@/service/request';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useAuthStore';
import { usePostStore } from '@/store/usePostStore';

interface SuggestedUser {
  _id: string;
  username: string;
  profilePicture?: string;
  bio?: string;
  followers: string[];
  isFollowing?: boolean;
}

const SuggestedUsers: React.FC = () => {
  const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>([]);
  const { user } = useAuthStore(); 
    const { triggerRefetch} = usePostStore();
  

  useEffect(() => {
    const fetchSuggested = async () => {
      try {
        const res = await userAPI.getSuggestedUsers();
        const users: SuggestedUser[] = res.data?.users || [];

        const updatedUsers = users.map((u) => ({
          ...u,
          isFollowing: u.followers.includes(user?._id || ''),
        }));

        setSuggestedUsers(updatedUsers);
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to fetch suggestions');
      }
    };

    if (user?._id) {
      fetchSuggested();
    }
  }, [user?._id]);

const handleFollowToggle = async (targetUserId: string) => {
  try {
    await userAPI.followOrUnfollow(targetUserId);
     triggerRefetch()

    setSuggestedUsers((prev) =>
      prev.map((u) =>
        u._id === targetUserId
          ? {
              ...u,
              isFollowing: !u.isFollowing,
              followers: u.isFollowing
                ? u.followers.filter((id) => id !== user?._id)
                : [...u.followers, user?._id || ''],
            }
          : u
      )
    );

    // ✅ Show success toast
    const toggledUser = suggestedUsers.find((u) => u._id === targetUserId);
    toast.success(
      toggledUser?.isFollowing ? 'Unfollowed successfully' : 'Followed successfully'
    );
  } catch (err: any) {
    toast.error(err.response?.data?.message || 'Follow/unfollow failed');
  }
};


  return (
    <div className="my-10">
      <div className="flex items-center justify-between text-sm">
        <h1 className="font-semibold text-gray-600">Suggested for you</h1>
        <span className="font-medium cursor-pointer">See All</span>
      </div>

      {suggestedUsers.map((user) => (
        <div key={user._id} className="flex items-center justify-between my-5">
          <div className="flex items-center gap-2">
            <Link to={`/account/${user._id}`}>
              <Avatar>
                <AvatarImage src={user.profilePicture} alt={user.username} />
                <AvatarFallback>
                  {user.username?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <h1 className="font-semibold text-sm">
                <Link to={`/account/${user._id}`}>{user.username}</Link>
              </h1>
              <span className="text-gray-600 text-sm">
                {user.bio || 'Bio here...'}
              </span>
            </div>
          </div>

          <button
            onClick={() => handleFollowToggle(user._id)}
            className={`text-xs font-bold cursor-pointer transition-all ${
              user.isFollowing
                ? 'text-gray-500 hover:text-gray-600'
                : 'text-[#3BADF8] hover:text-[#3495d6]'
            }`}
          >
            {user.isFollowing ? 'Unfollow' : 'Follow'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default SuggestedUsers;
