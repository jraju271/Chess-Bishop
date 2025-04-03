import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { EngineApi } from './Engine/Engine'
import {StateSlice} from './Meta/StateController'
import {UserControllerSlice} from './Firebase/UserController'
import PlayDialogStateReducer from './PlayDialogSlice';
import CurrentStateReducer from './Global'

export const Store = configureStore({
  reducer: {
    STATE:StateSlice.reducer,
    USER_STATE:UserControllerSlice.reducer,
    [EngineApi.reducerPath]: EngineApi.reducer,
    PlayDialogState:PlayDialogStateReducer,
    CurrentState:CurrentStateReducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(EngineApi.middleware),
})
setupListeners(Store.dispatch)
