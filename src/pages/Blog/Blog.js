import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import "./Blog.css";
import { useNavigate } from 'react-router-dom';
import { Container, Row } from "react-bootstrap";
import { MdArrowOutward } from "react-icons/md";
import Footer from "../../components/Footer";
import OptimizedImage from "../../components/OptimizedImage";

const Blog = () => {
  const navigate = useNavigate();

  // Blog list now comes from a fetch, not a static import
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    fetch('/data/blogs-index.json')
      .then((res) => res.json())
      .then((data) => {
        setBlogs(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load blog index:', err);
        setIsLoading(false);
      });
  }, []);

  const getUrlFriendlyString = (str) => {
    return str.toLowerCase().replace(/\s+/g, '-');
  };

  const handleBlogClick = (blog) => {
    const urlFriendlyPath = blog.url ? getUrlFriendlyString(blog.url) : getUrlFriendlyString(blog.title);
    navigate(`/blog/${urlFriendlyPath}/`);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsDropdownOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value.toLowerCase());
  };

  const getImagePath = (blog) => {
    if (!blog.images || blog.images.length === 0) {
      return '';
    }
    const firstImage = blog.images[0];
    if (typeof firstImage === 'object' && firstImage !== null) {
      return firstImage.path;
    }
    return firstImage;
  };

  const getImageAlt = (blog) => {
    if (!blog.images || blog.images.length === 0) {
      return blog.title;
    }
    const firstImage = blog.images[0];
    if (typeof firstImage === 'object' && firstImage !== null && firstImage.alt) {
      return firstImage.alt;
    }
    return blog.imageAltText || blog.title;
  };

  const filteredBlogs = blogs.filter(blog => {
    const matchesCategory = selectedCategory === "All" || blog.category === selectedCategory;
    const matchesSearch = blog.title.toLowerCase().includes(searchInput) ||
                          (blog.description || '').toLowerCase().includes(searchInput) ||
                          blog.category.toLowerCase().includes(searchInput);
    return matchesCategory && matchesSearch;
  });

  // BreadcrumbList schema — task #2. This is the blog INDEX page, so it's
  // only two levels deep (Home > Blog). The three-level version
  // (Home > Blog > <article title>) belongs on the individual post page,
  // not here. Last item omits "item" (no URL), per Google's guidance for
  // the current page in a breadcrumb trail.
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://metaguise.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blogs"
      }
    ]
  };

  return (
    <div className="singleblog-container">
      <Helmet>
        <title>Metaguise Blog | Facade Design, Kinetic Facades & Parametric Architecture</title>
        <meta
          name="description"
          content="Explore Metaguise's articles on metal facade design, kinetic facades, parametric architecture and material innovation for architects and homeowners across India."
        />
        <meta property="og:title" content="Metaguise Blog | Facade Design, Kinetic Facades & Parametric Architecture" />
        <meta property="og:description" content="Explore Metaguise's articles on metal facade design, kinetic facades, parametric architecture and material innovation for architects and homeowners across India." />
        <link rel="canonical" href="https://metaguise.com/blogs/" />
        <meta name="keywords" content="facade design blog, kinetic facade, parametric architecture" />

        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>

      <Container fluid>
        <Row>
          {/* Single H1 for both breakpoints — was previously duplicated via
              .desktop-title / .mobile-title CSS-toggle wrappers, which left
              two identical H1s in the DOM (only one hidden visually). */}
          <div className="blog-title mb-3">
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
          {isLoading ? (
            <div className="text-center py-5">
              <p>Loading blogs...</p>
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="no-blogs-message text-center">
              <p>No Blogs Found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-8 blog-grid mt-xl-5 px-xl-5 mt-4">
              {filteredBlogs.slice().reverse().map((blog) => {
                const imagePath = getImagePath(blog);
                const imageAlt = getImageAlt(blog);

                return (
                  <div
                    key={blog.title}
                    className="flex cursor-pointer blog-card"
                    onClick={() => handleBlogClick(blog)}
                  >
                    <OptimizedImage
                      src={`/assets/Blogs/${blog.folderName}/${imagePath.split('/').pop()}`}
                      alt={imageAlt}
                      className="object-cover rounded-lg"
                      width={640}
                      height={480}
                    />
                    <div className="mx-xl-4 blog-text">
                      <h2 className="text-xl blog-title-head">{blog.title}</h2>
                      <p className="text-sm mt-xl-2 blog-description">{blog.description}</p>
                      <p className="text-xs text-gray-400 text-start date-text">
                        {blog.date} | {blog.category}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Row>
      </Container>
      <Footer />
    </div>
  );
};

export default Blog;