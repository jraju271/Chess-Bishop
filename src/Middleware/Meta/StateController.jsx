import { createSlice } from '@reduxjs/toolkit';

import BotSleep from '../../assets/Image/Bot/BotSleep.gif'
import BotSpeak from '../../assets/Image/Bot/BotSpeak.gif'
import BotActiveMain from '../../assets/Image/Bot/BotActiveMain.gif'


const initialState = {
    value: {MemojiImage:{'Sleep':BotSleep,'Active':BotActiveMain,'Speak':BotSpeak},MemojiState:BotSleep}
}

export const StateSlice = createSlice({
    name: 'STATE',
    initialState,
    reducers: {
      setMemojiState: (state,action) => {
        state.value.MemojiState=state.value.MemojiImage[action.payload];
        console.log(action.payload);
      }
    },
  })

  export const { setMemojiState } = StateSlice.actions

  export default (StateSlice.reducer)