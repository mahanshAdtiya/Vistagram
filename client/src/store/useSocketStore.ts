import { create } from 'zustand';
import { io, type Socket } from 'socket.io-client';
import { toast } from 'sonner';

interface NotificationPayload {
  type: 'like' | 'comment' | 'follow';
  userId: string;
  userDetails: {
    _id: string;
    username: string;
    profilePicture?: string;
  };
  postId?: string;
  message: string;
  createdAt?: string;
}

interface SocketStore {
  socket: Socket | null;
  onlineUsers: string[];
  notifications: NotificationPayload[];
  initializeSocket: (userId: string) => void;
  disconnectSocket: () => void;
  sendNotification: (payload: {
    receiverId: string;
    type: 'like' | 'comment' | 'follow';
    postId?: string;
    sender: any;
  }) => void;
  isUserOnline: (userId: string) => boolean;
  clearNotifications: () => void;
}

export const useSocketStore = create<SocketStore>((set, get) => ({
  socket: null,
  onlineUsers: [],
  notifications: [],

  initializeSocket: (userId) => {
    const socket = io(import.meta.env.VITE_API_URL || "https://vistagram-k3y1.onrender.com", {
      query: { userId },
      transports: ['websocket'],
    });

    socket.on('getOnlineUsers', (users: string[]) => {
      set({ onlineUsers: users });
    });

    socket.on('receiveNotification', (data: NotificationPayload) => {
      // Show toast
      toast(`${data.userDetails.username} ${data.message}`, {
        description: data.type === 'comment' ? '💬 New comment' :
                     data.type === 'like' ? '❤️ Post liked' :
                     '➕ You got a new follower',
        action: {
          label: 'View',
          onClick: () => {
            if (data.postId) {
              window.location.href = `/post/${data.postId}`;
            } else {
              window.location.href = `/account/${data.userId}`;
            }
          }
        }
      });

      // Add to notifications
      set((state) => ({
        notifications: [data, ...state.notifications],
      }));
    });

    set({ socket });
  },

  sendNotification: ({ receiverId, type, postId, sender }) => {
    const socket = get().socket;
    if (socket) {
      socket.emit('sendNotification', { receiverId, type, postId, sender });
    }
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null, onlineUsers: [], notifications: [] });
    }
  },

  isUserOnline: (userId) => {
    return get().onlineUsers.includes(userId);
  },
  clearNotifications: () => set({ notifications: [] }),

}));
