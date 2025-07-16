import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import baseUrl from "../Urls";

export const addFish = createAsyncThunk("fish/addFish", async(formData, {rejectWithValue})=>{
    try{
        const token = localStorage.getItem("authToken");
        const response = await fetch(`${baseUrl}/api/fish/add`, {
            method: "POST",
            headers: {
                "Authorization": `${token}`, // Attach the token in the Authorization header
                "Content-Type": "application/json" 
            }, // content type
            body: JSON.stringify(formData), // string a convert kore diche
        })
        const data = response.data;
        if(!response.ok){
            return rejectWithValue(data);
        }
        return data;
    }catch(err){
        console.log(err)
        return rejectWithValue(err.message)
    }
})

export const getAllFish = createAsyncThunk("fish/getAllFish", async(_, {rejectWithValue})=>{
    //write hare code
    try{
        const token = localStorage.getItem("authToken");
        // console.log("supToken", token)
        const response =await fetch(`${baseUrl}/api/fish/displayallfish`,{
            method: "GET",
            headers: {
                "Authorization": `${token}`, // Attach the token in the Authorization header
                "Content-Type": "application/json" 
            },
        });
        const data = await response.json();
        if(!response.ok){
            return rejectWithValue(response)
        }
        // console.log("get all fish response",response)
        return data;
    }catch(err){
        console.log(err)
        return rejectWithValue(err.message);
    }
})

export const fishSlice = createSlice({
    name: "fish",
    initialState:{
        fishArr: [],
        loading: false,
        error: null,
        successMessage: null,
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(addFish.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.successMessage = null;
        })
        .addCase(addFish.fulfilled, (state, action) => {
            state.loading = false;
            state.successMessage = "Fish Add Successful!";
        })
        .addCase(addFish.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Something went wrong";
        })
        .addCase(getAllFish.fulfilled, (state, action)=>{
            state.fishArr = action.payload // addFish যদি fulfilled হয়ে যায় তখনই যেটা return করবে সেটা Payload ভেতরে আসবে এবং সেটা আপডেট করে দেবো
        })
    }
})

export const fishReducer = fishSlice.reducer;
export const actions = fishSlice.actions;