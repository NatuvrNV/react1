import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Dropdown, ListGroup } from "react-bootstrap";
import { FaYoutube, FaInstagram } from "react-icons/fa";
import { MdArrowOutward } from "react-icons/md";
import Footer from "../../components/Footer";
import "./SingleProduct.css";
// SingleProductDetail used to be a static import (~62 KB in every bundle).
// It's now fetched on demand from /data/products/<slug>.json.
import { fetchProductBySlug } from "../../utils/fetchProductData";
import { Helmet } from "react-helmet-async";
import { FaPlay } from "react-icons/fa";

const SingleProduct = () => {
  const navigate = useNavigate();
  const { productName } = useParams();

  // ✅ ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURN
  const [clickedIndex, setClickedIndex] = useState(null);
  const [contentToRender, setContentToRender] = useState([]);
  const gridRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showElementsDropdown, setShowElementsDropdown] = useState(false);
  const [activeButton, setActiveButton] = useState(null);
  const imageGridRef = useRef(null);

  // Product data now comes from a fetch, not a static import
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // ✅ Task 4/9 fix — SEO copy (real H1 text, definition paragraph, H2
  // sections) for the 21 product pages. This is a SEPARATE fetch from
  // fetchProductBySlug on purpose: it doesn't touch images/video/social
  // data at all, so if this copy fetch fails or a slug has no entry yet,
  // the rest of the page renders exactly as it did before. Now covers
  // all 21 slugs, including MetaLouver and SolidPanel. Never invent
  // copy here.
  const [productCopyData, setProductCopyData] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`${process.env.PUBLIC_URL}/data/product-index.json`)
      .then((res) => (res.ok ? res.json() : {}))
      .then((data) => {
        if (!cancelled) setProductCopyData(data);
      })
      .catch(() => {
        if (!cancelled) setProductCopyData({});
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const productCopy = productCopyData?.[productName?.toLowerCase()] || null;

  // ✅ Task 8 fix — real alt text for the product galleries, replacing
  // the generic "Project item N" placeholder. Same separate-fetch
  // pattern as productCopy above: doesn't touch images/video/social
  // data, so if this fetch fails or a slug has no entry, images just
  // fall back to the old generic alt text — nothing breaks.
  const [altTextData, setAltTextData] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`${process.env.PUBLIC_URL}/data/alt-text.json`)
      .then((res) => (res.ok ? res.json() : {}))
      .then((data) => {
        if (!cancelled) setAltTextData(data);
      })
      .catch(() => {
        if (!cancelled) setAltTextData({});
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const altText = altTextData?.[productName?.toLowerCase()] || null;

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setNotFound(false);
    setSelectedProduct(null);

    const slug = productName?.toLowerCase();

    fetchProductBySlug(slug)
      .then((data) => {
        if (!cancelled) {
          setSelectedProduct(data);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setNotFound(true);
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [productName]);

  const generateMetaKeywords = () => {
    const baseKeywords = [
      "metal facade",
      "metal cladding",
      "architectural metal",
      "parametric facade",
      "Metaguise",
    ];

    const productSpecificKeywords = selectedProduct?.metaKeywords || [
      selectedProduct?.Productname,
      `${selectedProduct?.Productname} metal facade`,
      `${selectedProduct?.Productname} cladding`,
      `${selectedProduct?.Productname} design`,
      "custom metal facade",
      "premium metal facade",
      "modern building facade",
      "architectural metal products",
      "facade design India",
      "metal facade manufacturer",
    ];

    return [...baseKeywords, ...productSpecificKeywords].join(", ");
  };

  const getProductOgImage = () => {
    if (selectedProduct?.images && selectedProduct.images.length > 0) {
      return `https://metaguise.com/${selectedProduct.images[0]}`;
    }
    return "https://metaguise.com/default-product-image.jpg";
  };

  const handleImageClick = (index) => {
    setClickedIndex(clickedIndex === index ? null : index);

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });

    document.getElementById("product-grid")?.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  const handleButtonClick = (index) => {
    setActiveButton(activeButton === index ? null : index);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (gridRef.current && !gridRef.current.contains(event.target)) {
        setClickedIndex(null);
      }
      window.scrollTo(0, 0);
    };

    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [gridRef]);

  useEffect(() => {
    const nightImages = selectedProduct?.images?.filter(
      (item) => item.split("/")[4] === "night"
    ) || [];

    if (darkMode && nightImages.length === 0) {
      setContentToRender([]);
    } else {
      setContentToRender(darkMode ? nightImages : selectedProduct?.images || []);
    }
  }, [darkMode, selectedProduct]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Now the conditional returns (after all hooks)
  if (isLoading) {
    return (
      <div className="container main-container">
        <div className="row">
          <div className="col-12 text-center py-5">
            <p>Loading product...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (notFound || !selectedProduct) {
    return (
      <div className="container main-container">
        <div className="row">
          <div className="col-12 text-center py-5">
            <h2>Product not found</h2>
            <button
              onClick={() => navigate("/all-products/")}
              className="back-button mt-3"
            >
              <span className="arrow">&larr; Back to Products</span>
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const categories = Array.from(
    new Set(
      selectedProduct.images
        .map((item) =>
          item.split("/")[4] !== "night"
            ? item.split("/")[4].toLowerCase()
            : null
        )
        .filter((item) => item)
    )
  );

  const isLastRow = (index) => {
    return (
      index >=
      selectedProduct.images.length -
        (selectedProduct.images.length % 3 === 0
          ? 3
          : selectedProduct.images.length % 3)
    );
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const filterImagesByCategory = (category) => {
    setSelectedCategory(category);
  };

  const filteredImages = selectedCategory
    ? contentToRender.filter((img) => img.includes(selectedCategory))
    : contentToRender;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: selectedProduct.Productname,
    description: selectedProduct.metadescription || selectedProduct.description,
    url: `https://metaguise.com/all-products/${productName}/`,
    image: selectedProduct.images?.map(
      (img) => `https://metaguise.com/${img}`
    ),
    brand: {
      "@type": "Brand",
      name: "Metaguise",
    },
    manufacturer: {
      "@type": "Organization",
      name: "Metaguise",
      url: "https://metaguise.com",
    },
    offers: {
      "@type": "Offer",
      url: `https://metaguise.com/all-products/${productName}/`,
      priceCurrency: "INR",
      price: "0",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Metaguise",
      },
    },
    category: "Architectural Metal Products",
    material: selectedProduct.materials || "Metal",
    inLanguage: "en-IN",
  };

  return (
    <div className="container main-container">
      <Helmet>
        <title>{selectedProduct.metatittles || `${selectedProduct.Productname} | Metaguise`}</title>
        <meta name="description" content={selectedProduct.metadescription || selectedProduct.description} />
        <meta name="keywords" content={generateMetaKeywords()} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://metaguise.com/all-products/${productName}/`} />

        <meta property="og:type" content="product" />
        <meta property="og:title" content={selectedProduct.ogTitle || selectedProduct.metatittles || `${selectedProduct.Productname} | Premium Metal Facade Solution`} />
        <meta property="og:description" content={selectedProduct.ogDescription || selectedProduct.metadescription || selectedProduct.description} />
        <meta property="og:image" content={selectedProduct.ogImage || getProductOgImage()} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={`${selectedProduct.Productname} metal facade design by Metaguise`} />
        <meta property="og:url" content={`https://metaguise.com/all-products/${productName}/`} />
        <meta property="og:site_name" content="Metaguise" />
        <meta property="og:locale" content="en_IN" />
        <meta property="product:brand" content="Metaguise" />
        <meta property="product:category" content="Architectural Metal Facade" />
        <meta property="product:availability" content="in stock" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={selectedProduct.twitterTitle || selectedProduct.metatittles || `${selectedProduct.Productname} | Metaguise`} />
        <meta name="twitter:description" content={selectedProduct.twitterDescription || selectedProduct.metadescription || selectedProduct.description} />
        <meta name="twitter:image" content={selectedProduct.twitterImage || selectedProduct.ogImage || getProductOgImage()} />
        <meta name="twitter:url" content={`https://metaguise.com/all-products/${productName}/`} />

        <script type="application/ld+json">
          {JSON.stringify(productSchema)}
        </script>
      </Helmet>

      <div className="row">
        <div className="col-12">
          <BackButton navigate={navigate} />
          {isMobile && (
            <MobileControls
              selectedProduct={selectedProduct}
              showElementsDropdown={showElementsDropdown}
              setShowElementsDropdown={setShowElementsDropdown}
              filterImagesByCategory={filterImagesByCategory}
              categories={categories}
              setDarkMode={setDarkMode}
              selectedCategory={selectedCategory}
            />
          )}
        </div>
        <div className="col-9 xs-12">
          <ImageGrid
            filteredImages={filteredImages}
            handleImageClick={handleImageClick}
            isLastRow={isLastRow}
            clickedIndex={clickedIndex}
            ref={imageGridRef}
            videoLink={selectedProduct.videoLink}
            altText={altText}
          />
        </div>
        <Sidebar
          selectedProduct={selectedProduct}
          productCopy={productCopy}
          categories={categories}
          selectedCategory={selectedCategory}
          filterImagesByCategory={filterImagesByCategory}
          darkMode={darkMode}
          toggleTheme={toggleTheme}
          activeButton={activeButton}
          handleButtonClick={handleButtonClick}
          youtubeLink={selectedProduct.youtubeLink}
          instagramLink={selectedProduct.instagramLink}
          productSlug={productName}
        />
        {isMobile && <BuildButton productSlug={productName} />}
      </div>

      {/* ✅ Task 4/9 — real definition paragraph + H2 sections below
          the image grid/sidebar, for all 21 products. Still guarded
          on productCopy so a future slug with no entry yet renders
          the page exactly as before — no placeholder text ships. */}
      {productCopy && (
        <div className="row">
          <div className="col-12 product-copy-section px-3 py-4">
            <p>{productCopy.definitionParagraph}</p>
            {productCopy.h2Sections?.map((section, i) => (
              <React.Fragment key={i}>
                <h2>{section.heading}</h2>
                <p>{section.copy}</p>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

const BackButton = ({ navigate }) => {
  return (
    <button onClick={() => navigate("/all-products/")} className="back-button">
      <span className="arrow">&larr; Back</span>
    </button>
  );
};

const MobileControls = ({
  selectedProduct,
  showElementsDropdown,
  setShowElementsDropdown,
  filterImagesByCategory,
  categories,
  selectedCategory,
}) => {
  return (
    <div className="mobile-controls">
      <ProjectHeader selectedProduct={selectedProduct} />
      <div className="Elements">
        <ElementsDropdown
          showElementsDropdown={showElementsDropdown}
          setShowElementsDropdown={setShowElementsDropdown}
          filterImagesByCategory={filterImagesByCategory}
          categories={categories}
          selectedCategory={selectedCategory}
          selectedProduct={selectedProduct}
        />

        <SocialIcons
          youtubeLink={selectedProduct?.youtubeLink}
          instagramLink={selectedProduct?.instagramLink}
        />
      </div>
    </div>
  );
};

// FIX — this used to be a second <h1>, duplicating Sidebar's <h1> below.
// Sidebar renders unconditionally (not gated on isMobile), so on mobile
// both were live in the DOM at once with nothing hiding either one —
// same two-H1 bug already fixed on the homepage and the projects/
// products hub pages. Downgraded to <h2>; Sidebar's is now the page's
// single real H1. CSS class unchanged, so it's visually identical.
const ProjectHeader = ({ selectedProduct }) => {
  return (
    <div className="col-12 single-head mb-3 px-3">
      <h2>
        {selectedProduct?.Productname
          ? selectedProduct.Productname.charAt(0).toUpperCase() +
            selectedProduct.Productname.slice(1)
          : "Product"}
      </h2>
    </div>
  );
};

const ElementsDropdown = ({
  showElementsDropdown,
  setShowElementsDropdown,
  selectedProduct,
}) => {
  return (
    <Dropdown
      show={showElementsDropdown}
      onToggle={(isOpen) => setShowElementsDropdown(isOpen)}
      className="description-dropdown"
    >
      <Dropdown.Toggle variant="dark" id="description-dropdown">
        Description
        <div id="arrow-icon" className="icon-overlay">
          <MdArrowOutward size={20} />
        </div>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item>
          <div
            dangerouslySetInnerHTML={{
              __html: selectedProduct?.description
                ? selectedProduct.description.charAt(0).toUpperCase() +
                  selectedProduct.description.slice(1)
                : "No description available",
            }}
          />
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

const SocialIcons = ({ youtubeLink, instagramLink }) => {
  return (
    <div className="social-icons">
      <button
        className="icon-button"
        onClick={() => instagramLink && window.open(instagramLink, "_blank")}
        disabled={!instagramLink}
      >
        <FaInstagram />
      </button>

      <button
        className="icon-button"
        onClick={() => youtubeLink && window.open(youtubeLink, "_blank")}
        disabled={!youtubeLink}
      >
        <FaYoutube />
      </button>
    </div>
  );
};

const Sidebar = ({
  selectedProduct,
  productCopy,
  categories,
  selectedCategory,
  filterImagesByCategory,
  darkMode,
  toggleTheme,
  activeButton,
  handleButtonClick,
  youtubeLink,
  instagramLink,
  productSlug,
}) => {
  // ✅ This is now the page's single real H1 (see ProjectHeader fix
  // above). Uses the new SEO title from product-copy.json — all 21
  // products now have an entry, so the plain-product-name fallback
  // below is effectively dead code unless a future slug is missing.
  const h1Text =
    productCopy?.h1 ||
    (selectedProduct.Productname.charAt(0).toUpperCase() +
      selectedProduct.Productname.slice(1));

  return (
    <div className="col-md-3 col-sm-12 sidebar-section pe-lg-4">
      <h1 style={{ fontWeight: "bold" }}>{h1Text}</h1>
      <div
        id="single-text"
        className="sidebar p-4 bg-darkrounded tw-text-white"
      >
        <ListGroup variant="flush">
          <p
            action
            variant="dark"
            style={{ fontSize: "15px" }}
            dangerouslySetInnerHTML={{
              __html:
                selectedProduct.description.charAt(0).toUpperCase() +
                selectedProduct.description.slice(1),
            }}
          />
        </ListGroup>
      </div>

      <div className="button-row" style={{ padding: "5px" }}>
        <Button
          icon={<FaYoutube />}
          text="See on YouTube"
          onClick={() => window.open(youtubeLink, "_blank")}
          active={activeButton === 0}
        />
        <Button
          icon={<FaInstagram />}
          text="See on Instagram"
          onClick={() => window.open(instagramLink, "_blank")}
          active={activeButton === 1}
        />
      </div>
      <a href={`/build/?product=${productSlug}/`}>
        <button id="build-button" className="hover-button">
          <span>Build Your Dream</span>
        </button>
      </a>
    </div>
  );
};

const ImageGrid = ({
  filteredImages,
  handleImageClick,
  isLastRow,
  clickedIndex,
  ref,
  videoLink,
  altText,
}) => {
  return (
    <div id="product-grid" className="image-grid" ref={ref}>
      {filteredImages.length === 0 && !videoLink ? (
        <div className="no-images-found">
          No images found.
          <span>Go Back to Day</span>
        </div>
      ) : (
        <>
          {videoLink && (
            <VideoItem
              videoUrl={videoLink}
              index={0}
              handleImageClick={handleImageClick}
              clickedIndex={clickedIndex}
              videoAlt={altText?.videoAlt}
            />
          )}

          {filteredImages.map((image, index) => (
            <Image
              key={index + 1}
              image={image}
              index={index + 1}
              handleImageClick={handleImageClick}
              isLastRow={isLastRow}
              clickedIndex={clickedIndex}
              // ✅ Task 8 — real alt text looked up by the image's own
              // path, not by grid position. Filtering by category or
              // night-mode reorders/subsets filteredImages, so index
              // alone would point at the wrong alt — path is stable.
              altText={altText?.images?.[image]}
            />
          ))}
        </>
      )}
    </div>
  );
};

const VideoItem = ({ videoUrl, index, handleImageClick, clickedIndex, videoAlt }) => {
  const getVideoId = (url) => {
    if (url.includes("shorts/")) {
      return url.split("/shorts/")[1]?.split("?")[0];
    } else if (url.includes("v=")) {
      return url.split("v=")[1]?.split("&")[0];
    }
    return null;
  };

  const videoId = getVideoId(videoUrl);
  if (!videoId) return null;

  return (
    <div
      className={`grid-item video-thumbnail ${
        clickedIndex === index ? "active" : ""
      }`}
      onClick={() => handleImageClick(index)}
    >
      {clickedIndex === index ? (
        <iframe
          width="100%"
          height="200"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube Video"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      ) : (
        <>
          <img
            src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
            alt={videoAlt || "YouTube Video Thumbnail"}
            className="grid-image"
            width={480}
            height={360}
            loading="lazy"
          />
          <div className="play-icon">
            <FaPlay size={40} color="white" />
          </div>
        </>
      )}
    </div>
  );
};

const Image = ({ image, index, handleImageClick, isLastRow, clickedIndex, altText }) => {
  return (
    <div
      className={`grid-item ${isLastRow(index) ? "last-row" : ""} ${
        clickedIndex === index ? "active" : ""
      }`}
      onClick={() => handleImageClick(index)}
    >
      <img
        src={`${process.env.PUBLIC_URL}/${image}`}
        className="grid-image"
        // ✅ Task 8 — falls back to the old generic placeholder only if
        // this image has no real alt text yet (e.g. the 6 uncovered
        // images each on MetaCoin and MetaSequin — see alt-text.json).
        alt={altText || `Project item ${index + 1}`}
        width={640}
        height={480}
        loading="lazy"
      />
    </div>
  );
};

const Button = ({ icon, text, onClick, active }) => {
  return (
    <button
      className={`transition-button ${active ? "active" : ""}`}
      onClick={onClick}
    >
      <span className="icon">{icon}</span>
      <span className="text">{text}</span>
    </button>
  );
};

const BuildButton = ({ productSlug }) => {
  return (
    <a href={`/build/?product=${productSlug}/`}>
      <button id="build-button" className="mobile-controls hover-button">
        <span>Build Your Dream</span>
      </button>
    </a>
  );
};

export default SingleProduct;