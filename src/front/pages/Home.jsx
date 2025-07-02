import React, { useEffect } from "react"
import { Link } from "react-router-dom";
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Home = () => {

	const { store, dispatch } = useGlobalReducer()

	const loadMessage = async () => {
		try {
			const backendUrl = import.meta.env.VITE_BACKEND_URL

			if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file")

			const response = await fetch(backendUrl + "/api/hello")
			const data = await response.json()

			if (response.ok) dispatch({ type: "set_hello", payload: data.message })

			return data

		} catch (error) {
			if (error.message) throw new Error(
				`Could not fetch the message from the backend.
				Please check if the backend is running and the backend port is public.`
			);
		}

	}

	useEffect(() => {
		loadMessage()
	}, [])

	return (
		<div className="text-center mt-5">
			<h1 className="display-4">Welcome to SnoutScout</h1>

			<div className="mb-4">
				<img src={rigoImageUrl} className="img-fluid rounded-circle mb-3" alt="Rigo Baby" style={{ maxWidth: '200px' }} />
			</div>

			<div className="row justify-content-center">
				<div className="col-md-8">
					<div className="alert alert-info">
						{store.message ? (
							<span>{store.message}</span>
						) : (
							<span className="text-danger">
								Loading message from the backend (make sure your python 🐍 backend is running)...
							</span>
						)}
					</div>
				</div>
			</div>

			<div className="row justify-content-center mt-4">
				<div className="col-md-6">
					<div className="d-grid gap-3">
						<Link to="/pets">
							<button className="btn btn-primary btn-lg">
								🐾 Browse Available Pets
							</button>
						</Link>
						<Link to="/favorites">
							<button className="btn btn-outline-success btn-lg">
								❤️ View My Favorites
							</button>
						</Link>
					</div>
				</div>
			</div>


		</div>
	);
}; 