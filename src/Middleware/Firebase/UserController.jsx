import { createSlice } from '@reduxjs/toolkit';



const initialState = {
    value: {
      USER: "",
      islogin: false,
      UserName: "",
      Name: "",
      Email: "",
      Age:"",
      Country:"",
      FIDE:"",
      profile:"",
      WinMatch:0,
      TotalMatch:0,
    },
};

export const UserControllerSlice = createSlice({
    name: 'USER_STATE',
    initialState,
    reducers: {
      setUserState: (state,action) => {
        // console.log(action.payload["User_id"]);
        state.value.USER = action.payload["User_id"];
        state.value.UserName = action.payload["UserName"];
        state.value.Name = action.payload["Name"];
        state.value.Email = action.payload["Email"];
        state.value.Age = action.payload["Age"];
        state.value.Country = action.payload["Country"];
        state.value.FIDE = action.payload["FIDE"];
        state.value.profile = action.payload["ProfileImage"];
        state.value.TotalMatch = action.payload["TotalMatch"];
        state.value.WinMatch = action.payload["WinMatch"];
        console.log("User State is Set :",state.value.USER);
        state.value.islogin = true;
      },
      setLogin:(state,action)=>{
        state.value.islogin = action.payload
      },
      setInitialState:(state)=>{
        return initialState
      },
    },
  })

  export const { setUserState,setLogin,setInitialState } = UserControllerSlice.actions

  export default (UserControllerSlice.reducer)