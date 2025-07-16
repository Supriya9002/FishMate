import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        minLength: [3, "The Name should be 3 characture length"],
        // maxLength: [8 ,"The Name must be 8 characture length"],
    },
    mobaile:{
        type: Number,
        required: true,
        validate: {
            validator: function (v) {
                return v.toString().length === 10; // Ensure the number is exactly 10 digits long
            },
            message: "Mobile number must be exactly 10 digits",
        },
    },
    password:{
        type: String,
        required: true,
    },
    date:{
        type: Date,
        default: Date.now,
    },
    sessions:[{
        type:String
    }]
})

//model
const AdminModel = mongoose.model("Admin", adminSchema);
export default AdminModel;