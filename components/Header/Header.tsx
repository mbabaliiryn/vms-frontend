import React, { useState } from "react";
import {
  FiMenu,
  // FiUser,
  // FiSettings,
  // FiHelpCircle,
  FiLogOut,
  FiSearch,
} from "react-icons/fi";
import useAuth from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface HeaderProps {
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ setSidebarOpen, sidebarOpen }) => {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    logout();
    toast.success("Signed out successfully!");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header
      className={`bg-orange-50 px-1 border-b border-gray-100 shadow-sm ${
        sidebarOpen ? "lg:ml-72" : "ml-0"
      } transition-all duration-300`}
    >
      <div className="h-16">
        <div className="mx-auto flex h-full items-center justify-between px-4">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen((prev) => !prev)}
              className="lg:hidden rounded-lg p-2 text-gray-600 transition-all duration-200 hover:bg-orange-50 hover:text-orange-500 active:scale-95"
            >
              <FiMenu size={24} />
            </button>
          </div>

          {/* Center Section - Search */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search appointments, services, or customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border-orange-200 bg-orange-50 pl-10 text-gray-600 placeholder-orange-400 transition-all duration-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
              <FiSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 transform text-orange-400"
                size={18}
              />
            </div>
          </div>

          {/* Right Section - User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center space-x-3 rounded-lg p-2 transition-all duration-200 hover:bg-orange-50">
              <Avatar className="h-8 w-8 ring-2 ring-orange-100">
                <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-500 text-white">
                  {getInitials(
                    `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() ||
                      "User Name"
                  )}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium text-gray-700">
                  {user?.firstName} {user?.lastName}
                </div>
                <div className="text-xs text-gray-500">
                  {user?.role || "User"}
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 rounded-xl border border-gray-100 bg-white p-1 shadow-lg">
              <div className="p-3 text-sm font-medium text-gray-600 border-b border-gray-100">
                {user?.phoneNumber}
              </div>
              {/* <DropdownMenuItem className="mt-1 cursor-pointer rounded-lg p-2.5 text-gray-600 transition-colors duration-200 hover:bg-orange-50 hover:text-orange-500">
                <FiUser className="mr-2" size={16} /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer rounded-lg p-2.5 text-gray-600 transition-colors duration-200 hover:bg-orange-50 hover:text-orange-500">
                <FiSettings className="mr-2" size={16} /> Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer rounded-lg p-2.5 text-gray-600 transition-colors duration-200 hover:bg-orange-50 hover:text-orange-500">
                <FiHelpCircle className="mr-2" size={16} /> Help & Support
              </DropdownMenuItem> */}
              <DropdownMenuSeparator className="my-1 bg-gray-100" />
              <DropdownMenuItem
                className="cursor-pointer rounded-lg p-2.5 text-red-500 transition-colors duration-200 hover:bg-red-50"
                onClick={handleLogout}
              >
                <FiLogOut className="mr-2" size={16} /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
