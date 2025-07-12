import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import navItems from "@/configs/navbar";
import type { NavItem } from "@/types";
import { useAuthStore } from "@/store/useAuthStore";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

export default function BottomNav() {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);

  return (
    <div className="flex items-center justify-center">
      <nav className="md:w-1/2 md:bottom-4 w-full fixed bottom-0 z-50 bg-white px-4 py-2 rounded-2xl shadow-xl border border-gray-200 flex justify-between">
        {navItems.map(({ to, icon: Icon, label, center }: NavItem) => {
          const isActive = location.pathname === to;

          return (
            <Link key={label} to={to}>
              <div
                className={cn(
                  "relative flex flex-col items-center justify-center transition-colors duration-200",
                  center
                    ? "bg-indigo-500 text-white p-4 rounded-full shadow-2xl -translate-y-6"
                    : "text-gray-500 hover:text-indigo-500",
                  isActive && !center && "text-indigo-500"
                )}
              >
                {label === "Account" ? (
                  <Avatar className="w-6 h-6">
                    <AvatarImage
                      src={user?.profilePicture || ""}
                      alt={user?.username}
                    />
                    <AvatarFallback>
                      {user?.username?.charAt(0)?.toUpperCase() || "A"}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  Icon && <Icon className={cn("w-6 h-6", center && "w-7 h-7")} />
                )}

                {!center && <span className="text-[10px] mt-1">{label}</span>}
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
