const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = 3001;

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/userDB")
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

// Define user schema and model
const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true }
});
const User = mongoose.model("User", userSchema);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // Serve static files from public
app.use(express.json());

// Serve login page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "login.html"));
});

// Handle login
app.post("/", async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);

    if (!email || !password) {
        return res.send('<script>alert("Please fill in all fields."); window.location.href="/";</script>');
    }

    try {
        let user = await User.findOne({ email });

        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                // Successful login, redirect to home
                return res.redirect("/home");
            } else {
                // Incorrect password
                return res.send('<script>alert("Invalid password. Try again."); window.location.href="/";</script>');
            }
        } else {
            // Register new user
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({ email, password: hashedPassword });
            await newUser.save();
            return res.redirect("/home"); // Redirect to home after registration
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

// Serve home page after login
app.get("/home", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"));
});

// Serve template page
app.get("/templates", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "template.html"));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
