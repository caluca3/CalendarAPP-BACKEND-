import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { authSlice } from "./auth/authSlice";
import { calendarSlice } from "./calendar/calendarSlice";
import { uiSlice } from "./ui/uiSlice";


export const store = configureStore({
    reducer:{
        auth:       authSlice.reducer,
        calendar: calendarSlice.reducer,
        ui:        uiSlice.reducer,
    },
    //*Se configura el middleware para que el id de la fecha dno de error
    middleware:(getDefaultMiddleware)=>getDefaultMiddleware({serializableCheck:false})
})