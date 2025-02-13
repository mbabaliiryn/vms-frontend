import axios from "axios";
import Cookies from "js-cookie";
import {
  CreateServiceHistoryInput,
  GetServiceHistoryByIdInput,
  UpdateServiceHistoryInput,
  DeleteServiceHistoryInput,
} from "@/types";

const API_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/business/maintenance`;

class ServiceHistoryApi {
  private getAuthHeaders() {
    const token = Cookies.get("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async request<T>(
    method: string,
    url: string,
    data?: CreateServiceHistoryInput | UpdateServiceHistoryInput | undefined,
    params?: GetServiceHistoryByIdInput | DeleteServiceHistoryInput | undefined
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

  createServiceHistory = (serviceHistoryData: CreateServiceHistoryInput) =>
    this.request("POST", API_URL, serviceHistoryData);

  updateServiceHistory = (serviceHistoryData: UpdateServiceHistoryInput) =>
    this.request("PUT", API_URL, serviceHistoryData);

  getServiceHistoryById = (serviceHistoryData: GetServiceHistoryByIdInput) =>
    this.request("GET", `${API_URL}/find`, undefined, serviceHistoryData);

  getServiceHistories = () => this.request("GET", API_URL);

  deleteServiceHistory = (serviceHistoryData: DeleteServiceHistoryInput) =>
    this.request("DELETE", API_URL, undefined, serviceHistoryData);
}

const serviceHistoryApi = new ServiceHistoryApi();
export default serviceHistoryApi;
