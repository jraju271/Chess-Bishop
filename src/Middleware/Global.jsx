import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    value: {isPlayDialog:false,Lesson:{isLessonOpen:false,CurrentLessonIndex:null},Topic:{isTopicOpen:false,CurrentTopicIndex:null},Notify:false,NextLesson:'',TaskState:[true,false,false,false]}
}

export const GlobalSlice = createSlice({
    name: 'CurrentState',
    initialState,
    reducers: {
      setPlayDialog: (state,action) => {
        state.value.isPlayDialog = action.payload;
      },
      setLessonState: (state,action) => {
        state.value.Lesson = action.payload
        
      },
      setTopicState: (state,action) => {
        state.value.Topic = action.payload; 
      },
      setNotifySate:(state,action)=>{
        
        state.value.Notify = action.payload.Notify
        state.value.NextLesson  =action.payload.LessonPath
        console.log(state.value.Notify);
      },
      setTaskState:(state,action)=>{
        state.value.TaskState[action.payload.index] = action.payload.iscompleted;
      }
    },
  })

  export const { setPlayDialog,setLessonState,setTopicState,setNotifySate,setTaskState } = GlobalSlice.actions

  export default GlobalSlice.reducer
  