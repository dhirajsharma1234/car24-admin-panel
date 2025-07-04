/** @format */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import useAuthRedirect from "@/hooks/useAuthRedirect";

const FUEL_TYPES = ["Petrol", "Diesel", "Electric", "Hybrid", "CNG"];
const TRANSMISSIONS = ["Automatic", "Manual"];
const CONDITIONS = ["new", "used"];
const BODY_TYPES = [
    "SEDAN",
    "SUV",
    "HATCHBACK",
    "CONVERTIBLE",
    "COUPE",
    "PICKUP",
    "VAN",
    "WAGON",
];

export default function AddCarPage() {
    useAuthRedirect(); // 👈 Protect the route
    const router = useRouter();

    const [models, setModels] = useState([]);
    const [brands, setBrands] = useState([]);
    const [form, setForm] = useState({
        brand: "",
        modelName: "",
        year: "",
        price: "",
        mileage: "",
        kmRun: "",
        bodyType: "",
        fuelType: "",
        transmission: "",
        color: "",
        description: "",
        condition: "",
        isApproved: true,
        isFeatured: false,
        isSold: false,
        city: "",
        images: [],
    });

    // Fetch brands
    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/brand/all?page=1&limit=10`
                );
                const data = await res.json();
                setBrands(data.data || []);
            } catch (err) {
                console.error("Failed to fetch brands", err);
                toast.error("Failed to load brands");
            }
        };
        fetchBrands();
    }, []);

    //fetch Models When Brand Changes
    useEffect(() => {
        const fetchModels = async () => {
            if (!form.brand) return;
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/brand/model/${form.brand}`
                );
                const data = await res.json();
                setModels(data.data || []);
            } catch (err) {
                console.error("Failed to fetch models", err);
                toast.error("Failed to load models");
                setModels([]);
            }
        };

        fetchModels();
    }, [form.brand]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const finalValue = type === "checkbox" ? checked : value;
        setForm((prev) => ({ ...prev, [name]: finalValue }));
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
            const token = localStorage.getItem("token");
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/car/create`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                }
            );

            const result = await res.json();

            if (!res.ok)
                throw new Error(result.message || "Something went wrong");

            toast.success("Car added successfully!");
            router.push("/admin/cars");
        } catch (err) {
            console.error(err);
            toast.error(`Failed to add car: ${err.message}`);
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
                    <Section title="Car Information">
                        <div className="grid md:grid-cols-3 gap-4">
                            <Select
                                name="brand"
                                label="Brand *"
                                value={form.brand}
                                onChange={handleChange}
                                required
                                options={brands.map((b) => ({
                                    label: b.name,
                                    value: b._id,
                                }))}
                            />
                            <Select
                                name="modelName"
                                label="Model *"
                                value={form.modelName}
                                onChange={handleChange}
                                required
                                options={models.map((m) => ({
                                    label: m.name,
                                    value: m._id,
                                }))}
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
                                label="Price (₹) *"
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
                        <div className="grid md:grid-cols-3 gap-4">
                            <Select
                                name="bodyType"
                                label="Body Type *"
                                value={form.bodyType}
                                onChange={handleChange}
                                required
                                options={BODY_TYPES.map((type) => ({
                                    label: type,
                                    value: type,
                                }))}
                            />
                            <Input
                                name="kmRun"
                                label="Kilometers Run"
                                type="number"
                                value={form.kmRun}
                                onChange={handleChange}
                            />
                            <Input
                                name="city"
                                label="City"
                                value={form.city}
                                onChange={handleChange}
                            />
                        </div>
                    </Section>

                    <Section title="Specifications">
                        <div className="grid md:grid-cols-2 gap-4">
                            <Select
                                name="fuelType"
                                label="Fuel Type *"
                                value={form.fuelType}
                                options={FUEL_TYPES.map((v) => ({
                                    label: v,
                                    value: v,
                                }))}
                                onChange={handleChange}
                                required
                            />
                            <Select
                                name="transmission"
                                label="Transmission *"
                                value={form.transmission}
                                options={TRANSMISSIONS.map((v) => ({
                                    label: v,
                                    value: v,
                                }))}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <Select
                            name="condition"
                            label="Condition *"
                            value={form.condition}
                            options={CONDITIONS.map((v) => ({
                                label: v,
                                value: v,
                            }))}
                            onChange={handleChange}
                            required
                        />
                        <div className="flex flex-wrap gap-6 mt-4">
                            <Checkbox
                                name="isApproved"
                                label="Approved"
                                checked={form.isApproved}
                                onChange={handleChange}
                            />
                            <Checkbox
                                name="isFeatured"
                                label="Featured"
                                checked={form.isFeatured}
                                onChange={handleChange}
                            />
                            <Checkbox
                                name="isSold"
                                label="Sold"
                                checked={form.isSold}
                                onChange={handleChange}
                            />
                        </div>
                    </Section>

                    <Section title="Images">
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                        {form.images.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                {form.images.map((file, i) => (
                                    <img
                                        key={i}
                                        src={URL.createObjectURL(file)}
                                        alt="preview"
                                        className="h-28 w-full object-cover rounded-md"
                                    />
                                ))}
                            </div>
                        )}
                    </Section>

                    <Section title="Description">
                        <textarea
                            name="description"
                            rows={4}
                            value={form.description}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            placeholder="Write car description..."
                        />
                    </Section>

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
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg"
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
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
                <option value="">Select</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

function Checkbox({ name, label, checked, onChange }) {
    return (
        <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
                type="checkbox"
                name={name}
                checked={checked}
                onChange={onChange}
                className="w-4 h-4"
            />
            {label}
        </label>
    );
}

function Section({ title, children }) {
    return (
        <div className="bg-gray-50 rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
            {children}
        </div>
    );
}
