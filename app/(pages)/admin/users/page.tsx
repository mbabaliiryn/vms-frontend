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
import { FiMoreVertical, FiPhone, FiMapPin, FiUser } from "react-icons/fi";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "sonner";
import { authApi } from "@/app/api";
import { User } from "@/types";
import axios from "axios";
import Spinner from "@/components/Spinner/Spinner";
import { useRouter } from "next/navigation";

export interface ApiResponse {
  success: boolean;
  message: string;
  data: User[];
}

interface DeleteResponse {
  success: boolean;
  message: string;
}

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = (await authApi.getUsers()) as ApiResponse;
        if (response.success) {
          setUsers(response.data);
        } else {
          toast.error("Failed to load users", {
            description:
              response.message || "An error occurred while fetching users.",
          });
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          toast.error("Failed to load users", {
            description:
              err.response?.data?.message ||
              "An error occurred while fetching users.",
          });
        } else {
          toast.error("Failed to load users", {
            description: "An unexpected error occurred.",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId: string) => {
    setLoading(true);
    try {
      const response = (await authApi.deleteUser(userId)) as DeleteResponse;
      if (response.success) {
        toast.success("User deleted successfully!");
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
        setIsDeleteDialogOpen(false);
      } else {
        toast.error("Failed to delete user", {
          description:
            response.message || "An error occurred while deleting the user.",
        });
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error("Failed to delete user", {
          description:
            err.response?.data?.message ||
            "An error occurred while deleting the user.",
        });
      } else {
        toast.error("Failed to delete user", {
          description: "An unexpected error occurred.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      ADMIN: "text-red-700 bg-red-50 border-red-200",
      MANAGER: "text-amber-700 bg-amber-50 border-amber-200",
      MECHANIC: "text-blue-700 bg-blue-50 border-blue-200",
    };
    return colors[role as keyof typeof colors] || colors.MECHANIC;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Users</h1>
        <Button
          onClick={() => router.push("/admin/users/create")}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600"
        >
          + Add User
        </Button>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className="border rounded-lg shadow-sm overflow-hidden">
          <Table className="w-full border-collapse">
            <TableCaption className="py-3 text-black">
              List of all users.
            </TableCaption>
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead className="px-4 py-3">ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Garage</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user, index) => (
                <TableRow
                  key={user.id}
                  className={`border-b ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100 transition`}
                >
                  <TableCell className="px-4 py-3 font-medium">
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FiUser className="text-gray-400" />
                      {`${user.firstName} ${user.lastName}`}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FiPhone className="text-blue-500" />
                      {user.phoneNumber}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-3 py-1 text-sm rounded-full border ${getRoleBadgeColor(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FiMapPin className="text-green-500" />
                      {user.garage?.name || "N/A"}
                    </div>
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
                              setSelectedUser(user);
                              setIsDialogOpen(true);
                            }}
                          >
                            <FaEye className="text-blue-500" /> View
                          </Button>
                          <Button
                            variant="ghost"
                            className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md transition"
                            onClick={() =>
                              router.push(`/admin/users/${user.id}/edit`)
                            }
                          >
                            <FaEdit className="text-green-500" /> Edit
                          </Button>
                          <Button
                            variant="ghost"
                            className="flex items-center gap-2 text-red-600 hover:bg-red-100 px-3 py-2 rounded-md transition"
                            onClick={() => {
                              setSelectedUser(user);
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

      {/* User Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">
                {selectedUser.firstName} {selectedUser.lastName}
              </h2>
              <p>
                <strong>Phone Number:</strong> {selectedUser.phoneNumber}
              </p>
              <p>
                <strong>Role:</strong>
                <span
                  className={`ml-2 px-2 py-1 text-sm rounded ${getRoleBadgeColor(
                    selectedUser.role
                  )}`}
                >
                  {selectedUser.role}
                </span>
              </p>
              <p>
                <strong>Branch:</strong> {selectedUser.garage?.name || "N/A"}
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
          <p>Are you sure you want to delete this user?</p>
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
              onClick={() => selectedUser && handleDeleteUser(selectedUser.id)}
            >
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersPage;
