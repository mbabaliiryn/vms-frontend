"use client";

import React, {useEffect, useState} from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
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
import {FiMoreVertical} from "react-icons/fi";
import {FaEye, FaEdit, FaTrash} from "react-icons/fa";
import {toast} from "sonner";
import {serviceHistoryApi} from "@/app/api";
import {ServiceHistory} from "@/types";
import axios from "axios";
import Spinner from "@/components/Spinner/Spinner";
import {useRouter} from "next/navigation";

export interface ApiResponse {
    success: boolean;
    message: string;
    data: ServiceHistory[];
}

interface DeleteResponse {
    success: boolean;
    message: string;
}

const ServiceHistoryPage: React.FC = () => {
    const [serviceHistories, setServiceHistories] = useState<ServiceHistory[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedHistory, setSelectedHistory] = useState<ServiceHistory | null>(
        null
    );
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        const fetchServiceHistories = async () => {
            setLoading(true);
            try {
                const response = (await serviceHistoryApi.getServiceHistories()) as ApiResponse;
                if (response.success) {
                    setServiceHistories(response.data);
                } else {
                    toast.error("Failed to load service history", {
                        description: response.message,
                    });
                }
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    toast.error("Error fetching service history", {
                        description: err.response?.data?.message || "Unexpected error occurred.",
                    });
                }
            } finally {
                setLoading(false);
            }
        };

        fetchServiceHistories();
    }, []);

    const handleDeleteHistory = async (historyId: string) => {
        setLoading(true);
        try {
            const response = (await serviceHistoryApi.deleteServiceHistory({
                serviceHistoryId: historyId,
            })) as DeleteResponse;

            if (response.success) {
                toast.success("Service history record deleted successfully!");
                setServiceHistories((prev) =>
                    prev.filter((history) => history.id !== historyId)
                );
                setIsDeleteDialogOpen(false);
            } else {
                toast.error("Failed to delete service history", {
                    description: response.message,
                });
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                toast.error("Error deleting service history", {
                    description: err.response?.data?.message || "An unexpected error occurred.",
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Service History</h1>
                <Button onClick={() => router.push("/operations/service-history/create")}>
                    + Add Record
                </Button>
            </div>

            {/* Table or Spinner */}
            {loading ? (
                <Spinner/>
            ) : (
                <div className="border rounded-lg shadow-sm overflow-hidden">
                    <Table className="w-full border-collapse">
                        <TableCaption className="py-3 text-gray-500">
                            List of all service records.
                        </TableCaption>
                        <TableHeader className="bg-gray-100">
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Vehicle</TableHead>
                                <TableHead>Mechanic</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Cost</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {serviceHistories.map((history, index) => (
                                <TableRow key={history.id} className="border-b hover:bg-gray-100 transition">
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{history.vehicleId}</TableCell>
                                    <TableCell>{history.mechanicId}</TableCell>
                                    <TableCell>{new Date(history.serviceDate).toLocaleDateString()}</TableCell>
                                    <TableCell>${history.cost ?? "N/A"}</TableCell>
                                    <TableCell>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <FiMoreVertical className="w-5 h-5"/>
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-40 p-2 bg-white border rounded-md shadow-lg">
                                                <div className="flex flex-col gap-1">
                                                    {/* View Button */}
                                                    <Button
                                                        variant="ghost"
                                                        onClick={() => {
                                                            setSelectedHistory(history);
                                                            setIsDialogOpen(true);
                                                        }}
                                                    >
                                                        <FaEye className="text-blue-500"/> View
                                                    </Button>
                                                    {/* Edit Button */}
                                                    <Button
                                                        variant="ghost"
                                                        onClick={() =>
                                                            router.push(`/operations/service-history/${history.id}/edit`)
                                                        }
                                                    >
                                                        <FaEdit className="text-green-500"/> Edit
                                                    </Button>
                                                    {/* Delete Button */}
                                                    <Button
                                                        variant="ghost"
                                                        className="text-red-600"
                                                        onClick={() => {
                                                            setSelectedHistory(history);
                                                            setIsDeleteDialogOpen(true);
                                                        }}
                                                    >
                                                        <FaTrash className="text-red-500"/> Delete
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

            {/* View Service History Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Service Record Details</DialogTitle>
                    </DialogHeader>
                    {selectedHistory && (
                        <div className="space-y-2">
                            <h2 className="text-lg font-semibold">
                                Service on {new Date(selectedHistory.serviceDate).toLocaleDateString()}
                            </h2>
                            <p>
                                <strong>Vehicle ID:</strong> {selectedHistory.vehicleId}
                            </p>
                            <p>
                                <strong>Mechanic ID:</strong> {selectedHistory.mechanicId}
                            </p>
                            <p>
                                <strong>Description:</strong> {selectedHistory.description}
                            </p>
                            <p>
                                <strong>Cost:</strong> ${selectedHistory.cost ?? "N/A"}
                            </p>
                            <p>
                                <strong>Branch ID:</strong> {selectedHistory.branchId}
                            </p>
                            {selectedHistory.updatedAt && (
                                <p>
                                    <strong>Last Updated:</strong>{" "}
                                    {new Date(selectedHistory.updatedAt).toLocaleDateString()}
                                </p>
                            )}
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
                    <p>Are you sure you want to delete this service record?</p>
                    <div className="mt-4 flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() =>
                                selectedHistory && handleDeleteHistory(selectedHistory.id)
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

export default ServiceHistoryPage;
