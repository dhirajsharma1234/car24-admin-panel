/** @format */

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import { Loader } from "@/components/loader";

const FUEL_TYPES = ["petrol", "diesel", "electric", "hybrid", "cng"];
const TRANSMISSIONS = ["Automatic", "Manual"];
const CONDITIONS = ["new", "used"];

export default function EditCarPage() {
    const router = useRouter();
    const { id } = useParams();
    const [brands, setBrands] = useState([]);
    const [form, setForm] = useState({
        brand: "",
        modelName: "",
        year: "",
        price: "",
        mileage: "",
        fuelType: "",
        transmission: "",
        color: "",
        description: "",
        condition: "",
        isApproved: true,
        isFeatured: false,
        isSold: false,
        images: [],
        addedBy: "",
    });
    const [loading, setLoading] = useState(true);
    const [newImages, setNewImages] = useState([]);

    const fetchBrands = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/brand/all`);
            const json = await res.json();
            setBrands(json.data || []);
        } catch {
            toast.error("Failed to load brands");
        }
    };

    const fetchUserAndCar = async () => {
        try {
            const token = localStorage.getItem("token");

            const [userRes, carRes] = await Promise.all([
                fetch(`http://localhost:5000/api/user/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                fetch(`http://localhost:5000/api/car/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            ]);

            const userJson = await userRes.json();
            const carJson = await carRes.json();

            if (userJson?.data && carJson?.data) {
                setForm({
                    ...carJson.data,
                    brand: carJson.data.brand?._id || "",
                    addedBy: userJson.data._id,
                });
            } else {
                toast.error("Failed to fetch user or car info");
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong while fetching");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBrands();
        fetchUserAndCar();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const finalValue = type === "checkbox" ? checked : value;
        setForm((prev) => ({ ...prev, [name]: finalValue }));
    };

    const handleImageUpload = (e) => {
        setNewImages(Array.from(e.target.files));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => {
            if (key === "images") return;
            formData.append(key, value);
        });

        newImages.forEach((file) => formData.append("images", file));

        try {
            const res = await fetch(`http://localhost:5000/api/car/${id}`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            const json = await res.json();

            console.log(form);

            if (res.ok) {
                toast.success("✅ Car updated!");
                router.push("/admin/cars");
            } else {
                toast.error(json?.message || "❌ Update failed");
            }
        } catch (err) {
            console.error(err);
            toast.error("❌ Server error");
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4 md:px-10">
            <div className="max-w-5xl mx-auto bg-white shadow-md rounded-2xl p-8 md:p-10">
                <h1 className="text-3xl font-semibold text-gray-800 mb-2">
                    ✏️ Edit Car
                </h1>

                <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <label className="text-sm text-gray-600">
                                Brand
                            </label>
                            <select
                                name="brand"
                                value={form.brand}
                                onChange={handleChange}
                                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg"
                            >
                                <option value="">Select Brand</option>
                                {brands.map((b) => (
                                    <option key={b._id} value={b._id}>
                                        {b.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <Input
                            name="modelName"
                            label="Model Name"
                            value={form.modelName}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            name="year"
                            type="number"
                            label="Year"
                            value={form.year}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                        <Input
                            name="price"
                            type="number"
                            label="Price (₹)"
                            value={form.price}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            name="mileage"
                            type="number"
                            label="Mileage"
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

                    <div className="grid md:grid-cols-2 gap-4">
                        <Select
                            name="fuelType"
                            label="Fuel Type"
                            value={form.fuelType}
                            options={FUEL_TYPES}
                            onChange={handleChange}
                            required
                        />
                        <Select
                            name="transmission"
                            label="Transmission"
                            value={form.transmission}
                            options={TRANSMISSIONS}
                            onChange={handleChange}
                            required
                        />
                        <Select
                            name="condition"
                            label="Condition"
                            value={form.condition}
                            options={CONDITIONS}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex flex-wrap gap-4">
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

                    <div>
                        <label className="text-sm text-gray-600 block mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            rows={4}
                            value={form.description}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>

                    {/* Existing Images */}
                    <div className="space-y-2">
                        <p className="text-sm text-gray-600">Existing Images</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {form.images?.map((img, i) => (
                                <img
                                    key={i}
                                    src={`http://localhost:5000/uploads/cars/${img}`}
                                    alt={`car-${i}`}
                                    className="h-28 object-cover rounded"
                                />
                            ))}
                        </div>
                    </div>

                    {/* Upload New Images */}
                    <div>
                        <label className="text-sm text-gray-600">
                            Upload New Images
                        </label>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="block mt-2"
                        />
                        {newImages.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                                {newImages.map((img, i) => (
                                    <img
                                        key={i}
                                        src={URL.createObjectURL(img)}
                                        className="h-28 object-cover rounded"
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg text-lg hover:bg-blue-700 transition"
                    >
                        ✅ Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
}

// Components
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
                    <option key={opt} value={opt}>
                        {opt}
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
