import { useRef, useState, type ChangeEvent } from 'react';
import { Dialog, DialogContent, DialogHeader } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';

import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { usePostStore } from '@/store/usePostStore';
import { readFileAsDataURL } from '@/utils/readFile';
import { useAuthStore } from '@/store/useAuthStore';
import { postAPI } from '@/service/request';

const CreatePost = ({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) => {
  const imageRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

    const user = useAuthStore((state) => state.user);
  const { posts, setPosts } = usePostStore();

  const fileChangeHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const dataUrl = await readFileAsDataURL(selectedFile);
      setImagePreview(dataUrl);
    }
  };

  const createPostHandler = async () => {
    if (!file) {
      toast.error('Please select an image.')
      return
    }

    const formData = new FormData()
    formData.append('caption', caption)
    formData.append('image', file)
    try {
      setLoading(true)
      
      const res = await postAPI.addPost(formData)
      if (res.data.success) {
        setPosts([res.data.post, ...posts])
        toast.success(res.data.message)
        setOpen(false)
      }
    } catch (error: any) {
      console.error('Create post error:', error)
      toast.error(error.response?.data?.message || 'Failed to create post.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={() => setOpen(false)}>
        <DialogHeader className='text-center font-semibold'>Create New Post</DialogHeader>

        <div className='flex gap-3 items-center'>
          <Avatar>
            <AvatarImage src={user?.profilePicture} alt='img' />
            <AvatarFallback>{user?.username?.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className='font-semibold text-xs'>{user?.username}</h1>
            <span className='text-gray-600 text-xs'>Bio here...</span>
          </div>
        </div>

        <Textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className='focus-visible:ring-transparent border-none'
          placeholder='Write a caption...'
        />

        {imagePreview && (
          <div className='w-full h-64 flex items-center justify-center'>
            <img src={imagePreview} alt='preview_img' className='object-cover h-full w-full rounded-md' />
          </div>
        )}

        <input ref={imageRef} type='file' className='hidden' onChange={fileChangeHandler} accept='image/*' />
        <Button onClick={() => imageRef.current?.click()} className='w-fit mx-auto bg-[#0095F6] hover:bg-[#258bcf]'>
          Select from computer
        </Button>

        {imagePreview && (
          loading ? (
            <Button disabled>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Please wait
            </Button>
          ) : (
            <Button onClick={createPostHandler} type='submit' className='w-full'>
              Post
            </Button>
          )
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
