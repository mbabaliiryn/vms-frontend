"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FiMoreVertical } from "react-icons/fi";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "sonner";
import { vehicleApi } from "@/app/api";
import { Vehicle } from "@/types";
import axios from "axios";
import Spinner from "@/components/Spinner/Spinner";
import { useRouter } from "next/navigation";

export interface ApiResponse {
  success: boolean;
  message: string;
  data: Vehicle[];
}

interface DeleteResponse {
  success: boolean;
  message: string;
}

const VehiclesPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        const response = (await vehicleApi.getVehicles()) as ApiResponse;
        if (response.success) {
          setVehicles(response.data);
        } else {
          toast.error("Failed to load vehicles", {
            description:
              response.message || "An error occurred while fetching vehicles.",
          });
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          toast.error("Failed to load vehicles", {
            description:
              err.response?.data?.message ||
              "An error occurred while fetching vehicles.",
          });
        } else {
          toast.error("Failed to load vehicles", {
            description: "An unexpected error occurred.",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const handleDeleteVehicle = async (vehicleId: string) => {
    setLoading(true);
    try {
      const response = (await vehicleApi.deleteVehicle({
        vehicleId,
      })) as DeleteResponse;
      if (response.success) {
        toast.success("Vehicle deleted successfully!");
        setVehicles((prevVehicles) =>
          prevVehicles.filter((vehicle) => vehicle.id !== vehicleId)
        );
        setIsDeleteDialogOpen(false);
      } else {
        toast.error("Failed to delete vehicle", {
          description:
            response.message || "An error occurred while deleting the vehicle.",
        });
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error("Failed to delete vehicle", {
          description:
            err.response?.data?.message ||
            "An error occurred while deleting the vehicle.",
        });
      } else {
        toast.error("Failed to delete vehicle", {
          description: "An unexpected error occurred.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Vehicles</h1>
        <Button
          onClick={() => router.push("/operations/vehicles/create")}
          className="px-4 py-2"
        >
          + Add Vehicle
        </Button>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className="border rounded-lg shadow-sm overflow-hidden">
          <Table className="w-full border-collapse">
            <TableCaption className="py-3 text-gray-500">
              List of all vehicles.
            </TableCaption>
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Make</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Plate Number</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles.map((vehicle, index) => (
                <TableRow
                  key={vehicle.id}
                  className="border-b hover:bg-gray-100 transition"
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{vehicle.make}</TableCell>
                  <TableCell>{vehicle.model}</TableCell>
                  <TableCell>{vehicle.year}</TableCell>
                  <TableCell>{vehicle.plateNumber}</TableCell>
                  <TableCell>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <FiMoreVertical className="w-5 h-5" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-40 p-2 bg-white border rounded-md shadow-lg">
                        <div className="flex flex-col gap-1">
                          <Button
                            variant="ghost"
                            onClick={() => {
                              setSelectedVehicle(vehicle);
                              setIsDialogOpen(true);
                            }}
                          >
                            <FaEye className="text-blue-500" /> View
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() =>
                              router.push(
                                `/operations/vehicles/${vehicle.id}/edit`
                              )
                            }
                          >
                            <FaEdit className="text-green-500" /> Edit
                          </Button>
                          <Button
                            variant="ghost"
                            className="text-red-600"
                            onClick={() => {
                              setSelectedVehicle(vehicle);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <FaTrash className="text-red-500" /> Delete
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Vehicle Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Vehicle Details</DialogTitle>
          </DialogHeader>
          {selectedVehicle && (
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">
                {selectedVehicle.make} {selectedVehicle.model} (
                {selectedVehicle.year})
              </h2>
              <p>
                <strong>Plate Number:</strong> {selectedVehicle.plateNumber}
              </p>
              {selectedVehicle.vin && (
                <p>
                  <strong>VIN:</strong> {selectedVehicle.vin}
                </p>
              )}
              <p>
                <strong>Branch ID:</strong> {selectedVehicle.branchId}
              </p>
              <p>
                <strong>Customer ID:</strong> {selectedVehicle.customerId}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this vehicle?</p>
          <div className="mt-4 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                selectedVehicle && handleDeleteVehicle(selectedVehicle.id)
              }
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VehiclesPage;
