"use client";

import React from "react";
import { FaCar, FaTools, FaChartLine, FaMapMarkedAlt } from "react-icons/fa";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Maintenance Services",
        data: [100, 150, 120, 180, 130, 200, 160],
        borderColor: "#f97316",
        backgroundColor: "rgba(249, 115, 22, 0.1)",
        fill: true,
      },
    ],
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50">
      {/* Stats Section */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {/* Total Vehicles Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="bg-orange-50 p-3 rounded-lg">
              <FaCar className="text-2xl text-orange-500" />
            </div>
            <span className="text-sm text-green-500 font-medium">+2.5%</span>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-500">
              Total Vehicles
            </h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">450</p>
          </div>
        </div>

        {/* Services Completed Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="bg-orange-50 p-3 rounded-lg">
              <FaTools className="text-2xl text-orange-500" />
            </div>
            <span className="text-sm text-green-500 font-medium">+5.0%</span>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-500">
              Services Completed
            </h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">1,200</p>
          </div>
        </div>

        {/* Fleet Utilization Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="bg-orange-50 p-3 rounded-lg">
              <FaChartLine className="text-2xl text-orange-500" />
            </div>
            <span className="text-sm text-red-500 font-medium">-1.5%</span>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-500">
              Fleet Utilization
            </h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">80%</p>
          </div>
        </div>

        {/* Active Maintenance Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="bg-orange-50 p-3 rounded-lg">
              <FaTools className="text-2xl text-orange-500" />
            </div>
            <span className="text-sm text-red-500 font-medium">-1.2%</span>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-500">
              Active Maintenance
            </h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">25</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-12 gap-6">
        {/* Maintenance Chart */}
        <div className="col-span-12 md:col-span-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Maintenance Trends
              </h2>
              <select className="px-3 py-1.5 bg-orange-50 text-orange-600 rounded-lg text-sm font-medium border-0">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
              </select>
            </div>
            <div className="h-72">
              <Line data={chartData} options={{ responsive: true }} />
            </div>
          </div>
        </div>

        {/* Map View */}
        <div className="col-span-12 md:col-span-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Vehicle Location
            </h2>
            <div className="h-72 bg-orange-50 rounded-xl flex items-center justify-center">
              <FaMapMarkedAlt className="text-4xl text-orange-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Maintenance Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            Upcoming Maintenance
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-orange-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-orange-600 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-orange-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-orange-600 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-orange-600 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">Car #123</td>
                <td className="px-6 py-4 text-sm text-gray-600">02/14/2025</td>
                <td className="px-6 py-4 text-sm text-gray-600">Oil Change</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-medium bg-green-50 text-green-600 rounded-full">
                    Scheduled
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">Van #245</td>
                <td className="px-6 py-4 text-sm text-gray-600">02/16/2025</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  Tire Replacement
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-medium bg-red-50 text-red-600 rounded-full">
                    Delayed
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* System Alerts */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">System Alerts</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-red-50 rounded-lg">
              <FaTools className="text-red-500 mr-3" />
              <span className="text-sm text-red-600 font-medium">
                Maintenance overdue for Car #12
              </span>
            </div>
            <div className="flex items-center p-4 bg-orange-50 rounded-lg">
              <FaTools className="text-orange-500 mr-3" />
              <span className="text-sm text-orange-600 font-medium">
                Upcoming service for Truck #5
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
