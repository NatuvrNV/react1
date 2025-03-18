import React from 'react';
import "./Blog.css";
import { useNavigate } from 'react-router-dom';
import { Container, Row } from "react-bootstrap";
import { SingleBlogDetail } from './BlogConstants';
import { MdArrowOutward } from "react-icons/md";
import { useState } from "react";
import Footer from "../../components/Footer";

const Blog = () => {
  const navigate = useNavigate();

  const handleBlogClick = (id) => {
    navigate(`/blog/${id}`);

    
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
    <span>Categories</span>
    <MdArrowOutward />
  </button>
  {isDropdownOpen && (
    <div className="category-dropdown">
      <ul>
        <li>Facade Innovations</li>
        <li>Project Highlights</li>
        <li>Architectural Insights</li>
        <li>Material Spotlight</li>
        <li>Sustainability</li>
        <li>Behind the Design</li>
        <li>Industry Trends</li>
        <li>Company News & Updates</li>
      </ul>
    </div>
  )}
</div>

          </div>
        </Row>

        <Row>
          <div className="grid grid-cols-2 gap-8 blog-grid mt-xl-5 px-xl-5 mt-4">
            {SingleBlogDetail.map((blog, index) => (
              <div
                key={index}
                className="flex cursor-pointer blog-card"
                onClick={() => handleBlogClick(index)}
              >
                <img src={blog.images[0]} alt={blog.title} className="object-cover rounded-lg" />
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
        </Row>
      </Container>
       <Footer />
    </div>
  );
};

export default Blog;
