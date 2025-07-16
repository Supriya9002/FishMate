import CoustomerModel from "./coustomer.schema.js";
import FishModel from "../fish/fish.schema.js";

export default class CoustomerController{
    
    //Coustomer Buy Fish
    async coustomer_Fish_Buy(req, res){
        try{
            const {quantity, payment, name, mobaile} = req.body;
            console.log("req.body", req.body)
            if(payment<0){
                return res.status(401).json("Payment Must be Positive")
            }
            const {fishID} = req.params;
            const fish = await FishModel.findById(fishID);
            // console.log("fish",fish)
            if(!fish){
                return res.status(200).send("Fish not found");
            }
            //check available quantity
            if(fish.availableQuantity < quantity){
                return res.status(200).send(`Available Fish Quantity ${fish.availableQuantity}kg`);
            }
            fish.availableQuantity -= quantity;
            await fish.save(); 
            //Mobaile Number Exit Or Not
            const coustomer = await CoustomerModel.findOne({mobaile});
            if(!coustomer){
                const amountDue = (fish.price * quantity) - payment;
                const newCoustomer = new CoustomerModel({
                    name,
                    mobaile,
                    adminID: req.userID,
                    transactions: [{fishID, quantity, price: fish.price, amountDue}],
                    totalDue: amountDue
                });
                await newCoustomer.save();
                res.status(201).json("New customer created and transaction added");
            }else{
                // console.log("Supriya")
                const amountDue = (fish.price * quantity) - payment;
                coustomer.transactions.push({fishID,quantity,price: fish.price,amountDue});
                coustomer.totalDue += amountDue;
                await coustomer.save();
                // console.log("Haldar");
                res.status(201).json({message: "Coustomer Transaction Updated"})
            }
        }catch(err){
            console.log(err);
            res.status(500).json(err);
        }
    }

    //coustomer fish pay for specific using Transaction id
    async coustomer_Pay_for_SpacificFish(req, res){
        // try{
        //     console.log("Don",req.body, req.params);
        //     const {CoustomerID, transactionID} = req.params;
        //     const {amountPay} = req.body;
        //     const exitCoustomer = await CoustomerModel.findOne({_id: CoustomerID, adminID: req.userID});
        //     if(!exitCoustomer){
        //         return res.status(404).send("Coustomer Dose not exit");
        //     }
        //     console.log("ddd",exitCoustomer.transactions);
        //     const coustomer = exitCoustomer.transactions.find((transaction)=> transaction._id.toString() === transactionID);
        //     console.log("coustomer", coustomer);
        //     if(amountPay>0 && amountPay<=coustomer.amountDue){
        //         coustomer.amountDue -= amountPay;
        //         exitCoustomer.totalDue -= amountPay; 
        //     }else{
        //         return res.status(404).send("pay Amount must be positive and between amountDue")
        //     }
        //     await exitCoustomer.save();
        //     res.status(201).send(coustomer);
        // }catch(err){
        //     console.log(err)
        // }
    }

    //coustomer Details
    async coustomer_Details(req, res){
        try{
            console.log(req.body);
            const coustomer = await CoustomerModel.findOne({mobaile: req.body.mobaile, adminID: req.userID});
            // console.log("coustomer", coustomer)
            if (!coustomer) {
                return res.status(200).json(null);
            }
            res.status(200).json(coustomer);
        }catch(err){
            console.log(err); 
        }
    }

    //getAllCoustomer
    async getAllCoustomer(req, res){
        try{
            console.log("getAllCoustomer");
            const AllCoustomer = await CoustomerModel.find({adminID: req.userID});
            if(!AllCoustomer){
                return res.status(401).json(null)
            }
            res.status(200).json(AllCoustomer);
        }catch(err){
            console.log(err);
        }
    }
    
    //get Coustomer Details by ID
    async getCoustomerDetailsByID(req, res){
        try{
            // console.log(req.params);
            const {coustomerID} = req.params;
            const getCoustomer = await CoustomerModel.findById(coustomerID)
            if(!getCoustomer){
                return res.status(401).json({message: "coustomer Not found"})
            }
            console.log(getCoustomer)
            res.status(200).json(getCoustomer);
        }catch(err){
            console.log(err);
            res.status(200).json(err);
        }
    }
    // full payment by coustomer
    async fullPaymentByCoustomer(req, res){
        try{
            // console.log("fullPaymentByCoustomer",req.params, req.body);
            const {coustomerID} = req.params;
            const {Payment} = req.body; 
            const ifExit_Coustomer = await CoustomerModel.findOne({_id:coustomerID, adminID: req.userID});
            // console.log(ifExit_Coustomer)
            if(!ifExit_Coustomer){
                return res.status(401).json({message: "coustomer Not found"})
            }
            // console.log(ifExit_Coustomer.totalDue, Payment)
            if(Number(ifExit_Coustomer.totalDue )!== Number(Payment)){
                return res.status(401).json({message: "Actual amountDue and coustomer payment not qeual"})
            }
            ifExit_Coustomer.transactions?.map((coustomer)=>{
                coustomer.amountDue = 0;
            });
            ifExit_Coustomer.totalDue = 0;
            await ifExit_Coustomer.save();
            // console.log("Finished")
            res.status(200).json(ifExit_Coustomer);
        }catch(err){
            console.log(err)
            res.status(200).json(err);
        }
    }
    //perticular One Fish Payment By Coustomer
    async onePaymentByCoustomer(req, res){
        try{
            const {coustomerID, transactionID} = req.params;
            const {payment} = req.body;
            console.log("In Customer Controller",coustomerID, transactionID, payment)
            const coustomer = await CoustomerModel.findOne({_id:coustomerID, adminID: req.userID});
            if(!coustomer){
                return res.status(404).json({ message: "Customer not found" });
            }
            const transaction = coustomer.transactions.find((transaction)=>{
                return transaction._id.toString() === transactionID
            })
            if(!transaction){
                return res.status(404).json({ message: "Transacton not found" });
            }
            if(payment>0 && payment<= transaction.amountDue){
                transaction.amountDue -= payment;
                coustomer.totalDue -= payment 
            }else{
                return res.status(400).json({message: "Payment must be positive and less than or equal to the amount due"});
            }
            await coustomer.save();
            res.status(200).json({ message: "Payment updated successfully", transaction });
        }catch(err){
            console.log(err);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}
