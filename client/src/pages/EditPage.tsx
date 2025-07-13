import React, { useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useAuthStore';
import { userAPI } from '@/service/request';
import { readFileAsDataURL } from '@/utils/readFile';

const EditProfile: React.FC = () => {
  const imageRef = useRef<HTMLInputElement>(null);
  const user = useAuthStore((state) => state.user);
  const fetchUser = useAuthStore((state) => state.fetchUser);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>(user?.profilePicture || '');

  const [input, setInput] = useState<{
    username: string;
    email: string;
    profilePhoto: File | string | undefined;
    bio: string | undefined;
  }>({
    username: user?.username || '',
    email: user?.email || '',
    profilePhoto: user?.profilePicture,
    bio: user?.bio,
  });

  const fileChangeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput((prev) => ({ ...prev, profilePhoto: file }));
      const dataUrl = await readFileAsDataURL(file);
      setImagePreview(dataUrl);
    }
  };

  const editProfileHandler = async () => {
    if (!user) return;

    const formData = new FormData();
    formData.append('username', input.username);
    formData.append('email', input.email);
    if (input.bio) formData.append('bio', input.bio);
    if (input.profilePhoto instanceof File) {
      formData.append('profilePhoto', input.profilePhoto);
    }

    try {
      setLoading(true);
      const res = await userAPI.editProfile(formData);

      if (res.data.success) {
        toast.success(res.data.message);
        await fetchUser();
        navigate(`/profile/${user._id}`);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Profile update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex max-w-2xl mx-auto pl-10">
      <section className="flex flex-col gap-6 w-full my-8">
        <h1 className="font-bold text-xl">Edit Profile</h1>

        {/* Profile Photo Section */}
        <div className="flex items-center justify-between bg-gray-100 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-16 w-16">
              <AvatarImage src={imagePreview} alt="profile" />
              <AvatarFallback>{user?.username?.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-bold text-sm">{user?.username}</h1>
            </div>
          </div>

          <input
            ref={imageRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={fileChangeHandler}
          />

          <Button
            onClick={() => imageRef.current?.click()}
            className="bg-[#0095F6] h-8 hover:bg-[#318bc7]"
          >
            Change photo
          </Button>
        </div>

        <div>
          <h1 className="font-bold text-xl mb-2">Username</h1>
          <input
            type="text"
            value={input.username}
            onChange={(e) => setInput((prev) => ({ ...prev, username: e.target.value }))}
            className="w-full border rounded-md px-4 py-2 text-sm"
          />
        </div>

        {/* Email */}
        <div>
          <h1 className="font-bold text-xl mb-2">Email</h1>
          <input
            type="email"
            value={input.email}
            onChange={(e) => setInput((prev) => ({ ...prev, email: e.target.value }))}
            className="w-full border rounded-md px-4 py-2 text-sm"
          />
        </div>

        {/* Bio */}
        <div>
          <h1 className="font-bold text-xl mb-2">Bio</h1>
          <Textarea
            value={input.bio}
            onChange={(e) => setInput((prev) => ({ ...prev, bio: e.target.value }))}
            name="bio"
            className="focus-visible:ring-transparent"
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          {loading ? (
            <Button className="w-fit bg-[#0095F6] hover:bg-[#2a8ccd]">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button
              onClick={editProfileHandler}
              className="w-fit bg-[#0095F6] hover:bg-[#2a8ccd]"
            >
              Submit
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};

export default EditProfile;
