'use client';

import {
  Car,
  ClipboardList,
  DollarSign,
  PhoneCall,
  TrendingUp,
  CheckCircle,
} from "lucide-react";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts';

const StatCard = ({ title, value, icon: Icon, color, growth }) => {
  const isPositive = growth >= 0;

  const colorMap = {
    blue: 'bg-blue-100 text-blue-600',
    amber: 'bg-amber-100 text-amber-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    purple: 'bg-purple-100 text-purple-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center gap-4">
        <div className={`p-4 rounded-xl ${colorMap[color]} shadow-inner`}>
          <Icon className="w-8 h-8" />
        </div>
        <div className="flex flex-col justify-between">
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <h2 className="text-3xl font-bold text-gray-800 mt-1">{value.toLocaleString()}</h2>
          {growth !== 0 && (
            <div className={`mt-1 text-sm flex items-center gap-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              <TrendingUp size={16} />
              {isPositive ? '↑' : '↓'} {Math.abs(growth)}% in last 30 days
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const dashboardData = {
  totalCars: 1200,
  totalEnquiries: 380,
  totalSellRequests: 90,
  contactedEnquiries: 240,
  acceptedSellRequests: 56,
  carGrowth: 8,
  enquiryGrowth: 12,
  sellRequestGrowth: 5,
};

const graphData = [
  { name: 'Week 1', cars: 200, enquiries: 50, sellRequests: 20 },
  { name: 'Week 2', cars: 220, enquiries: 60, sellRequests: 25 },
  { name: 'Week 3', cars: 250, enquiries: 90, sellRequests: 30 },
  { name: 'Week 4', cars: 270, enquiries: 100, sellRequests: 35 },
];

export default function DashboardPage() {
  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
        <StatCard title="Total Cars" value={dashboardData.totalCars} icon={Car} color="blue" growth={dashboardData.carGrowth} />
        <StatCard title="Total Enquiries" value={dashboardData.totalEnquiries} icon={ClipboardList} color="amber" growth={dashboardData.enquiryGrowth} />
        <StatCard title="Total Sell Requests" value={dashboardData.totalSellRequests} icon={DollarSign} color="emerald" growth={dashboardData.sellRequestGrowth} />
        <StatCard title="Contacted Enquiries" value={dashboardData.contactedEnquiries} icon={PhoneCall} color="purple" growth={0} />
        <StatCard title="Accepted Sell Requests" value={dashboardData.acceptedSellRequests} icon={CheckCircle} color="green" growth={0} />
      </div>

      {/* Line Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-md mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Growth Trends (Last 4 Weeks)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={graphData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="cars" stroke="#3B82F6" name="Cars" strokeWidth={2} />
            <Line type="monotone" dataKey="enquiries" stroke="#F59E0B" name="Enquiries" strokeWidth={2} />
            <Line type="monotone" dataKey="sellRequests" stroke="#10B981" name="Sell Requests" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Request Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={graphData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="cars" fill="#3B82F6" name="Cars" />
            <Bar dataKey="enquiries" fill="#F59E0B" name="Enquiries" />
            <Bar dataKey="sellRequests" fill="#10B981" name="Sell Requests" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
