/** @format */

"use client";

import { useState } from "react";
import {
    CheckCircle2,
    XCircle,
    Clock,
    ChevronLeft,
    ChevronRight,
    Download,
} from "lucide-react";
import Link from "next/link";

const sellRequests = [
    {
        _id: "65b2c3d4e5f6g7h8i9j0k1l",
        brand: { _id: "65a1b2c3d4e5f6g7h8i9j1m", name: "Toyota" },
        model: "Corolla",
        year: 2020,
        expectedPrice: 18500,
        mileage: 35000,
        fuelType: "Petrol",
        images: [
            "https://media.istockphoto.com/id/2157069693/photo/smiling-man-with-glasses-sitting-in-modern-living-room-with-bookshelf-background.jpg?s=1024x1024&w=is&k=20&c=Xe8CQUv-QiUraT0nCB6YEtOqZr1kmq10m3aPko_RLoY=",
        ],
        status: "pending",
        user: {
            _id: "65a1b2c3d4e5f6g7h8i9j1n",
            name: "Michael Brown",
            email: "michael@example.com",
            phone: "456-789-0123",
        },
        createdAt: "2023-12-10T08:20:00Z",
    },
    {
        _id: "65b2c3d4e5f6g7h8i9j0k1m",
        brand: { _id: "65a1b2c3d4e5f6g7h8i9j1o", name: "Honda" },
        model: "Accord",
        year: 2019,
        expectedPrice: 22000,
        mileage: 28000,
        fuelType: "Hybrid",
        images: [
            "https://media.istockphoto.com/id/2157069693/photo/smiling-man-with-glasses-sitting-in-modern-living-room-with-bookshelf-background.jpg?s=1024x1024&w=is&k=20&c=Xe8CQUv-QiUraT0nCB6YEtOqZr1kmq10m3aPko_RLoY=",
        ],
        status: "approved",
        user: {
            _id: "65a1b2c3d4e5f6g7h8i9j1p",
            name: "Sarah Wilson",
            email: "sarah@example.com",
            phone: "567-890-1234",
        },
        createdAt: "2023-12-08T11:45:00Z",
    },
];

// Date formatting utility
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

// Status badge component
const StatusBadge = ({ status }) => {
    const baseClasses =
        "px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit";

    switch (status) {
        case "approved":
            return (
                <span
                    className={`${baseClasses} bg-green-50 text-green-700 border border-green-100`}
                >
                    <CheckCircle2 size={14} /> Approved
                </span>
            );
        case "rejected":
            return (
                <span
                    className={`${baseClasses} bg-red-50 text-red-700 border border-red-100`}
                >
                    <XCircle size={14} /> Rejected
                </span>
            );
        default:
            return (
                <span
                    className={`${baseClasses} bg-yellow-50 text-yellow-700 border border-yellow-100`}
                >
                    <Clock size={14} /> Pending
                </span>
            );
    }
};

export default function SellRequestsPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(sellRequests.length / itemsPerPage);

    const handleStatusUpdate = async (id, newStatus) => {
        console.log(`Updating sell request ${id} to ${newStatus}`);
        // API call would go here
        // Example:
        // await fetch(`/api/sell-requests/${id}`, {
        //   method: 'PATCH',
        //   body: JSON.stringify({ status: newStatus })
        // })
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Sell Requests
                    </h1>
                    <p className="text-gray-500">
                        Review and manage car sell requests
                    </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                    <Download size={16} />
                    <span>Export</span>
                </button>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {[
                                    "Car Details",
                                    "Seller",
                                    "Request Details",
                                    "Date",
                                    "Status",
                                    "Actions",
                                ].map((col) => (
                                    <th
                                        key={col}
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sellRequests.map((request) => (
                                <tr
                                    key={request._id}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={request.images[0]}
                                                alt={`${request.brand.name} ${request.model}`}
                                                className="w-16 h-12 object-cover rounded-md"
                                            />
                                            <div>
                                                <div className="font-medium text-gray-900">
                                                    {request.brand.name}{" "}
                                                    {request.model}
                                                </div>
                                                <div className="text-gray-500 text-sm">
                                                    Year: {request.year}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-medium text-gray-900">
                                            {request.user.name}
                                        </div>
                                        <div className="text-gray-500 text-sm">
                                            {request.user.phone}
                                        </div>
                                        <div className="text-gray-500 text-sm">
                                            {request.user.email}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-gray-900">
                                            $
                                            {request.expectedPrice.toLocaleString()}
                                        </div>
                                        <div className="text-gray-500 text-sm">
                                            {request.mileage.toLocaleString()}{" "}
                                            miles
                                        </div>
                                        <div className="text-gray-500 text-sm capitalize">
                                            {request.fuelType.toLowerCase()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                        {formatDate(request.createdAt)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusBadge status={request.status} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center gap-3">
                                            {request.status === "pending" && (
                                                <>
                                                    <button
                                                        onClick={() =>
                                                            handleStatusUpdate(
                                                                request._id,
                                                                "approved"
                                                            )
                                                        }
                                                        className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors"
                                                    >
                                                        <CheckCircle2
                                                            size={16}
                                                        />
                                                        <span>Approve</span>
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleStatusUpdate(
                                                                request._id,
                                                                "rejected"
                                                            )
                                                        }
                                                        className="flex items-center gap-1 px-3 py-1 bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors"
                                                    >
                                                        <XCircle size={16} />
                                                        <span>Reject</span>
                                                    </button>
                                                </>
                                            )}
                                            <Link
                                                href={`/admin/sell-requests/${request._id}`}
                                                className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
                                            >
                                                <span>Details</span>
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                        Showing{" "}
                        <span className="font-medium text-gray-700">1</span> to{" "}
                        <span className="font-medium text-gray-700">
                            {Math.min(itemsPerPage, sellRequests.length)}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium text-gray-700">
                            {sellRequests.length}
                        </span>{" "}
                        results
                    </div>
                    <div className="flex gap-1">
                        <button
                            onClick={() =>
                                setCurrentPage((prev) => Math.max(prev - 1, 1))
                            }
                            disabled={currentPage === 1}
                            className="p-2 rounded-md border border-gray-200 bg-white text-gray-700 disabled:opacity-50 hover:bg-gray-50 transition-colors"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1
                        ).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-10 h-10 rounded-md border ${
                                    currentPage === page
                                        ? "border-blue-500 bg-blue-50 text-blue-600"
                                        : "border-gray-200 bg-white text-gray-700"
                                } hover:bg-gray-50 transition-colors`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={() =>
                                setCurrentPage((prev) =>
                                    Math.min(prev + 1, totalPages)
                                )
                            }
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-md border border-gray-200 bg-white text-gray-700 disabled:opacity-50 hover:bg-gray-50 transition-colors"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
