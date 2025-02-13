import React from "react";
import Link from "next/link";
import SidebarItem from "@/components/Sidebar/SidebarItem";
// import ClickOutside from "@/components/ClickOutside";
import useLocalStorage from "@/hooks/useLocalStorage";
import {
    FiHome,
    FiUsers,
    FiSettings,
    FiDatabase,
    FiTool,
    FiTruck,
    FiClipboard,
    FiBriefcase,
    FiLogOut,
    FiX,
} from "react-icons/fi";

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
                icon: <FiHome size={18}/>,
                label: "Dashboard",
                route: "/dashboard",
            },
        ],
    },
    {
        name: "ADMINISTRATION",
        menuItems: [
            {
                icon: <FiUsers size={18}/>,
                label: "Users",
                children: [
                    {label: "All Users", route: "/admin/users"},
                    {label: "Add User", route: "/admin/users/create"},
                    {label: "Manage Roles", route: "/admin/users/roles"},
                ],
            },
            {
                icon: <FiDatabase size={18}/>,
                label: "Branches",
                children: [
                    {label: "All Branches", route: "/admin/branches"},
                    {label: "Add Branch", route: "/admin/branches/create"},
                ],
            },
        ],
    },
    {
        name: "BUSINESS OPERATIONS",
        menuItems: [
            {
                icon: <FiBriefcase size={18}/>,
                label: "Customers",
                route: "/operations/customers",
            },
            {
                icon: <FiTruck size={18}/>,
                label: "Vehicles",
                route: "/operations/vehicles",
            },
            {
                icon: <FiClipboard size={18}/>,
                label: "Inspections",
                children: [
                    {label: "All Inspections", route: "/operations/inspections"},
                    {label: "New Inspection", route: "/operations/inspections/create"},
                ],
            },
            {
                icon: <FiTool size={18}/>,
                label: "Service History",
                route: "/operations/service-history",
            },
        ],
    },
    {
        name: "SETTINGS",
        menuItems: [
            {icon: <FiSettings size={18}/>, label: "Settings", route: "/settings"},
        ],
    },
];

const Sidebar: React.FC<SidebarProps> = ({sidebarOpen, setSidebarOpen}) => {
    const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");

    return (
        <>
            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* <ClickOutside onClick={() => setSidebarOpen(false)}> */}
            <aside
                className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col bg-gray-900 text-white shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                {/* Sidebar Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-700">
                    <Link href="/" className="text-xl font-bold text-white">
                        AutoCare Hub
                    </Link>
                    <button
                        onClick={(event) => {
                            event.stopPropagation();
                            setSidebarOpen(false);
                        }}
                        className="p-2 text-gray-400 transition hover:text-white lg:hidden"
                    >
                        <FiX size={24}/>
                    </button>
                </div>

                {/* Sidebar Menu */}
                <div
                    className="flex flex-col flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
                    <nav className="mt-4 px-4 lg:px-6">
                        {menuGroups.map((group, groupIndex) => (
                            <div key={groupIndex} className="mb-6">
                                <h3 className="mb-3 ml-4 text-xs font-semibold uppercase text-gray-400">
                                    {group.name}
                                </h3>
                                <ul className="space-y-2">
                                    {group.menuItems.map((menuItem, menuIndex) => (
                                        <SidebarItem
                                            key={menuIndex}
                                            item={menuItem}
                                            pageName={pageName}
                                            setPageName={setPageName}
                                        />
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </nav>
                </div>

                {/* Logout Button - Stays Fixed at the Bottom */}
                <div className="p-6 border-t border-gray-700">
                    <button
                        className="flex w-full items-center justify-center gap-3 rounded-lg bg-gray-200 px-4 py-2 text-gray-900 transition hover:bg-red-400 hover:text-white"
                        onClick={() => console.log("Logging out...")}
                    >
                        <FiLogOut size={20}/> Logout
                    </button>
                </div>
            </aside>
            {/* </ClickOutside> */}
        </>
    );
};

export default Sidebar;
