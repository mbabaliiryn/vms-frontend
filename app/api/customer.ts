import axios from "axios";
import Cookies from "js-cookie";
import {
  CreateCustomerInput,
  UpdateCustomerInput,
  GetCustomerByIdInput,
  DeleteBranchInput,
} from "@/types";

const API_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/business/customers`;

class CustomerApi {
  private getAuthHeaders() {
    const token = Cookies.get("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async request<T>(
    method: string,
    url: string,
    data?: CreateCustomerInput | UpdateCustomerInput | undefined,
    params?: GetCustomerByIdInput | DeleteBranchInput | undefined
  ): Promise<T> {
    try {
      const response = await axios({
        method,
        url,
        data,
        params,
        headers: this.getAuthHeaders(),
      });

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("API Error:", error.response?.data || error.message);
        throw (
          error.response?.data || new Error("An unknown API error occurred")
        );
      } else {
        console.error("Unexpected Error:", error);
        throw new Error("An unexpected error occurred");
      }
    }
  }

  createCustomer = (customerData: CreateCustomerInput) =>
    this.request("POST", API_URL, customerData);

  updateCustomer = (customerData: UpdateCustomerInput) =>
    this.request("PUT", API_URL, customerData);

  getCustomerById = (customerData: GetCustomerByIdInput) =>
    this.request("GET", `${API_URL}/find`, undefined, customerData);

  getCustomers = () => this.request("GET", API_URL);

  deleteCustomer = (customerData: { customerId: string }) =>
    this.request("DELETE", API_URL, undefined, customerData);
}

const customerApi = new CustomerApi();
export default customerApi;
