import { api } from './api';

// Inside @/service/request.ts or where userAPI is defined
export const userAPI = {
  register: (data: { username: string; email: string; password: string }) =>
    api.post('/api/v1/user/register', data),

  login: (data: { email: string; password: string }) =>
    api.post('/api/v1/user/login', data),

  logout: () => api.get('/api/v1/user/logout'),

  getMe: () => api.get('/api/v1/user/me'),

  // ✅ Updated to match router endpoint
  editProfile: (formData: FormData) =>
    api.post('/api/v1/user/profile/edit', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    }),

  followOrUnfollow: (userId: string) =>
    api.post(`/api/v1/user/followorunfollow/${userId}`),

  getProfile: (userId: string) =>
    api.get(`/api/v1/user/${userId}/profile`),
};



export const postAPI = {
  addPost: (data: FormData) => api.post('/api/v1/post/addpost', data),
  getAllPosts: () => api.get('/api/v1/post/all'),
  getUserPosts: () => api.get('/api/v1/post/userpost/all'),
  likePost: (postId: string) => api.get(`/api/v1/post/${postId}/like`),
  dislikePost: (postId: string) => api.get(`/api/v1/post/${postId}/dislike`),
  addComment: (postId: string, data: { commentText: string }) =>
    api.post(`/api/v1/post/${postId}/comment`, data),
  getComments: (postId: string) =>
    api.post(`/api/v1/post/${postId}/comment/all`),
  deletePost: (postId: string) => api.delete(`/api/v1/post/delete/${postId}`),
  getFeedPosts: () => api.get('/api/v1/post/feed'),

  getFilteredPosts: (params: {
    authorId?: string;
    hashtags?: string[];
    sortLikes?: "asc" | "desc";
    page?: number;
    limit?: number;
  }) => {
    const query = new URLSearchParams();

    if (params.authorId) query.append("authorId", params.authorId);
    if (params.hashtags && params.hashtags.length > 0)
      query.append("hashtags", params.hashtags.join(","));
    if (params.sortLikes) query.append("sortLikes", params.sortLikes);
    if (params.page) query.append("page", params.page.toString());
    if (params.limit) query.append("limit", params.limit.toString());

    return api.get(`/api/v1/post/all?${query.toString()}`);
  },
   bookmarkPost: (postId: string) =>
    api.get(`/api/v1/post/${postId}/bookmark`),
};