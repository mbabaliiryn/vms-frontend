import axios from "axios";
import Cookies from "js-cookie";
import {
  CreateVehicleInput,
  UpdateVehicleInput,
  GetVehicleByIdInput,
  DeleteVehicleInput,
} from "@/types";

const API_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/business/vehicles`;

class VehicleApi {
  private getAuthHeaders() {
    const token = Cookies.get("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async request<T>(
    method: string,
    url: string,
    data?: CreateVehicleInput | UpdateVehicleInput | undefined,
    params?: GetVehicleByIdInput | DeleteVehicleInput | undefined
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

  createVehicle = (vehicleData: CreateVehicleInput) =>
    this.request("POST", API_URL, vehicleData);

  updateVehicle = (vehicleData: UpdateVehicleInput) =>
    this.request("PUT", API_URL, vehicleData);

  getVehicleById = (vehicleData: GetVehicleByIdInput) =>
    this.request("GET", `${API_URL}/find`, undefined, vehicleData);

  getVehicles = () => this.request("GET", API_URL);

  deleteVehicle = (vehicleData: DeleteVehicleInput) =>
    this.request("DELETE", API_URL, undefined, vehicleData);
}

const vehicleApi = new VehicleApi();
export default vehicleApi;
