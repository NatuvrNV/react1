import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import "./Blog.css";
import { useNavigate } from 'react-router-dom';
import { Container, Row } from "react-bootstrap";
import { SingleBlogDetail } from './BlogConstants';
import { MdArrowOutward } from "react-icons/md";
import Footer from "../../components/Footer";

const Blog = () => {
  const navigate = useNavigate();
  
  // State to track selected category, dropdown state, and search input
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  // Function to handle blog click navigation with title-based URL
  const handleBlogClick = (blogTitle) => {
    const urlFriendlyTitle = blogTitle.toLowerCase().replace(/\s+/g, '-');
    navigate(`/blog/${urlFriendlyTitle}`);
  };

  // Function to handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsDropdownOpen(false);
  };

  // Function to handle search input
  const handleSearchChange = (e) => {
    setSearchInput(e.target.value.toLowerCase());
  };

  // Function to parse MM-DD-YY format into a standard Date object
  const parseDate = (dateString) => {
    // Handle MM-DD-YY format (e.g., "01-04-25")
    if (/^\d{2}-\d{2}-\d{2}$/.test(dateString)) {
      const [month, day, year] = dateString.split('-');
      return new Date(`20${year}-${month}-${day}`);
    }
    
    // Handle other formats or return current date as fallback
    return new Date();
  };

  // Filter blogs based on selected category and search query
  const filteredBlogs = SingleBlogDetail.filter(blog => {
    const matchesCategory = selectedCategory === "All" || blog.category === selectedCategory;
    const matchesSearch = blog.title.toLowerCase().includes(searchInput) || 
                          blog.description.toLowerCase().includes(searchInput) || 
                          blog.category.toLowerCase().includes(searchInput);
    return matchesCategory && matchesSearch;
  });

  // Sort blogs by date in descending order (newest first)
  const sortedBlogs = [...filteredBlogs].sort((a, b) => {
    const dateA = parseDate(a.date);
    const dateB = parseDate(b.date);
    return dateB - dateA; // For descending order (newest first)
  });

  return (
    <div className="singleblog-container">
      <Helmet>
        <title>Metaguise Blog | Architectural Insights & Facade Innovations</title>
        <meta 
          name="description" 
          content="Explore our latest articles on facade innovations, architectural trends, and project highlights. Discover expert insights, material spotlights, and behind-the-scenes design stories in our comprehensive blog collection." 
        />
      </Helmet>

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
              placeholder="Search blogs..."
              className="search-bar"
              value={searchInput}
              onChange={handleSearchChange}
            />

            {/* Category Dropdown */}
            <div
              className="category-container"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <button id="category-button" className="blog-button">
                <span>{selectedCategory === "All" ? "Categories" : selectedCategory}</span>
                <MdArrowOutward />
              </button>
              {isDropdownOpen && (
                <div className="category-dropdown">
                  <ul>
                    <li onClick={() => handleCategorySelect("All")}>All</li>
                    {[
                      "Facade Innovations", "Project Highlights", "Architectural Insights",
                      "Material Spotlight", "Sustainability", "Behind the Design",
                      "Industry Trends", "Company News & Updates"
                    ].map((category, index) => (
                      <li key={index} onClick={() => handleCategorySelect(category)}>
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
          {sortedBlogs.length === 0 ? (
            <div className="no-blogs-message text-center">
              <p>No Blogs Found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-8 blog-grid mt-xl-5 px-xl-5 mt-4">
              {sortedBlogs.map((blog) => (
                <div
                  key={blog.title}
                  className="flex cursor-pointer blog-card"
                  onClick={() => handleBlogClick(blog.title)}
                >
                  <img src={`/assets/Blogs/${blog.folderName}/${blog.images[0]?.split('/').pop()}`} 
                       alt={blog.title}  
                       className="object-cover rounded-lg" />
                  <div className="mx-xl-4 blog-text">
                    <h2 className="text-xl blog-title">{blog.title}</h2>
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
