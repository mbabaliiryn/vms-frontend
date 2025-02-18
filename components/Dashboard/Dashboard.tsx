import React from "react";
import { Vehicle, Garage, Customer } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ApiDataDisplayProps {
  vehicles: Vehicle[];
  garages: Garage[];
  customers: Customer[];
  loading: boolean;
}

const ApiDataDisplay = ({
  vehicles,
  garages,
  customers,
  loading,
}: ApiDataDisplayProps) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>API Data Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="vehicles">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="vehicles">
              Vehicles ({vehicles.length})
            </TabsTrigger>
            <TabsTrigger value="garages">
              Garages ({garages.length})
            </TabsTrigger>
            <TabsTrigger value="customers">
              Customers ({customers.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="vehicles" className="mt-4">
            <div className="rounded-lg border">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-orange-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-orange-600">
                        ID
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-orange-600">
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {vehicles.map((vehicle, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3">{JSON.stringify(vehicle)}</td>
                        <td className="px-4 py-3 whitespace-pre-wrap">
                          {Object.entries(vehicle).map(([key, value]) => (
                            <div key={key}>
                              <span className="font-medium">{key}:</span>{" "}
                              {JSON.stringify(value)}
                            </div>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="garages" className="mt-4">
            <div className="rounded-lg border">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-orange-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-orange-600">
                        ID
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-orange-600">
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {garages.map((garage, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3">{JSON.stringify(garage)}</td>
                        <td className="px-4 py-3 whitespace-pre-wrap">
                          {Object.entries(garage).map(([key, value]) => (
                            <div key={key}>
                              <span className="font-medium">{key}:</span>{" "}
                              {JSON.stringify(value)}
                            </div>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="customers" className="mt-4">
            <div className="rounded-lg border">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-orange-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-orange-600">
                        ID
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-orange-600">
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {customers.map((customer, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          {JSON.stringify(customer)}
                        </td>
                        <td className="px-4 py-3 whitespace-pre-wrap">
                          {Object.entries(customer).map(([key, value]) => (
                            <div key={key}>
                              <span className="font-medium">{key}:</span>{" "}
                              {JSON.stringify(value)}
                            </div>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ApiDataDisplay;
