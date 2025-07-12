import { create } from 'zustand'

export interface User {
  _id: string
  username: string
  profilePicture?: string
}

export interface CommentType {
  _id: string
  text: string
  author: User
  post: string
}

export interface PostType {
  _id: string
  caption?: string
  image: string
  author: User
  likes: string[]
  comments: CommentType[]
  hashtags: string[]
}

interface PostStore {
  posts: PostType[]
  selectedPost: PostType | null
  setPosts: (posts: PostType[]) => void
  setSelectedPost: (post: PostType | null) => void
}

export const usePostStore = create<PostStore>((set) => ({
  posts: [],
  selectedPost: null,
  setPosts: (posts) => set({ posts }),
  setSelectedPost: (post) => set({ selectedPost: post }),
}))
