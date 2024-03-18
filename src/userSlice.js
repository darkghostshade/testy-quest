import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  Loged_in: false,
  UserName: 'user1',
  UserImage: null,
  UserCode: 'test',
  LobbyCode: 'test',
};

export const userSlice = createSlice({
  name: 'User',
  initialState,
  reducers: {
    LoginUser: (state) => {
      state.Loged_in = true;
    },
    Logout: (state) => {
      state.Loged_in = false;
    }
  }
});

export const {LoginUser, Logout } = userSlice.actions;

export default userSlice.reducer;