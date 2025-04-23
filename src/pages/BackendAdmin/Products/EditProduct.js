import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SingleProductDetail, ProductImages } from "../../../utils/constants";
import "./css/EditProduct.css";

const EditProduct = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    description: "",
    coverImage: "",
    metaTitle: "",
    metaDescription: "",
    images: [],
    youtubeLink: "",
    instaLink: "",
  });

  useEffect(() => {
    const foundProduct = SingleProductDetail.find(
      (prod) => prod.name.toLowerCase() === decodeURIComponent(name).toLowerCase()
    );

    if (foundProduct) {
      const coverImage =
        ProductImages.find((img) =>
          new RegExp(`\\b${foundProduct.name}\\b`, "i").test(img.imgPath)
        )?.imgPath || "";

      setProduct({ ...foundProduct, coverImage });
    }
  }, [name]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageOrder = (index, direction) => {
    const newImages = [...product.images];
    const swapIndex = index + (direction === "up" ? -1 : 1);
    if (swapIndex >= 0 && swapIndex < newImages.length) {
      [newImages[index], newImages[swapIndex]] = [
        newImages[swapIndex],
        newImages[index],
      ];
      setProduct({ ...product, images: newImages });
    }
  };

  const handleSave = () => {
    alert("Product updated successfully!");
    navigate("/admin/products");
  };

  return (
    <div className="edit-product-container container mt-xl-5">
      <h1>Edit Product</h1>

      <div className="row">
           {/* Name */}
      <div className="form-group edit-group col-4">
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={product.name}
          onChange={handleChange}
        />
      </div>

      {/* Description */}
      <div className="form-group edit-group  col-4">
        <label>Description:</label>
        <textarea
          name="description"
          value={product.description}
          onChange={handleChange}
        />
      </div>

      {/* Cover Image */}
      <div className="form-group edit-group col-4">
        <label>Cover Image:</label>
        <input
          type="text"
          name="coverImage"
          value={product.coverImage}
          onChange={handleChange}
        />
        {product.coverImage && (
          <img src={product.coverImage} alt="Cover" width="100" />
        )}
      </div>
      </div>
     

<div className="row">
      {/* Meta Title */}
      <div className="form-group edit-group col-4">
        <label>Meta Title:</label>
        <input
          type="text"
          name="metaTitle"
          value={product.metaTitle}
          onChange={handleChange}
        />
      </div>

      {/* Meta Description */}
      <div className="form-group edit-group col-4">
        <label>Meta Description:</label>
        <textarea
          name="metaDescription"
          value={product.metaDescription}
          onChange={handleChange}
        />
      </div>

      {/* YouTube Link */}
      <div className="form-group edit-group col-4">
        <label>YouTube Link:</label>
        <input
          type="text"
          name="youtubeLink"
          value={product.youtubeLink}
          onChange={handleChange}
        />
      </div>
</div>


<div className="row">
        {/* Instagram Link */}
        <div className="form-group edit-group col-4">
        <label>Instagram Link:</label>
        <input
          type="text"
          name="instaLink"
          value={product.instaLink}
          onChange={handleChange}
        />
      </div>

      {/* Images */}
      <div className="form-group edit-group col-4">
        <label>Images:</label>
        {product.images.map((image, index) => (
          <div key={index} className="image-item">
            <img src={image} alt={`product-${index}`} width="100" />
            <button onClick={() => handleImageOrder(index, "up")}>⬆️</button>
            <button onClick={() => handleImageOrder(index, "down")}>⬇️</button>
          </div>
        ))}
      </div>
</div>

      {/* Save Button */}
      <button className="save-button" onClick={handleSave}>
        Save
      </button>
    </div>
  );
};

export default EditProduct;
