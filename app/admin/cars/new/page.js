/** @format */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const FUEL_TYPES = ["Petrol", "Diesel", "Electric", "Hybrid", "CNG"];
const TRANSMISSIONS = ["Automatic", "Manual"];

export default function AddCarPage() {
    const router = useRouter();

    const [form, setForm] = useState({
        brand: "",
        model: "",
        year: "",
        price: "",
        mileage: "",
        fuelType: "",
        transmission: "",
        color: "",
        description: "",
        images: [],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setForm((prev) => ({ ...prev, images: files }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => {
            if (key === "images") {
                value.forEach((file) => formData.append("images", file));
            } else {
                formData.append(key, value);
            }
        });

        try {
            const res = await fetch("/api/cars", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                alert("Car added successfully!");
                router.push("/admin/cars");
            } else {
                alert("Error adding car.");
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4 md:px-10">
            <div className="max-w-5xl mx-auto bg-white shadow-md rounded-2xl p-8 md:p-10">
                <h1 className="text-3xl font-semibold text-gray-800 mb-2">
                    🚗 Add New Car
                </h1>
                <p className="text-gray-500 mb-8">
                    Fill in the car details to add it to the inventory.
                </p>

                <form onSubmit={handleSubmit} className="space-y-10">
                    {/* Car Info */}
                    <div className="bg-gray-50 rounded-xl shadow-sm p-6 space-y-6">
                        <h2 className="text-xl font-semibold text-gray-700">
                            Car Information
                        </h2>

                        <div className="grid md:grid-cols-3 gap-4">
                            <Input
                                name="brand"
                                label="Brand ID *"
                                value={form.brand}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                name="model"
                                label="Model *"
                                value={form.model}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                name="year"
                                label="Year *"
                                type="number"
                                value={form.year}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                            <Input
                                name="price"
                                label="Price ($) *"
                                type="number"
                                value={form.price}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                name="mileage"
                                label="Mileage"
                                type="number"
                                value={form.mileage}
                                onChange={handleChange}
                            />
                            <Input
                                name="color"
                                label="Color"
                                value={form.color}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Specifications */}
                    <div className="bg-gray-50 rounded-xl shadow-sm p-6 space-y-6">
                        <h2 className="text-xl font-semibold text-gray-700">
                            Specifications
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <Select
                                name="fuelType"
                                label="Fuel Type *"
                                value={form.fuelType}
                                options={FUEL_TYPES}
                                onChange={handleChange}
                                required
                            />
                            <Select
                                name="transmission"
                                label="Transmission *"
                                value={form.transmission}
                                options={TRANSMISSIONS}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Images */}
                    <div className="bg-gray-50 rounded-xl shadow-sm p-6 space-y-4">
                        <h2 className="text-xl font-semibold text-gray-700">
                            Images
                        </h2>

                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-700 bg-white focus:outline-none"
                        />

                        {form.images.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                {form.images.map((file, index) => (
                                    <img
                                        key={index}
                                        src={URL.createObjectURL(file)}
                                        alt={`preview-${index}`}
                                        className="h-28 w-full object-cover rounded-md shadow-sm"
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div className="bg-gray-50 rounded-xl shadow-sm p-6 space-y-4">
                        <h2 className="text-xl font-semibold text-gray-700">
                            Description
                        </h2>
                        <textarea
                            name="description"
                            rows={4}
                            placeholder="Write a detailed description..."
                            value={form.description}
                            onChange={handleChange}
                            className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-100"
                        />
                    </div>

                    {/* Submit */}
                    <div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
                        >
                            🚀 Submit Listing
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function Input({
    name,
    label,
    type = "text",
    value,
    onChange,
    required = false,
}) {
    return (
        <div>
            <label className="text-sm text-gray-600">{label}</label>
            <input
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                required={required}
                className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-100"
            />
        </div>
    );
}

function Select({ name, label, value, options, onChange, required = false }) {
    return (
        <div>
            <label className="text-sm text-gray-600">{label}</label>
            <select
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-100"
            >
                <option value="">Select</option>
                {options.map((opt) => (
                    <option key={opt} value={opt}>
                        {opt}
                    </option>
                ))}
            </select>
        </div>
    );
}
