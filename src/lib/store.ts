import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../lib/features/auth/authSlice';
import petReducer from "../lib/features/pet/petSlice"
import healthCheckReducer  from "../lib/features/pet/HealthCheckSlice"
import adoptionReducer  from "./features/adopt/adoptSlice"
import userReducer from './features/user/userSlice';
import paymentReducer from './features/payment/paymentSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
        auth: authReducer,
         pets: petReducer,
         healthChecks: healthCheckReducer,
         adoption: adoptionReducer,
         user: userReducer, 
         payment: paymentReducer,
    }
  })
}


export type AppStore = ReturnType<typeof makeStore>

export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']