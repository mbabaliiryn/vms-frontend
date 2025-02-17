"use client";

import React from "react";
import Link from "next/link";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import useLocalStorage from "@/hooks/useLocalStorage";
import {
  FiHome,
  FiUsers,
  FiDatabase,
  FiTruck,
  FiClipboard,
  FiBriefcase,
  FiLogOut,
  FiX,
  FiList,
  FiUserPlus,
  FiMapPin,
  FiPlusCircle,
  FiTool,
  FiFileText,
  FiActivity,
} from "react-icons/fi";
import useAuth from "@/hooks/useAuth";
import { toast } from "sonner";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

interface MenuItem {
  icon?: React.ReactNode;
  label: string;
  route?: string;
  children?: MenuItem[];
}

const menuGroups: { name: string; menuItems: MenuItem[] }[] = [
  {
    name: "MAIN MENU",
    menuItems: [
      {
        icon: <FiHome size={18} />,
        label: "Dashboard",
        route: "/dashboard",
      },
    ],
  },
  {
    name: "ADMINISTRATION",
    menuItems: [
      {
        icon: <FiUsers size={18} />,
        label: "Users",
        children: [
          {
            icon: <FiList size={16} />,
            label: "All Users",
            route: "/admin/users",
          },
          {
            icon: <FiUserPlus size={16} />,
            label: "Add User",
            route: "/admin/users/create",
          },
        ],
      },
      {
        icon: <FiDatabase size={18} />,
        label: "Garages",
        children: [
          {
            icon: <FiMapPin size={16} />,
            label: "All Garages",
            route: "/admin/garages",
          },
          {
            icon: <FiPlusCircle size={16} />,
            label: "Add Garage",
            route: "/admin/garages/create",
          },
        ],
      },
    ],
  },
  {
    name: "BUSINESS OPERATIONS",
    menuItems: [
      {
        icon: <FiBriefcase size={18} />,
        label: "Customers",
        route: "/operations/customers",
      },
      {
        icon: <FiTruck size={18} />,
        label: "Vehicles",
        route: "/operations/vehicles",
      },
      {
        icon: <FiClipboard size={18} />,
        label: "Inspections",
        children: [
          {
            icon: <FiTool size={16} />,
            label: "Vehicle Inspections",
            children: [
              {
                icon: <FiList size={16} />,
                label: "All Inspections",
                route: "/operations/inspections/vehicles",
              },
              {
                icon: <FiFileText size={16} />,
                label: "New Inspection",
                route: "/operations/inspections/vehicles/create",
              },
            ],
          },
          {
            icon: <FiActivity size={16} />,
            label: "Garage Inspections",
            children: [
              {
                icon: <FiList size={16} />,
                label: "All Inspections",
                route: "/operations/inspections/garages",
              },
              {
                icon: <FiFileText size={16} />,
                label: "New Inspection",
                route: "/operations/inspections/garages/create",
              },
            ],
          },
        ],
      },
    ],
  },
];

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const [openDropdowns, setOpenDropdowns] = useLocalStorage<
    Record<string, boolean>
  >("openDropdowns", {});
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    setTimeout(() => {
      toast.success("Signed out successfully!");
    }, 1000);
  };

  const toggleDropdown = (label: string) => {
    if (!label) return;
    setOpenDropdowns((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const isValidMenuItem = (item: MenuItem | undefined): item is MenuItem => {
    return !!item && typeof item.label === "string";
  };

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col bg-white shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between bg-gradient-to-r from-orange-50 to-orange-100 px-8 py-5">
          <Link
            href="/dashboard"
            className="text-xl font-bold text-orange-600 hover:text-orange-700 transition-colors"
          >
            NAGOA
          </Link>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSidebarOpen(false);
            }}
            className="lg:hidden p-2 text-orange-500 transition-colors hover:text-orange-600"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-orange-200 scrollbar-track-gray-50">
          <nav className="mt-4 px-4 lg:px-6">
            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="mb-6">
                <h3 className="mb-3 ml-4 text-xs font-semibold uppercase tracking-wider text-orange-500">
                  {group.name}
                </h3>
                <ul className="space-y-1">
                  {group.menuItems
                    .filter(isValidMenuItem)
                    .map((menuItem, menuIndex) => (
                      <SidebarItem
                        key={`${menuItem.label}-${menuIndex}`}
                        item={menuItem}
                        isDropdownOpen={!!openDropdowns?.[menuItem.label]}
                        toggleDropdown={toggleDropdown}
                      />
                    ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Logout Section */}
        <div className="border-t border-gray-100 bg-gray-50 p-6">
          <button
            className="flex w-full items-center justify-center gap-3 rounded-lg bg-orange-50 px-4 py-2.5 text-orange-600 transition-all hover:bg-orange-500 hover:text-white hover:shadow-md active:transform active:scale-95"
            onClick={handleLogout}
          >
            <FiLogOut size={18} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
