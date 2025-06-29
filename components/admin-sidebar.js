/** @format */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    Car,
    Gavel,
    ClipboardList,
    Tags,
} from "lucide-react";

const menuItems = [
    {
        title: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Brands",
        href: "/admin/brands",
        icon: Tags,
    },
    {
        title: "Cars",
        href: "/admin/cars",
        icon: Car,
    },
    {
        title: "Users Enquiry",
        href: "/admin/users",
        icon: ClipboardList,
    },
    {
        title: "Bidding",
        href: "/admin/users/bidding",
        icon: Gavel,
    },
    {
        title: "Sell Requests",
        href: "/admin/sell-request",
        icon: Package,
    },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-full md:w-64 bg-gray-800 text-white p-4 md:min-h-screen">
            <h1 className="text-xl font-bold mb-6">Admin Panel</h1>
            <nav>
                <ul className="space-y-2">
                    {menuItems.map(({ title, href, icon: Icon }) => {
                        const isActive = pathname === href;
                        return (
                            <li key={href}>
                                <Link
                                    href={href}
                                    className={`flex items-center p-2 rounded transition-colors ${
                                        isActive
                                            ? "bg-gray-700"
                                            : "hover:bg-gray-700"
                                    }`}
                                >
                                    <Icon className="mr-2" size={18} />
                                    <span>{title}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </aside>
    );
}
