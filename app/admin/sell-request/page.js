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
    Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Loader } from "@/components/loader";

const fetchSellRequests = async (page, limit, token) => {
    const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/sell/car?page=${page}&limit=${limit}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return data;
};

const updateSellRequestStatus = async ({ id, status, token }) => {
    await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/sell/car/${id}/status`,
        { status },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const StatusBadge = ({ status }) => {
    const base =
        "px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit";
    if (status === "approved")
        return (
            <span className={`${base} bg-green-50 text-green-700`}>
                <CheckCircle2 size={14} /> Approved
            </span>
        );
    if (status === "rejected")
        return (
            <span className={`${base} bg-red-50 text-red-700`}>
                <XCircle size={14} /> Rejected
            </span>
        );
    return (
        <span className={`${base} bg-yellow-50 text-yellow-700`}>
            <Clock size={14} /> Pending
        </span>
    );
};

export default function SellRequestsPage() {
    const [page, setPage] = useState(1);
    const limit = 10;
    const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : "";
    const [updatingStatusId, setUpdatingStatusId] = useState(null);
    const [updatingAction, setUpdatingAction] = useState(null);

    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ["sell-requests", page],
        queryFn: () => fetchSellRequests(page, limit, token),
        keepPreviousData: true,
    });

    const mutation = useMutation({
        mutationFn: ({ id, status }) =>
            updateSellRequestStatus({ id, status, token }),
        onMutate: ({ id, status }) => {
            setUpdatingStatusId(id);
            setUpdatingAction(status);
        },
        onSuccess: () => {
            toast.success("Status updated successfully");
            queryClient.invalidateQueries({ queryKey: ["sell-requests"] });
        },
        onError: () => {
            toast.error("Status update failed");
        },
        onSettled: () => {
            setUpdatingStatusId(null);
            setUpdatingAction(null);
        },
    });

    const sellRequests = data?.data || [];
    const total = data?.total || 0;
    const totalPages = data?.totalPages || 1;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Sell Requests
                    </h1>
                    <p className="text-gray-500">
                        Review and manage car sell requests
                    </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50">
                    <Download size={16} /> Export
                </button>
            </div>

            <div className="bg-white shadow-sm rounded-xl border overflow-x-auto">
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
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                                >
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {isLoading || sellRequests.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="text-center px-6 py-6 text-gray-500"
                                >
                                    {isLoading ? (
                                        <Loader />
                                    ) : (
                                        "No sell requests found."
                                    )}
                                </td>
                            </tr>
                        ) : (
                            sellRequests.map((req) => (
                                <tr key={req._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={
                                                    req.images?.[0]
                                                        ? `http://localhost:5000/uploads/cars/${req.images[0]}`
                                                        : "/fallback-car.jpg"
                                                }
                                                alt={req.modelName}
                                                className="w-16 h-12 object-cover rounded-md"
                                            />
                                            <div>
                                                <div className="font-medium text-gray-900">
                                                    {req.brand?.name}{" "}
                                                    {req.modelName}
                                                </div>
                                                <div className="text-gray-500 text-sm">
                                                    Year: {req.year}
                                                </div>
                                                <div className="text-gray-500 text-sm capitalize">
                                                    {req.condition}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <div className="font-medium text-gray-900">
                                            {req.sellerName}
                                        </div>
                                        <div className="text-gray-500">
                                            {req.sellerPhone}
                                        </div>
                                        <div className="text-gray-500">
                                            {req.sellerEmail}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        ₹{req.expectedPrice?.toLocaleString()}
                                        <div className="text-gray-500">
                                            {req.mileage?.toLocaleString()} km
                                        </div>
                                        <div className="capitalize text-gray-500">
                                            {req.fuelType}, {req.transmission}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {formatDate(req.createdAt)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={req.status} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            {req.status === "pending" && (
                                                <>
                                                    <button
                                                        onClick={() =>
                                                            mutation.mutate({
                                                                id: req._id,
                                                                status: "approved",
                                                            })
                                                        }
                                                        disabled={
                                                            updatingStatusId ===
                                                            req._id
                                                        }
                                                        className={`px-3 py-1 text-green-700 bg-green-50 hover:bg-green-100 rounded flex items-center gap-1 ${
                                                            updatingStatusId ===
                                                                req._id &&
                                                            updatingAction ===
                                                                "approved"
                                                                ? "opacity-50 cursor-not-allowed"
                                                                : ""
                                                        }`}
                                                    >
                                                        {updatingStatusId ===
                                                            req._id &&
                                                        updatingAction ===
                                                            "approved" ? (
                                                            <Loader2
                                                                size={14}
                                                                className="animate-spin"
                                                            />
                                                        ) : (
                                                            <CheckCircle2
                                                                size={14}
                                                            />
                                                        )}
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            mutation.mutate({
                                                                id: req._id,
                                                                status: "rejected",
                                                            })
                                                        }
                                                        disabled={
                                                            updatingStatusId ===
                                                            req._id
                                                        }
                                                        className={`px-3 py-1 text-red-700 bg-red-50 hover:bg-red-100 rounded flex items-center gap-1 ${
                                                            updatingStatusId ===
                                                                req._id &&
                                                            updatingAction ===
                                                                "rejected"
                                                                ? "opacity-50 cursor-not-allowed"
                                                                : ""
                                                        }`}
                                                    >
                                                        {updatingStatusId ===
                                                            req._id &&
                                                        updatingAction ===
                                                            "rejected" ? (
                                                            <Loader2
                                                                size={14}
                                                                className="animate-spin"
                                                            />
                                                        ) : (
                                                            <XCircle
                                                                size={14}
                                                            />
                                                        )}
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                    Showing{" "}
                    <span className="font-medium text-gray-700">
                        {(page - 1) * limit + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium text-gray-700">
                        {Math.min(page * limit, total)}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-gray-700">{total}</span>{" "}
                    results
                </div>
                <div className="flex gap-1">
                    <button
                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                        disabled={page === 1}
                        className="p-2 rounded-md border border-gray-300 bg-white text-gray-700 disabled:opacity-50"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (p) => (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={`w-10 h-10 rounded-md border ${
                                    p === page
                                        ? "border-blue-500 bg-blue-50 text-blue-600"
                                        : "border-gray-200 bg-white text-gray-700"
                                }`}
                            >
                                {p}
                            </button>
                        )
                    )}
                    <button
                        onClick={() =>
                            setPage((p) => Math.min(p + 1, totalPages))
                        }
                        disabled={page === totalPages}
                        className="p-2 rounded-md border border-gray-300 bg-white text-gray-700 disabled:opacity-50"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
