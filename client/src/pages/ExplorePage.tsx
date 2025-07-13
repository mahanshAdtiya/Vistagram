import { useEffect, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";
import { postAPI } from "@/service/request";
import PostFilter from "@/components/PostFilter";
import { Post } from "@/components";
import { usePostStore, type PostType } from "@/store/usePostStore";

interface SearchParams {
  authorId: string;
  hashtags: string[];
  sortLikes: "asc" | "desc" | "";
}

const PostExplorePage: React.FC = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
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

  const { refreshKey } = usePostStore();
  const totalPages = Math.ceil(tableParams.total / tableParams.pageSize);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setTableParams((prev) => ({ ...prev, page: newPage }));
  };

  useEffect(() => {
    fetchPosts();
  }, [tableParams.page, tableParams.pageSize, tableParams.searchParams, refreshKey]);

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
      console.log("HAHA RESPONSE OF EXPLORE: ", result)

      if (result.success && Array.isArray(result.posts)) {
        setPosts(result.posts);
        setTableParams((prev) => ({
          ...prev,
          total: result.totalPosts || 0,
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
        <PostFilter tableParams={tableParams} setTableParams={setTableParams} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-center min-h-[400px]">
        {loading ? (
          Array.from({ length: tableParams.pageSize }).map((_, i) => (
            <Skeleton key={i} className="w-full h-[300px] rounded-xl" />
          ))
        ) : posts.length > 0 ? (
          posts.map((post) => <Post key={post._id} post={post} />)
        ) : (
          <p className="col-span-full text-center text-muted-foreground">
            No posts found.
          </p>
        )}
      </div>

      {totalPages > 1 && (
        <Pagination className="mb-10 mt-6 flex justify-center">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(tableParams.page - 1)}
                className={tableParams.page === 1 ? "pointer-events-none opacity-50" : ""}
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
                className={tableParams.page === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default PostExplorePage;
