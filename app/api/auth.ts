import axios from "axios";
import Cookies from "js-cookie";
import { RegisterInput, LoginInput, AssignRoleInput } from "@/types";
import dotenv from "dotenv";

dotenv.config();

const API_URL = `${process.env.NEXT_PUBLIC_BASE_URL!}/register`;

class AuthApi {
  signup = async (userData: RegisterInput) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  adminSignup = async (userData: RegisterInput) => {
    try {
      const response = await axios.post(`${API_URL}/register-admin`, userData);

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  login = async (userData: LoginInput) => {
    try {
      const response = await axios.post(`${API_URL}/login`, userData);

      const { token, user } = response.data;

      Cookies.set("token", token, {
        expires: 5,
        secure: true,
        sameSite: "Strict",
      });

      Cookies.set("user", JSON.stringify(user), {
        expires: 5,
        secure: true,
        sameSite: "Strict",
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  assignRole = async (userData: AssignRoleInput) => {
    try {
      const token = Cookies.get("token");
      const response = await axios.put(`${API_URL}/assign-role`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  getUsers = async () => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get(`${API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  logout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
  };

  //   forgotPassword = async (email: string) => {
  //     try {
  //       const response = await axios.post(`${API_URL}/forgot-password`, {
  //         email,
  //       });

  //       return response.data;
  //     } catch (error) {
  //       throw error;
  //     }
  //   };

  //   resetPassword = async (password: string, userId: string) => {
  //     try {
  //       const response = await axios.put(`${API_URL}/reset-password/${userId}`, {
  //         newPassword: password,
  //       });

  //       return response.data;
  //     } catch (error) {
  //       throw error;
  //     }
  //   };

  //   inviteUser = async (userData: {
  //     email: string;
  //     firstName: string;
  //     lastName: string;
  //     role: string;
  //   }) => {
  //     try {
  //       const token = localStorage.getItem("token");
  //       const companyId = localStorage.getItem("companyId");
  //       const response = await axios.post(`${API_URL}/invite-user`, userData, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "company-id": `${companyId}`,
  //         },
  //       });

  //       return response.data;
  //     } catch (error) {
  //       throw error;
  //     }
  //   };

  //   getCompanyUsers = async () => {
  //     const companyId = localStorage.getItem("companyId");
  //     const token = localStorage.getItem("token");
  //     try {
  //       const response = await axios.get(`${API_URL}/get-company-users`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "company-id": `${companyId}`,
  //         },
  //       });

  //       return response.data;
  //     } catch (error) {
  //       throw error;
  //     }
  //   };

  //   getUserById = async (userId: string) => {
  //     const token = localStorage.getItem("token");
  //     try {
  //       const response = await axios.get(`${API_URL}/get-user/${userId}`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });

  //       return response.data;
  //     } catch (error) {
  //       throw error;
  //     }
  //   };
}

const authApi = new AuthApi();

export default authApi;
