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

const AutoCareDashboard: React.FC = () => {
  // Chart data for the Maintenance Chart
  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Maintenance Services",
        data: [100, 150, 120, 180, 130, 200, 160],
        borderColor: "#4CAF50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        fill: true,
      },
    ],
  };

  return (
    <div className="p-6 space-y-6">
      {/* Stats Section */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {/* Total Vehicles Card */}
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
          <FaCar className="text-4xl text-blue-500" />
          <div className="text-xl font-semibold mt-4">Total Vehicles</div>
          <div className="text-3xl font-bold mt-2">450</div>
          <div className="text-sm text-green-500 mt-1">+2.5%</div>
        </div>

        {/* Total Services Completed Card */}
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
          <FaTools className="text-4xl text-yellow-500" />
          <div className="text-xl font-semibold mt-4">
            Total Services Completed
          </div>
          <div className="text-3xl font-bold mt-2">1,200</div>
          <div className="text-sm text-green-500 mt-1">+5.0%</div>
        </div>

        {/* Fleet Utilization Card */}
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
          <FaChartLine className="text-4xl text-green-500" />
          <div className="text-xl font-semibold mt-4">Fleet Utilization</div>
          <div className="text-3xl font-bold mt-2">80%</div>
          <div className="text-sm text-red-500 mt-1">-1.5%</div>
        </div>

        {/* Active Maintenance Card */}
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
          <FaTools className="text-4xl text-red-500" />
          <div className="text-xl font-semibold mt-4">Active Maintenance</div>
          <div className="text-3xl font-bold mt-2">25</div>
          <div className="text-sm text-red-500 mt-1">-1.2%</div>
        </div>
      </div>

      {/* Maintenance Chart and Map Section */}
      <div className="grid grid-cols-12 gap-6">
        {/* Maintenance Chart */}
        <div className="col-span-12 md:col-span-6 lg:col-span-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Maintenance Chart</h2>
            <div className="h-72">
              <Line data={chartData} options={{ responsive: true }} />
            </div>
          </div>
        </div>

        {/* Map View */}
        <div className="col-span-12 md:col-span-6 lg:col-span-4">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Map View</h2>
            <div className="h-72 bg-gray-200 rounded-lg flex items-center justify-center">
              <FaMapMarkedAlt className="text-4xl text-gray-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Maintenance Table */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Upcoming Maintenance</h2>
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Vehicle</th>
              <th className="px-4 py-2 text-left">Scheduled Date</th>
              <th className="px-4 py-2 text-left">Service Type</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2">Car #123</td>
              <td className="px-4 py-2">02/14/2025</td>
              <td className="px-4 py-2">Oil Change</td>
              <td className="px-4 py-2 text-green-500">Scheduled</td>
            </tr>
            <tr>
              <td className="px-4 py-2">Van #245</td>
              <td className="px-4 py-2">02/16/2025</td>
              <td className="px-4 py-2">Tire Replacement</td>
              <td className="px-4 py-2 text-red-500">Delayed</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* System Alerts Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">System Alerts</h2>
        <ul>
          <li className="flex items-center py-2">
            <FaTools className="w-5 h-5 text-red-500 mr-2" />
            <span>Maintenance overdue for Car #12</span>
          </li>
          <li className="flex items-center py-2">
            <FaTools className="w-5 h-5 text-yellow-500 mr-2" />
            <span>Upcoming service for Truck #5</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AutoCareDashboard;
