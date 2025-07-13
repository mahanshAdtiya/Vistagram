import { create } from 'zustand'
import {type AuthUser} from './useAuthStore'

export interface CommentType {
  _id: string
  text: string
  author: AuthUser
  post: string
}

export interface PostType {
  _id: string;
  caption?: string;
  image: string;
  author: AuthUser;
  likes: string[];
  comments: CommentType[];
  hashtags: string[];
  locationText?: string; 
  locationUrl?: string;  
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
