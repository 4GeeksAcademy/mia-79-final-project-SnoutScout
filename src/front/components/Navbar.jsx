import React from 'react';
import { Navbar as BSNavbar, Nav, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export function Navbar() {
  return (
    <BSNavbar expand="lg" className="navbar-custom">
      <Container>
        <BSNavbar.Brand as={Link} to="/" className="text-white">
          SnoutScout
        </BSNavbar.Brand>
        <BSNavbar.Toggle aria-controls="main-nav" className="navbar-dark" />
        <BSNavbar.Collapse id="main-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className="text-white">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/messages" className="text-white">
              Messages
            </Nav.Link>
            <Nav.Link as={Link} to="/browse" className="text-white">
              Browse
            </Nav.Link>
            <Nav.Link as={Link} to="/favorites" className="text-white">
              Favorites
            </Nav.Link>
            <Nav.Link as={Link} to="/socialfeed" className="text-white">
              Social Feed
            </Nav.Link>
          </Nav>
          <Button as={Link} to="/signup" variant="outline-light" size="sm">
            Sign Up
          </Button>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
}
