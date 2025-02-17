import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarItem {
  route?: string;
  label: string;
  children?: SidebarItem[];
}

const SidebarDropdown = ({ item }: { item: SidebarItem[] }) => {
  const pathname = usePathname();

  return (
    <ul className="mt-2 flex flex-col gap-1 pl-8">
      {item.map((child: SidebarItem, index: number) => (
        <li key={index}>
          {child.route ? (
            <Link
              href={child.route}
              className={`group relative flex items-center gap-2.5 rounded-md px-4 py-2 text-sm font-medium transition-colors duration-200 ease-in-out hover:text-orange-500 ${
                pathname === child.route ? "text-orange-500" : "text-gray-500"
              }`}
            >
              <span className="absolute -left-2 h-1.5 w-1.5 rounded-full bg-orange-500 opacity-0 transition-opacity duration-200 ease-in-out group-hover:opacity-100"></span>
              {child.label}
            </Link>
          ) : (
            <span className="px-4 py-2 text-sm text-gray-500">
              {child.label}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
};

export default SidebarDropdown;
