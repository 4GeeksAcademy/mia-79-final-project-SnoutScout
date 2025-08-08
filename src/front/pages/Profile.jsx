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
    // check authentication to make sure user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      // Redirect to login if not authenticated
      navigate("/login");
      return;
    }

    // GET request to fetch user profile data
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      await fetch(`${apiUrl}api/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch profile data");
          }
          return response.json();
        })
        .then((data) => {
          dispatch({ type: "SET_USER", payload: data.user });
          setBio(data.user.bio || "This user has no bio.");
        })
        .catch((error) => {
          console.error("Error fetching profile data:", error);
          alert("Failed to load profile data. Please try again later.");
        });
    };
    fetchProfile();
  }, [dispatch, navigate]);

  // PUT request
  const handleUpdateProfile = async () => {
    const token = localStorage.getItem("token");

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
    const updatedUser = await response.json();
    dispatch({ type: "SET_USER", payload: updatedUser });
    setBio(updatedUser.bio || "You don't have a bio yet!");
    alert("Profile updated successfully!");
  };

  return (
    <div
      className="page-body d-flex justify-content-center"
      style={{
        background: "linear-gradient(to right, #3f866c, #37bf5e)",
      }}
    >
      <div
        className="profile-body rounded-4 d-flex flex-column m-5 p-5"
        style={{
          minHeight: "600px",
          minWidth: "1000px",
          border: "3px solid #FFD6A5",
          background: "linear-gradient(to bottom, #FFF8E1 0%, #FFFFFF 100%)",
        }}
      >
        <div
          className="profile-top d-flex rounded-3"
          style={{
            backgroundColor: "rgba(144, 238, 144, 0.2)",
            border: "2px dashed rgba(50, 205, 50, 0.5)",
          }}
        >
          {/* Profile Image */}
          <div
            className="profile-image rounded-circle m-3"
            style={{
              height: "250px",
              width: "250px",
              overflow: "hidden",
              flexShrink: "0",
              border: "3px solid #81C784", // Green border
            }}
          >
            {/* user.profilepic OR default pic below */}
            <img
              src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
              className="rounded-circle h-100 w-100"
              alt="Profile"
              style={{
                objectFit: "cover",
              }}
            ></img>
          </div>
          <div
            className="container-text d-flex flex-column ps-3"
            style={{ width: "fit-content" }}
          >
            {/* Name */}
            <div className="name pt-3">
              <h2>
                {store.user.first_name} {store.user.last_name}
              </h2>
            </div>

            {/* Bio, 250 max characters */}
            <div className="bio">
              <h5>{store.user.bio}</h5>
            </div>
            <div className="buttons d-flex gap-2">
              {/* Changes what's below from pics/posts, both are squares */}
              <button type="button" className="btn btn-info">
                My Posts
              </button>
              {/* viewing your own page => your messages page 
                                viewing someone else's page => create new contact, open fresh new conversation that */}
              <Link to="/messages" className="btn btn-success">
                My Messages
              </Link>
              {/* Edit Profile button, opens modal */}
              <button
                type="button"
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#staticBackdrop"
              >
                Edit Profile
              </button>
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
                    <div className="modal-header">
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
                        placeholder=""
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
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
                      <button type="button" className="btn btn-primary" onClick={handleUpdateProfile}>
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Puppy Pics */}
        <div className="container-pictures d-flex flex-wrap justify-content-around m-2 pt-3">
          <div
            className="grid-item-pic"
            style={{
              width: "250px",
              height: "250px",
              border: "2px solid #FFD6A5",
              background: "#FFD8A8",
            }}
          >
            <img
              src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
              className="p-2 h-100 w-100"
              alt="Pictures"
            ></img>
          </div>
          <div
            className="grid-item-pic"
            style={{
              width: "250px",
              height: "250px",
              border: "2px solid #FFD6A5",
              background: "#FFD8A8",
            }}
          >
            <img
              src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
              className="p-2 h-100 w-100"
              alt="Pictures"
            ></img>
          </div>
          <div
            className="grid-item-pic"
            style={{
              width: "250px",
              height: "250px",
              border: "2px solid #FFD6A5",
              background: "#FFD8A8",
            }}
          >
            <img
              src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
              className="p-2 h-100 w-100"
              alt="Pictures"
            ></img>
          </div>
          <div
            className="grid-item-pic"
            style={{
              width: "250px",
              height: "250px",
              border: "2px solid #FFD6A5",
              background: "#FFD8A8",
            }}
          >
            <img
              src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
              className="p-2 h-100 w-100"
              alt="Pictures"
            ></img>
          </div>
        </div>
      </div>
    </div>
  );
};
