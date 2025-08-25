import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col } from "react-bootstrap";
import { SingleBlogDetail } from './BlogConstants';
import "./Blog.css";
import Footer from "../../components/Footer";

const SingleBlogPage = () => {
  const { title } = useParams();
  const navigate = useNavigate();

  const blog = SingleBlogDetail.find(blog =>
    blog.title.toLowerCase().replace(/\s+/g, '-') === title.toLowerCase()
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!blog) {
      navigate('/404');
    }
  }, [title, blog, navigate]);

  const handleBlogClick = (blogTitle) => {
    const urlFriendlyTitle = blogTitle.toLowerCase().replace(/\s+/g, '-');
    navigate(`/blog/${urlFriendlyTitle}`);
  };

  const BlogButton = ({ navigate }) => {
    return (
      <button onClick={() => navigate(-1)} className="blog-button">
        <span className="arrow">&larr; Back</span>
      </button>
    );
  };

  if (!blog) {
    return null;
  }

  // Get related blogs from the same category (excluding current blog)
  let relatedBlogs = SingleBlogDetail.filter(b =>
    b.category === blog.category && b.title !== blog.title
  );

  // If no related blogs, show all other blogs
  if (relatedBlogs.length === 0) {
    relatedBlogs = SingleBlogDetail.filter(b => b.title !== blog.title);
  }

  const metaTitle = blog.metaTitle || blog.title;
  const metaDescription = blog.metaDescription || blog.description;

  // Function to render images in rows of 2
  const renderImageRows = () => {
    const rows = [];
    for (let i = 0; i < blog.images.length; i += 2) {
      const imagePair = blog.images.slice(i, i + 2);
      rows.push(
        <Row key={i} className="mb-4">
          {imagePair.map((image, index) => (
            <Col key={i + index} xs={6}>
              <img
                src={`/assets/Blogs/${blog.folderName}/${image.split('/').pop()}`}
                alt={`${blog.title} ${i + index + 1}`}
                className="object-cover rounded-lg w-100"
                loading="lazy"
                style={{objectFit: 'cover', height: '300px'}}
              />
            </Col>
          ))}
        </Row>
      );
    }
    return rows;
  };

  return (
    <div className="singleblog-container">
      {/* Meta Tags */}
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
      </Helmet>

      <Container className='mt-4'>
        {/* Mobile Layout */}
        <div className="d-block d-xl-none">
          <BlogButton navigate={navigate} />
          <h2 className="text-4xl mb-4 blog-title mt-4">{blog.title}</h2>
          <p className="text-xs text-gray-400 text-start single-text">
            {blog.date} | {blog.category}
          </p>
          
          {/* Mobile image gallery - show all images in rows of 2 */}
          <div className="mobile-image-gallery mt-3">
            {renderImageRows()}
          </div>
          
          <p className="text-sm blog-fulldescription mt-4" dangerouslySetInnerHTML={{ __html: blog.Fulldescription }}></p>
        </div>

        {/* Desktop Layout */}
        <div className="d-none d-xl-block">
          <Row>
            <Col xl={12}>
              <BlogButton navigate={navigate} />
            </Col>
          </Row>

          <Row className='py-xl-3'>
            <Col xl={7}>
              <h2 id='head-text' className="text-4xl mt-xl-4 blog-title text-start">{blog.title}</h2>
              <p className="text-xs text-gray-400 date-text text-start">{blog.date} | {blog.category}</p>
              <p className="text-sm blog-fulldescription" dangerouslySetInnerHTML={{ __html: blog.Fulldescription }}></p>
            </Col>

            <Col xl={5}>
              <div className="image-gallery mt-xl-4">
                {/* Show all images in rows of 2 */}
                {renderImageRows()}
              </div>
            </Col>
          </Row>
        </div>
      </Container>

      {relatedBlogs.length > 0 && (
        <Container fluid>
          <Row>
            <Col xl={12}>
              <div className="desktop-title mb-3 single-title">
                <h1 className="text-5xl text-center mb-10">Related Articles</h1>
              </div>
              <div className="mobile-title mb-3 single-title">
                <h1 className="text-5xl text-center mb-10">Related Articles</h1>
              </div>
            </Col>
          </Row>

          <Row>
            <div className="grid grid-cols-2 gap-8 blog-grid mt-xl-5 px-xl-5 mt-4">
              {relatedBlogs.map((relatedBlog) => (
                <div
                  key={relatedBlog.title}
                  className="flex cursor-pointer blog-card"
                  onClick={() => handleBlogClick(relatedBlog.title)}
                >
                  <img src={`/assets/Blogs/${relatedBlog.folderName}/${relatedBlog.images[0]?.split('/').pop()}`} alt={relatedBlog.title} className="object-cover rounded-lg" />
                  <div className="mx-xl-4 blog-text">
                    <h2 className="text-xl blog-title">{relatedBlog.title}</h2>
                    <p className="text-sm mt-xl-2 blog-description">{relatedBlog.description}</p>
                    <p className="text-xs text-gray-400 text-start date-text">
                      {relatedBlog.date} | {relatedBlog.category}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Row>
        </Container>
      )}
      <Footer />
    </div>
  );
};

export default SingleBlogPage;

