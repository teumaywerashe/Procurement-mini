import { AuthState, User } from "@/src/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
};

const authSlice = createSlice({
  initialState,
  name: "auth",
  reducers: {
    logIn: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isLoggedIn = true;
    },

    logOut: (state) => {
      state.isLoggedIn = false;
      state.user = null;
    },
  },
});

export const { logIn, logOut } = authSlice.actions;
export const authReducer = authSlice.reducer;
