import React, { useState } from "react";
import {
  FiMenu,
  FiBell,
  FiMessageSquare,
  FiUser,
  FiSettings,
  FiHelpCircle,
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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface HeaderProps {
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ setSidebarOpen, sidebarOpen }) => {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const notifications = [
    { id: 1, title: "New service request", time: "5m ago" },
    { id: 2, title: "Appointment confirmed", time: "1h ago" },
    { id: 3, title: "Service completed", time: "2h ago" },
  ];

  const messages = [
    {
      id: 1,
      from: "Alice Smith",
      preview: "When will my car be ready?",
      time: "10m ago",
    },
    {
      id: 2,
      from: "Bob Johnson",
      preview: "Thanks for the quick service!",
      time: "30m ago",
    },
    {
      id: 3,
      from: "Carol White",
      preview: "Need to reschedule...",
      time: "1h ago",
    },
    {
      id: 4,
      from: "David Brown",
      preview: "Is my car ready for pickup?",
      time: "2h ago",
    },
    {
      id: 5,
      from: "Eve Wilson",
      preview: "Question about the repair",
      time: "3h ago",
    },
  ];

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
      className={`bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white border-b border-gray-700 ${
        sidebarOpen ? "ml-72" : "ml-0"
      }`}
    >
      <div className="backdrop-blur-sm bg-black/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen((prev) => !prev)}
              className="lg:hidden text-white hover:bg-gray-700/50 p-2 rounded-lg transition-all duration-200 active:scale-95"
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
                className="w-full bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 pl-10 rounded-lg focus:ring-2 focus:ring-blue-400 transition-all duration-200"
              />
              <FiSearch
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger className="relative">
                <button className="relative hover:bg-gray-700/50 p-2 rounded-lg transition-all duration-200 active:scale-95">
                  <FiBell size={20} />
                  {notifications.length > 0 && (
                    <Badge className="absolute -top-1 -right-1 bg-red-500 text-white h-5 w-5 flex items-center justify-center p-0 animate-pulse">
                      {notifications.length}
                    </Badge>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 bg-gray-800/95 backdrop-blur-md text-white border border-gray-700 rounded-xl shadow-xl">
                <div className="p-3 text-sm font-semibold border-b border-gray-700/50">
                  Notifications
                </div>
                {notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className="flex items-center justify-between p-3 hover:bg-gray-700/50 cursor-pointer transition-colors duration-200"
                  >
                    <div>
                      <div className="font-medium">{notification.title}</div>
                      <div className="text-sm text-gray-400">
                        {notification.time}
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Messages */}
            <DropdownMenu>
              <DropdownMenuTrigger className="relative">
                <button className="relative hover:bg-gray-700/50 p-2 rounded-lg transition-all duration-200 active:scale-95">
                  <FiMessageSquare size={20} />
                  {messages.length > 0 && (
                    <Badge className="absolute -top-1 -right-1 bg-red-500 text-white h-5 w-5 flex items-center justify-center p-0 animate-pulse">
                      {messages.length}
                    </Badge>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 bg-gray-800/95 backdrop-blur-md text-white border border-gray-700 rounded-xl shadow-xl">
                <div className="p-3 text-sm font-semibold border-b border-gray-700/50">
                  Messages
                </div>
                {messages.map((message) => (
                  <DropdownMenuItem
                    key={message.id}
                    className="flex items-center justify-between p-3 hover:bg-gray-700/50 cursor-pointer transition-colors duration-200"
                  >
                    <div className="space-y-1">
                      <div className="font-medium">{message.from}</div>
                      <div className="text-sm text-gray-400">
                        {message.preview}
                      </div>
                      <div className="text-xs text-gray-500">
                        {message.time}
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-3 hover:bg-gray-700/50 p-2 rounded-lg transition-all duration-200">
                <Avatar className="h-8 w-8 ring-2 ring-gray-700/50">
                  <AvatarFallback className="text-black bg-gradient-to-br from-blue-400 to-purple-400">
                    {getInitials(
                      `${user?.firstName ?? ""} ${
                        user?.lastName ?? ""
                      }`.trim() || "User Name"
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div className="text-xs text-gray-400">
                    {user?.role || "User"}
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-gray-800/95 backdrop-blur-md text-white border border-gray-700 rounded-xl shadow-xl">
                <div className="p-3 text-sm font-semibold border-b border-gray-700/50">
                  {user?.phoneNumber}
                </div>
                <DropdownMenuItem className="p-2.5 hover:bg-gray-700/50 cursor-pointer transition-colors duration-200">
                  <FiUser className="mr-2" size={16} /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="p-2.5 hover:bg-gray-700/50 cursor-pointer transition-colors duration-200">
                  <FiSettings className="mr-2" size={16} /> Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="p-2.5 hover:bg-gray-700/50 cursor-pointer transition-colors duration-200">
                  <FiHelpCircle className="mr-2" size={16} /> Help & Support
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-700/50" />
                <DropdownMenuItem
                  className="p-2.5 hover:bg-red-500/10 cursor-pointer text-red-400 transition-colors duration-200"
                  onClick={handleLogout}
                >
                  <FiLogOut className="mr-2" size={16} /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
