import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "./db.js"; // Import MySQL connection

export default class AdminController {

    // Register
    async register(req, res) {
        try {
            const { name, mobaile, password } = req.body;

            // Check if the admin with the mobile number already exists
            const [existingAdmin] = await pool.query('SELECT * FROM Admins WHERE mobaile = ?', [mobaile]);
            if (existingAdmin.length > 0) {
                return res.status(400).json("Admin already exists");
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 12);

            // Insert new admin into MySQL
            await pool.query('INSERT INTO Admins (name, mobaile, password) VALUES (?, ?, ?)', [name, mobaile, hashedPassword]);

            res.status(201).json("Admin Registered Successfully");
        } catch (err) {
            console.error(err);
            res.status(500).json(`${err}`);
        }
    }

    // Login
    async login(req, res) {
        try {
            const { mobaile, password } = req.body;

            // Fetch the admin based on mobile number
            const [admins] = await pool.query('SELECT * FROM Admins WHERE mobaile = ?', [mobaile]);
            const admin = admins[0];
            if (!admin) {
                return res.status(400).json("Mobile Number Does not exist");
            }

            // Compare the passwords
            const isPasswordCorrect = await bcrypt.compare(password, admin.password);
            if (!isPasswordCorrect) {
                return res.status(400).json("Password Not Correct");
            }

            // Generate JWT token
            const token = jwt.sign({ userID: admin.id }, "JCok8ibiRY", { expiresIn: "1d" });

            // Store the session token
            await pool.query('UPDATE Admins SET sessions = ? WHERE id = ?', [token, admin.id]);

            res.status(201).json(token);
        } catch (err) {
            console.error(err);
            res.status(500).json(`${err}`);
        }
    }
}
