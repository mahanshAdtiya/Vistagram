import { create } from 'zustand';

interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface AuthStore {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signupWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => {
  const storedUser = localStorage.getItem("auth_user");
  const parsedUser = storedUser ? (JSON.parse(storedUser) as AuthUser) : null;

  return {
    user: parsedUser,
    loading: false,
    error: null,

    loginWithGoogle: async () => {
      set({ loading: true, error: null });
      try {
        const mockUser: AuthUser = {
          id: "123",
          name: "Mahansh Aditya",
          email: "mahansh@lilagames.com",
        };
        await new Promise((r) => setTimeout(r, 1000));
        localStorage.setItem("auth_user", JSON.stringify(mockUser));
        set({ user: mockUser, loading: false });
      } catch (error) {
        set({ user: null, loading: false, error: "Google login failed" });
      }
    },

    loginWithEmail: async (email, password) => {
      set({ loading: true, error: null });
      try {
        const mockUser: AuthUser = {
          id: "123",
          name: "Mahansh Aditya",
          email: "mahansh@lilagames.com",
        };
        await new Promise((r) => setTimeout(r, 1000));
        localStorage.setItem("auth_user", JSON.stringify(mockUser));
        set({ user: mockUser, loading: false });
        
      } catch (error) {
        set({ user: null, loading: false, error: "Invalid email or password" });
      }
    },

    signupWithEmail: async (email, password) => {
      set({ loading: true, error: null });
      try {
        const mockUser: AuthUser = {
          id: "123",
          name: "Mahansh Aditya",
          email: "mahansh@lilagames.com",
        };
        await new Promise((r) => setTimeout(r, 1000));
        localStorage.setItem("auth_user", JSON.stringify(mockUser));
        set({ user: mockUser, loading: false });
      } catch (error) {
        set({ user: null, loading: false, error: "Signup failed" });
      }
    },

    logout: () => {
      localStorage.removeItem("auth_user");
      set({ user: null });
    },
  };
});
