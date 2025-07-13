import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import {
//   Tooltip,
//   TooltipTrigger,
//   TooltipContent,
// } from "@/components/ui/tooltip";
// import { ArrowDownUp, ThumbsUp } from "lucide-react";

interface SearchParams {
  authorId: string;
  hashtags: string[];
  sortLikes: "asc" | "desc" | "";
  sortTime?: "asc" | "desc" | "";
}

interface TableParams {
  page: number;
  pageSize: number;
  total: number;
  searchParams: SearchParams;
}

interface PostSearchBarProps {
  tableParams: TableParams;
  setTableParams: React.Dispatch<React.SetStateAction<TableParams>>;
}

const PostSearchBar: React.FC<PostSearchBarProps> = ({
  tableParams,
  setTableParams,
}) => {
  const [input, setInput] = useState("");

useEffect(() => {
  const author = tableParams.searchParams.authorId || "";
  const hashtags = tableParams.searchParams.hashtags.map((tag) => `#${tag}`);
  const newInput = [author, ...hashtags].join(" ").trim();
  setInput(newInput);
}, [tableParams.searchParams]);


  const parseInput = () => {
    const parts = input.trim().split(/\s+/);
    const author = parts.find((p) => !p.startsWith("#")) || "";
    const hashtags = parts
      .filter((p) => p.startsWith("#"))
      .map((tag) => tag.slice(1));

    setTableParams((prev: TableParams) => ({
      ...prev,
      page: 1,
      searchParams: {
        ...prev.searchParams,
        authorId: author,
        hashtags,
      },
    }));
  };

  // const toggleSort = (
  //   key: "sortLikes" | "sortTime"
  // ) => {
  //   setTableParams((prev: TableParams) => {
  //     const current = prev.searchParams[key];
  //     let next: "asc" | "desc" | "" = current === "asc" ? "desc" : current === "desc" ? "" : "asc";
  //     return {
  //       ...prev,
  //       searchParams: {
  //         ...prev.searchParams,
  //         [key]: next,
  //       },
  //     };
  //   });
  // };

  // const getSortState = (key: "sortLikes" | "sortTime"): "asc" | "desc" | undefined => {
  //     const val = tableParams.searchParams[key];
  //     return val === "" ? undefined : val;
  // };

  // const iconClass = (active: boolean, direction?: "asc" | "desc") =>
  //   `
  //     h-5 w-5 
  //     transition-transform duration-200 ease-in-out 
  //     ${active ? "text-primary font-bold" : "text-muted-foreground"} 
  //     ${direction === "asc" ? "rotate-0" : direction === "desc" ? "rotate-180" : ""}
  //   `;

  return (
    <div className="flex flex-col md:flex-row items-center gap-3 mb-6 px-4 md:px-0">
      <div className="flex w-full">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='e.g. "mahansh  #travel"'
          onKeyDown={(e) => e.key === "Enter" && parseInput()}
        />
        <Button className="ml-2 bg-[#212328]" onClick={parseInput}>
          Search
        </Button>
      </div>

      <div className="flex items-center gap-3">
        {/* Likes Sort */}
        {/* <Tooltip>
          <TooltipTrigger asChild>
            <Button className="px-7" variant="ghost" size="icon" onClick={() => toggleSort("sortLikes")}>
              <div className="flex items-center justify-between">
                <ThumbsUp className="h-5 w-5 mr-1 text-muted-foreground" />
                <ArrowDownUp
                    className={iconClass(
                    !!getSortState("sortLikes"),
                    getSortState("sortLikes")
                    )}
                />
              </div>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Sort by Likes (asc/desc)</p>
          </TooltipContent>
        </Tooltip> */}
      </div>
    </div>
  );
};

export default PostSearchBar;
