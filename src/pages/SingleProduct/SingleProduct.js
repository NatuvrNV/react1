import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Dropdown, ListGroup } from "react-bootstrap";
import { FaYoutube, FaInstagram } from "react-icons/fa";
import { MdArrowOutward } from "react-icons/md";
import Footer from "../../components/Footer";
import "./SingleProduct.css";
import { SingleProductDetail } from "../../utils/constants";
import { Helmet } from "react-helmet-async";
import { FaPlay } from "react-icons/fa";

const SingleProduct = () => {
  const imageGridRef = useRef(null);

  const handleImageClick = (index) => {
    setClickedIndex(clickedIndex === index ? null : index);

    // Scroll entire page to top
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });

    // Optional: Also prevent #products-grid from overriding the scroll
    document.getElementById("product-grid")?.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  const navigate = useNavigate();

  const { productName } = useParams();
  const selectedProduct = SingleProductDetail.find(
    (item) => item.name.toLowerCase() === productName
  );

  const [clickedIndex, setClickedIndex] = useState(null);
  const [contentToRender, setContentToRender] = useState([]);
  const gridRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showElementsDropdown, setShowElementsDropdown] = useState(false);
  const [activeButton, setActiveButton] = useState(null);

  const handleButtonClick = (index) => {
    setActiveButton(activeButton === index ? null : index);
  };

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

  useEffect(() => {
    const nightImages = selectedProduct.images.filter(
      (item) => item.split("/")[4] === "night"
    );

    if (darkMode && nightImages.length === 0) {
      setContentToRender([]);
    } else {
      setContentToRender(darkMode ? nightImages : selectedProduct.images);
    }
  }, [darkMode, selectedProduct.images]);

  const filterImagesByCategory = (category) => {
    setSelectedCategory(category);
  };

  const filteredImages = selectedCategory
    ? contentToRender.filter((img) => img.includes(selectedCategory))
    : contentToRender;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="container main-container">
      <Helmet>
        <title>
           {selectedProduct.metatittles}
        </title>
        <meta name="description" content={selectedProduct.metadescription} />
        <meta property="og:title" content={selectedProduct.metatittles} />
        <meta
          property="og:description"
          content={selectedProduct.metadescription}
        />
        <link
          rel="canonical"
          href={`https://metaguise.com/all-products/${productName}`}
        />

        {/* ✅ PRODUCT SCHEMA FOR AI + GOOGLE */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: selectedProduct.Productname,
            description: selectedProduct.metadescription,
            url: `https://metaguise.com/all-products/${productName}`,
            image: selectedProduct.images?.map(
              (img) => `${window.location.origin}/${img}`
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
            category: "Architectural Metal Products",
            material: selectedProduct.materials || "Metal",
            inLanguage: "en-IN",
          })}
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
              selectedCategory={selectedCategory} // Pass this prop
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
            videoLink={selectedProduct.videoLink} // Add this line
          />
        </div>
        <Sidebar
          selectedProduct={selectedProduct}
          categories={categories}
          selectedCategory={selectedCategory}
          filterImagesByCategory={filterImagesByCategory}
          darkMode={darkMode}
          toggleTheme={toggleTheme}
          activeButton={activeButton}
          handleButtonClick={handleButtonClick}
          youtubeLink={selectedProduct.youtubeLink}
          instagramLink={selectedProduct.instagramLink}
        />
        {isMobile && <BuildButton />}
      </div>
      <Footer />
    </div>
  );
};

const BackButton = ({ navigate }) => {
  return (
    <button onClick={() => navigate("/all-products")} className="back-button">
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
          selectedProduct={selectedProduct} // Pass selectedProduct as a prop
        />

        <SocialIcons
          youtubeLink={selectedProduct?.youtubeLink}
          instagramLink={selectedProduct?.instagramLink}
        />
      </div>
    </div>
  );
};

const ProjectHeader = ({ selectedProduct }) => {
  return (
    <div className="col-12 single-head mb-3 px-3">
      <h3>
        {selectedProduct?.Productname
          ? selectedProduct.Productname.charAt(0).toUpperCase() +
            selectedProduct.Productname.slice(1)
          : "Product"}
      </h3>
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
  categories,
  selectedCategory,
  filterImagesByCategory,
  darkMode,
  toggleTheme,
  activeButton,
  handleButtonClick,
  youtubeLink,
  instagramLink,
}) => {
  return (
    <div className="col-md-3 col-sm-12 sidebar-section pe-lg-4">
      <h3 style={{ fontWeight: "bold" }}>
        {selectedProduct.Productname.charAt(0).toUpperCase() +
          selectedProduct.Productname.slice(1)}
      </h3>
      <div
        id="single-text"
        className="sidebar p-4 bg-darkrounded tw-text-white"
      >
        <ListGroup variant="flush">
          <h1
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
      <a href="https://docs.google.com/forms/d/e/1FAIpQLSf1nJBRFNLm2hYrS95oZvnK-FgSOeNEUIDcbLvAl7G_7p87Sg/viewform?fbclid=PAZXh0bgNhZW0CMTEAAaY_AV6AaLgq4i2maOVBHN06Ou6PMrqaw9GdissjRbQa57VtkuRdhb2B47c_aem_5oXOIfcz7M1mEeOrTpC1bw">
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
              index={0} // Position before first image
              handleImageClick={handleImageClick}
              clickedIndex={clickedIndex}
            />
          )}

          {filteredImages.map((image, index) => (
            <Image
              key={index + 1} // Avoid duplicate keys
              image={image}
              index={index + 1} // Shift index forward
              handleImageClick={handleImageClick}
              isLastRow={isLastRow}
              clickedIndex={clickedIndex}
            />
          ))}
        </>
      )}
    </div>
  );
};

const VideoItem = ({ videoUrl, index, handleImageClick, clickedIndex }) => {
  // Extract Video ID from YouTube Link
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
            alt="YouTube Video Thumbnail"
            className="grid-image"
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

const Image = ({ image, index, handleImageClick, isLastRow, clickedIndex }) => {
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
        alt={`Project item ${index + 1}`}
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

const BuildButton = () => {
  return (
    <a href="https://docs.google.com/forms/d/e/1FAIpQLSf1nJBRFNLm2hYrS95oZvnK-FgSOeNEUIDcbLvAl7G_7p87Sg/viewform?fbclid=PAZXh0bgNhZW0CMTEAAaY_AV6AaLgq4i2maOVBHN06Ou6PMrqaw9GdissjRbQa57VtkuRdhb2B47c_aem_5oXOIfcz7M1mEeOrTpC1bw">
      <button id="build-button" className="mobile-controls hover-button">
        <span>Build Your Dream</span>
      </button>
    </a>
  );
};

export default SingleProduct;