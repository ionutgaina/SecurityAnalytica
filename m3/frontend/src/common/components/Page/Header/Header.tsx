import { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import SignInModal from "../../../../pages/Login/SignIn";
import SignUpModal from "../../../../pages/Register/SignUp";
import { hasToken } from "../../../api/auth";

export default function Header() {
  const [registerShow, setRegisterShow] = useState(false);
  const [loginShow, setLoginShow] = useState(false);

  return (
    <>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand as={Link} to="/">
            SecurityAnalytica
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav text-white" />
          <Navbar.Collapse id="responsive-navbar-nav text-white">
            <Nav className="justify-content-end flex-grow-1 pe-3 text-white">
              <Nav.Link as={Link} to="/" className="text-white">
                Analyze and Secure
              </Nav.Link>
              <Nav.Link as={Link} to="/" className="text-white">
                Search users
              </Nav.Link>
              {!hasToken() ? (
                <>
                  <Nav.Link className="text-white" onClick={() => setLoginShow(true)}>
                    Login
                  </Nav.Link>
                  <Nav.Link className="text-white" onClick={() => setRegisterShow(true)}>
                    Register
                  </Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/profile" className="text-white">
                    My Profile
                  </Nav.Link>
                  <Nav.Link as={Link} to="/logout">
                    Logout
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <SignUpModal
        show={registerShow}
        onHide={() => setRegisterShow(false)}
        showLoginModal={() => setLoginShow(true)}
      />
      <SignInModal show={loginShow} onHide={() => setLoginShow(false)} />
    </>
  );
}
