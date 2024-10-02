import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../lib/features/auth/authSlice';
import petReducer from "../lib/features/pet/petSlice"
export const makeStore = () => {
  return configureStore({
    reducer: {
        auth: authReducer,
         pets: petReducer,
    }
  })
}


export type AppStore = ReturnType<typeof makeStore>

export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']