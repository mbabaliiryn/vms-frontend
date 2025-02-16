"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FiChevronDown } from "react-icons/fi";
import { usePathname } from "next/navigation";

interface MenuItem {
  icon?: React.ReactNode;
  label: string;
  route?: string;
  children?: MenuItem[];
}

interface SidebarItemProps {
  item: MenuItem;
  isDropdownOpen: boolean;
  toggleDropdown: (label: string) => void;
  level?: number;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  isDropdownOpen,
  toggleDropdown,
  level = 0,
}) => {
  const pathname = usePathname();
  const [localDropdowns, setLocalDropdowns] = useState<Record<string, boolean>>(
    {}
  );

  // Guard clause for undefined items
  if (!item?.label) return null;

  const isActive = (menuItem: MenuItem): boolean => {
    if (!menuItem) return false;
    return (
      menuItem.route === pathname ||
      (menuItem.children?.some((child) => isActive(child)) ?? false)
    );
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item.route) {
      e.preventDefault();
      toggleDropdown(item.label);
    }
  };

  const toggleNestedDropdown = (label: string) => {
    setLocalDropdowns((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const hasChildren = Array.isArray(item.children) && item.children.length > 0;
  const currentIsActive = isActive(item);

  return (
    <li className="relative">
      <Link
        href={item.route || "#"}
        onClick={handleClick}
        className={`group flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ease-in-out
          ${level > 0 ? "ml-4" : ""}
          ${
            currentIsActive
              ? "bg-orange-50 text-orange-600"
              : "text-gray-600 hover:bg-orange-50/50 hover:text-orange-500"
          }`}
      >
        {item.icon && (
          <span
            className={`transition-colors duration-200 ${
              currentIsActive
                ? "text-orange-500"
                : "text-gray-400 group-hover:text-orange-400"
            }`}
          >
            {item.icon}
          </span>
        )}
        <span className="flex-grow text-sm">{item.label}</span>
        {hasChildren && (
          <FiChevronDown
            className={`h-4 w-4 transition-transform duration-300 ${
              isDropdownOpen ? "rotate-180" : ""
            } ${currentIsActive ? "text-orange-500" : "text-gray-400"}`}
          />
        )}
      </Link>

      {hasChildren && isDropdownOpen && (
        <ul className="mt-1 flex flex-col gap-1 overflow-hidden pl-2">
          {item.children?.map((child, index) => (
            <SidebarItem
              key={`${child.label}-${index}`}
              item={child}
              isDropdownOpen={!!localDropdowns[child.label]}
              toggleDropdown={toggleNestedDropdown}
              level={level + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

export default SidebarItem;
