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
import { FaEye, FaTrash } from "react-icons/fa";
import { toast } from "sonner";
import { inspectionsApi } from "@/app/api";
import { Inspection } from "@/types";
import axios from "axios";
import Spinner from "@/components/Spinner/Spinner";
import { useRouter } from "next/navigation";

export interface ApiResponse {
  success: boolean;
  message: string;
  data: Inspection[];
}

interface DeleteResponse {
  success: boolean;
  message: string;
}

const InspectionsPage: React.FC = () => {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedInspection, setSelectedInspection] =
    useState<Inspection | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    const fetchInspections = async () => {
      setLoading(true);
      try {
        const response =
          (await inspectionsApi.getAllInspectionChecklists()) as ApiResponse;
        if (response.success) {
          setInspections(response.data);
        } else {
          toast.error("Failed to load inspections", {
            description:
              response.message ||
              "An error occurred while fetching inspections.",
          });
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          toast.error("Failed to load inspections", {
            description:
              err.response?.data?.message ||
              "An error occurred while fetching inspections.",
          });
        } else {
          toast.error("Failed to load inspections", {
            description: "An unexpected error occurred.",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInspections();
  }, []);

  const handleDeleteInspection = async (checklistId: string) => {
    setLoading(true);
    try {
      const response = (await inspectionsApi.deleteInspectionChecklist({
        checklistId,
      })) as DeleteResponse;
      if (response.success) {
        toast.success("Inspection checklist deleted successfully!");
        setInspections((prevInspections) =>
          prevInspections.filter((inspection) => inspection.id !== checklistId)
        );
        setIsDeleteDialogOpen(false);
      } else {
        toast.error("Failed to delete inspection", {
          description:
            response.message ||
            "An error occurred while deleting the inspection.",
        });
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error("Failed to delete inspection", {
          description:
            err.response?.data?.message ||
            "An error occurred while deleting the inspection.",
        });
      } else {
        toast.error("Failed to delete inspection", {
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
        <h1 className="text-2xl font-semibold">Inspections</h1>
        <Button
          onClick={() => router.push("/operations/inspections/create")}
          className="px-4 py-2"
        >
          + Add Inspection
        </Button>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className="border rounded-lg shadow-sm overflow-hidden">
          <Table className="w-full border-collapse">
            <TableCaption className="py-3 text-gray-500">
              List of all inspections.
            </TableCaption>
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead className="px-4 py-3">ID</TableHead>
                <TableHead>Vehicle ID</TableHead>
                <TableHead>Branch ID</TableHead>
                <TableHead>Inspector ID</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inspections.map((inspection, index) => (
                <TableRow
                  key={inspection.id}
                  className={`border-b ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100 transition`}
                >
                  <TableCell className="px-4 py-3 font-medium">
                    {index + 1}
                  </TableCell>
                  <TableCell>{inspection.vehicleId}</TableCell>
                  <TableCell>{inspection.branchId}</TableCell>
                  <TableCell>{inspection.inspectorId}</TableCell>

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
                              setSelectedInspection(inspection);
                              setIsDialogOpen(true);
                            }}
                          >
                            <FaEye className="text-blue-500" /> View
                          </Button>
                          <Button
                            variant="ghost"
                            className="flex items-center gap-2 text-red-600 hover:bg-red-100 px-3 py-2 rounded-md transition"
                            onClick={() => {
                              setSelectedInspection(inspection);
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

      {/* Inspection Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Inspection Details</DialogTitle>
          </DialogHeader>
          {selectedInspection && (
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">
                Vehicle ID: {selectedInspection.vehicleId}
              </h2>
              <p>
                <strong>Branch ID:</strong> {selectedInspection.branchId}
              </p>
              <p>
                <strong>Inspector ID:</strong> {selectedInspection.inspectorId}
              </p>
              {/* You could add more fields here, but we leave it simple as per the requirement */}
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
          <p>Are you sure you want to delete this inspection?</p>
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
                selectedInspection &&
                handleDeleteInspection(selectedInspection.id)
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

export default InspectionsPage;
