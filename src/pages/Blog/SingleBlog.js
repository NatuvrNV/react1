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
      <button onClick={() => navigate('/blogs')} className="blog-button">
        <span className="arrow"> &larr;</span>
        Back
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
  
  // Added urlFriendlyTitle variable for canonical URL
  const urlFriendlyTitle = blog.title.toLowerCase().replace(/\s+/g, '-');
  
  // Function to get alt text for an image
  const getImageAltText = (blog, imageIndex = 0) => {
    // Check if the blog has the new images array format with alt tags
    if (blog.images && blog.images.length > 0 && typeof blog.images[0] === 'object' && blog.images[0].alt) {
      return blog.images[imageIndex]?.alt || blog.imageAltText || blog.title;
    }
    // Fallback to old format
    return blog.imageAltText || blog.title;
  };

  // Function to render images in rows of 2 (Template A)
  const renderImageRows = () => {
    const rows = [];
    for (let i = 0; i < blog.images.length; i += 2) {
      const imagePair = blog.images.slice(i, i + 2);
      rows.push(
        <Row key={i} className="mb-4">
          {imagePair.map((image, index) => {
            // Handle both old and new image formats
            const imagePath = typeof image === 'object' ? image.path : image;
            const imageAlt = typeof image === 'object' ? image.alt : getImageAltText(blog, i + index);
            
            return (
              <Col key={i + index} xs={6}>
                <img
                  src={`/assets/Blogs/${blog.folderName}/${imagePath.split('/').pop()}`}
                  alt={imageAlt}
                  className="object-cover rounded-lg w-100"
                  loading="lazy"
                  style={{objectFit: 'cover', height: '300px'}}
                />
              </Col>
            );
          })}
        </Row>
      );
    }
    return rows;
  };

  // Function to render Template A (current layout)
  const renderTemplateA = () => {
    return (
      <>
        {/* Mobile Layout */}
        <div className="d-block d-xl-none">
          <BlogButton navigate={navigate} />
          <h1 className="text-4xl mb-4 blog-title mt-4">{blog.title}</h1>
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
              <h1 id='head-text' className="text-4xl mt-xl-4 blog-title text-start">{blog.title}</h1>
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
      </>
    );
  };

  // Function to render Template B (vertical stacked layout)
  const renderTemplateB = () => {
    // Split the description into sections if provided in blog.contentSections
    const descriptionSections = blog.contentSections || 
      blog.Fulldescription.split('</p>').filter(section => section.trim()).map(section => section + '</p>');

    // Calculate how many content sections we have per image
    const sectionsPerImage = Math.ceil(descriptionSections.length / blog.images.length);
    
    return (
      <>
        <BlogButton navigate={navigate} />
        
        {/* Mobile Layout for Template B */}
        <div className="d-block d-xl-none">
          <h1 className="text-4xl mb-4 blog-title mt-4">{blog.title}</h1>
          <p className="text-xs text-gray-400 text-start single-text">
            {blog.date} | {blog.category}
          </p>
          
          {/* Mobile: Vertical stacked layout for Template B */}
          {blog.images.map((image, index) => {
            // Handle both old and new image formats
            const imagePath = typeof image === 'object' ? image.path : image;
            const imageAlt = typeof image === 'object' ? image.alt : getImageAltText(blog, index);
            
            return (
              <div key={index} className="mt-2">
                {/* Image */}
                <img
                  src={`/assets/Blogs/${blog.folderName}/${imagePath.split('/').pop()}`}
                  alt={imageAlt}
                  className="object-cover rounded-lg w-100 mb-4"
                  loading="lazy"
                  style={{objectFit: 'cover', height: '200px', borderRadius: '20px'}}
                />
                
                {/* Text section(s) for this image */}
                {descriptionSections.length > 0 && (
                  <div className="text-sm blog-fulldescription template2 mb-5">
                    {(() => {
                      const startIndex = index * sectionsPerImage;
                      const endIndex = startIndex + sectionsPerImage;
                      const sectionsForThisImage = descriptionSections.slice(startIndex, endIndex);
                      
                      return sectionsForThisImage.map((section, sectionIndex) => (
                        <div 
                          key={`${index}-${sectionIndex}`}
                          dangerouslySetInnerHTML={{ __html: section }}
                        />
                      ));
                    })()}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Desktop Layout for Template B */}
        <div className="d-none d-xl-block">
          <Row className="my-4">
            <Col xl={12}>
              <h1 id='head-text2' className="text-4xl blog-title text-start">{blog.title}</h1>
              <p className="text-xs text-gray-400 date-text2 text-start mt-2">
                {blog.date} | {blog.category}
              </p>
            </Col>
          </Row>

          {/* Desktop: Vertical stacked layout for Template B */}
          <div className="mt-2">
            {blog.images.map((image, index) => {
              // Handle both old and new image formats
              const imagePath = typeof image === 'object' ? image.path : image;
              const imageAlt = typeof image === 'object' ? image.alt : getImageAltText(blog, index);
              
              return (
                <div key={index} className="mb-2 pb-2">
                  {/* Image - Full width */}
                  <Row className="my-4">
                    <Col xl={8}>
                      <img
                        src={`/assets/Blogs/${blog.folderName}/${imagePath.split('/').pop()}`}
                        alt={imageAlt}
                        className="object-cover rounded-lg w-100"
                        loading="lazy"
                        style={{objectFit: 'cover', height: '400px', borderRadius: '20px'}}
                      />
                    </Col>
                  </Row>
                  
                  {/* Text section(s) for this image - Full width */}
                  {descriptionSections.length > 0 && (
                    <Row>
                      <Col xl={8}>
                        <div className="text-sm blog-fulldescription template2 px-3">
                          {(() => {
                            const startIndex = index * sectionsPerImage;
                            const endIndex = startIndex + sectionsPerImage;
                            const sectionsForThisImage = descriptionSections.slice(startIndex, endIndex);
                            
                            return sectionsForThisImage.map((section, sectionIndex) => (
                              <div 
                                key={`${index}-${sectionIndex}`}
                                dangerouslySetInnerHTML={{ __html: section }}
                                className="my-3"
                              />
                            ));
                          })()}
                        </div>
                      </Col>
                    </Row>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  };

  // Function to get alt text for related blog images
  const getRelatedBlogImageAlt = (relatedBlog, imageIndex = 0) => {
    if (relatedBlog.images && relatedBlog.images.length > 0) {
      const firstImage = relatedBlog.images[0];
      if (typeof firstImage === 'object' && firstImage.alt) {
        return firstImage.alt;
      }
    }
    return relatedBlog.imageAltText || relatedBlog.title;
  };

  // Select template based on blog.template property
  const renderTemplate = () => {
    switch(blog.template) {
      case 'B':
        return renderTemplateB();
      case 'A':
      default:
        return renderTemplateA();
    }
  };

  return (
    <div className="singleblog-container">
      {/* Meta Tags */}
      <Helmet>
        <title> {metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <link
          rel="canonical"
          href={`https://metaguise.com/blog/${urlFriendlyTitle}`}
        />
        
        {/* Schema from BlogConstants - if it exists */}
        {blog.schema && (
          <script type="application/ld+json">
            {blog.schema}
          </script>
        )}
      </Helmet>

      <Container className='mt-4'>
        {renderTemplate()}
      </Container>

      {/* Related Articles Section - Same for both templates */}
      {relatedBlogs.length > 0 && (
        <Container fluid>
          <Row>
            <Col xl={12}>
              <div className="desktop-title mb-3 single-title">
                <h2 className="text-5xl text-center mb-10">Related Articles</h2>
              </div>
              <div className="mobile-title mb-3 single-title">
                <h2 className="text-5xl text-center mb-10">Related Articles</h2>
              </div>
            </Col>
          </Row>

          <Row>
            <div className="grid grid-cols-2 gap-8 blog-grid mt-xl-5 px-xl-5 mt-4">
              {relatedBlogs.slice(0, 4).map((relatedBlog) => {
                // Get the first image path and alt for the related blog
                const firstImage = relatedBlog.images && relatedBlog.images.length > 0 
                  ? (typeof relatedBlog.images[0] === 'object' 
                      ? relatedBlog.images[0].path 
                      : relatedBlog.images[0])
                  : '';
                
                const imageAlt = getRelatedBlogImageAlt(relatedBlog);
                
                return (
                  <div
                    key={relatedBlog.title}
                    className="flex cursor-pointer blog-card"
                    onClick={() => handleBlogClick(relatedBlog.title)}
                  >
                    <img 
                      src={`/assets/Blogs/${relatedBlog.folderName}/${firstImage.split('/').pop()}`} 
                      alt={imageAlt}
                      className="object-cover rounded-lg" 
                    />
                    <div className="mx-xl-4 blog-text">
                      <h2 className="text-xl blog-title-head">{relatedBlog.title}</h2>
                      <p className="text-sm mt-xl-2 blog-description">{relatedBlog.description}</p>
                      <p className="text-xs text-gray-400 text-start date-text">
                        {relatedBlog.date} | {relatedBlog.category}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Row>
        </Container>
      )}
      <Footer />
    </div>
  );
};

export default SingleBlogPage;