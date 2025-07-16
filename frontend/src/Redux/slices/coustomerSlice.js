import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import baseUrl from "../Urls";

export const fetchCoustomerDetails = createAsyncThunk("customer/customerrDetails", async(mobaile, {rejectWithValue})=>{
    try{
        console.log("CoustomerDetails in Createthank", mobaile)
        const token = localStorage.getItem("authToken");
        const response = await fetch(`${baseUrl}/api/coustomer/coustomerDetails`,{
            method:"POST",
            headers:{
                "Authorization": `${token}`,
                "Content-Type": "application/json", 
            },
            body: JSON.stringify({ mobaile: mobaile }), // mobaile string a convert kore diche
        })
        // console.log("In fetch COUSTOMER details", response.body);
        const data = await response.json();
        console.log("In fetch fish details",data);
        if(!response.ok){
            return rejectWithValue(data.message);
        }
        return data;
    }catch(err){
        // console.log(err);
        return rejectWithValue(err.message);
    }
});

//Fetch Coustomer Details by ID
export const fetchCoustomerDetailsByID = createAsyncThunk("customer/fetchCoustomerDetailsByID", async(coustomerID, {rejectWithValue})=>{
    try{
        // console.log("CoustomerDetails in Createthank", coustomerID)
        const token = localStorage.getItem("authToken");
        const response = await fetch(`${baseUrl}/api/coustomer/getCoustomerDetailsByID/${coustomerID}`,{
            method:"GET",
            headers:{
                "Authorization": `${token}`,
                "Content-Type": "application/json", 
            },
            // body: JSON.stringify({ mobaile: mobaile }), // mobaile string a convert kore diche
        })
        // console.log("In fetch COUSTOMER details", response.body);
        const data = await response.json();
        console.log("In fetchCoustomerDetailsByID Data",data);
        if(!response.ok){
            return rejectWithValue(data.message);
        }
        return data;
    }catch(err){
        // console.log(err);
        return rejectWithValue(err.message);
    }
});

export const fetchFishDetails = createAsyncThunk("fish/fishDetails", async(fishID, {rejectWithValue})=>{
    try{
        //console.log("FishID in Createthank", fishID)
        const token = localStorage.getItem("authToken");
        const response = await fetch(`${baseUrl}/api/fish/fishDetails/${fishID}`,{
            method:"GET",
            headers:{
                "Authorization": `${token}`,
                "Content-Type": "application/json",
            }
        })
        // console.log("In fetch fish details", response);
        const data = await response.json();
        //console.log("In fetch fish details",data)
        if(!response.ok){
            return rejectWithValue(data.message)
        }
        return data;
    }catch(err){
        // console.log(err);
        return rejectWithValue(err.message)
    }
})

export const addCoustomer = createAsyncThunk("coustomer/addCoustomer",async({formData, fishID}, {rejectWithValue})=>{
    try{
        // console.log("IN createThank", formData, fishID)
        const token = localStorage.getItem("authToken");
        const response = await fetch(`${baseUrl}/api/coustomer/coustomerFishBuy/${fishID}`,{ 
            method: "POST",
            headers: {
                "Authorization": `${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })
        // console.log("xxx",response)
        const data = await response.json();
        // console.log("Addcoustomer return data", data)
        if(!response.ok){
            return rejectWithValue(data);
        }
        return data;
    }catch(err){
        console.log(err);
        return rejectWithValue(err.message);
    }
})

export const fetchAllCoustomer = createAsyncThunk("coustomer/fetchAllCoustomer", async(_, {rejectWithValue})=>{
    try{
        const token = localStorage.getItem("authToken");
        const response = await fetch(`${baseUrl}/api/coustomer/getAllCoustomer`, {
            method: "GET",
            headers:{
                "Authorization": `${token}`,
                "Content-Type": "application/json",
            }
        });
        const data = await response.json();
        // console.log("fetchAllCoustomer createAsyncThunk",data);
        if(!response.ok){
            return rejectWithValue(data);
        }
        return data;
    }catch(err){
        console.log(err);
        return rejectWithValue(err)
    }
})

export const fullPaymentByCoustomer = createAsyncThunk("coustomer/fullPaymentByCoustomer",async({Payment, coustomerID}, {rejectWithValue})=>{
    try{
        console.log("IN createThank", Payment, coustomerID)
        const token = localStorage.getItem("authToken");
        const response = await fetch(`${baseUrl}/api/coustomer/fullPaymentByCoustomer/${coustomerID}`,{ 
            method: "POST",
            headers: {
                "Authorization": `${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({Payment: Payment}),
        })
        const data = await response.json();
        console.log("Addcoustomer return data", data)
        if(!response.ok){
            return rejectWithValue(data);
        }
        return data;
    }catch(err){
        console.log(err);
        return rejectWithValue(err.message);
    }
})

//onePaymentByCoustomer
export const onePaymentByCoustomer = createAsyncThunk("coustomer/onePaymentByCoustomer",async({Payment, coustomerID, transactionID}, {rejectWithValue})=>{
    try{
        // console.log("IN createThank", Payment)
        // console.log("LALU", coustomerID);
        // console.log("Pintu", transactionID)
        const token = localStorage.getItem("authToken");
        const response = await fetch(`${baseUrl}/api/coustomer/onePaymentByCoustomer/${coustomerID}/${transactionID}`,{ 
            method: "POST",
            headers: {
                "Authorization": `${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({payment: Payment}),
        })
        const data = await response.json();
        // console.log("Addcoustomer return data", data)
        if(!response.ok){
            return rejectWithValue(data);
        }
        return data;
    }catch(err){
        console.log(err);
        return rejectWithValue(err.message);
    }
})
export const customerSlice = createSlice({
    name: "coustomer",
    initialState:{
        coustomerDetails: null,
        fishDetails: null,
        coustomerArr:[],
        loading: false,
        error: null,
        successMessage: null,
    },
    reducers:{},
    extraReducers: (builder)=>{
        builder
        .addCase(fetchCoustomerDetailsByID.fulfilled, (state, action)=>{
            console.log("In fetchAllCoustomer By ID action.payload", action.payload)
            state.coustomerDetails = action.payload;
        })
        .addCase(fetchAllCoustomer.fulfilled, (state, action)=>{
            // console.log("In fetchAllCoustomer action.payload", action.payload)
            state.coustomerArr = action.payload;
        })
        .addCase(fetchCoustomerDetails.fulfilled,(state, action)=>{
            // console.log("Extrareducer in coustomerslicee", action.payload)
            state.coustomerDetails = action.payload;
        })
        .addCase(fetchFishDetails.fulfilled,(state, action)=>{
            // console.log("Extrareducer in coustomerslicee", action.payload)
            state.fishDetails = action.payload;
        })
        .addCase(addCoustomer.pending, (state, action) => {
            console.log("Supriya pending", action.payload);
            state.loading = true;
            state.error = null;
            state.successMessage = null;
        })
        .addCase(addCoustomer.fulfilled, (state, action) => {
            console.log("Supriya fuilfilled", action.payload)
            state.loading = false;
            state.successMessage = "Coustomer Add Successful!";
            // reset form data here
            // state.formData = { name: '', mobile: '', payment: '', quantity: '', customerPay: '' };
        })
        .addCase(addCoustomer.rejected, (state, action) => {
            console.log("Supriya reject")
            state.loading = false;
            state.error = action.payload || "Something went wrong";
        })
    }
})

export const coustomerReducer = customerSlice.reducer;