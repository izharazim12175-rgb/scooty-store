import { createSlice } from "@reduxjs/toolkit";

function getInitialAuth() {
  if (typeof window === "undefined" || !window.sessionStorage) {
    return { token: null, user: null };
  }
  try {
    const token = sessionStorage.getItem("scootstore_admin_token");
    const userStr = sessionStorage.getItem("scootstore_admin_user");
    const user = userStr ? JSON.parse(userStr) : null;
    return { token, user };
  } catch (err) {
    console.error("Failed to read auth state from sessionStorage:", err);
    return { token: null, user: null };
  }
}

const initialAuth = getInitialAuth();

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: initialAuth.token,
    user: initialAuth.user,
    isAuthenticated: Boolean(initialAuth.token && initialAuth.user),
    isAdmin: Boolean(initialAuth.token && initialAuth.user?.role === "admin"),
    loading: false,
    error: null,
  },
  reducers: {
    loginSuccess: (state, action) => {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
      state.isAuthenticated = true;
      state.isAdmin = user?.role === "admin";
      state.error = null;
      state.loading = false;

      if (typeof window !== "undefined" && window.sessionStorage) {
        try {
          sessionStorage.setItem("scootstore_admin_token", token);
          sessionStorage.setItem("scootstore_admin_user", JSON.stringify(user));
        } catch (err) {
          console.error("Failed to save auth to sessionStorage:", err);
        }
      }
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.isAdmin = false;
      state.error = null;
      state.loading = false;

      if (typeof window !== "undefined" && window.sessionStorage) {
        try {
          sessionStorage.removeItem("scootstore_admin_token");
          sessionStorage.removeItem("scootstore_admin_user");
        } catch (err) {
          console.error("Failed to remove auth from sessionStorage:", err);
        }
      }
    },
    setAuthLoading: (state, action) => {
      state.loading = Boolean(action.payload);
    },
    setAuthError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loginSuccess,
  logout,
  setAuthLoading,
  setAuthError,
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;

