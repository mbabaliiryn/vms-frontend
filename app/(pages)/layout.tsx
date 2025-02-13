"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar/Sidebar";
import Header from "@/components/Header/Header";

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  return (
    <div className="flex h-screen">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex flex-col flex-1">
        <Header setSidebarOpen={setSidebarOpen} />

        <main
          className={`flex-1 overflow-y-auto transition-all duration-300 ${
            sidebarOpen ? "ml-72" : "ml-20"
          }`}
        >
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default PageLayout;
