/** @format */

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useRef } from "react";
import axios from "axios";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { Loader } from "@/components/loader";
import toast from "react-hot-toast";

const fetchBrands = async ({ queryKey }) => {
    const [_key, page, limit] = queryKey;
    const token = localStorage.getItem("token");
    const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/brand/all?page=${page}&limit=${limit}`,
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    return res.data;
};

const deleteBrand = async (id) => {
    const token = localStorage.getItem("token");
    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/brand/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

const createBrand = async (formData) => {
    const token = localStorage.getItem("token");
    await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/brand/create`,
        formData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        }
    );
};

export default function BrandListPage() {
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const queryClient = useQueryClient();
    const logoRef = useRef();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const { data, isLoading } = useQuery({
        queryKey: ["brands", page, limit],
        queryFn: fetchBrands,
        keepPreviousData: true,
    });

    const deleteMutation = useMutation({
        mutationFn: deleteBrand,
        onSuccess: () => {
            toast.success("Brand deleted");
            queryClient.invalidateQueries({ queryKey: ["brands"] });
        },
        onError: () => toast.error("Failed to delete brand"),
    });

    const addMutation = useMutation({
        mutationFn: createBrand,
        onSuccess: () => {
            toast.success("Brand added");
            queryClient.invalidateQueries({ queryKey: ["brands"] });
            setName("");
            setDescription("");
            logoRef.current.value = "";
        },
        onError: () => toast.error("Failed to add brand"),
    });

    const brands = data?.data || [];
    const pagination = {
        total: data?.total || 0,
        page: data?.page || 1,
        totalPages: data?.totalPages || 1,
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const file = logoRef.current.files[0];
        if (!file || !name || !description)
            return toast.error("Fill all fields");

        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("logo", file);
        addMutation.mutate(formData);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
                Car Brands
            </h1>

            <form
                onSubmit={handleSubmit}
                className="mb-6 grid gap-4 grid-cols-1 md:grid-cols-3 items-end"
            >
                <input
                    type="text"
                    placeholder="Brand name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border px-3 py-2 rounded"
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="border px-3 py-2 rounded"
                />
                <input
                    type="file"
                    ref={logoRef}
                    className="border px-3 py-2 rounded"
                />
                <button
                    type="submit"
                    className="bg-gray-800 text-white px-4 py-2 rounded col-span-1 md:col-span-3 hover:bg-blue-700"
                >
                    Add Brand
                </button>
            </form>

            {isLoading ? (
                <Loader />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {brands.map((brand) => (
                        <div
                            key={brand._id}
                            className="bg-white shadow-sm rounded-lg p-4 flex flex-col items-center text-center"
                        >
                            <Image
                                src={`https://cardikhao-production.up.railway.app/uploads/brands/${brand.logo}`}
                                alt={brand.name}
                                width={80}
                                height={80}
                                className="object-contain mb-2"
                            />
                            <h2 className="text-lg font-semibold text-gray-800 capitalize">
                                {brand.name}
                            </h2>
                            <p className="text-sm text-gray-500 mb-2">
                                {brand.description}
                            </p>
                            <button
                                onClick={() => {
                                    if (
                                        confirm(
                                            "Are you sure you want to delete this brand?"
                                        )
                                    ) {
                                        deleteMutation.mutate(brand._id);
                                    }
                                }}
                                className="text-red-600 text-sm flex items-center gap-1 hover:underline"
                            >
                                <Trash2 size={14} /> Delete
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                    <button
                        onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                        disabled={page === 1}
                        className="p-2 border rounded bg-white disabled:opacity-50"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    {Array.from(
                        { length: pagination.totalPages },
                        (_, i) => i + 1
                    ).map((p) => (
                        <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`w-8 h-8 border rounded text-sm ${
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
                            setPage((prev) =>
                                Math.min(pagination.totalPages, prev + 1)
                            )
                        }
                        disabled={page === pagination.totalPages}
                        className="p-2 border rounded bg-white disabled:opacity-50"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}
        </div>
    );
}
