const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

mongoose.connect("mongodb://127.0.0.1:27017/userDB", {
});

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true }
});
const User = mongoose.model("User", userSchema);

async function addUser() {
    const email = "test@example.com";  // CHANGE this email if needed
    const password = "password123";   // CHANGE this password if needed

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ email, password: hashedPassword });

    try {
        await newUser.save();
        console.log("✅ User added successfully");
    } catch (err) {
        console.error("❌ Error adding user:", err);
    } finally {
        mongoose.connection.close();
    }
}

addUser();
