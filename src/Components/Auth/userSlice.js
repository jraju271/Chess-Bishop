import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: {
    islogin: false,
    UserName: '',
    Email: '',
    Age: '',
    profile: '',
    WinMatch: 0,
    TotalMatch: 0
  }
};

const userSlice = createSlice({
  name: 'USER_STATE',
  initialState,
  reducers: {
    login: (state, action) => {
      state.value = action.payload;
    },
    logout: (state) => {
      state.value = initialState.value;
    }
  }
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
