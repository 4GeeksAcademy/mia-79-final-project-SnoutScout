import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Profile = () => {
    const navigate = useNavigate();
    const { store, dispatch } = useGlobalReducer();
    const [bio, setBio] = useState(
        `${store.user.bio || "This user has no bio."}`
    );
    const apiUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        fetchProfile();
    }, [dispatch, navigate]);  

    const fetchProfile = async () => {
        const token = store.user.token
            const response = await fetch(`${apiUrl}api/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error fetching profile:", errorData);
                alert("Failed to fetch profile. Please try again.");
                return;
            }
            const data = await response.json();
            dispatch({ type: "set_user", payload: data.user });
            return
        };
    const handleUpdateProfile = async () => {

        const response = await fetch(`${apiUrl}api/profile`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                bio,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error updating profile:", errorData);
            alert("Failed to update profile. Please try again.");
            return;
        }
        fetchProfile()
    };

    return (
        <div className="page-body d-flex justify-content-center align-items-center"
            style={{
                background: "linear-gradient(45deg, #E8F5E9 0%, #C8E6C9 50%, #E0F7FA 100%)",
                minHeight: "100vh"
            }}>
            <div className="profile-container rounded-4 shadow p-4"
                style={{
                    width: "800px",
                    border: "2px solid #81C784",
                    background: "linear-gradient(to bottom, #E8F5E9 0%, #FFFFFF 100%)"
                }}>

                {/* Profile Content */}
                <div className="profile-content d-flex">
                    {/* Profile Image */}
                    <div className="profile-image-container me-4"
                        style={{ minWidth: "200px" }}>
                        <div className="profile-image rounded-circle border border-3 border-success overflow-hidden"
                            style={{
                                width: "200px",
                                height: "200px"
                            }}>
                            <img
                                src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                                className="h-100 w-100"
                                alt="Profile"
                                style={{ objectFit: "cover" }}
                            />
                        </div>
                    </div>

                    {/* Profile Details */}
                    <div className="profile-details flex-grow-1">
                        <div className="name-header mb-4 p-3 rounded"
                            style={{
                                background: "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)",
                                border: "1px solid #1B5E20",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                            }}>
                            <h2 className="m-0 text-center" style={{
                                color: "white",
                                fontWeight: "600",
                                fontSize: "1.8rem",
                                letterSpacing: "0.5px",
                                textShadow: "0 1px 2px rgba(0,0,0,0.2)"
                            }}>
                                {store.user.user.first_name} {store.user.user.last_name}
                            </h2>
                        </div>


                        <div className="bio-container mb-4 p-3 rounded"
                            style={{
                                backgroundColor: "rgba(129, 199, 132, 0.1)",
                                border: "1px solid #81C784"
                            }}>
                            <p className="m-0" style={{ color: "#4CAF50" }}>
                                {store.user.user.bio || "This user has no bio."}
                            </p>
                        </div>

                        <div className="profile-actions d-flex gap-2">
                            <button type="button" className="btn btn-success">
                                My Posts
                            </button>
                            <Link to="/messages" className="btn btn-info">
                                My Messages
                            </Link>
                            <button
                                type="button"
                                className="btn btn-primary"
                                data-bs-toggle="modal"
                                data-bs-target="#staticBackdrop"
                            >
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>

                {/* Photos Section */}
                <div className="photos-section mt-4">
                    <h4 className="fw-bold mb-3 text-center" style={{
                        color: "#2E7D32",
                        position: "relative",
                        display: "inline-block",
                        left: "50%",
                        transform: "translateX(-50%)",
                        padding: "0 20px",
                        background: "linear-gradient(to right, transparent, #E8F5E9, transparent)",
                        borderBottom: "2px solid #81C784"
                    }}>
                        My Photos
                    </h4>
                    <div className="photos-grid d-flex flex-wrap justify-content-around">
                        {[1, 2, 3, 4].map((item) => (
                            <div key={item} className="photo-item"
                                style={{
                                    width: "160px",
                                    height: "160px",
                                    border: "2px solid #81C784",
                                    borderRadius: "10px",
                                    overflow: "hidden",
                                    background: "rgba(129, 199, 132, 0.1)",
                                    margin: "10px",
                                    transition: "transform 0.3s ease",
                                    cursor: "pointer"
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}>
                                <img
                                    src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                                    className="h-100 w-100"
                                    alt="Photo"
                                    style={{ objectFit: "cover" }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            <div
                className="modal fade"
                id="staticBackdrop"
                data-bs-backdrop="static"
                data-bs-keyboard="false"
                tabIndex="-1"
                aria-labelledby="staticBackdropLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header" style={{
                            background: "linear-gradient(to right, #4CAF50, #2E7D32)",
                            color: "#FFFFFF"
                        }}>
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">
                                Edit Your Bio!
                            </h1>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <input
                                type="text"
                                className="form-control mb-3"
                                placeholder="Enter your bio..."
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                style={{ border: "1px solid #81C784" }}
                            />
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                            >
                                Close
                            </button>
                            <button
                                type="button"
                                className="btn btn-success"
                                onClick={handleUpdateProfile}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};