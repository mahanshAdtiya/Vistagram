import { create } from 'zustand';

interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface AuthStore {
  user: AuthUser | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => {
  // Load from localStorage on init
  const storedUser = localStorage.getItem('auth_user');
  const parsedUser = storedUser ? JSON.parse(storedUser) as AuthUser : null;

  return {
    user: parsedUser,
    loading: false,

    loginWithGoogle: async () => {
      set({ loading: true });

      try {
        const mockUser: AuthUser = {
          id: '123',
          name: 'Mahansh Aditya',
          email: 'mahansh@lilagames.com',
        };

        // Simulate network delay
        await new Promise((r) => setTimeout(r, 1000));

        localStorage.setItem('auth_user', JSON.stringify(mockUser));
        set({ user: mockUser, loading: false });
      } catch (error) {
        console.error('Login failed', error);
        localStorage.removeItem('auth_user');
        set({ user: null, loading: false });
      }
    },

    logout: () => {
      localStorage.removeItem('auth_user');
      set({ user: null });
    },
  };
});
