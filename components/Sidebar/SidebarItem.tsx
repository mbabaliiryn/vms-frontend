import React from "react";
import Link from "next/link";
import SidebarDropdown from "@/components/Sidebar/SidebarDropdown";
import { usePathname } from "next/navigation";
import { FiChevronDown } from "react-icons/fi";

interface MenuItem {
  icon?: React.ReactNode;
  label: string;
  route?: string;
  children?: MenuItem[];
}

interface SidebarItemProps {
  item: MenuItem;
  pageName: string;
  setPageName: (name: string) => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  pageName,
  setPageName,
}) => {
  const pathname = usePathname();

  const isActive = (menuItem: MenuItem): boolean => {
    if (menuItem.route === pathname) return true;
    return menuItem.children?.some((child) => isActive(child)) || false;
  };

  const isItemActive = isActive(item);
  const isDropdownOpen = pageName === item.label.toLowerCase();

  const handleClick = (e: React.MouseEvent) => {
    if (!item.route) e.preventDefault();
    setPageName(isDropdownOpen ? "" : item.label.toLowerCase());
  };

  return (
    <li className="relative">
      <Link
        href={item.route || "#"}
        onClick={handleClick}
        className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-all duration-300 ease-in-out ${
          isItemActive
            ? "bg-gray-900 text-white dark:bg-meta-4"
            : "text-gray-300 hover:bg-gray-800"
        }`}
      >
        {item.icon}
        <span className="flex-grow">{item.label}</span>

        {item.children && (
          <FiChevronDown
            className={`transition-transform duration-300 ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
          />
        )}
      </Link>

      {item.children && (
        <div
          className={`overflow-hidden transition-[max-height] duration-300 ${
            isDropdownOpen ? "max-h-96" : "max-h-0"
          }`}
        >
          <SidebarDropdown item={item.children} />
        </div>
      )}
    </li>
  );
};

export default SidebarItem;
