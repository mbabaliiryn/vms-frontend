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
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {FiMoreVertical, FiPhone, FiMail, FiTool} from "react-icons/fi";
import {FaEye, FaEdit, FaTrash} from "react-icons/fa";
import {toast} from "sonner";
import {branchApi} from "@/app/api";
import {Branch} from "@/types";
import axios from "axios";
import Spinner from "@/components/Spinner/Spinner";
import {useRouter} from "next/navigation";

export interface ApiResponse {
    success: boolean;
    message: string;
    data: Branch[];
}

interface DeleteResponse {
    success: boolean;
    message: string;
}

const BranchesPage: React.FC = () => {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false); // State for delete confirmation

    const router = useRouter();

    useEffect(() => {
        const fetchBranches = async () => {
            setLoading(true);
            try {
                const response = (await branchApi.getBranches()) as ApiResponse;
                if (response.success) {
                    setBranches(response.data);
                } else {
                    toast.error("Failed to load branches", {
                        description: response.message || "An error occurred while fetching branches.",
                    });
                }
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    toast.error("Failed to load branches", {
                        description: err.response?.data?.message || "An error occurred while fetching branches.",
                    });
                } else {
                    toast.error("Failed to load branches", {
                        description: "An unexpected error occurred.",
                    });
                }
            } finally {
                setLoading(false);
            }
        };

        fetchBranches();
    }, []);

    const handleDeleteBranch = async (branchId: string) => {
        setLoading(true);
        try {
            const response = (await branchApi.deleteBranch({branchId}) as DeleteResponse);
            if (response.success) {
                toast.success("Branch deleted successfully!");
                setBranches((prevBranches) => prevBranches.filter((branch) => branch.id !== branchId));
                setIsDeleteDialogOpen(false);
            } else {
                toast.error("Failed to delete branch", {
                    description: response.message || "An error occurred while deleting the branch.",
                });
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                toast.error("Failed to delete branch", {
                    description: err.response?.data?.message || "An error occurred while deleting the branch.",
                });
            } else {
                toast.error("Failed to delete branch", {
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
                <h1 className="text-2xl font-semibold">Branches</h1>
                <Button onClick={() => router.push("/admin/branches/create")} className="px-4 py-2">
                    + Add Branch
                </Button>
            </div>

            {loading ? (
                <Spinner/>
            ) : (
                <div className="border rounded-lg shadow-sm overflow-hidden">
                    <Table className="w-full border-collapse">
                        <TableCaption className="py-3 text-gray-500">List of all available branches.</TableCaption>
                        <TableHeader className="bg-gray-100">
                            <TableRow>
                                <TableHead className="px-4 py-3">ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Details</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Manager</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {branches.map((branch, index) => (
                                <TableRow
                                    key={branch.id}
                                    className={`border-b ${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100 transition`}
                                >
                                    <TableCell className="px-4 py-3 font-medium">{index + 1}</TableCell>
                                    <TableCell>{branch.name}</TableCell>
                                    <TableCell>{branch.location}</TableCell>
                                    <TableCell className="text-sm text-gray-600 space-y-1">
                                        <div className="flex items-center gap-2">
                                            <FiPhone className="text-blue-500"/>
                                            {branch.contactNumber}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FiMail className="text-gray-500"/>
                                            {branch.branchEmail || "N/A"}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FiTool className="text-yellow-500"/>
                                            {branch.servicesOffered.join(", ")}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                    <span
                        className={`px-3 py-1 text-sm rounded-full border ${
                            branch.isActive
                                ? "text-green-500 bg-green-100 border-green-300"
                                : "text-red-500 bg-red-100 border-red-300"
                        }`}
                    >
                      {branch.isActive ? "Active" : "Inactive"}
                    </span>
                                    </TableCell>
                                    <TableCell>
                                        {branch.manager?.firstName && branch.manager?.lastName
                                            ? `${branch.manager.firstName} ${branch.manager.lastName}`
                                            : "N/A"}
                                    </TableCell>

                                    <TableCell>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <FiMoreVertical className="w-5 h-5"/>
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-40 p-2 bg-white border rounded-md shadow-lg">
                                                <div className="flex flex-col gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md transition"
                                                        onClick={() => {
                                                            setSelectedBranch(branch);
                                                            setIsDialogOpen(true);
                                                        }}
                                                    >
                                                        <FaEye className="text-blue-500"/> View
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md transition"
                                                        onClick={() => router.push(`/admin/branches/${branch.id}/edit`)}
                                                    >
                                                        <FaEdit className="text-green-500"/> Edit
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        className="flex items-center gap-2 text-red-600 hover:bg-red-100 px-3 py-2 rounded-md transition"
                                                        onClick={() => {
                                                            setSelectedBranch(branch);
                                                            setIsDeleteDialogOpen(true); // Open delete confirmation dialog
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

            {/* Branch Details Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Branch Details</DialogTitle>
                    </DialogHeader>
                    {selectedBranch && (
                        <div className="space-y-2">
                            <h2 className="text-lg font-semibold">{selectedBranch.name}</h2>
                            <p><strong>Location:</strong> {selectedBranch.location}</p>
                            <p><strong>Contact Number:</strong> {selectedBranch.contactNumber}</p>
                            <p><strong>Email:</strong> {selectedBranch.branchEmail || "N/A"}</p>
                            <p><strong>Services Offered:</strong> {selectedBranch.servicesOffered.join(", ")}</p>
                            <p>
                                <strong>Status:</strong>
                                <span
                                    className={`ml-2 px-2 py-1 text-sm rounded ${selectedBranch.isActive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                  {selectedBranch.isActive ? "Active" : "Inactive"}
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
                    <p>Are you sure you want to delete this branch?</p>
                    <div className="mt-4 justify-end flex gap-3">
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            disabled={loading}
                            onClick={() => selectedBranch && handleDeleteBranch(selectedBranch.id)}
                        >
                            {loading ? "Deleting..." : "Delete"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default BranchesPage;
