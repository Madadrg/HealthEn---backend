const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const path = require("path");
const connectDB = require("./db");
const contactsRouter = require("./routes/api/contacts");
const usersRouter = require("./routes/api/users");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

// Connect to the database
connectDB();

// Serve static files from the "public" directory
app.use("/avatars", express.static(path.join(__dirname, "public/avatars")));

// API routes
app.use("/api/contacts", contactsRouter);
app.use("/api/users", usersRouter);

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;
