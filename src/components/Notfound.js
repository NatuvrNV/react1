import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const NotFound = () => {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(3);

    useEffect(() => {
        // Start countdown when component mounts
        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        // Redirect after 3 seconds
        const redirectTimer = setTimeout(() => {
            window.scrollTo(0, 0);
            navigate("/");
        }, 3000);

        // Cleanup timers when component unmounts
        return () => {
            clearInterval(timer);
            clearTimeout(redirectTimer);
        };
    }, [navigate]);

    return (
        <Container fluid className="bg-dark text-white contact-container">
            <Row className="text-row">
                <Col md={12} className="d-flex align-items-center justify-content-center gap-4">
                    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                        <p id="not-text" className="text-xl text-gray-600 mt-1">
                            Oops! Page Not Found
                        </p>
                        <p className="text-gray-500 mt-2">
                            Redirecting to homepage in {countdown} second{countdown !== 1 ? 's' : ''}...
                        </p>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default NotFound;
