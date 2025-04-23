const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  Productname: { type: String, required: true },
  coverImage: { type: String },  // Add if needed for cover images
});

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
