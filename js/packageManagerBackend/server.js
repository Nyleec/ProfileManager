const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// File paths
const profilesFile = "./data/profiles.json";
const messagesFile = "./data/messages.json";


const SECRET_KEY = "your_secret_key"; // Replace with a secure key

// Register a new user
app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required." });
    }

    const profiles = readData(profilesFile);

    // Check if the username already exists
    if (profiles.some((profile) => profile.username === username)) {
        return res.status(400).json({ error: "Username already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user profile
    const userNumber = profiles.length > 0 ? Math.max(...profiles.map((p) => p.userNumber)) + 1 : 1;
    const newProfile = {
        userNumber,
        username,
        password: hashedPassword,
        messages: [], // Each user will have their own messages
    };

    profiles.push(newProfile);
    writeData(profilesFile, profiles);

    res.status(201).json({ message: "User registered successfully." });
});

// Login a user
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required." });
    }

    const profiles = readData(profilesFile);
    const user = profiles.find((profile) => profile.username === username);

    if (!user) {
        return res.status(400).json({ error: "Invalid username or password." });
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ error: "Invalid username or password." });
    }

    // Generate a JWT token
    const token = jwt.sign({ userNumber: user.userNumber, username: user.username }, SECRET_KEY, {
        expiresIn: "1h",
    });

    res.json({ message: "Login successful.", token });
});

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ error: "Invalid token." });
        }
        req.user = user; // Attach user info to the request
        next();
    });
};

// Get messages for the authenticated user
app.get("/messages", authenticateToken, (req, res) => {
    const profiles = readData(profilesFile);
    const user = profiles.find((profile) => profile.userNumber === req.user.userNumber);

    if (!user) {
        return res.status(404).json({ error: "User not found." });
    }

    res.json(user.messages); // Return only the messages for the logged-in user
});

// Send a message (authenticated)
app.post("/messages", authenticateToken, (req, res) => {
    const { recipient, content } = req.body;

    if (!recipient || !content) {
        return res.status(400).json({ error: "Recipient and content are required." });
    }

    const profiles = readData(profilesFile);
    const sender = profiles.find((profile) => profile.userNumber === req.user.userNumber);
    const recipientProfile = profiles.find((profile) => profile.username === recipient);

    if (!recipientProfile) {
        return res.status(404).json({ error: "Recipient not found." });
    }

    const message = {
        sender: sender.username,
        recipient: recipient,
        content: content,
        timestamp: new Date().toISOString(),
    };

    // Add the message to the recipient's messages
    recipientProfile.messages.push(message);
    writeData(profilesFile, profiles);

    res.status(201).json({ message: "Message sent successfully." });
});


// Utility functions to read/write JSON files
const readData = (filePath) => {
    if (!fs.existsSync(filePath)) return [];
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
};

const writeData = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Routes

// Create a user profile
app.post("/profiles", (req, res) => {
    const profiles = readData(profilesFile);
    const newProfile = req.body;

    // Validate input
    if (!newProfile.name || !newProfile.age || !newProfile.location || !newProfile.description) {
        return res.status(400).json({ error: "All fields are required." });
    }

    profiles.push(newProfile);
    writeData(profilesFile, profiles);
    res.status(201).json({ message: "Profile created successfully." });
});

// Get all user profiles
app.get("/profiles", (req, res) => {
    const profiles = readData(profilesFile);
    res.json(profiles);
});

// Send a message
app.post("/messages", (req, res) => {
    const messages = readData(messagesFile);
    const newMessage = req.body;

    // Validate input
    if (!newMessage.sender || !newMessage.recipient || !newMessage.content) {
        return res.status(400).json({ error: "All fields are required." });
    }

    newMessage.timestamp = new Date().toISOString();
    messages.push(newMessage);
    writeData(messagesFile, messages);
    res.status(201).json({ message: "Message sent successfully." });
});

// Get messages for a specific user
app.get("/messages/:user", (req, res) => {
    const user = req.params.user;
    const messages = readData(messagesFile);
    const userMessages = messages.filter((msg) => msg.recipient === user);
    res.json(userMessages);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});