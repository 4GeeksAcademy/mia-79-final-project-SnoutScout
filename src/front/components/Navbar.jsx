import React from 'react';
import { Navbar as BSNavbar, Nav, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';


export const Navbar = () => {

	return (
		<nav className="navbar navbar-expand navbar-light py-2" style={{ backgroundColor: "#fd7e14" }}>
			<div className="container-fluid">
				<h1 className="navbar-brand fs-1 fw-bold">SnoutScout</h1>
				<div className="d-flex flex-grow-1 justify-content-center">
					<div className="d-none d-md-flex gap-4">
						<Link to="/" className="nav-link text-white">Home</Link>
						<Link to="/messages" className="nav-link text-white">Messages</Link>
						<Link to="/snoutscouter" className="nav-link text-white">SnoutScouter</Link>
						<Link to="/favorites" className="nav-link text-white">Favorites</Link>
					</div>
				</div>

				<div className="d-flex w-100 justify-content-end">
					<div className="col-auto">
						<Link to="/login">
							<button className="btn btn-light" style={{ color: "#fd7e14" }}>
								Login
							</button>
						</Link>

					</div>

				</div>
			</div>
		</nav>
	);
};

export default Navbar;
