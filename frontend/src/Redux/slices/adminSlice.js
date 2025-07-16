import { createSlice, createAsyncThunk, } from "@reduxjs/toolkit";
import baseUrl from "../Urls";


export const registerAdmin = createAsyncThunk ("admin/registerAdmin", async(formData, {rejectWithValue})=>{
    try{
        const response = await fetch(`${baseUrl}/api/admin/register`,{
            "method": "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(formData), 
        })
        const data = await response.json();
        if (!response.ok) {
            return rejectWithValue(data);
        }
        return data;
    }catch(err){
        console.log(err);
        return rejectWithValue(err.message);
    }
})

export const loginAdmin = createAsyncThunk("admin/loginAdmin", async(formData, {rejectWithValue})=>{
    try{
        const response = await fetch(`${baseUrl}/api/admin/login`,{
            "method":"POST",
            headers:{"Content-Type": "application/json"},
            body: JSON.stringify(formData),
        })
        console.log("response", response);
        const data = await response.json();
        if(!response.ok){
            return rejectWithValue(data)
        }
        // console.log("In loginAdmin", data);
        localStorage.setItem("authToken", data)
        return data;
    }catch(err){
        console.log(err);
        return rejectWithValue(err.message);
    }
})

const adminSlice = createSlice({
    name: "admin",
    initialState: {
      loading: false,
      error: null,
      successMessage: null,
      isLogin: false,
      currentLocationPath: null,
    },
    reducers: {
      // You can add other reducers if needed
      // Define a reducer to update the `isLogin` status
      setIsLogin(state,action){
        state.isLogin = action.payload;
      },
      setCurrentLocationPath(state, action){
        state.currentLocationPath = action.payload;
      }
    },
    extraReducers: (builder) => {
      builder // fulfilled, pending, rejected is predefine, Yes, in Redux Toolkit's createAsyncThunk, the action types Predefine
        // Handle registration pending state
        .addCase(registerAdmin.pending, (state) => {
          state.loading = true;
          state.error = null;
          state.successMessage = null;
        })
        // Handle registration fulfilled state (successful registration)
        .addCase(registerAdmin.fulfilled, (state, action) => {
          state.loading = false;
          // state.isLogin= false;
          state.successMessage = "Registration Successful!";
        })
        // Handle registration rejected state (error)
        .addCase(registerAdmin.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || "Something went wrong";
        })
        .addCase(loginAdmin.fulfilled, (state, action)=>{
          // state.isLogin = true;
          localStorage.setItem("isLogin",  true)
        })
    },
  });
  
export const adminReducer= adminSlice.reducer;
export const adminActions = adminSlice.actions;