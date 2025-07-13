import { useEffect, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext, PaginationLink, } from "@/components/ui/pagination";
import { postAPI } from "@/service/request";
import PostFilter from "@/components/PostFilter";
import {Post} from "@/components"; 

import type { PostType} from '@/store/usePostStore';


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

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-center">
      {loading
        ? Array.from({ length: tableParams.pageSize }).map((_, i) => (
            <Skeleton key={i} className="w-full h-[300px] rounded-xl" />
          ))
        : posts.map((post) => <Post key={post._id} post={post} />)}
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
