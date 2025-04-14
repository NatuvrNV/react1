import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const NotFound = () => {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(3);
    const [isPreloaderDone, setIsPreloaderDone] = useState(false);

    // Simulate preloader finishing
    useEffect(() => {
        const preloaderTimeout = setTimeout(() => {
            setIsPreloaderDone(true); // Replace this logic with your actual preloader logic
        }, 1500); // Simulated preloader time

        return () => clearTimeout(preloaderTimeout);
    }, []);

    useEffect(() => {
        if (!isPreloaderDone) return;

        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        const redirectTimer = setTimeout(() => {
            window.scrollTo(0, 0);
            navigate("/");
        }, 3000);

        return () => {
            clearInterval(timer);
            clearTimeout(redirectTimer);
        };
    }, [isPreloaderDone, navigate]);

    return (
        <Container fluid className="bg-dark text-white contact-container">
            <Row className="text-row">
                <Col md={12} className="d-flex align-items-center justify-content-center gap-4">
                    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                        <p id="not-text" className="text-xl text-gray-600 mt-1">
                            Oops! Page Not Found
                        </p>
                        {isPreloaderDone ? (
                            <p className="text-gray-500 mt-2">
                                Redirecting to homepage in {countdown} second{countdown !== 1 ? 's' : ''}...
                            </p>
                        ) : (
                            <p className="text-gray-500 mt-2">Loading...</p>
                        )}
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default NotFound;
