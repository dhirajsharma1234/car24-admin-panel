/** @format */

"use client";

import { Loader } from "@/components/loader";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AdminProfilePage() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/user/me`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                const json = await res.json();

                if (json.status && json.data) {
                    setForm({
                        name: json.data.name,
                        email: json.data.email,
                        password: "",
                    });
                } else {
                    toast.error("❌ Failed to load profile");
                }
            } catch (err) {
                console.error(err);
                toast.error("❌ Error fetching profile");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/user/update`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(form),
                }
            );

            const json = await res.json();
            if (res.ok && json.status) {
                toast.success("✅ Profile updated successfully");
            } else {
                toast.error(`❌ ${json.message || "Update failed"}`);
            }
        } catch (err) {
            console.error(err);
            toast.error("❌ Error updating profile");
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded-md">
            <h1 className="text-2xl font-semibold mb-4 text-gray-800">
                Admin Profile
            </h1>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                    />
                </div>

                {/* Password (optional) */}
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        New Password (optional)
                    </label>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="••••••••"
                    />
                </div>

                {/* Submit */}
                <div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}
