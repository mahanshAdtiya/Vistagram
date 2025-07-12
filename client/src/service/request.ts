import { api } from './api';

export const userAPI = {
  register: (data: { username: string; email: string; password: string }) =>
    api.post('/api/v1/user/register', data),

  login: (data: { email: string; password: string }) =>
    api.post('/api/v1/user/login', data),

  logout: () => api.get('/api/v1/user/logout'),

  getMe: () => api.get('/api/v1/user/me'), // ✅ added this line

  editProfile: (data: FormData) =>
    api.post('/api/v1/user/profile/edit', data),

  followOrUnfollow: (userId: string) =>
    api.post(`/api/v1/user/followorunfollow/${userId}`),
};


export const postAPI = {
  addPost: (data: FormData) => api.post('/api/v1/post/addpost', data),
  getAllPosts: () => api.get('/api/v1/post/all'),
  getUserPosts: () => api.get('/api/v1/post/userpost/all'),
  likePost: (postId: string) => api.get(`/api/v1/post/${postId}/like`),
  dislikePost: (postId: string) => api.get(`/api/v1/post/${postId}/dislike`),
  addComment: (postId: string, data: { comment: string }) => api.post(`/api/v1/post/${postId}/comment`, data),
  getComments: (postId: string) => api.post(`/api/v1/post/${postId}/comment/all`),
  deletePost: (postId: string) => api.delete(`/api/v1/post/delete/${postId}`),
};
