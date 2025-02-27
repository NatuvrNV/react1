

import { Container, Row, Col,} from "react-bootstrap";

import { useNavigate } from "react-router-dom";


const NotFound = () => {
    const navigate = useNavigate(); // Initialize the navigate function

  return (
    <>
      
      <Container fluid className="bg-dark text-white contact-container">
        <Row className="text-row">
          <Col md={12} className="d-flex align-items-center justify-content-center gap-4">
          <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        
      <p id="not-text" className="text-xl text-gray-600 mt-1">Oops! Page Not Found</p>
      
      <button   id="project-button" 
  className="hover-button" 
  onClick={() => {
    window.scrollTo(0, 0); // Scroll to top
    navigate("/"); }}>
            <span>Go Back to Home</span>
          </button>
    </div>
          
          </Col>

        
        </Row>

     
      </Container>

    
    </>
  );
};

export default NotFound;
