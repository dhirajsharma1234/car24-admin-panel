/** @format */
"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import {
    Download,
    Plus,
    Edit,
    Trash2,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { Loader } from "@/components/loader";
import useAuthRedirect from "@/hooks/useAuthRedirect";
import toast from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const fetchCars = async ({ queryKey }) => {
    const [_key, page, limit, search] = queryKey;
    const token = localStorage.getItem("token");
    const res = await axios.get(
        `http://localhost:5000/api/car/all?page=${page}&limit=${limit}&search=${search}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return res.data;
};

const deleteCar = async (id) => {
    const token = localStorage.getItem("token");
    await axios.delete(`http://localhost:5000/api/car/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export default function CarListPage() {
    useAuthRedirect();

    const queryClient = useQueryClient();
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);

    const { data, isLoading } = useQuery({
        queryKey: ["cars", page, limit, search],
        queryFn: fetchCars,
        keepPreviousData: true,
    });

    const mutation = useMutation({
        mutationFn: deleteCar,
        onSuccess: () => {
            toast.success("Car deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["cars"] });
        },
        onError: () => {
            toast.error("Failed to delete car");
        },
    });

    const cars = data?.cars || [];
    const pagination = data?.pagination || {
        total: 0,
        page: 1,
        pages: 1,
        limit: 10,
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="flex justify-between items-center mb-6 flex-col md:flex-row gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Car Inventory
                    </h1>
                    <p className="text-gray-500">Manage your car listings</p>
                </div>
                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => {
                            setPage(1);
                            setSearch(e.target.value);
                        }}
                        placeholder="Search brand, model, fuel..."
                        className="border border-gray-300 px-3 py-2 rounded-lg text-sm w-full md:w-64"
                    />
                    <select
                        value={limit}
                        onChange={(e) => {
                            setPage(1);
                            setLimit(Number(e.target.value));
                        }}
                        className="border border-gray-300 px-2 py-2 rounded-lg text-sm"
                    >
                        {[5, 10, 20, 50].map((n) => (
                            <option key={n} value={n}>
                                {n} per page
                            </option>
                        ))}
                    </select>
                    <button className="px-4 py-2 border bg-white text-gray-700 rounded-lg flex items-center gap-2">
                        <Download size={16} /> Export
                    </button>
                    <Link
                        href="/admin/cars/new"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700"
                    >
                        <Plus size={16} /> Add Car
                    </Link>
                </div>
            </div>

            {isLoading ? (
                <Loader />
            ) : (
                <div className="bg-white shadow-sm rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm table-fixed divide-y divide-gray-200">
                            <thead className="bg-gray-100 text-gray-600 text-left">
                                <tr>
                                    <th className="px-4 py-3 w-1/3">Car</th>
                                    <th className="px-4 py-3 w-1/4">Details</th>
                                    <th className="px-4 py-3 w-1/4">Status</th>
                                    <th className="px-4 py-3 w-1/5">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cars.length > 0 ? (
                                    cars.map((car) => (
                                        <tr
                                            key={car._id}
                                            className="hover:bg-gray-50 border-t transition"
                                        >
                                            <td className="px-4 py-3 align-top">
                                                <div className="flex items-start gap-3">
                                                    <img
                                                        src={
                                                            car.images?.[0]
                                                                ? `http://localhost:5000/uploads/cars/${car.images[0]}`
                                                                : "/fallback-car.jpg"
                                                        }
                                                        alt="car"
                                                        className="w-16 h-12 object-cover rounded-md"
                                                    />
                                                    <div className="space-y-0.5">
                                                        <p className="font-semibold text-gray-900 text-sm">
                                                            {car.brand?.name}{" "}
                                                            {car.modelName}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            Year: {car.year}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            Color: {car.color}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-gray-700 align-top">
                                                <div className="space-y-1">
                                                    <p className="capitalize">
                                                        {car.fuelType}
                                                    </p>
                                                    <p className="capitalize">
                                                        {car.transmission}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {car.mileage?.toLocaleString()}{" "}
                                                        km
                                                    </p>
                                                    <p className="text-sm font-semibold">
                                                        ₹
                                                        {car.price?.toLocaleString()}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 align-top">
                                                <div className="flex flex-col gap-1">
                                                    <span
                                                        className={`px-2 py-1 text-xs rounded-full font-medium w-fit ${
                                                            car.isApproved
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-yellow-100 text-yellow-800"
                                                        }`}
                                                    >
                                                        {car.isApproved
                                                            ? "Approved"
                                                            : "Pending"}
                                                    </span>
                                                    <span
                                                        className={`px-2 py-1 text-xs rounded-full font-medium w-fit ${
                                                            car.isFeatured
                                                                ? "bg-purple-100 text-purple-800"
                                                                : "bg-gray-100 text-gray-800"
                                                        }`}
                                                    >
                                                        {car.isFeatured
                                                            ? "Featured"
                                                            : "Not Featured"}
                                                    </span>
                                                    <span
                                                        className={`px-2 py-1 text-xs rounded-full font-medium w-fit ${
                                                            car.isSold
                                                                ? "bg-red-100 text-red-800"
                                                                : "bg-blue-100 text-blue-800"
                                                        }`}
                                                    >
                                                        {car.isSold
                                                            ? "Sold"
                                                            : "Available"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 align-top">
                                                <div className="flex gap-2">
                                                    <Link
                                                        href={`/admin/cars/${car._id}/edit`}
                                                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 flex items-center gap-1 text-xs"
                                                    >
                                                        <Edit size={14} />
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => {
                                                            if (
                                                                confirm(
                                                                    "Are you sure to delete this car?"
                                                                )
                                                            ) {
                                                                mutation.mutate(
                                                                    car._id
                                                                );
                                                            }
                                                        }}
                                                        className="px-3 py-1 bg-red-50 text-red-700 rounded hover:bg-red-100 flex items-center gap-1 text-xs"
                                                    >
                                                        <Trash2 size={14} />
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-4 py-6 text-center text-gray-500"
                                        >
                                            No cars found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {pagination.pages > 1 && (
                        <div className="flex justify-center items-center gap-2 px-4 py-4 border-t">
                            <button
                                onClick={() =>
                                    setPage((p) => Math.max(p - 1, 1))
                                }
                                disabled={page === 1}
                                className="p-2 rounded border border-gray-300 bg-white text-gray-700 disabled:opacity-50"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            {Array.from(
                                { length: pagination.pages },
                                (_, i) => i + 1
                            ).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={`w-8 h-8 rounded border text-sm ${
                                        page === p
                                            ? "bg-blue-600 text-white border-blue-600"
                                            : "bg-white text-gray-700 border-gray-300"
                                    }`}
                                >
                                    {p}
                                </button>
                            ))}
                            <button
                                onClick={() =>
                                    setPage((p) =>
                                        Math.min(p + 1, pagination.pages)
                                    )
                                }
                                disabled={page === pagination.pages}
                                className="p-2 rounded border border-gray-300 bg-white text-gray-700 disabled:opacity-50"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
