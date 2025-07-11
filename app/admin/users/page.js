/** @format */
"use client";

import Link from "next/link";
import {
    CheckCircle2,
    XCircle,
    Clock,
    ChevronLeft,
    ChevronRight,
    Download,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Loader } from "@/components/loader";
import toast from "react-hot-toast";

export default function EnquiriesPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchEnquiries = async ({ queryKey }) => {
        const [, page] = queryKey;
        const token = localStorage.getItem("token");
        const res = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/enquiry?page=${page}&limit=${itemsPerPage}&type=enquiry`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return res.data;
    };

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["enquiries", currentPage],
        queryFn: fetchEnquiries,
        keepPreviousData: true,
    });

    console.log("user enquiries data: ");
    console.log(data);

    useEffect(() => {
        refetch();
    }, [currentPage]);

    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status }) => {
            const token = localStorage.getItem("token");
            const res = await axios.patch(
                `${process.env.NEXT_PUBLIC_API_URL}/enquiry/${id}/status`,
                { status },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return res.data;
        },
        onSuccess: () => {
            toast.success("Status updated successfully");
            refetch();
        },
        onError: () => {
            toast.error("Failed to update status");
        },
    });

    const handleApprove = (id) => {
        updateStatusMutation.mutate({ id, status: "contacted" });
    };

    const handleReject = (id) => {
        updateStatusMutation.mutate({ id, status: "rejected" });
    };

    const StatusBadge = ({ status }) => {
        const baseClasses =
            "px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit";
        switch (status.toLowerCase()) {
            case "contacted":
                return (
                    <span
                        className={`${baseClasses} bg-green-50 text-green-700 border border-green-100`}
                    >
                        <CheckCircle2 size={14} /> Contacted
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

    if (isLoading) return <Loader />;
    if (isError)
        return (
            <div className="p-6 text-red-500">Failed to load enquiries.</div>
        );

    const enquiries = data?.data || [];
    const pagination = data?.pagination || { page: 1, pages: 1, total: 0 };

    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Enquiry Management
                    </h1>
                    <p className="text-gray-500">
                        Review and manage customer enquiries
                    </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors w-full sm:w-auto">
                    <Download size={16} />
                    <span>Export</span>
                </button>
            </div>

            {/* Desktop Table */}
            <div className="hidden sm:block bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {[
                                    "Name",
                                    "Contact",
                                    "Car Info",
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
                            {enquiries.map((enquiry) => (
                                <tr
                                    key={enquiry._id}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-medium text-gray-900">
                                            {enquiry?.name}
                                        </div>
                                        <div className="text-gray-500 text-sm">
                                            {enquiry?.email}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-900">
                                        {enquiry?.phone}
                                    </td>
                                    <td className="px-6 py-4 text-gray-900 font-mono">
                                        <div className="text-green-700">
                                            {enquiry?.car?._id || "N/A"}
                                        </div>
                                        <div className="text-red-700">
                                            {enquiry?.car?.brand?.name || "N/A"}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {enquiry?.car?.modelName?.name ||
                                                ""}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {new Date(
                                            enquiry?.createdAt
                                        ).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={enquiry.status} />
                                    </td>
                                    <td className="px-6 py-4">
                                        {enquiry.status.toLowerCase() ===
                                            "pending" && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() =>
                                                        handleApprove(
                                                            enquiry._id
                                                        )
                                                    }
                                                    disabled={
                                                        updateStatusMutation.isPending
                                                    }
                                                    className="px-3 py-1 text-green-700 bg-green-50 hover:bg-green-100 rounded-md flex items-center gap-1 text-sm"
                                                >
                                                    <CheckCircle2 size={16} />
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleReject(
                                                            enquiry._id
                                                        )
                                                    }
                                                    disabled={
                                                        updateStatusMutation.isPending
                                                    }
                                                    className="px-3 py-1 text-red-700 bg-red-50 hover:bg-red-100 rounded-md flex items-center gap-1 text-sm"
                                                >
                                                    <XCircle size={16} />
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile View Cards */}
            <div className="sm:hidden space-y-4">
                {enquiries.map((enquiry) => (
                    <div
                        key={enquiry._id}
                        className="bg-white p-4 rounded-xl shadow border space-y-2"
                    >
                        <div className="text-sm">
                            <strong>Name:</strong> {enquiry.name}
                        </div>
                        <div className="text-sm text-gray-600 break-words">
                            <strong>Email:</strong> {enquiry.email}
                        </div>
                        <div className="text-sm">
                            <strong>Phone:</strong> {enquiry.phone}
                        </div>
                        <div className="text-sm break-all">
                            <strong>Car ID:</strong>{" "}
                            {enquiry?.car?.brand?.name || "N/A"}
                        </div>
                        <div className="text-sm text-gray-600">
                            <strong>Model:</strong>{" "}
                            {enquiry?.car?.modelName?.name || "—"}
                        </div>
                        <div className="text-sm">
                            <strong>Date:</strong>{" "}
                            {new Date(enquiry.createdAt).toLocaleDateString()}
                        </div>
                        <StatusBadge status={enquiry.status} />
                        {enquiry.status.toLowerCase() === "pending" && (
                            <div className="flex gap-2 mt-2">
                                <button
                                    onClick={() => handleApprove(enquiry._id)}
                                    className="px-3 py-1 text-green-700 bg-green-50 hover:bg-green-100 rounded-md flex items-center gap-1 text-sm w-full"
                                >
                                    <CheckCircle2 size={16} />
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleReject(enquiry._id)}
                                    className="px-3 py-1 text-red-700 bg-red-50 hover:bg-red-100 rounded-md flex items-center gap-1 text-sm w-full"
                                >
                                    <XCircle size={16} />
                                    Reject
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-500">
                    Showing page{" "}
                    <span className="font-medium text-gray-700">
                        {pagination.page}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-gray-700">
                        {pagination.pages}
                    </span>{" "}
                    ({pagination.total} enquiries)
                </div>
                <div className="flex gap-1">
                    <button
                        onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="p-2 rounded-md border border-gray-200 bg-white text-gray-700 disabled:opacity-50 hover:bg-gray-50"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    {Array.from(
                        { length: pagination.pages },
                        (_, i) => i + 1
                    ).map((page) => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-10 h-10 rounded-md border text-sm ${
                                currentPage === page
                                    ? "border-blue-500 bg-blue-50 text-blue-600"
                                    : "border-gray-200 bg-white text-gray-700"
                            } hover:bg-gray-50`}
                        >
                            {page}
                        </button>
                    ))}
                    <button
                        onClick={() =>
                            setCurrentPage((prev) =>
                                Math.min(prev + 1, pagination.pages)
                            )
                        }
                        disabled={currentPage === pagination.pages}
                        className="p-2 rounded-md border border-gray-200 bg-white text-gray-700 disabled:opacity-50 hover:bg-gray-50"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
