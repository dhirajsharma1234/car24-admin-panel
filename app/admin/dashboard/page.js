/** @format */

"use client";
import { useEffect, useState } from "react";
import {
    Car,
    ClipboardList,
    DollarSign,
    PhoneCall,
    TrendingUp,
    CheckCircle,
    Tag,
} from "lucide-react";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import useAuthRedirect from "@/hooks/useAuthRedirect";

const StatCard = ({ title, value, icon: Icon, color, growth }) => {
    const isPositive = growth >= 0;
    const colorMap = {
        blue: "bg-blue-100 text-blue-600",
        amber: "bg-amber-100 text-amber-600",
        emerald: "bg-emerald-100 text-emerald-600",
        purple: "bg-purple-100 text-purple-600",
        green: "bg-green-100 text-green-600",
        red: "bg-red-100 text-red-600",
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center gap-4">
                <div
                    className={`p-4 rounded-xl ${colorMap[color]} shadow-inner`}
                >
                    <Icon className="w-8 h-8" />
                </div>
                <div className="flex flex-col justify-between">
                    <p className="text-sm text-gray-500 font-medium">{title}</p>
                    <h2 className="text-3xl font-bold text-gray-800 mt-1">
                        {value?.toLocaleString() || "0"}
                    </h2>
                    {growth !== 0 && (
                        <div
                            className={`mt-1 text-sm flex items-center gap-1 ${
                                isPositive ? "text-green-500" : "text-red-500"
                            }`}
                        >
                            <TrendingUp size={16} />
                            {isPositive ? "↑" : "↓"} {Math.abs(growth)}% in last
                            30 days
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default function DashboardPage() {
    useAuthRedirect();
    const [dashboardData, setDashboardData] = useState(null);
    const [graphData, setGraphData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(
                    `http://localhost:5000/api/user/dashboard`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok)
                    throw new Error("Failed to fetch dashboard data");

                const data = await response.json();
                setDashboardData(data.data);

                // Generate graph data from API response
                setGraphData([
                    {
                        name: "Week 1",
                        cars: Math.floor(data.data.totalCars * 0.2),
                        enquiries: Math.floor(data.data.totalEnquiries * 0.2),
                        sellRequests: Math.floor(
                            data.data.totalSellRequests * 0.2
                        ),
                    },
                    {
                        name: "Week 2",
                        cars: Math.floor(data.data.totalCars * 0.4),
                        enquiries: Math.floor(data.data.totalEnquiries * 0.4),
                        sellRequests: Math.floor(
                            data.data.totalSellRequests * 0.4
                        ),
                    },
                    {
                        name: "Week 3",
                        cars: Math.floor(data.data.totalCars * 0.6),
                        enquiries: Math.floor(data.data.totalEnquiries * 0.6),
                        sellRequests: Math.floor(
                            data.data.totalSellRequests * 0.6
                        ),
                    },
                    {
                        name: "Week 4",
                        cars: data.data.totalCars,
                        enquiries: data.data.totalEnquiries,
                        sellRequests: data.data.totalSellRequests,
                    },
                ]);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">
                Dashboard Overview
            </h1>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
                <StatCard
                    title="Total Cars"
                    value={dashboardData?.totalCars}
                    icon={Car}
                    color="blue"
                    growth={dashboardData?.carGrowth}
                />
                <StatCard
                    title="Total Enquiries"
                    value={dashboardData?.totalEnquiries}
                    icon={ClipboardList}
                    color="amber"
                    growth={dashboardData?.enquiryGrowth}
                />
                <StatCard
                    title="Total Sell Requests"
                    value={dashboardData?.totalSellRequests}
                    icon={DollarSign}
                    color="emerald"
                    growth={dashboardData?.sellRequestGrowth}
                />
                <StatCard
                    title="Contacted Enquiries"
                    value={dashboardData?.contactedEnquiries}
                    icon={PhoneCall}
                    color="purple"
                    growth={0}
                />
                <StatCard
                    title="Total Brands"
                    value={dashboardData?.totalBrands}
                    icon={Tag}
                    color="green"
                    growth={dashboardData?.brandGrowth}
                />
            </div>

            {/* Line Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-md mb-10">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Growth Trends (Last 4 Weeks)
                </h2>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={graphData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" stroke="#888" />
                        <YAxis stroke="#888" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#fff",
                                borderRadius: "0.5rem",
                                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                            }}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="cars"
                            stroke="#3B82F6"
                            name="Cars"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="enquiries"
                            stroke="#F59E0B"
                            name="Enquiries"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="sellRequests"
                            stroke="#10B981"
                            name="Sell Requests"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Bar Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Request Distribution
                </h2>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={graphData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" stroke="#888" />
                        <YAxis stroke="#888" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#fff",
                                borderRadius: "0.5rem",
                                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                            }}
                        />
                        <Legend />
                        <Bar
                            dataKey="cars"
                            fill="#3B82F6"
                            name="Cars"
                            radius={[4, 4, 0, 0]}
                        />
                        <Bar
                            dataKey="enquiries"
                            fill="#F59E0B"
                            name="Enquiries"
                            radius={[4, 4, 0, 0]}
                        />
                        <Bar
                            dataKey="sellRequests"
                            fill="#10B981"
                            name="Sell Requests"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
