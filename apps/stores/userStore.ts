import { create } from "zustand";
import { registerUserResponse } from "@packages/types/jwt";
import { type RegisterUserFormSchema } from "@packages/schema/registerSchema";
import axios from "axios";
import { access } from "fs";

// Types
type States = {
  hasUserLogin: boolean;
};

type Actions = {
  onLogin: (data: RegisterUserFormSchema) => void;
  onCreateUser: (data: RegisterUserFormSchema) => void;
  getAccessToken: () => string | null;
  onRefresh: () => Promise<void>;
};

// Initial state
const initialState: States = {
  hasUserLogin: false,
};

// Zustand store
const useUserStore = create<States & Actions>((set) => ({
  ...initialState,

  getAccessToken: () => {
    return localStorage.getItem("accessToken");
  },

  onLogin: async (data) => {
    try {
      // TODO: turn axios
      const response = await axios.post("/api/auth/login", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const userResponse: registerUserResponse = response.data;
      console.log(userResponse);
      set({
        hasUserLogin: true,
      });

      localStorage.setItem("accessToken", userResponse.accessToken);
    } catch (e) {
      console.error("Error logging in:", e);
    }
  },

  // Function to handle user login, stores access token and updates state
  onCreateUser: async (data) => {
    // TODO: add retry logic
    try {
      // TODO: turn axios
      const response = await axios.post("/api/auth/register", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const userResponse: registerUserResponse = response.data;
      console.log(userResponse);
      set({
        hasUserLogin: true,
      });

      localStorage.setItem("accessToken", userResponse.accessToken);
    } catch (e) {
      console.error("Error creating user:", e);
    }
  },

  // Function to refresh the token (typically called when an API call fails due to token expiration)
  onRefresh: async () => {
    try {
      const response = await axios.get("/api/auth/refresh", {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (response.status === 200) {
        const userResponse = response.data;
        console.log("refreshed", userResponse);
        // Update access token in localStorage
        localStorage.setItem("accessToken", userResponse.accessToken);
      } else {
        console.error("Failed to refresh token");
        set({ hasUserLogin: false });
        localStorage.removeItem("accessToken");
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
    }
  },
}));

export default useUserStore;
