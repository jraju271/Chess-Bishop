import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    value: {PlayDialog:false,},
}

export const PlayDialogSlice = createSlice({
    name: 'PlayDialogState',
    initialState,
    reducers: {
      setPlayDialog: (state,action) => {
        state.value.PlayDialog = action.payload;
        
      }
    },
  })

  export const { setPlayDialog } = PlayDialogSlice.actions

  export default PlayDialogSlice.reducer