import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    fishID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Fish",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    amountDue: {
        type: Number,
        required: true,  // This will be calculated as quantity * price
    },
    date: {
        type: Date,
        default: Date.now,
    }
});

const CoustomerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: [3, "The Name should be 3 characture length"],
    },
    mobaile: {
        type: Number,
        required: true,
        validate: {
            validator: function (v) {
              return /^[0-9]{10}$/.test(v); // Regular expression to match 10-digit numbers
            },
            message: props => `${props.value} is not a valid 10-digit number!`
          },
    },
    adminID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
    },
    transactions: [transactionSchema],
    totalDue:{
        type: Number,
        default: 0, // Tracks the total outstanding amount
    },
    date:{
        type: Date,
        default: Date.now,
    },
});

//model
const CoustomerModel = mongoose.model("Coustomer", CoustomerSchema);
export default CoustomerModel;
