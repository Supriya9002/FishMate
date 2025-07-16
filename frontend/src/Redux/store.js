import { configureStore } from "@reduxjs/toolkit";
import { adminReducer } from "./slices/adminSlice";
import { fishReducer } from "./slices/fishSlice";
import { coustomerReducer } from "./slices/coustomerSlice";

const store = configureStore({
    reducer:{
        admin: adminReducer,
        fish: fishReducer,
        coustomer: coustomerReducer
    }
})

export default store;