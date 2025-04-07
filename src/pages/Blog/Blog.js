import React, { useState } from 'react';
import "./Blog.css";
import { useNavigate } from 'react-router-dom';
import { Container, Row } from "react-bootstrap";
import { SingleBlogDetail } from './BlogConstants';
import { MdArrowOutward } from "react-icons/md";
import Footer from "../../components/Footer";

const Blog = () => {
  const navigate = useNavigate();
  
  // State to track selected category and dropdown state
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Function to handle blog click navigation
  const handleBlogClick = (id) => {
    navigate(`/blog/${id}`);
  };

  // Function to handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsDropdownOpen(false);  // Close dropdown after selecting category
  };

  // Filter blogs based on selected category
  const filteredBlogs = selectedCategory && selectedCategory !== "All"
    ? SingleBlogDetail.filter(blog => blog.category === selectedCategory)
    : SingleBlogDetail;

  return (
    <div className="singleblog-container">
      <Container fluid>
        <Row>
          <div className="desktop-title mb-3 blog-title">
            <h1 className="text-5xl text-center mb-10">Blog</h1>
          </div>

          <div className="mobile-title mb-3 blog-title">
            <h1 className="text-5xl text-center mb-10">Blog</h1>
          </div>
        </Row>

        <Row>
          <div className="gap-4 mb-10 text-center search">
            <input
              type="text"
              placeholder="Search"
              className="search-bar"
            />

            {/* Category Button with Hover and Click Dropdown */}
            <div
              className="category-container"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Handle clicks for mobile
            >
              <button id="category-button" className="blog-button">
                <span>{selectedCategory === "All" ? "Categories" : selectedCategory}</span>
                <MdArrowOutward />
              </button>
              {isDropdownOpen && (
                <div className="category-dropdown">
                  <ul>
                    {/* Add "All" option to show all blogs */}
                    <li onClick={() => handleCategorySelect("All")}>All</li>
                    {/* List of categories that filter blogs */}
                    {["Facade Innovations", "Project Highlights", "Architectural Insights", "Material Spotlight", "Sustainability", "Behind the Design", "Industry Trends", "Company News & Updates"].map((category, index) => (
                      <li
                        key={index}
                        onClick={() => handleCategorySelect(category)}
                      >
                        {category}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </Row>

        <Row className='Blog-row'>
          {/* Check if filteredBlogs is empty and show the "No Blogs Found" message */}
          {filteredBlogs.length === 0 ? (
            <div className="no-blogs-message text-center">
              <p>No Blogs Found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-8 blog-grid mt-xl-5 px-xl-5 mt-4">
              {filteredBlogs.map((blog, index) => (
                <div
                  key={index}
                  className="flex cursor-pointer blog-card"
                  onClick={() => handleBlogClick(index)}
                >
                  <img src={`/assets/Blogs/${blog.folderName}/${blog.images[0]?.split('/').pop()}`} alt={blog.title}  className="object-cover rounded-lg" />
                  <div className="mx-xl-4 blog-text">
                    <h2 className="text-xl  blog-title">{blog.title}</h2>
                    <p className="text-sm mt-xl-2 blog-description">{blog.description}</p>
                    <p className="text-xs text-gray-400 text-start date-text">
                      {blog.date} | {blog.category}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Row>
      </Container>
      <Footer />
    </div>
  );
};

export default Blog;
