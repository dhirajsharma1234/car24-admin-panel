/** @format */

"use client";

import { Inter } from "next/font/google";
import "./admin.css";
import AdminSidebar from "@/components/admin-sidebar";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export default function AdminLayout({ children }) {
    const router = useRouter();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    //protected route
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.replace("/login");
        }
    }, [router]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(e) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target)
            ) {
                setDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        toast.success("Logged out successfully 👋");
        router.push("/login");
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            <AdminSidebar />

            <div className="flex-1 flex flex-col bg-gray-50 p-6 overflow-hidden">
                {/* Header */}
                <header className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Admin Dashboard
                    </h1>

                    {/* Profile section */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center space-x-3 focus:outline-none"
                        >
                            <img
                                src="https://th.bing.com/th/id/OIP.HKw4wDlds7fGxI-c8-SKrgHaFO?w=256&h=181&c=7&r=0&o=7&pid=1.7&rm=3"
                                alt="Profile"
                                className="w-9 h-9 rounded-full shadow"
                            />
                            <span className="text-gray-700 font-medium">
                                Admin Name
                            </span>
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-md z-50">
                                <div className="px-4 py-2 border-b">
                                    <p className="text-sm font-semibold text-gray-800">
                                        Admin Name
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        admin@example.com
                                    </p>
                                </div>
                                <ul className="text-sm">
                                    <li>
                                        <a
                                            href="/admin/profile"
                                            className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                                        >
                                            My Profile
                                        </a>
                                    </li>
                                    <li>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                                        >
                                            Logout
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </header>

                {/* Main content */}
                <main className="flex-1 p-4 bg-gray-100 overflow-x-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
