// models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  productDiscount: {
    type: Number,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  markedPrice: {
    type: Number,
    required: true,
  },
  currentPrice: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  inStock: {
    type: Boolean,
    default: true,
  },

  productDescription: {
    type: String,
    default: "",
  },
  productImgs: {
    type: [{ imgUrl: String }],
    default: [],
  },
  productSpecs: {
    type: [{ desc: String }],
    default: [],
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
