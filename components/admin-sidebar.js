/** @format */

import Link from "next/link";
import { LayoutDashboard, Users, Package, Settings } from "lucide-react";

export default function AdminSidebar() {
    return (
        <div className="w-64 bg-gray-800 text-white p-4">
            <h1 className="text-xl font-bold mb-6">Admin Panel</h1>
            <nav>
                <ul className="space-y-2">
                    <li>
                        <Link
                            href="/admin/dashboard"
                            className="flex items-center p-2 rounded hover:bg-gray-700"
                        >
                            <LayoutDashboard className="mr-2" />
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/admin/cars"
                            className="flex items-center p-2 rounded hover:bg-gray-700"
                        >
                            <Package className="mr-2" />
                            Cars
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/admin/users"
                            className="flex items-center p-2 rounded hover:bg-gray-700"
                        >
                            <Users className="mr-2" />
                            Users Enquiry
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/admin/sell-request"
                            className="flex items-center p-2 rounded hover:bg-gray-700"
                        >
                            <Package className="mr-2" />
                            Sell Requests
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/admin/settings"
                            className="flex items-center p-2 rounded hover:bg-gray-700"
                        >
                            <Settings className="mr-2" />
                            Settings
                        </Link>
                    </li>
                    {/* <li>
            <Link href="/admin/speed" className="flex items-center p-2 rounded hover:bg-gray-700">
              <Users className="mr-2" />
              Speed Test
            </Link>
          </li> */}
                </ul>
            </nav>
        </div>
    );
}
