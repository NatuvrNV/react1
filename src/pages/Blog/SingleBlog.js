import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col } from "react-bootstrap";
import { SingleBlogDetail } from './BlogConstants';
import "./Blog.css";
import Footer from "../../components/Footer";

const SingleBlogPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const blog = SingleBlogDetail[parseInt(id, 10)];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

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

  if (!blog || !blog.images) {
    navigate('/404');
    return null;
  }

  return (
    <div className="singleblog-container ">
      <Container className='mt-4'>
        {/* Mobile Layout */}
        <div className="d-block d-xl-none">
          <BlogButton navigate={navigate} />
          <div className="mobile-image-gallery mt-3">
            <div className="d-flex">
              <img src={`/assets/Blogs/${blog.folderName}/${blog.images[0]?.split('/').pop()}`} alt={blog.title} className="object-cover rounded-lg w-50 first-image" />
              <div className="d-flex flex-column w-50 ms-2">
                <img src={`/assets/Blogs/${blog.folderName}/${blog.images[1]?.split('/').pop()}`} alt={blog.title} className="object-cover rounded-lg mb-2 second-image" />
                <img src={`/assets/Blogs/${blog.folderName}/${blog.images[2]?.split('/').pop()}`} alt={blog.title} className="object-cover rounded-lg second-image" />
              </div>
            </div>
          </div>
          <h2 className="text-4xl mb-4 blog-title mt-4 ">{blog.title}</h2>
          <p className="text-xs text-gray-400 text-start single-text ">
            {blog.date} | {blog.category}
          </p>
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
            <Col xl={6}>
              <h2 id='head-text' className="text-4xl mt-xl-4 blog-title text-start">{blog.title}</h2>
              <p className="text-xs text-gray-400 date-text text-start">{blog.date}</p>
              <p className="text-sm blog-fulldescription " dangerouslySetInnerHTML={{ __html: blog.Fulldescription }}></p>
            </Col>

            <Col xl={6}>
              <div className="image-gallery mt-xl-4">
                <img 
                  src={`/assets/Blogs/${blog.folderName}/${blog.images[0]?.split('/').pop()}`} 
                  alt={blog.title} 
                  className="object-cover rounded-lg w-100 mb-4" 
                  loading="lazy" // lazy load the first image
                />
                <div className="grid grid-cols-2 gap-4 single-grid">
                  {blog.images[1] && (
                    <img 
                      src={`/assets/Blogs/${blog.folderName}/${blog.images[1]?.split('/').pop()}`} 
                      alt={blog.title} 
                      className="object-cover rounded-lg w-100" 
                      loading="lazy" // lazy load
                    />
                  )}
                  {blog.images[2] && (
                    <img 
                      src={`/assets/Blogs/${blog.folderName}/${blog.images[2]?.split('/').pop()}`} 
                      alt={blog.title} 
                      className="object-cover rounded-lg w-100" 
                      loading="lazy" // lazy load
                    />
                  )}
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
            {SingleBlogDetail.map((relatedBlog, index) => (
              <div
                key={index}
                className="flex cursor-pointer blog-card"
                onClick={() => handleBlogClick(index)}
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
      <Footer />
    </div>
  );
};

export default SingleBlogPage;
