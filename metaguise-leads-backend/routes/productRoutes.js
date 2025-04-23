const express = require("express");
const router = express.Router();
const { getAllProducts, updateProduct } = require("../controllers/productController");

// Routes
router.get("/Products", getAllProducts);
router.put("/Products/:id", updateProduct);

module.exports = router;
