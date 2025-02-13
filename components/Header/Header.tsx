"use client";

import React from "react";
import { FiMenu, FiBell, FiMessageSquare, FiUser } from "react-icons/fi";

interface HeaderProps {
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<HeaderProps> = ({ setSidebarOpen }) => {
  return (
    <header className="bg-gray-900 text-white p-4 shadow-md flex items-center justify-between">
      {/* Menu Button (for mobile) */}
      <button
        onClick={() => setSidebarOpen((prev) => !prev)}
        className="lg:hidden text-white"
      >
        <FiMenu size={24} />
      </button>

      {/* Title */}
      <h1 className="text-xl font-semibold">AutoCare Hub</h1>

      {/* Right Side Icons (Notifications, Messages, Profile) */}
      <div className="flex items-center space-x-4">
        {/* Notification Icon */}
        <button className="relative">
          <FiBell size={20} />
          {/* Optional Badge */}
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-red-600 bg-white rounded-full">
            3
          </span>
        </button>

        {/* Messages Icon */}
        <button className="relative">
          <FiMessageSquare size={20} />
          {/* Optional Badge */}
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-red-600 bg-white rounded-full">
            5
          </span>
        </button>

        {/* Profile Section */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <FiUser size={20} />
            <span className="text-sm">John Doe</span>{" "}
            {/* Display active user */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
