import axios from "axios";
import Cookies from "js-cookie";
import {
  CreateGarageInput,
  UpdateGarageInput,
  GetGarageByIdInput,
  DeleteGarageInput,
} from "@/types";

const API_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/garages`;

interface GetAdminGaragesInput {
  adminId: string;
}

class GarageApi {
  private getAuthHeaders() {
    const token = Cookies.get("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async request<T>(
    method: string,
    url: string,
    data?: CreateGarageInput | UpdateGarageInput | undefined,
    params?:
      | GetGarageByIdInput
      | DeleteGarageInput
      | GetAdminGaragesInput
      | undefined
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

  createGarage = (garageData: CreateGarageInput) =>
    this.request("POST", API_URL, garageData);

  updateGarage = (garageData: UpdateGarageInput) =>
    this.request("PUT", API_URL, garageData);

  getGarageById = (garageData: GetGarageByIdInput) =>
    this.request("GET", `${API_URL}/find`, undefined, garageData);

  getGarages = () => this.request("GET", API_URL);

  getAdminGarages = (data: GetAdminGaragesInput) =>
    this.request("GET", `${API_URL}/admin/garages`, undefined, data);

  deleteGarage = (garageData: DeleteGarageInput) =>
    this.request("DELETE", API_URL, undefined, garageData);
}

const garageApi = new GarageApi();
export default garageApi;
