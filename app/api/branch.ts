import axios from "axios";
import Cookies from "js-cookie";
import {
  CreateBranchInput,
  UpdateBranchInput,
  GetBranchByIdInput,
  DeleteBranchInput,
} from "@/types";

const API_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/branches`;

class BranchApi {
  private getAuthHeaders() {
    const token = Cookies.get("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async request<T>(
    method: string,
    url: string,
    data?: CreateBranchInput | UpdateBranchInput | undefined,
    params?: GetBranchByIdInput | DeleteBranchInput | undefined
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

  createBranch = (branchData: CreateBranchInput) =>
    this.request("POST", API_URL, branchData);

  updateBranch = (branchData: UpdateBranchInput) =>
    this.request("PUT", API_URL, branchData);

  getBranchById = (branchData: GetBranchByIdInput) =>
    this.request("GET", `${API_URL}/find`, undefined, branchData);

  getBranches = () => this.request("GET", API_URL);

  deleteBranch = (branchData: DeleteBranchInput) =>
    this.request("DELETE", API_URL, undefined, branchData);
}

const branchApi = new BranchApi();
export default branchApi;
