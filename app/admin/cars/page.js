/** @format */

"use client";

import { useState } from "react";
import Link from "next/link";
import { Download, Plus, Star, Edit, Trash2 } from "lucide-react";

const cars = [
    {
        _id: "abc123",
        brand: { _id: "b1", name: "Maruti" },
        model: "Swift",
        year: 2022,
        price: 450000,
        mileage: 15000,
        fuelType: "Petrol",
        transmission: "Manual",
        color: "Red",
        description: "Popular compact car",
        images: [
            "https://cdn.pixabay.com/photo/2023/07/19/12/16/car-8136751_1280.jpg",
            "https://cdn.pixabay.com/photo/2023/07/19/12/16/car-8136751_1280.jpg",
        ],
        isApproved: true,
        isFeatured: true,
        isSold: false,
        createdAt: "2024-12-05T09:10:00Z",
    },
    {
        _id: "abc456",
        brand: { _id: "b2", name: "Hyundai" },
        model: "Creta",
        year: 2023,
        price: 980000,
        mileage: 8000,
        fuelType: "Diesel",
        transmission: "Automatic",
        color: "White",
        description: "Premium SUV",
        images: [
            "https://cdn.pixabay.com/photo/2023/07/19/12/16/car-8136751_1280.jpg",
        ],
        isApproved: false,
        isFeatured: false,
        isSold: false,
        createdAt: "2024-11-11T11:00:00Z",
    },
];

export default function CarListPage() {
    const [search, setSearch] = useState("");

    const filtered = cars.filter(
        (c) =>
            c.model.toLowerCase().includes(search.toLowerCase()) ||
            c.brand.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="flex justify-between items-center mb-6 flex-col md:flex-row gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Car Inventory
                    </h1>
                    <p className="text-gray-500">Manage your car listings</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by brand or model"
                        className="border border-gray-300 px-3 py-2 rounded-lg text-sm w-full md:w-64"
                    />
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

            <div className="bg-white shadow-sm rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-100 text-gray-600 text-left">
                            <tr>
                                <th className="px-4 py-3">Car</th>
                                <th className="px-4 py-3">Details</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((car) => (
                                <tr
                                    key={car._id}
                                    className="hover:bg-gray-50 border-t"
                                >
                                    <td className="px-4 py-3">
                                        <div className="flex gap-4 items-center">
                                            <img
                                                src={car.images[0]}
                                                alt={`${car.brand.name} ${car.model}`}
                                                className="w-16 h-12 object-cover rounded-md"
                                            />
                                            <div>
                                                <div className="font-semibold text-gray-900">
                                                    {car.brand.name} {car.model}
                                                </div>
                                                <div className="text-gray-500 text-xs">
                                                    Year: {car.year}
                                                </div>
                                                <div className="text-gray-500 text-xs">
                                                    Color: {car.color}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-gray-700">
                                        <div className="capitalize">
                                            {car.fuelType}
                                        </div>
                                        <div className="capitalize">
                                            {car.transmission}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {car.mileage.toLocaleString()} km
                                        </div>
                                        <div className="text-sm text-gray-700 font-semibold">
                                            ₹{car.price.toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-col gap-1">
                                            <span
                                                className={`px-2 py-1 text-xs rounded-full w-fit font-medium ${
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
                                                className={`px-2 py-1 text-xs rounded-full w-fit font-medium ${
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
                                                className={`px-2 py-1 text-xs rounded-full w-fit font-medium ${
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
                                    <td className="px-4 py-3">
                                        <div className="flex gap-3">
                                            <Link
                                                href={`/admin/cars/${car._id}/edit`}
                                                className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
                                            >
                                                <Edit size={14} />
                                                Edit
                                            </Link>
                                            <button className="flex items-center gap-1 px-3 py-1 bg-red-50 text-red-700 rounded hover:bg-red-100">
                                                <Trash2 size={14} />
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
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
            </div>
        </div>
    );
}
