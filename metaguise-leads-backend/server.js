const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const projectRoutes = require('./routes/projectRoutes');
const productRoutes = require('./routes/productRoutes');
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000", // Change to your frontend URL
  })
);
app.use(cookieParser());

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected successfully!"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Exit if DB connection fails
  });

// ✅ User Schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model("User", UserSchema);

// ✅ Leads Schema
const LeadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  message: { type: String, required: true },
  source: { type: String, default: "contact_form" },
}, { timestamps: true });
const Lead = mongoose.model("Lead", LeadSchema);

// ✅ Register Admin API (One-time setup)
app.post("/api/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "❌ Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, password: hashedPassword });
    res.status(201).json({ message: "✅ Admin registered!" });
  } catch (error) {
    console.error("❌ Error in /api/register:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Login API
// ✅ Improved Login API
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: "❌ User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "❌ Incorrect password" });

    // ✅ Generate Fresh Token
    const token = jwt.sign(
      { id: user._id, username: user.username }, // Include username in the payload if needed
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // ✅ Send Token Securely (For Production, add 'secure: true')
    res
      .cookie("token", token, { httpOnly: true, sameSite: "strict" })
      .json({ message: "✅ Login successful", token, userId: user._id });

  } catch (error) {
    console.error("❌ Error in /api/login:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Logout API
app.post("/api/logout", (req, res) => {
  res.clearCookie("token").json({ message: "✅ Logged out" });
});

// ✅ Authentication Middleware
// ✅ Improved Auth Middleware
const authMiddleware = (req, res, next) => {
  let token = req.cookies.token || req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "❌ No token provided" });
  }

  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }

  // ✅ Verify Token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("❌ Invalid Token:", err.message);
      return res.status(403).json({ message: "❌ Invalid token" });
    }
    req.userId = decoded.id;
    next();
  });
};

// ✅ Get Leads (Protected Route)
app.get("/api/leads", authMiddleware, async (req, res) => {
  try {
    const leads = await Lead.find();
    res.json(leads);
  } catch (error) {
    console.error("❌ Error fetching leads:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Submit Lead (Public API)
app.post("/api/submit-lead", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ message: "❌ All fields are required." });
    }

    const newLead = new Lead({ name, email, phone, message });
    await newLead.save();
    res.status(201).json({ message: "✅ Lead submitted successfully!" });
  } catch (error) {
    console.error("❌ Error saving lead:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Update Lead (Protected Route)
app.put("/api/leads/:id", authMiddleware, async (req, res) => {
  try {
    const updatedLead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedLead);
  } catch (error) {
    console.error("❌ Error updating lead:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Delete Lead (Protected Route)
app.delete("/api/leads/:id", authMiddleware, async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ message: "✅ Lead deleted successfully!" });
  } catch (error) {
    console.error("❌ Error deleting lead:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/products', productRoutes);



// ✅ 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "❌ Route not found" });
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Unhandled Error:", err.message);
  res.status(500).json({ message: "Internal server error" });
});

// ✅ Server Listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
