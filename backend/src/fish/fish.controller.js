import FishModel from "./fish.schema.js";

export default class FishController{
    //add fish
    async addFish(req, res){
        try{
            console.log("cccc",req.body);
            const newFish = new FishModel({...req.body, adminID: req.userID})
            await newFish.save();
            res.status(201).send("New Fish Item Added");
        }catch(err){
            console.log(err);
            res.status(500).json(err);
        }
    }
    //one fish details check
    async fishDetails(req, res){
        try{
            const fishID = req.params.fishID;
            const fishDetails = await FishModel.findOne({_id: fishID, adminID: req.userID});
            if(!fishDetails){
                return res.status(401).send("Fish not found")
            }
            console.log(fishDetails);
            res.status(200).json(fishDetails);
        }catch(err){
            console.log(err)
            res.status(200).json(err)
        }
    }
    //display All fish
    async displayAllFish(req, res) {
        try {
            const currentDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
        
            // Fetch fish entries matching the current date and adminID
            const fishes = await FishModel.find({
                adminID: req.userID,
                date: {
                    $gte: new Date(currentDate), // Start of the day
                    $lt: new Date(new Date(currentDate).getTime() + 24 * 60 * 60 * 1000) // Start of the next day
                }
            });
            // console.log("Filtered Fish List:", fishes);
            res.status(200).json(fishes); // Send the filtered list to the frontend
            } catch (err) {
                console.log(err);
                res.status(500).json(err);
            }
        }

    //delete fish one-by-one
    async deleteFish(req, res){
        try{
            console.log("S",req.params.id)
            const t = await FishModel.deleteOne({_id: req.params.id, adminID: req.userID});
            console.log("t",t);
            res.status(200).send(`Fish with ID ${req.params.id} successfully deleted`);
        }catch(err){
            console.log(err);
            res.status(500).json(err);
        }
    }
    //Update fish one-by-one
    async updateFish(req, res){
        try{
            console.log("S",req.params.id);
            const editData = await FishModel.findById({_id: req.params.id, adminID: req.userID});
            if(!editData){
                return res.status(400).send(`Fish with ID ${req.params.id} not found or unauthorized`)
            }
            console.log("t", editData);
            console.log("super",req.body.name);
            //hare add what part i update...
            if(req.body.name){
                console.log(req.body.name);
                let name = req.body.name;
                for(var i=0; i<name.length; i++){
                    console.log(Number(name[i]), typeof name[i])
                    if(!isNaN(Number(name[i]))){
                        return res.status(201).json({message: "Name must be String"})
                    }
                }
            }
            editData.name = req.body.name || editData.name;
            editData.price = req.body.price || editData.price;
            editData.availableQuantity = req.body.availableQuantity || editData.availableQuantity;
            await editData.save();
            res.status(200).send(`Fish with ID ${req.params.id} successfully updated`);
        }catch(err){
            console.log(err);
        }
    }
}