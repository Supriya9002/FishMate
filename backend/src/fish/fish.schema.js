import mongoose from "mongoose";

const FishSchema = new mongoose.Schema({
    name:{
        type: String,
        // maxLength: [10 ,"The Name must be 8 characture length"],
    },
    price:{
        type: Number,
    },
    availableQuantity:{
        type: Number,
    },
    adminID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
    },
    date:{
        type: Date,
        default: Date.now,
    },
})

//model
const FishModel = mongoose.model("Fish", FishSchema);
export default FishModel;