"use client";

import React, {useState} from "react";
import Sidebar from "@/components/Sidebar/Sidebar";
import Header from "@/components/Header/Header";
import useAuth from "@/hooks/useAuth";

const PageLayout = ({children}: { children: React.ReactNode }) => {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
    useAuth();

    return (
        <div className="flex h-screen">
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>

            <div className="flex flex-col flex-1">
                <Header setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen}/>

                <main
                    className={`flex-1 overflow-y-auto transition-all duration-300 ${
                        sidebarOpen ? "ml-72" : "ml-0"
                    }`}
                >
                    <div className="p-6">{children}</div>
                </main>
            </div>
        </div>
    );
};

export default PageLayout;
