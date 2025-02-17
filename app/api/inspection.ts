import axios from "axios";
import Cookies from "js-cookie";
import {
  CreateVehicleInspectionChecklistInput,
  UpdateVehicleInspectionChecklistInput,
  GetVehicleInspectionChecklistByIdInput,
  DeleteVehicleInspectionChecklistInput,
  CreateGarageInspectionChecklistInput,
  UpdateGarageInspectionChecklistInput,
  GetGarageInspectionChecklistByIdInput,
  DeleteGarageInspectionChecklistInput,
} from "@/types";

const API_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/business/inspections`;

class InspectionsApi {
  private getAuthHeaders() {
    const token = Cookies.get("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async request<T>(
    method: string,
    url: string,
    data?: object,
    params?: object
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

  // Vehicle Inspection APIs
  createVehicleInspectionChecklist = (
    data: CreateVehicleInspectionChecklistInput
  ) => this.request("POST", `${API_URL}/vehicles`, data);

  updateVehicleInspectionChecklist = (
    data: UpdateVehicleInspectionChecklistInput
  ) => this.request("PUT", `${API_URL}/vehicles`, data);

  getAllInspectionChecklists = () => this.request("GET", `${API_URL}`);

  getVehicleInspectionChecklistById = (
    data: GetVehicleInspectionChecklistByIdInput
  ) => this.request("GET", `${API_URL}/vehicles/find`, undefined, data);

  deleteVehicleInspectionChecklist = (
    data: DeleteVehicleInspectionChecklistInput
  ) => this.request("DELETE", `${API_URL}/vehicles`, undefined, data);

  // Garage Inspection APIs
  createGarageInspectionChecklist = (
    data: CreateGarageInspectionChecklistInput
  ) => this.request("POST", `${API_URL}/garages`, data);

  updateGarageInspectionChecklist = (
    data: UpdateGarageInspectionChecklistInput
  ) => this.request("PUT", `${API_URL}/garages`, data);

  getGarageInspectionChecklistById = (
    data: GetGarageInspectionChecklistByIdInput
  ) => this.request("GET", `${API_URL}/garages/find`, undefined, data);

  deleteGarageInspectionChecklist = (
    data: DeleteGarageInspectionChecklistInput
  ) => this.request("DELETE", `${API_URL}/garages`, undefined, data);
}

const inspectionsApi = new InspectionsApi();
export default inspectionsApi;
