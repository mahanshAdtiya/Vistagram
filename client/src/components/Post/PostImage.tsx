import { Link } from 'react-router-dom';

interface Props {
  postId: string;
  image: string;
}

const PostImage: React.FC<Props> = ({ postId, image }) => {
  return (
    <Link to={`/post/${postId}`}>
      <img
        className="rounded-sm my-2 w-full aspect-square object-cover"
        src={image}
        alt="post"
      />
    </Link>
  );
};

export default PostImage;
