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
import { FiMoreVertical, FiPhone, FiMail, FiTool } from "react-icons/fi";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "sonner";
import { garageApi } from "@/app/api";
import { Garage } from "@/types";
import axios from "axios";
import Spinner from "@/components/Spinner/Spinner";
import { useRouter } from "next/navigation";

export interface ApiResponse {
  success: boolean;
  message: string;
  data: Garage[];
}

interface DeleteResponse {
  success: boolean;
  message: string;
}

const GaragesPage: React.FC = () => {
  const [garages, setGarages] = useState<Garage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedGarage, setSelectedGarage] = useState<Garage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    const fetchGarages = async () => {
      setLoading(true);
      try {
        const response = (await garageApi.getGarages()) as ApiResponse;
        if (response.success) {
          setGarages(response.data);
        } else {
          toast.error("Failed to load garages", {
            description:
              response.message || "An error occurred while fetching garages.",
          });
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          toast.error("Failed to load garages", {
            description:
              err.response?.data?.message ||
              "An error occurred while fetching garages.",
          });
        } else {
          toast.error("Failed to load garages", {
            description: "An unexpected error occurred.",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchGarages();
  }, []);

  const handleDeleteGarage = async (garageId: string) => {
    setLoading(true);
    try {
      const response = (await garageApi.deleteGarage({
        garageId,
      })) as DeleteResponse;
      if (response.success) {
        toast.success("Garage deleted successfully!");
        setGarages((prevGarages) =>
          prevGarages.filter((garage) => garage.id !== garageId)
        );
        setIsDeleteDialogOpen(false);
      } else {
        toast.error("Failed to delete garage", {
          description:
            response.message || "An error occurred while deleting the garage.",
        });
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error("Failed to delete garage", {
          description:
            err.response?.data?.message ||
            "An error occurred while deleting the garage.",
        });
      } else {
        toast.error("Failed to delete garage", {
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
        <h1 className="text-2xl font-semibold">Garages</h1>
        <Button
          onClick={() => router.push("/admin/garages/create")}
          className="px-4 py-2"
        >
          + Add Garage
        </Button>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className="border rounded-lg shadow-sm overflow-hidden">
          <Table className="w-full border-collapse">
            <TableCaption className="py-3 text-gray-500">
              List of all available garages.
            </TableCaption>
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead className="px-4 py-3">ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {garages.map((garage, index) => (
                <TableRow
                  key={garage.id}
                  className={`border-b ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100 transition`}
                >
                  <TableCell className="px-4 py-3 font-medium">
                    {index + 1}
                  </TableCell>
                  <TableCell>{garage.name}</TableCell>
                  <TableCell>{garage.location}</TableCell>
                  <TableCell className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center gap-2">
                      <FiPhone className="text-blue-500" />
                      {garage.contactNumber}
                    </div>
                    <div className="flex items-center gap-2">
                      <FiMail className="text-gray-500" />
                      {garage.garageEmail || "N/A"}
                    </div>
                    <div className="flex items-center gap-2">
                      <FiTool className="text-yellow-500" />
                      {garage.servicesOffered.join(", ")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-3 py-1 text-sm rounded-full border ${
                        garage.isActive
                          ? "text-green-500 bg-green-100 border-green-300"
                          : "text-red-500 bg-red-100 border-red-300"
                      }`}
                    >
                      {garage.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>

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
                            className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md transition"
                            onClick={() => {
                              setSelectedGarage(garage);
                              setIsDialogOpen(true);
                            }}
                          >
                            <FaEye className="text-blue-500" /> View
                          </Button>
                          <Button
                            variant="ghost"
                            className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md transition"
                            onClick={() =>
                              router.push(`/admin/garages/${garage.id}/edit`)
                            }
                          >
                            <FaEdit className="text-green-500" /> Edit
                          </Button>
                          <Button
                            variant="ghost"
                            className="flex items-center gap-2 text-red-600 hover:bg-red-100 px-3 py-2 rounded-md transition"
                            onClick={() => {
                              setSelectedGarage(garage);
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

      {/* Garage Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Garage Details</DialogTitle>
          </DialogHeader>
          {selectedGarage && (
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">{selectedGarage.name}</h2>
              <p>
                <strong>Location:</strong> {selectedGarage.location}
              </p>
              <p>
                <strong>Contact Number:</strong> {selectedGarage.contactNumber}
              </p>
              <p>
                <strong>Email:</strong> {selectedGarage.garageEmail || "N/A"}
              </p>
              <p>
                <strong>Services Offered:</strong>{" "}
                {selectedGarage.servicesOffered.join(", ")}
              </p>
              <p>
                <strong>Status:</strong>
                <span
                  className={`ml-2 px-2 py-1 text-sm rounded ${
                    selectedGarage.isActive
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {selectedGarage.isActive ? "Active" : "Inactive"}
                </span>
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this garage?</p>
          <div className="mt-4 justify-end flex gap-3">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={loading}
              onClick={() =>
                selectedGarage && handleDeleteGarage(selectedGarage.id)
              }
            >
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GaragesPage;
