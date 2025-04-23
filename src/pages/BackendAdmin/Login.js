import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap"; // Import Bootstrap Components
import logo from "../../assets/logo.png";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Define hardcoded credentials
  const hardcodedUsername = "admin";
  const hardcodedPassword = "password123";

  const handleLogin = () => {
    if (username === hardcodedUsername && password === hardcodedPassword) {
      window.location.href = "/admin";
    } else {
      alert("Invalid username or password");
    }
  };

  return (
    <Container fluid className="bg-dark text-white min-vh-100 d-flex align-items-center justify-content-center">
      <Row className="w-100">
        <Col md={12} className="d-flex align-items-center justify-content-center">
          <div className="p-8 rounded-xl shadow-lg text-center w-96">
            {/* Logo */}
            <img src={logo} alt="Metaguise Logo" className="mx-auto mb-4 w-24" />

            {/* Username Field */}
            <div className="mb-4 loginfield">
              <input
                type="text"
                placeholder="Username"
                className="w-full"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Password Field */}
            <div className="mb-4 loginfield">
              <input
                type="password"
                placeholder="Password"
                className="w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Login Button */}
            <div>
              <button
                onClick={handleLogin}
                className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
              >
                Login
              </button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
