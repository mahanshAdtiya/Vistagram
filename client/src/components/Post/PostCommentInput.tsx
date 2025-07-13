interface Props {
  text: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPost: () => void;
}

const PostCommentInput: React.FC<Props> = ({ text, onChange, onPost }) => {
  return (
    <div className="flex items-center justify-between">
      <input
        type="text"
        placeholder="Add a comment..."
        value={text}
        onChange={onChange}
        className="outline-none text-sm w-full"
      />
      {text && (
        <span onClick={onPost} className="text-[#3BADF8] cursor-pointer">
          Post
        </span>
      )}
    </div>
  );
};

export default PostCommentInput;
