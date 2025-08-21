import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import "./Blog.css";
import { useNavigate } from 'react-router-dom';
import { Container, Row } from "react-bootstrap";
import { SingleBlogDetail } from './BlogConstants';
import { MdArrowOutward } from "react-icons/md";
import Footer from "../../components/Footer";

const Blog = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  
  // State to track selected category, dropdown state, and search input
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Function to handle blog click navigation with title-based URL
  const handleBlogClick = (blogTitle) => {
    // Convert title to URL-friendly format (replace spaces with hyphens)
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

  // Filter blogs based on selected category and search query
  const filteredBlogs = SingleBlogDetail.filter(blog => {
    const matchesCategory = selectedCategory === "All" || blog.category === selectedCategory;
    const matchesSearch = blog.title.toLowerCase().includes(searchInput) || 
                          blog.description.toLowerCase().includes(searchInput) || 
                          blog.category.toLowerCase().includes(searchInput);
    return matchesCategory && matchesSearch;
  }).sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date (latest first)

  // Handle keyboard navigation for dropdown
  const handleKeyDown = (e, category) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCategorySelect(category);
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false);
    }
  };

  return (
    <div className="singleblog-container">
      {/* Add Meta Tags */}
      <Helmet>
        <title>Metaguise Blog | Architectural Insights & Facade Innovations</title>
        <meta 
          name="description" 
          content="Explore our latest articles on facade innovations, architectural trends, and project highlights. Discover expert insights, material spotlights, and behind-the-scenes design stories in our comprehensive blog collection." 
        />
        <link rel="canonical" href="https://metaguise.com/blogs" />
      </Helmet>

      <Container fluid>
        <Row>
          <div className="blog-header">
            <h1 className="blog-main-title">Blog</h1>
          </div>
        </Row>

        <Row>
          <div className="blog-controls">
            <input
              type="text"
              placeholder="Search blogs..."
              className="search-bar"
              value={searchInput}
              onChange={handleSearchChange}
              aria-label="Search blog posts"
            />

            {/* Category Dropdown */}
            <div
              className="category-container"
              ref={dropdownRef}
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button 
                id="category-button" 
                className="blog-button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                aria-haspopup="true"
                aria-expanded={isDropdownOpen}
              >
                <span>{selectedCategory === "All" ? "Categories" : selectedCategory}</span>
                <MdArrowOutward className={isDropdownOpen ? "dropdown-icon rotated" : "dropdown-icon"} />
              </button>
              {isDropdownOpen && (
                <div className="category-dropdown" role="menu">
                  <ul>
                    <li 
                      role="menuitem"
                      tabIndex={0}
                      onClick={() => handleCategorySelect("All")}
                      onKeyDown={(e) => handleKeyDown(e, "All")}
                      className={selectedCategory === "All" ? "active" : ""}
                    >
                      All
                    </li>
                    {[
                      "Facade Innovations", "Project Highlights", "Architectural Insights",
                      "Material Spotlight", "Sustainability", "Behind the Design",
                      "Industry Trends", "Company News & Updates"
                    ].map((category, index) => (
                      <li 
                        key={index}
                        role="menuitem"
                        tabIndex={0}
                        onClick={() => handleCategorySelect(category)}
                        onKeyDown={(e) => handleKeyDown(e, category)}
                        className={selectedCategory === category ? "active" : ""}
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

        <Row className='blog-content-row'>
          {filteredBlogs.length === 0 ? (
            <div className="no-blogs-message">
              <p>No blogs found matching your criteria</p>
            </div>
          ) : (
            <div className="blog-grid">
              {filteredBlogs.map((blog) => (
                <div
                  key={blog.id || blog.title}
                  className="blog-card"
                  onClick={() => handleBlogClick(blog.title)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleBlogClick(blog.title);
                    }
                  }}
                  role="button"
                  aria-label={`Read more about ${blog.title}`}
                >
                  <div className="blog-image-container">
                    <img 
                      src={blog.images[0]?.startsWith('http') 
                        ? blog.images[0] 
                        : `/assets/Blogs/${blog.folderName}/${blog.images[0]}`} 
                      alt={blog.title}  
                      className="blog-image"
                      loading="lazy"
                    />
                  </div>
                  <div className="blog-content">
                    <h2 className="blog-item-title">{blog.title}</h2>
                    <p className="blog-description">{blog.description}</p>
                    <div className="blog-meta">
                      <span className="blog-date">{blog.date}</span>
                      <span className="blog-category">{blog.category}</span>
                    </div>
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
