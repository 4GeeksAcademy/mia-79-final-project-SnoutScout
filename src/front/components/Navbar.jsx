import { Link } from "react-router-dom";
import React from "react";

export const Navbar = () => {

	return (
		<nav className="navbar navbar-expand navbar-light py-2" style={{ backgroundColor: "#fd7e14" }}>
			<div className="container-fluid">
				<h1 className="navbar-brand fs-1 fw-bold">SnoutScout</h1>
				<div className="d-flex flex-grow-1 justify-content-center">
					<div className="d-none d-md-flex gap-4">
						<a href="#" className="nav-link text-white">Home</a>
						<a href="#" className="nav-link text-white">Messages</a>
						<a href="#" className="nav-link text-white">Browse</a>
						<a href="#" className="nav-link text-white">Favorites</a>
					</div>
				</div>

				<div className="d-flex w-100 justify-content-end">
					<div className="col-auto">
						<button className="btn btn-light" style={{ color: "#fd7e14" }} type="submit">Join Now</button>
					</div>

				</div>
			</div>
		</nav>
	);
};