import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap"; // Import Bootstrap Components
import logo from "../../assets/logo.png";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (res.ok) {
      window.location.href = "/admin";
    } else {
      alert(data.message);
    }
  };

  return (
    <Container fluid className="bg-dark text-white min-vh-100 d-flex align-items-center justify-content-center">
      <Row className="w-100">
        <Col md={12} className="d-flex align-items-center justify-content-center">
          <div className=" p-8 rounded-xl shadow-lg text-center w-96">
            {/* Logo */}
            <img src={logo} alt="Metaguise Logo" className="mx-auto mb-4 w-24" />

            {/* <h2 className="text-2xl font-semibold mb-4 text-white text-center ">Admin Login</h2> */}

            {/* Username Field */}
            <div className="mb-4 loginfield">
              <input
                type="text"
                placeholder="Username"
                className="w-full "
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Password Field */}
            <div className="mb-4 loginfield">
              <input
                type="password"
                placeholder="Password"
                className="w-full "
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
