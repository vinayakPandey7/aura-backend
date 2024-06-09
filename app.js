const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Use the cors middleware
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB Atlas", err);
  });

// Routes
const authRoutes = require("./routes/user");
const productRoutes = require("./routes/products");
const reviewRoutes = require("./routes/review");
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/review", reviewRoutes);

app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});
