/** @format */

"use client";

import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";

export default function BrandModelPage() {
    const { brandId } = useParams();
    const queryClient = useQueryClient();
    const [name, setName] = useState("");

    const fetchModels = async () => {
        const res = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/brand/model/${brandId}`
        );
        return res.data;
    };

    const { data, isLoading } = useQuery({
        queryKey: ["models", brandId],
        queryFn: fetchModels,
    });

    const createMutation = useMutation({
        mutationFn: async () => {
            const token = localStorage.getItem("token");
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/brand/model`,
                {
                    brand: brandId,
                    name,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
        },
        onSuccess: () => {
            toast.success("Model added");
            setName("");
            queryClient.invalidateQueries({ queryKey: ["models", brandId] });
        },
        onError: () => toast.error("Failed to add model"),
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            const token = localStorage.getItem("token");
            await axios.delete(
                `${process.env.NEXT_PUBLIC_API_URL}/brand/model/${id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
        },
        onSuccess: () => {
            toast.success("Model deleted");
            queryClient.invalidateQueries({ queryKey: ["models", brandId] });
        },
        onError: () => toast.error("Failed to delete model"),
    });

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
                Manage Models
            </h1>

            {/* Form */}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    if (!name) return toast.error("Enter model name");
                    createMutation.mutate();
                }}
                className="mb-4 flex gap-4 items-center"
            >
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Model name"
                    className="border px-3 py-2 rounded"
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Add Model
                </button>
            </form>

            {/* Models List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {isLoading ? (
                    <p>Loading models...</p>
                ) : data?.data?.length > 0 ? (
                    data.data.map((model) => (
                        <div
                            key={model._id}
                            className="bg-white p-4 rounded shadow flex justify-between items-center"
                        >
                            <span className="capitalize font-medium">
                                {model.name}
                            </span>
                            <button
                                onClick={() => {
                                    if (
                                        confirm(
                                            "Delete this model permanently?"
                                        )
                                    ) {
                                        deleteMutation.mutate(model._id);
                                    }
                                }}
                                className="text-red-600 hover:underline text-sm flex items-center gap-1"
                            >
                                <Trash2 size={14} /> Delete
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No models found for this brand.</p>
                )}
            </div>
        </div>
    );
}
