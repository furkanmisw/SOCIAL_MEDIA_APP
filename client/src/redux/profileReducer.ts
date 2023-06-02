import { createSlice } from "@reduxjs/toolkit";
import { IProfileInitialState } from "../interfaces/ISlices";
import { RootState } from "./store";
import { getMyProfile } from "../api/profile";

const init = () => document.cookie.includes("isloggedin=true");

const initialState: IProfileInitialState = {
  isloggedin: init(),
  loginPopupActive: false,
  values: {
    username: "",
    pp: null,
    id: "",
  },
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    toggleSetIsloggedin: (state) => {
      state.isloggedin = !state.isloggedin;
    },
    toggleSetLoginPopupActive: (state) => {
      state.loginPopupActive = !state.loginPopupActive;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getMyProfile.fulfilled, (state, action) => {
      state.values = action.payload as {
        username: string;
        pp: string | null;
        id: string;
      };
    });
  },
});

export const { toggleSetIsloggedin, toggleSetLoginPopupActive } =
  profileSlice.actions;

export const selectProfile = (state: RootState) => state.profile;
export const selectValues = (state: RootState) => state.profile.values;
export const selectIsLoggedin = (state: RootState) => state.profile.isloggedin;
export const selectPostPopupActive = (state: RootState) =>
  state.profile.loginPopupActive;

export default profileSlice.reducer;
