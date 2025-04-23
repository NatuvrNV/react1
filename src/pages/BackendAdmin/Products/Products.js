import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/Product.css";
import { MdDelete, MdEdit, MdSave, MdClose, MdAdd } from "react-icons/md";
import { SingleProductDetail, ProductImages } from "../../../utils/constants";

const Product = () => {
  const navigate = useNavigate();
  const [Product, setProduct] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({});
  const [newProduct, setNewProduct] = useState({ name: "", description: "", coverImage: "" });
  const [showAddForm, setShowAddForm] = useState(false); // Controls form visibility

  useEffect(() => {
    const ProductWithImages = SingleProductDetail.map((Product) => {
      const coverImage =
        ProductImages.find((img) =>
          new RegExp(`\\b${Product.name}\\b`, "i").test(img.imgPath)
        )?.imgPath || "";

      const type = coverImage.split("/")[3]; // Extract 'commercial' or 'residential' from the path
      return { ...Product, coverImage, type };
    });
    setProduct(ProductWithImages);
  }, []);

  const handleEdit = (Product) => {
    navigate(`/products/edit/${Product._id}`);
  };

  const handleChange = (e, field) => {
    setEditedProduct({ ...editedProduct, [field]: e.target.value });
  };

  const handleSave = (id) => {
    const updatedProduct = Product.map((Product) =>
      Product._id === id ? { ...Product, ...editedProduct } : Product
    );
    setProduct(updatedProduct);
    setEditingProductId(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const filteredProduct = Product.filter((Product) => Product._id !== id);
      setProduct(filteredProduct);
    }
  };

  const handleAddProduct = () => {
    if (!newProduct.name.trim() || !newProduct.description.trim()) {
      alert("Please enter product name and description.");
      return;
    }

    const newProductEntry = {
      _id: Date.now().toString(), // Unique ID
      ...newProduct,
      coverImage: newProduct.coverImage || "", // Default empty if no image
    };

    setProduct([...Product, newProductEntry]);
    setNewProduct({ name: "", description: "", coverImage: "" }); // Reset form
    setShowAddForm(false); // Hide form after adding
  };

  return (
    <div className="admin-container">
      <aside className="sidebar-admin">
        <h2>Admin Dashboard</h2>
        <nav>
          <ul>
            <li><a href="/admin">Leads</a></li>
            <li><a href="/projects">Projects</a></li>
            <li><a href="/products">Products</a></li>
            <li>
              <button className="logout-button" onClick={() => window.location.href = "/login"}>Logout</button>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="main-content">
        <header className="top-navbar">
          <h1>Product Management</h1>
        </header>

        {/* Button to show/hide add form */}
        <button className="add-product-button" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? <MdClose size={20} /> : <MdAdd size={20} />} {showAddForm ? "Cancel" : "Add New Product"}
        </button>

        {/* Add Product Form (Appears only when showAddForm is true) */}
        {showAddForm && (
          <div className="add-product-form">
            <h3>Add New Product</h3>
            <input
              type="text"
              placeholder="Product Name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Description"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            />
            <input
              type="text"
              placeholder="Cover Image URL (optional)"
              value={newProduct.coverImage}
              onChange={(e) => setNewProduct({ ...newProduct, coverImage: e.target.value })}
            />
            <button onClick={handleAddProduct}><MdAdd size={20} /> Add Product</button>
            <button className="cancel-button" onClick={() => setShowAddForm(false)}>Cancel</button>
          </div>
        )}

        {/* Product Table */}
        <div className="table-container">
          <table className="product-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Cover Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(Product) && Product.length > 0 ? (
                Product.map((Product) => (
                  <tr key={Product._id}>
                    {editingProductId === Product._id ? (
                      <>
                        <td>
                          <input
                            className="updateProduct"
                            value={editedProduct.name}
                            onChange={(e) => handleChange(e, "name")}
                          />
                        </td>
                        <td>
                          <input
                            className="updateProduct product-desc"
                            value={editedProduct.description}
                            onChange={(e) => handleChange(e, "description")}
                          />
                        </td>
                        <td>{Product.coverImage && <img src={Product.coverImage} alt="Cover" className="cover-image" />}</td>
                        <td>
                          <button onClick={() => handleSave(Product._id)}><MdSave size={20} /></button>
                          <button onClick={() => setEditingProductId(null)}><MdClose size={20} /></button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{Product.name}</td>
                        <td className="product-desc">{Product.description}</td>
                        <td className="image-table">{Product.coverImage && <img src={Product.coverImage} alt="Cover" className="cover-image" />}</td>
                        <td>
                          <button onClick={() => handleEdit(Product)}><MdEdit size={20} /></button>
                          <button onClick={() => handleDelete(Product._id)}><MdDelete size={20} /></button>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No products found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Product;
