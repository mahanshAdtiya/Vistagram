import {
  Heart,
  Home,
  LogOut,
  PlusSquare,
  TrendingUp,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";
import {CreatePost} from '@/components'

const LeftSidebar = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error: any) {
      console.error("Logout error", error);
      toast.error(error?.response?.data?.message || "Logout failed");
    }
  };

  const sidebarHandler = (text: string) => {
    switch (text) {
      case "Logout":
        logoutHandler();
        break;
      case "Profile":
        navigate("/account");
        break;
      case "Create":
        setOpen(true);
        break;
      case "Explore":
        navigate("/explore");
        break;
      case "Home":
        navigate("/");
        break;
      case "Search":
        break;
      default:
        break;
    }
  };

  const sidebarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <TrendingUp />, text: "Explore" },
    { icon: <Heart />, text: "Notifications" },
    { icon: <PlusSquare />, text: "Create" },
    {
      icon: (
        <Avatar className="w-6 h-6">
          <AvatarImage
            src={user?.profilePicture || ""}
            alt={user?.username || "User"}
          />
          <AvatarFallback>
            {user?.username?.charAt(0)?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOut />, text: "Logout" },
  ];

  return (
    <div className="fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen bg-white">
      <div className="flex flex-col">
        <h1 className="my-8 pl-3 font-bold text-xl text-indigo-500">Vistagram</h1>
        <div>
          {sidebarItems.map((item, index) => (
            <div
              key={index}
              onClick={() => sidebarHandler(item.text)}
              className="flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3"
            >
              {item.icon}
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
      <CreatePost open={open} setOpen={setOpen} />
    </div>
  );
};

export default LeftSidebar;
