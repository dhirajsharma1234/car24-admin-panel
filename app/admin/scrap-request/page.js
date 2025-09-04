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
    Eye,
    Phone,
    Mail,
    MapPin,
} from "lucide-react";
import toast from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Loader } from "@/components/loader";

const fetchScrapRequests = async (page, limit, token) => {
    const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/scrap/car/requests?page=${page}&limit=${limit}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return data;
};

const updateScrapRequestStatus = async ({ id, status, token }) => {
    await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/scrap/car/requests/${id}/status`,
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

const CarBrandLogo = ({ brand }) => {
    // Simple mapping of car brands to emojis for visual representation
    const brandEmojis = {
        toyota: "🇯🇵",
        honda: "🚗",
        ford: "🇺🇸",
        maruti: "🇮🇳",
        hyundai: "🚙",
        tata: "🐯",
        mahindra: "🐘",
        default: "🚘",
    };

    const brandKey = brand?.toLowerCase() || "default";
    const emoji = brandEmojis[brandKey] || brandEmojis.default;

    return (
        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-lg">
            {emoji}
        </div>
    );
};

export default function ScrapRequestsPage() {
    const [page, setPage] = useState(1);
    const limit = 10;
    const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : "";
    const [updatingStatusId, setUpdatingStatusId] = useState(null);
    const [updatingAction, setUpdatingAction] = useState(null);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ["scrap-requests", page],
        queryFn: () => fetchScrapRequests(page, limit, token),
        keepPreviousData: true,
    });

    const mutation = useMutation({
        mutationFn: ({ id, status }) =>
            updateScrapRequestStatus({ id, status, token }),
        onMutate: ({ id, status }) => {
            setUpdatingStatusId(id);
            setUpdatingAction(status);
        },
        onSuccess: () => {
            toast.success("Status updated successfully");
            queryClient.invalidateQueries({ queryKey: ["scrap-requests"] });
        },
        onError: () => {
            toast.error("Status update failed");
        },
        onSettled: () => {
            setUpdatingStatusId(null);
            setUpdatingAction(null);
        },
    });

    const scrapRequests = data?.data || [];
    const total = data?.total || 0;
    const totalPages = data?.totalPages || 1;

    const openDetailsModal = (request) => {
        setSelectedRequest(request);
        setIsDetailModalOpen(true);
    };

    const closeDetailsModal = () => {
        setIsDetailModalOpen(false);
        setSelectedRequest(null);
    };

    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Scrap Requests
                    </h1>
                    <p className="text-gray-500">
                        Review and manage car scrap requests
                    </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 w-full sm:w-auto">
                    <Download size={16} /> Export
                </button>
            </div>

            <div className="bg-white shadow-sm rounded-xl border overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            {[
                                "Car Details",
                                "Customer",
                                "Location",
                                "Date",
                                "Status",
                            ].map((col) => (
                                <th
                                    key={col}
                                    className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                                >
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {isLoading || scrapRequests.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="text-center px-6 py-6 text-gray-500"
                                >
                                    {isLoading ? (
                                        <Loader />
                                    ) : (
                                        "No scrap requests found."
                                    )}
                                </td>
                            </tr>
                        ) : (
                            scrapRequests.map((req) => (
                                <tr key={req._id} className="hover:bg-gray-50">
                                    <td className="px-4 sm:px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <CarBrandLogo
                                                brand={req.carBrand}
                                            />
                                            <div>
                                                <div className="font-medium text-gray-900">
                                                    {req.carBrand} {req.model}
                                                </div>
                                                <div className="text-gray-500 text-sm">
                                                    Year: {req.year}
                                                </div>
                                                <div className="text-gray-500 text-sm capitalize">
                                                    {req.fuelType}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 sm:px-6 py-4">
                                        <div className="font-medium text-gray-900">
                                            {req.name}
                                        </div>
                                        <div className="text-gray-500 text-sm flex items-center gap-1">
                                            <Phone size={14} />{" "}
                                            {req.phoneNumber}
                                        </div>
                                        <div className="text-gray-500 text-sm flex items-center gap-1">
                                            <Mail size={14} /> {req.emailId}
                                        </div>
                                    </td>
                                    <td className="px-4 sm:px-6 py-4">
                                        <div className="text-gray-900 text-sm flex items-center gap-1">
                                            <MapPin size={14} /> {req.city}
                                        </div>
                                    </td>
                                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-500">
                                        {formatDate(req.createdAt)}
                                    </td>
                                    <td className="px-4 sm:px-6 py-4">
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <button
                                                onClick={() =>
                                                    openDetailsModal(req)
                                                }
                                                className="px-3 py-1 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded flex items-center gap-1 justify-center text-xs sm:text-sm"
                                            >
                                                <Eye size={14} /> View
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

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
                                className={`w-10 h-10 rounded-md border text-sm ${
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

            {/* Details Modal */}
            {isDetailModalOpen && selectedRequest && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-800">
                                    Scrap Request Details
                                </h2>
                                <button
                                    onClick={closeDetailsModal}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <XCircle size={24} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-medium text-gray-700 mb-2">
                                        Car Information
                                    </h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">
                                                Brand:
                                            </span>
                                            <span className="font-medium">
                                                {selectedRequest.carBrand}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">
                                                Model:
                                            </span>
                                            <span className="font-medium">
                                                {selectedRequest.model}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">
                                                Year:
                                            </span>
                                            <span className="font-medium">
                                                {selectedRequest.year}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">
                                                Fuel Type:
                                            </span>
                                            <span className="font-medium capitalize">
                                                {selectedRequest.fuelType}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-medium text-gray-700 mb-2">
                                        Customer Information
                                    </h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">
                                                Name:
                                            </span>
                                            <span className="font-medium">
                                                {selectedRequest.name}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">
                                                Phone:
                                            </span>
                                            <span className="font-medium">
                                                {selectedRequest.phoneNumber}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">
                                                Email:
                                            </span>
                                            <span className="font-medium">
                                                {selectedRequest.emailId}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">
                                                City:
                                            </span>
                                            <span className="font-medium">
                                                {selectedRequest.city}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-200">
                                <h3 className="font-medium text-gray-700 mb-2">
                                    Request Date
                                </h3>
                                <p className="text-gray-500">
                                    {formatDate(selectedRequest.createdAt)}
                                </p>
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    onClick={closeDetailsModal}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                >
                                    Close
                                </button>
                                {selectedRequest.status === "pending" && (
                                    <>
                                        <button
                                            onClick={() => {
                                                mutation.mutate({
                                                    id: selectedRequest._id,
                                                    status: "approved",
                                                });
                                                closeDetailsModal();
                                            }}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                                        >
                                            <CheckCircle2 size={16} /> Approve
                                        </button>
                                        <button
                                            onClick={() => {
                                                mutation.mutate({
                                                    id: selectedRequest._id,
                                                    status: "rejected",
                                                });
                                                closeDetailsModal();
                                            }}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                                        >
                                            <XCircle size={16} /> Reject
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
