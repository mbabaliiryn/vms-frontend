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
import { customerApi } from "@/app/api";
import { Customer } from "@/types";
import axios from "axios";
import Spinner from "@/components/Spinner/Spinner";
import { useRouter } from "next/navigation";

export interface ApiResponse {
  success: boolean;
  message: string;
  data: Customer[];
}

interface DeleteResponse {
  success: boolean;
  message: string;
}

const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const response = (await customerApi.getCustomers()) as ApiResponse;
        if (response.success) {
          setCustomers(response.data);
        } else {
          toast.error("Failed to load customers", {
            description:
              response.message || "An error occurred while fetching customers.",
          });
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          toast.error("Failed to load customers", {
            description:
              err.response?.data?.message ||
              "An error occurred while fetching customers.",
          });
        } else {
          toast.error("Failed to load customers", {
            description: "An unexpected error occurred.",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleDeleteCustomer = async (customerId: string) => {
    setLoading(true);
    try {
      const response = (await customerApi.deleteCustomer({
        customerId,
      })) as DeleteResponse;
      if (response.success) {
        toast.success("Customer deleted successfully!");
        setCustomers((prevCustomers) =>
          prevCustomers.filter((customer) => customer.id !== customerId)
        );
        setIsDeleteDialogOpen(false);
      } else {
        toast.error("Failed to delete customer", {
          description:
            response.message ||
            "An error occurred while deleting the customer.",
        });
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error("Failed to delete customer", {
          description:
            err.response?.data?.message ||
            "An error occurred while deleting the customer.",
        });
      } else {
        toast.error("Failed to delete customer", {
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
        <h1 className="text-2xl font-semibold">Customers</h1>
        <Button
          onClick={() => router.push("/operations/customers/create")}
          className="px-4 py-2  bg-orange-500 hover:bg-orange-600"
        >
          + Add Customer
        </Button>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className="border rounded-lg shadow-sm overflow-hidden">
          <Table className="w-full border-collapse">
            <TableCaption className="py-3 text-gray-500">
              List of all customers.
            </TableCaption>
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead className="px-4 py-3">ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Customer Type</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Garage</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer, index) => (
                <TableRow
                  key={customer.id}
                  className={`border-b ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100 transition`}
                >
                  <TableCell className="px-4 py-3 font-medium">
                    {index + 1}
                  </TableCell>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.customerType}</TableCell>
                  <TableCell>{customer.contact}</TableCell>
                  <TableCell>{customer.address}</TableCell>
                  <TableCell>{customer.garage.name}</TableCell>

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
                              setSelectedCustomer(customer);
                              setIsDialogOpen(true);
                            }}
                          >
                            <FaEye className="text-blue-500" /> View
                          </Button>
                          <Button
                            variant="ghost"
                            className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md transition"
                            onClick={() =>
                              router.push(
                                `/operations/customers/${customer.id}/edit`
                              )
                            }
                          >
                            <FaEdit className="text-green-500" /> Edit
                          </Button>
                          <Button
                            variant="ghost"
                            className="flex items-center gap-2 text-red-600 hover:bg-red-100 px-3 py-2 rounded-md transition"
                            onClick={() => {
                              setSelectedCustomer(customer);
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

      {/* Customer Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">{selectedCustomer.name}</h2>
              <p>
                <strong>Contact:</strong> {selectedCustomer.contact}
              </p>
              <p>
                <strong>Customer Type:</strong> {selectedCustomer.customerType}
              </p>
              <p>
                <strong>Address:</strong> {selectedCustomer.address}
              </p>
              <p>
                <strong>Garage:</strong> {selectedCustomer.garage.name}
              </p>
              <p>
                <strong>Vehicles: </strong>{" "}
                {selectedCustomer.vehicles?.length || 0}
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
          <p>Are you sure you want to delete this customer?</p>
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
                selectedCustomer && handleDeleteCustomer(selectedCustomer.id)
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

export default CustomersPage;
