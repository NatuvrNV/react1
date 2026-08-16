import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col } from "react-bootstrap";
import { blogSchemas } from './blogSchemas';
import "./Blog.css";
import Footer from "../../components/Footer";

// Injects/removes the Article + WebPage JSON-LD <script> tags for the
// current blog, keyed by blog.url, from the static blogSchemas map.
const useBlogSchema = (blog) => {
  useEffect(() => {
    if (!blog || !blog.url) return undefined;

    const schemaEntry = blogSchemas[blog.url];
    if (!schemaEntry) return undefined;

    const articleScript = document.createElement('script');
    articleScript.type = 'application/ld+json';
    articleScript.id = 'schema-article';
    articleScript.text = JSON.stringify(schemaEntry.articleSchema);

    const webPageScript = document.createElement('script');
    webPageScript.type = 'application/ld+json';
    webPageScript.id = 'schema-webpage';
    webPageScript.text = JSON.stringify(schemaEntry.webPageSchema);

    document.head.appendChild(articleScript);
    document.head.appendChild(webPageScript);

    return () => {
      articleScript.remove();
      webPageScript.remove();
    };
  }, [blog]);
};

const SingleBlogPage = () => {
  const { title } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const getUrlFriendlyString = (str) => str.toLowerCase().replace(/\s+/g, '-');

  // Fetch the single post's full content by slug
  useEffect(() => {
    setIsLoading(true);
    setNotFound(false);
    window.scrollTo(0, 0);

    const slug = title.toLowerCase();

    fetch(`/data/blogs/${slug}.json`)
      .then((res) => {
        if (!res.ok) throw new Error('not found');
        return res.json();
      })
      .then((data) => setBlog(data))
      .catch(() => setNotFound(true))
      .finally(() => setIsLoading(false));
  }, [title]);

  // Related blogs, once blog + index are available
  useEffect(() => {
    if (!blog) return;
    fetch('/data/blogs-index.json')
      .then((res) => res.json())
      .then((index) => {
        let related = index.filter(
          (b) => b.category === blog.category && b.title !== blog.title
        );
        if (related.length === 0) {
          related = index.filter((b) => b.title !== blog.title);
        }
        setRelatedBlogs(related);
      })
      .catch((err) => console.error('Failed to load related blogs:', err));
  }, [blog]);

  useEffect(() => {
    if (notFound) navigate('/404');
  }, [notFound, navigate]);

  // Old article/webpage schema injection (from blogSchemas.js, keyed by blog.url)
  useBlogSchema(blog);

  const handleBlogClick = (b) => {
    const urlFriendlyPath = b.url ? getUrlFriendlyString(b.url) : getUrlFriendlyString(b.title);
    navigate(`/blog/${urlFriendlyPath}`);
  };

  const BlogButton = ({ navigate }) => (
    <button onClick={() => navigate('/blogs')} className="blog-button">
      <span className="arrow"> &larr;</span>
      Back
    </button>
  );

  if (isLoading) {
    return (
      <div className="singleblog-container">
        <Container className="mt-4">
          <p className="text-center py-5">Loading...</p>
        </Container>
        <Footer />
      </div>
    );
  }

  if (!blog) return null;

  // Helper function to get the first image URL (for OG/Twitter meta)
  const getFirstImageUrl = () => {
    if (blog.images && blog.images.length > 0) {
      const firstImage = blog.images[0];
      const imagePath = typeof firstImage === 'object' ? firstImage.path : firstImage;
      return `https://metaguise.com/assets/Blogs/${blog.folderName}/${imagePath.split('/').pop()}`;
    }
    return '';
  };

  // Helper function to get alt text for the first image
  const getFirstImageAlt = () => {
    if (blog.images && blog.images.length > 0) {
      const firstImage = blog.images[0];
      if (typeof firstImage === 'object' && firstImage.alt) return firstImage.alt;
    }
    return blog.imageAltText || blog.title;
  };

  const metaTitle = blog.metaTitle || blog.title;
  const metaDescription = blog.metaDescription || blog.description;
  const firstImageUrl = getFirstImageUrl();
  const firstImageAlt = getFirstImageAlt();

  const urlFriendlyTitle = blog.url ? getUrlFriendlyString(blog.url) : getUrlFriendlyString(blog.title);
  const canonicalUrl = `https://metaguise.com/blog/${urlFriendlyTitle}/`;

  // Body renderer: supports both flat Fulldescription (HTML string) and
  // contentSections (array of HTML strings)
  const renderBody = (b, className) => {
    if (b.Fulldescription) {
      return <div className={className} dangerouslySetInnerHTML={{ __html: b.Fulldescription }} />;
    }
    if (Array.isArray(b.contentSections) && b.contentSections.length > 0) {
      return (
        <div className={className}>
          {b.contentSections.map((section, i) => (
            <div key={i} dangerouslySetInnerHTML={{ __html: section }} />
          ))}
        </div>
      );
    }
    return null;
  };

  // Function to get alt text for an image
  const getImageAltText = (b, imageIndex = 0) => {
    // Check if the blog has the new images array format with alt tags
    if (b.images && b.images.length > 0 && typeof b.images[0] === 'object' && b.images[0].alt) {
      return b.images[imageIndex]?.alt || b.imageAltText || b.title;
    }
    // Fallback to old format
    return b.imageAltText || b.title;
  };

  // Function to render images in rows of 2 (Template A gallery)
  const renderImageRows = () => {
    const rows = [];
    for (let i = 0; i < blog.images.length; i += 2) {
      const imagePair = blog.images.slice(i, i + 2);
      rows.push(
        <Row key={i} className="mb-4">
          {imagePair.map((image, index) => {
            const imagePath = typeof image === 'object' ? image.path : image;
            const imageAlt = typeof image === 'object' ? image.alt : getImageAltText(blog, i + index);

            return (
              <Col key={i + index} xs={6}>
                <img
                  src={`/assets/Blogs/${blog.folderName}/${imagePath.split('/').pop()}`}
                  alt={imageAlt}
                  className="object-cover rounded-lg w-100"
                  loading="lazy"
                  width="640"
                  height="480"
                  style={{ objectFit: 'cover', height: '300px' }}
                />
              </Col>
            );
          })}
        </Row>
      );
    }
    return rows;
  };

  // ---- Template A: title/date/description in one column, image grid in the other ----
  // NOTE: the post title <h1> and BlogButton are now rendered ONCE, above the
  // mobile/desktop split. Previously each breakpoint block rendered its own
  // <h1>{blog.title}</h1>, toggled with Bootstrap's d-block/d-none classes.
  // Those are display:none, not conditional rendering, so both H1s stayed in
  // the DOM at once — duplicate H1 on every blog post.
  const renderTemplateA = () => {
    return (
      <>
        <BlogButton navigate={navigate} />
        <h1 id="head-text" className="text-4xl mb-4 mt-4 mt-xl-4 blog-title text-start">{blog.title}</h1>

        {/* Mobile Layout */}
        <div className="d-block d-xl-none">
          <p className="text-xs text-gray-400 text-start single-text">
            {blog.date} | {blog.category}
          </p>

          {/* Mobile image gallery - show all images in rows of 2 */}
          <div className="mobile-image-gallery mt-3">
            {renderImageRows()}
          </div>

          {renderBody(blog, "text-sm blog-fulldescription mt-4")}
        </div>

        {/* Desktop Layout */}
        <div className="d-none d-xl-block">
          <Row className='py-xl-3'>
            <Col xl={7}>
              <p className="text-xs text-gray-400 date-text text-start">{blog.date} | {blog.category}</p>
              {renderBody(blog, "text-sm blog-fulldescription")}
            </Col>

            <Col xl={5}>
              <div className="image-gallery mt-xl-4">
                {renderImageRows()}
              </div>
            </Col>
          </Row>
        </div>
      </>
    );
  };

  // ---- Template B: vertical stacked layout, alternating image + text ----
  // Same fix: single <h1> hoisted above the mobile/desktop split.
  const renderTemplateB = () => {
    const descriptionSections = blog.contentSections ||
      blog.Fulldescription.split('</p>').filter(section => section.trim()).map(section => section + '</p>');

    const sectionsPerImage = Math.ceil(descriptionSections.length / blog.images.length);

    return (
      <>
        <BlogButton navigate={navigate} />
        <h1 id="head-text2" className="text-4xl mb-4 mt-4 blog-title text-start">{blog.title}</h1>

        {/* Mobile Layout for Template B */}
        <div className="d-block d-xl-none">
          <p className="text-xs text-gray-400 text-start single-text">
            {blog.date} | {blog.category}
          </p>

          {blog.images.map((image, index) => {
            const imagePath = typeof image === 'object' ? image.path : image;
            const imageAlt = typeof image === 'object' ? image.alt : getImageAltText(blog, index);

            return (
              <div key={index} className="mt-2">
                <img
                  src={`/assets/Blogs/${blog.folderName}/${imagePath.split('/').pop()}`}
                  alt={imageAlt}
                  className="object-cover rounded-lg w-100 mb-4"
                  loading="lazy"
                  width="640"
                  height="480"
                  style={{ objectFit: 'cover', height: '200px', borderRadius: '20px' }}
                />

                {descriptionSections.length > 0 && (
                  <div className="text-sm blog-fulldescription template2 mb-5">
                    {(() => {
                      const startIndex = index * sectionsPerImage;
                      const endIndex = startIndex + sectionsPerImage;
                      const sectionsForThisImage = descriptionSections.slice(startIndex, endIndex);
                      return sectionsForThisImage.map((section, sectionIndex) => (
                        <div key={`${index}-${sectionIndex}`} dangerouslySetInnerHTML={{ __html: section }} />
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
              <p className="text-xs text-gray-400 date-text2 text-start mt-2">
                {blog.date} | {blog.category}
              </p>
            </Col>
          </Row>

          <div className="mt-2">
            {blog.images.map((image, index) => {
              const imagePath = typeof image === 'object' ? image.path : image;
              const imageAlt = typeof image === 'object' ? image.alt : getImageAltText(blog, index);

              return (
                <div key={index} className="mb-2 pb-2">
                  <Row className="my-4">
                    <Col xl={8}>
                      <img
                        src={`/assets/Blogs/${blog.folderName}/${imagePath.split('/').pop()}`}
                        alt={imageAlt}
                        className="object-cover rounded-lg w-100"
                        loading="lazy"
                        width="640"
                        height="480"
                        style={{ objectFit: 'cover', height: '400px', borderRadius: '20px' }}
                      />
                    </Col>
                  </Row>

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

  const getRelatedBlogImageAlt = (relatedBlog) => {
    if (relatedBlog.images && relatedBlog.images.length > 0) {
      const firstImage = relatedBlog.images[0];
      if (typeof firstImage === 'object' && firstImage.alt) return firstImage.alt;
    }
    return relatedBlog.imageAltText || relatedBlog.title;
  };

  // Select template based on blog.template property
  const renderTemplate = () => {
    switch (blog.template) {
      case 'B':
        return renderTemplateB();
      case 'A':
      default:
        return renderTemplateA();
    }
  };

  return (
    <div className="singleblog-container">
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />

        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={firstImageUrl} />
        <meta property="og:image:alt" content={firstImageAlt} />
        <meta property="og:site_name" content="MetaGuise" />
        <meta property="og:locale" content="en_US" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={canonicalUrl} />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={firstImageUrl} />
        <meta name="twitter:image:alt" content={firstImageAlt} />
        <meta name="twitter:site" content="@metaguise" />
        <meta name="twitter:creator" content="@metaguise" />

        <meta property="article:published_time" content={blog.date} />
        <meta property="article:section" content={blog.category} />
        <meta property="article:author" content="MetaGuise" />

        {/* Per-blog JSON schema, if present (separate from the article/webpage
            schema injected by useBlogSchema above, which comes from blogSchemas.js) */}
        {blog.schema && (
          <script type="application/ld+json">
            {JSON.stringify(blog.schema)}
          </script>
        )}
      </Helmet>

      <noscript>
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
          <h1>{blog.title}</h1>
          <p>{blog.date} | {blog.category}</p>
          <p>{blog.description}</p>

          {blog.contentSections ? (
            blog.contentSections.map((section, i) => (
              <p key={i}>{section.replace(/<[^>]+>/g, '')}</p>
            ))
          ) : (
            <p>{blog.Fulldescription?.replace(/<[^>]+>/g, '')}</p>
          )}

          <p>
            For more information about metal facades in India, visit{' '}
            <a href="https://metaguise.com">Metaguise</a> — India's leading
            metal facade company based in Gurugram.
          </p>
        </div>
      </noscript>

      <Container className='mt-4'>
        {renderTemplate()}
      </Container>

      {relatedBlogs.length > 0 && (
        <Container fluid>
          <Row>
            <Col xl={12}>
              {/* Single H2 for both breakpoints — was previously duplicated via
                  .desktop-title / .mobile-title CSS-toggle wrappers, same
                  display:none pattern that caused the duplicate H1 above. */}
              <div className="single-title mb-3">
                <h2 className="text-5xl text-center mb-10">Related Articles</h2>
              </div>
            </Col>
          </Row>

          <Row>
            <div className="grid grid-cols-2 gap-8 blog-grid mt-xl-5 px-xl-5 mt-4">
              {relatedBlogs.slice(0, 4).map((relatedBlog) => {
                const firstImage = relatedBlog.images && relatedBlog.images.length > 0
                  ? (typeof relatedBlog.images[0] === 'object' ? relatedBlog.images[0].path : relatedBlog.images[0])
                  : '';
                const imageAlt = getRelatedBlogImageAlt(relatedBlog);

                return (
                  <div
                    key={relatedBlog.title}
                    className="flex cursor-pointer blog-card"
                    onClick={() => handleBlogClick(relatedBlog)}
                  >
                    <img
                      src={`/assets/Blogs/${relatedBlog.folderName}/${firstImage.split('/').pop()}`}
                      alt={imageAlt}
                      className="object-cover rounded-lg"
                      loading="lazy"
                      width="640"
                      height="480"
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