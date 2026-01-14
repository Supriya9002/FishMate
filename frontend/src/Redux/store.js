import { configureStore } from "@reduxjs/toolkit";
import { adminReducer } from "./slices/adminSlice";
import { fishReducer } from "./slices/fishSlice";
import { coustomerReducer } from "./slices/coustomerSlice";
import { profileReducer } from "./slices/profileSlice";

const store = configureStore({
  reducer: {
    admin: adminReducer,
    fish: fishReducer,
    coustomer: coustomerReducer,
    profile: profileReducer,
  },
});

export default store;
