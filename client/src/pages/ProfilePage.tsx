import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AtSign, Heart, MessageCircle } from "lucide-react";
import { useAuthStore, type AuthUser} from "@/store/useAuthStore";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';



const Profile: React.FC = () => {
  const { id: userId } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<"posts" | "saved">("posts");
  const [userProfile, setUserProfile] = useState<AuthUser | null>(null);

  const { user, getUserProfile} = useAuthStore();

  const isLoggedInUserProfile = user?._id === userProfile?._id;
  const isFollowing = !!userProfile?.followers?.includes(user?._id || "");


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getUserProfile(userId!);
        console.log("HAHA | FETCHED USER: ", profile)
        setUserProfile(profile);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };
    if (userId) fetchProfile();
  }, [userId]);

  const displayedPosts = activeTab === "posts"
    ? userProfile?.posts ?? []
    : userProfile?.bookmarks ?? [];


  return (
    <div className="flex max-w-5xl justify-center pl-10">
      <div className="flex flex-col gap-20 p-8">
        <div className="grid grid-cols-2">
          <section className="flex items-center justify-center">
            <Avatar className="h-32 w-32">
              <AvatarImage
                src={userProfile?.profilePicture}
                alt="profilephoto"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg">
                  {userProfile?.username}
                </span>
                {isLoggedInUserProfile ? (
                  <>
                    <Link to="/account/edit">
                      <Button
                        variant="secondary"
                        className="h-5 cursor-pointer bg-[#212328] text-white text-xs hover:bg-[#2c2e33] transition-colors duration-200"
                      >
                        Edit profile
                      </Button>
                    </Link>
                  </>
                ) : isFollowing ? (
                  <>
                    <Button
                      variant="secondary"
                      className="h-5 cursor-pointer bg-[#212328] text-white text-xs hover:bg-[#2c2e33] transition-colors duration-200"
                    >
                      Unfollow
                    </Button>
                  </>
                ) : (
                  <Button
                    className="h-8 cursor-pointer bg-[#0095F6] hover:bg-[#007dd1] text-white text-sm transition-colors duration-200"
                  >
                    Follow
                  </Button>
                )}

              </div>

              <div className="flex items-center gap-4 text-sm">
                <p>
                  <span className="font-semibold">
                    {(userProfile?.posts ?? []).length}
                  </span> posts
                </p>
                <p>
                <span className="font-semibold">
                  {(userProfile?.followers ?? []).length}
                </span> followers
                </p>
                <p>
                  <span className="font-semibold">
                    {(userProfile?.following ?? []).length}
                  </span> following
                </p>
              </div>

              <div className="flex flex-col gap-1 text-sm">
                <span className="font-semibold">
                  {userProfile?.bio || "bio here..."}
                </span>
                <Badge className="w-fit" variant="secondary">
                  <AtSign />
                  <span className="pl-1">{userProfile?.username}</span>
                </Badge>
              </div>
            </div>
          </section>
        </div>

        {/* Tab Switcher */}
        <div className="border-t border-t-gray-200">
          <div className="flex items-center justify-center gap-10 text-sm">
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "posts" ? "font-bold" : ""
              }`}
              onClick={() => setActiveTab("posts")}
            >
              POSTS
            </span>
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "saved" ? "font-bold" : ""
              }`}
              onClick={() => setActiveTab("saved")}
            >
              SAVED
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1">
            {displayedPosts?.map((post) => (
              <div
                key={post._id}
                className="relative group cursor-pointer overflow-hidden"
              >
                <img
                  src={post.image}
                  alt="postimage"
                  className="rounded-sm my-2 w-full aspect-square object-cover"
                />
                <Link to={`/post/${post._id}`}>
                  <div className="rounded-sm my-2 absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center text-white space-x-4">
                      <button className="flex items-center gap-2 hover:text-gray-300">
                        <Heart />
                        <span>{post?.likes.length}</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-gray-300">
                        <MessageCircle />
                        <span>{post?.comments.length}</span>
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
