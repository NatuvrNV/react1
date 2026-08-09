import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <Container fluid className="bg-dark text-white contact-container">
            <Row className="text-row">
                <Col md={12} className="d-flex align-items-center justify-content-center gap-4">
                    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                        <h1 id="not-text" className="text-xl text-gray-600 mt-1">
                            404 | Page Not Found
                        </h1>
                        <p className="text-gray-500 mt-2">
                            Oops! The page you're looking for doesn't exist.
                        </p>
                        <Link to="/" className="mt-3 text-blue-600 underline">
                            Go back to homepage
                        </Link>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default NotFound;