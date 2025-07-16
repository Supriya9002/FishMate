import CustomerModel from "./customer.model.js";
import FishModel from "../fish/fish.model.js";
import { Op } from "sequelize"; // For handling SQL operators

export default class CustomerController {
  
    // Customer Buy Fish
    async customer_Fish_Buy(req, res) {
        try {
            const { quantity, payment, name, mobile } = req.body;
            console.log("req.body", req.body);
            if (payment < 0) {
                return res.status(401).json("Payment must be positive");
            }
            const { fishID } = req.params;
            const fish = await FishModel.findByPk(fishID); // Use Sequelize's findByPk for primary key lookup
            if (!fish) {
                return res.status(200).send("Fish not found");
            }

            // Check available quantity
            if (fish.availableQuantity < quantity) {
                return res.status(200).send(`Available Fish Quantity: ${fish.availableQuantity}kg`);
            }
            fish.availableQuantity -= quantity;
            await fish.save();

            // Mobile number exists or not
            let customer = await CustomerModel.findOne({ where: { mobile } });
            const amountDue = (fish.price * quantity) - payment;

            if (!customer) {
                // Create new customer if they don't exist
                customer = await CustomerModel.create({
                    name,
                    mobile,
                    adminID: req.userID,
                    totalDue: amountDue,
                });
            } else {
                // Update existing customer
                customer.totalDue += amountDue;
                await customer.save();
            }

            // Create transaction
            await customer.createTransaction({
                fishID,
                quantity,
                price: fish.price,
                amountDue,
            });

            res.status(201).json({ message: customer ? "Customer transaction updated" : "New customer created and transaction added" });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    }

    // Customer fish pay for specific transaction using Transaction ID
    async customer_Pay_for_SpecificFish(req, res) {
        try {
            const { customerID, transactionID } = req.params;
            const { amountPay } = req.body;

            const customer = await CustomerModel.findByPk(customerID, {
                include: ['transactions']  // Assuming associations are set
            });

            if (!customer) {
                return res.status(404).send("Customer does not exist");
            }

            const transaction = customer.transactions.find((t) => t.id === parseInt(transactionID));
            if (!transaction) {
                return res.status(404).json({ message: "Transaction not found" });
            }

            if (amountPay > 0 && amountPay <= transaction.amountDue) {
                transaction.amountDue -= amountPay;
                customer.totalDue -= amountPay;
                await transaction.save();
                await customer.save();
            } else {
                return res.status(400).json({ message: "Pay amount must be positive and between the amount due" });
            }

            res.status(201).json({ message: "Transaction updated successfully" });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    }

    // Customer Details
    async customer_Details(req, res) {
        try {
            const customer = await CustomerModel.findOne({
                where: { mobile: req.body.mobile, adminID: req.userID },
            });

            if (!customer) {
                return res.status(200).json(null);
            }

            res.status(200).json(customer);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    }

    // Get all customers
    async getAllCustomer(req, res) {
        try {
            const allCustomers = await CustomerModel.findAll({ where: { adminID: req.userID } });
            res.status(200).json(allCustomers);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    }

    // Get customer details by ID
    async getCustomerDetailsByID(req, res) {
        try {
            const { customerID } = req.params;
            const customer = await CustomerModel.findByPk(customerID);

            if (!customer) {
                return res.status(404).json({ message: "Customer not found" });
            }

            res.status(200).json(customer);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    }

    // Full payment by customer
    async fullPaymentByCustomer(req, res) {
        try {
            const { customerID } = req.params;
            const { Payment } = req.body;

            const customer = await CustomerModel.findByPk(customerID);
            if (!customer) {
                return res.status(404).json({ message: "Customer not found" });
            }

            if (Number(customer.totalDue) !== Number(Payment)) {
                return res.status(400).json({ message: "Actual amountDue and customer payment do not match" });
            }

            customer.totalDue = 0;
            await customer.save();
            res.status(200).json(customer);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    }

    // Particular fish payment by customer
    async onePaymentByCustomer(req, res) {
        try {
            const { customerID, transactionID } = req.params;
            const { payment } = req.body;

            const customer = await CustomerModel.findByPk(customerID, {
                include: ['transactions'],  // Assuming the relationship is defined
            });

            if (!customer) {
                return res.status(404).json({ message: "Customer not found" });
            }

            const transaction = customer.transactions.find((t) => t.id === parseInt(transactionID));
            if (!transaction) {
                return res.status(404).json({ message: "Transaction not found" });
            }

            if (payment > 0 && payment <= transaction.amountDue) {
                transaction.amountDue -= payment;
                customer.totalDue -= payment;
                await transaction.save();
                await customer.save();
                res.status(200).json({ message: "Payment updated successfully", transaction });
            } else {
                return res.status(400).json({ message: "Payment must be positive and less than or equal to the amount due" });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    }
}
