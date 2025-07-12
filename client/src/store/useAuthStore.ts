import { create } from 'zustand';
import { userAPI } from "@/service/request";
import { toast } from "sonner";

interface AuthUser {
  _id: string;
  username: string;
  email: string;
  profilePicture?: string;
  bio?: string;
  followers?: string[];
  following?: string[];
  posts?: any[];
}

interface AuthStore {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  isHydrated: boolean;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signupWithEmail: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: false,
  error: null,
  isHydrated: false,

  loginWithEmail: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await userAPI.login({ email, password });
      if (res.data.success) {
        const me = await userAPI.getMe();
        set({ user: me.data.user, loading: false });
        toast.success(res.data.message || "Logged in successfully");
      }
    } catch (error: any) {
      console.error(error);
      const message = error?.response?.data?.message || "Login failed";
      toast.error(message);
      set({ user: null, loading: false, error: message });
    }
  },


  signupWithEmail: async (username, email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await userAPI.register({ username, email, password });
      if (res.data.success) {
        toast.success(res.data.message || "Account created successfully");
        set({ loading: false });
      } else {
        toast.error("Signup failed");
        set({ loading: false, error: "Signup failed" });
      }
    } catch (error: any) {
      console.error(error);
      const message = error?.response?.data?.message || "Signup failed";
      toast.error(message);
      set({ loading: false, error: message });
    }
  },

  logout: async () => {
    try {
      await userAPI.logout();
      set({ user: null });
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error", error);
      toast.error("Logout failed");
    }
  },

  fetchUser: async () => {
    try {
      const res = await userAPI.getMe();
      if (res.data.success) {
        console.log("HAHA | RESPONSE: ", res.data)
        console.log("HAHA | VALID TOKEN")
        set({ user: res.data.user, isHydrated: true });
      } else {
        set({ user: null, isHydrated: true });
      }
    } catch (error) {
      console.error("Fetch user error", error);
      set({ user: null, isHydrated: true });
    }
  },
}));
