import axios from "axios";
import Cookies from "js-cookie";
import {
    CreateInspectionChecklistInput,
    UpdateInspectionChecklistInput,
    GetInspectionChecklistByIdInput,
    DeleteInspectionChecklistInput,
} from "@/types";

const API_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/business/inspections`;

class InspectionsApi {
    private getAuthHeaders() {
        const token = Cookies.get("token");
        return token ? {Authorization: `Bearer ${token}`} : {};
    }

    private async request<T>(
        method: string,
        url: string,
        data?:
            | CreateInspectionChecklistInput
            | UpdateInspectionChecklistInput
            | undefined,
        params?:
            | GetInspectionChecklistByIdInput
            | DeleteInspectionChecklistInput
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

    createInspectionChecklist = (
        inspectionChecklistData: CreateInspectionChecklistInput
    ) => this.request("POST", `${API_URL}`, inspectionChecklistData);

    updateInspectionChecklist = (
        inspectionChecklistData: UpdateInspectionChecklistInput
    ) => this.request("PUT", `${API_URL}`, inspectionChecklistData);

    getAllInspectionChecklists = () => this.request("GET", `${API_URL}`);

    getInspectionChecklistById = (
        inspectionChecklistData: GetInspectionChecklistByIdInput
    ) =>
        this.request("GET", `${API_URL}/find`, undefined, inspectionChecklistData);

    deleteInspectionChecklist = (
        inspectionChecklistData: DeleteInspectionChecklistInput
    ) => this.request("DELETE", `${API_URL}`, undefined, inspectionChecklistData);
}

const inspectionsApi = new InspectionsApi();
export default inspectionsApi;
