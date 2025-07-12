import {
  Home,
  Compass,
  Camera,
  Image,
} from "lucide-react";
import type { NavItem } from "@/types";

const navItems: NavItem[] = [
  { label: "Home", to: "/home", icon: Home },
  { label: "Explore", to: "/explore", icon: Compass },
  { label: "Upload", to: "/upload", icon: Camera, center: true },
  { label: "My Posts", to: "/myposts", icon: Image },
  { label: "Account", to: "/account" },
];

export default navItems;
