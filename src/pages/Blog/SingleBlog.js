import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col } from "react-bootstrap";
import { SingleBlogDetail } from './BlogConstants';
import "./Blog.css";
import Footer from "../../components/Footer";

const SingleBlogPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const blog = SingleBlogDetail[id];

  const handleBlogClick = (id) => {
    navigate(`/blog/${id}`);
  };

  const BlogButton = ({ navigate }) => {
    return (
      <button onClick={() => navigate(-1)} className="blog-button">
        <span className="arrow">&larr; Back</span>
      </button>
    );
  };

  if (!blog) {
    navigate('/404');
    return null;
  }

  return (
    <div className="singleblog-container">
      <Container>
        {/* Mobile Layout */}
        <div className="d-block d-xl-none">
          <BlogButton navigate={navigate} />
          <div className="mobile-image-gallery mt-4">
            <div className="d-flex">
              <img src={`/assets/Blogs/${blog.images[0].split('/').pop()}`} alt={blog.title} className="object-cover rounded-lg w-50" />
              <div className="d-flex flex-column w-50 ms-2">
                <img src={`/assets/Blogs/${blog.images[1].split('/').pop()}`} alt={blog.title} className="object-cover rounded-lg mb-2" />
                <img src={`/assets/Blogs/${blog.images[2].split('/').pop()}`} alt={blog.title} className="object-cover rounded-lg" />
              </div>
            </div>
          </div>
          <h2 className="text-4xl mb-4 blog-title mt-4">{blog.title}</h2>
          <p className="text-xs text-gray-400 text-start single-text">
                    {blog.date} | {blog.category}
                  </p>
          <p className="text-sm blog-fulldescription mt-4">{blog.Fulldescription}</p>
        </div>

        {/* Desktop Layout */}
        <div className="d-none d-xl-block">
          <Row>
            <Col xl={3} className="order-1">
              <BlogButton navigate={navigate} />
            </Col>
            <Col xl={6}>
              <h2 className="text-4xl mb-4 blog-title">{blog.title}</h2>
            </Col>
            <Col xl={3}>
              <p className="text-xs text-gray-400 date-text">{blog.date}</p>
            </Col>
          </Row>

          <Row>
            <Col xl={6}>
              <p className="text-sm mt-xl-2 blog-fulldescription mt-xl-5">{blog.Fulldescription}</p>
            </Col>

            <Col xl={6} className="order-xl-1">
              <div className="image-gallery">
                <img src={`/assets/Blogs/${blog.images[0].split('/').pop()}`} alt={blog.title} className="object-cover rounded-lg w-100 mb-4" />
                <div className="grid grid-cols-2 gap-4 single-grid">
                  <img src={`/assets/Blogs/${blog.images[1].split('/').pop()}`} alt={blog.title} className="object-cover rounded-lg w-100" />
                  <img src={`/assets/Blogs/${blog.images[2].split('/').pop()}`} alt={blog.title} className="object-cover rounded-lg w-100" />
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Container>

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
            {SingleBlogDetail.map((blog, index) => (
              <div
                key={index}
                className="flex cursor-pointer blog-card"
                onClick={() => handleBlogClick(index)}
              >
                <img src={`/assets/Blogs/${blog.images[0].split('/').pop()}`} alt={blog.title} className="object-cover rounded-lg" />
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
        </Row>
      </Container>
      <Footer />
    </div>
  );
};

export default SingleBlogPage;