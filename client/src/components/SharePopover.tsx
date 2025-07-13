import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  WhatsappShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  RedditShareButton,
} from 'react-share';
import {
  FaCopy,
  FaWhatsapp,
  FaTwitter,
  FaLinkedin,
  FaTelegram,
  FaReddit,
} from 'react-icons/fa';
import { Send } from 'lucide-react';

import type { PostType, CommentType } from '@/store/usePostStore';

interface SharePopoverProps {
  post: PostType;
  postLike: number;
  comment: CommentType[];
}

const BASE_URL = window.location.origin;

const SharePopover: React.FC<SharePopoverProps> = ({ post, postLike, comment }) => {
  const shareUrl = `${BASE_URL}/post/${post._id}`;

  // 🔁 Always-fresh message
  const generateShareMessage = () => {
    return `Hey! View this post by ${post.author.username}: ${shareUrl}\n` +
           `It has ${postLike} likes and ${comment.length} comments!`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateShareMessage());
      toast.success('Link copied!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to copy link');
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Send className="mt-1 cursor-pointer hover:text-gray-600" />
      </PopoverTrigger>

      <PopoverContent className="w-72 p-4 space-y-2 z-[9999]">
        <h4 className="font-semibold text-sm">Share this post</h4>

        <Button
          variant="outline"
          className="w-full justify-start text-left"
          onClick={copyToClipboard}
        >
          <FaCopy className="mr-2" /> Copy Link
        </Button>

        <Separator className="my-2" />

        <div className="flex flex-wrap gap-2">
          <WhatsappShareButton url={shareUrl} title={generateShareMessage()}>
            <Button variant="outline" size="icon"><FaWhatsapp /></Button>
          </WhatsappShareButton>
          <TwitterShareButton url={shareUrl} title={generateShareMessage()}>
            <Button variant="outline" size="icon"><FaTwitter /></Button>
          </TwitterShareButton>
          <LinkedinShareButton url={shareUrl} title={generateShareMessage()}>
            <Button variant="outline" size="icon"><FaLinkedin /></Button>
          </LinkedinShareButton>
          <TelegramShareButton url={shareUrl} title={generateShareMessage()}>
            <Button variant="outline" size="icon"><FaTelegram /></Button>
          </TelegramShareButton>
          <RedditShareButton url={shareUrl} title={generateShareMessage()}>
            <Button variant="outline" size="icon"><FaReddit /></Button>
          </RedditShareButton>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SharePopover;
