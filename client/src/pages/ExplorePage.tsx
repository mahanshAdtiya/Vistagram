import { useEffect, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext, PaginationLink, } from "@/components/ui/pagination";
import { postAPI } from "@/service/request";
import PostFilter from "@/components/PostFilter";

interface Author {
  _id: string;
  username: string;
  profilePicture: string;
}

interface Post {
  _id: string;
  caption: string;
  image: string;
  author: Author;
  likes: string[];
  hashtags: string[];
}

interface SearchParams {
  authorId: string;
  hashtags: string[];
  sortLikes: "asc" | "desc" | "";
}

const PostExplorePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [tableParams, setTableParams] = useState<{
    page: number;
    pageSize: number;
    total: number;
    searchParams: SearchParams;
  }>({
    page: 1,
    pageSize: 8,
    total: 0,
    searchParams: {
      authorId: "",
      hashtags: [],
      sortLikes: "",
    },
  });

  const totalPages = Math.ceil(tableParams.total / tableParams.pageSize);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setTableParams((prev) => ({ ...prev, page: newPage }));
  };

  useEffect(() => {
    fetchPosts();
  }, [tableParams.page, tableParams.pageSize, tableParams.searchParams]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { authorId, hashtags, sortLikes } = tableParams.searchParams;

      const response = await postAPI.getFilteredPosts({
        authorId,
        hashtags,
        sortLikes: sortLikes === "" ? undefined : sortLikes,
        page: tableParams.page,
        limit: tableParams.pageSize,
      });

      const result = response.data;

      if (result.success && Array.isArray(result.posts)) {
        setPosts(result.posts);
        setTableParams((prev) => ({
          ...prev,
          total: result.total || 0,
        }));
      } else {
        setPosts([]);
      }
    } catch (err) {
      console.error("Fetch Posts Error:", err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="w-full">
        <PostFilter
          tableParams={tableParams}
          setTableParams={setTableParams}
        />
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5 justify-center">
        {loading
          ? Array.from({ length: tableParams.pageSize }).map((_, i) => (
              <Skeleton key={i} className="w-full h-[300px] rounded-xl" />
            ))
          : posts.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-transform hover:-translate-y-1"
              >
                <img
                  src={post.image}
                  alt="Post"
                  className="w-full h-[200px] object-cover rounded-t-xl"
                />
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <img
                      src={post.author.profilePicture}
                      alt="Author"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="font-semibold text-sm">{post.author.username}</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{post.caption}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.hashtags.map((tag, i) => (
                      <span
                        key={i}
                        className="bg-muted px-2 py-1 rounded-full text-xs text-muted-foreground"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <a
                    href={`/posts/${post._id}`}
                    className="block text-center w-full bg-gray-900 text-white py-2 rounded-full text-sm hover:bg-gray-800"
                  >
                    View Post
                  </a>
                </div>
              </div>
            ))}
      </div>

      {totalPages > 1 && (
        <Pagination className="mb-10 flex justify-center">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(tableParams.page - 1)}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={tableParams.page === i + 1}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(tableParams.page + 1)}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default PostExplorePage;
