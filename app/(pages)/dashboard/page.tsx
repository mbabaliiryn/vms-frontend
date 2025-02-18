"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FaCar, FaTools, FaUsers } from "react-icons/fa";
import { vehicleApi, garageApi, customerApi } from "@/app/api";
import { Vehicle, Garage, Customer } from "@/types";
import axios from "axios";
import { toast } from "sonner";
import Spinner from "@/components/Spinner/Spinner";

interface ApiResponse {
  success: boolean;
  message: string;
  data: Vehicle[] | Garage[] | Customer[];
}

const Dashboard = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [garages, setGarages] = useState<Garage[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [vehicleRes, garageRes, customerRes] = await Promise.all([
          (await vehicleApi.getVehicles()) as Promise<ApiResponse>,
          (await garageApi.getGarages()) as Promise<ApiResponse>,
          (await customerApi.getCustomers()) as Promise<ApiResponse>,
        ]);

        if (vehicleRes.success) setVehicles(vehicleRes.data as Vehicle[]);
        if (garageRes.success) setGarages(garageRes.data as Garage[]);
        if (customerRes.success) setCustomers(customerRes.data as Customer[]);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          toast.error("Error loading data", {
            description:
              err.response?.data?.message || "Failed to load required data.",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card className="bg-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="bg-orange-100 p-3 rounded-lg">
                <FaCar className="text-3xl text-orange-600" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-600">
                Total Vehicles
              </h3>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {vehicles.length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="bg-green-100 p-3 rounded-lg">
                <FaTools className="text-3xl text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-600">
                Total Garages
              </h3>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {garages.length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="bg-blue-100 p-3 rounded-lg">
                <FaUsers className="text-3xl text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-600">
                Total Customers
              </h3>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {customers.length}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* <Card className="bg-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <FaMoneyBillWave className="text-3xl text-yellow-600" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-600">
                Total Revenue
              </h3>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                ${revenue.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card> */}
      </div>

      {/* <div className="bg-white shadow-lg p-6 rounded-lg">
        <h3 className="text-lg font-bold text-gray-700 mb-4">Vehicle Growth</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={vehicleChartData}>
            <XAxis dataKey="name" stroke="#8884d8" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#4f46e5" barSize={50} />
          </BarChart>
        </ResponsiveContainer>
      </div> */}
    </div>
  );
};

export default Dashboard;
