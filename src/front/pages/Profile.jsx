import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Profile = () => {
    const { store, dispatch } = useGlobalReducer();
    const [name, setName] = useState(`${store.user.first_name} ${store.user.last_name}`);
    const [bio, setBio] = useState(`${store.user.bio || "This user has no bio."}`);
    
    // edit logic 

    // check to make sure user is logged in

    // PUT request

    // GET request




        return (
        <div className="page-body d-flex justify-content-center"
            style={{
                background: "linear-gradient(to right, #3f866c, #37bf5e)"
            }}>
            <div className="profile-body rounded-4 d-flex flex-column m-5 p-5"
                style={{
                    minHeight: "600px",
                    minWidth: "1000px",
                    border: "3px solid #FFD6A5",
                    background: "linear-gradient(to bottom, #FFF8E1 0%, #FFFFFF 100%)"
                }}>
                <div className="profile-top d-flex rounded-3" style={{
                    backgroundColor: "rgba(144, 238, 144, 0.2)",
                    border: "2px dashed rgba(50, 205, 50, 0.5)"
                }}>

                    {/* Profile Image */}
                    <div className="profile-image rounded-circle m-3"
                        style={{
                            height: "250px",
                            width: "250px",
                            overflow: "hidden",
                            flexShrink: "0",
                            border: "3px solid #81C784", // Green border
                        }}>
                        {/* user.profilepic OR default pic below */}
                        <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" className="rounded-circle h-100 w-100" alt="Profile"
                            style={{
                                objectFit: "cover"
                            }}></img>
                    </div>
                    <div className="container-text d-flex flex-column ps-3" style={{ width: "fit-content" }}>

                        {/* Name */}
                        <div className="name pt-3">
                            <h2>{store.user.first_name} {store.user.last_name}</h2>
                        </div>

                        {/* Bio, 250 max characters */}
                        <div className="bio">
                            <h5>{store.bio}</h5>
                        </div>
                        <div className="buttons d-flex gap-2">
                            {/* Changes what's below from pics/posts, both are squares */}
                            <button type="button" className="btn btn-info">My Posts</button>
                            {/* viewing your own page => your messages page 
                                viewing someone else's page => create new contact, open fresh new conversation that */}
                            <Link to="/messages" className="btn btn-success">My Messages</Link>
                            {/* Edit Profile button, opens modal */}
                            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                                Launch static backdrop modal
                            </button>
                            <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                <div class="modal-dialog">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h1 class="modal-title fs-5" id="staticBackdropLabel">Modal title</h1>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div class="modal-body">
                                            <input type="text" className="form-control mb-3" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                            <button type="button" class="btn btn-primary">Understood</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Puppy Pics */}
                <div className="container-pictures d-flex flex-wrap justify-content-around m-2 pt-3">
                    <div className="grid-item-pic"
                        style={{
                            width: "250px",
                            height: "250px",
                            border: "2px solid #FFD6A5",
                            background: "#FFD8A8"
                        }} >
                        <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" className="p-2 h-100 w-100" alt="Pictures"></img>
                    </div>
                    <div className="grid-item-pic"
                        style={{
                            width: "250px",
                            height: "250px",
                            border: "2px solid #FFD6A5",
                            background: "#FFD8A8"
                        }}>
                        <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" className="p-2 h-100 w-100" alt="Pictures"></img>
                    </div>
                    <div className="grid-item-pic"
                        style={{
                            width: "250px",
                            height: "250px",
                            border: "2px solid #FFD6A5",
                            background: "#FFD8A8"
                        }}>
                        <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" className="p-2 h-100 w-100" alt="Pictures"></img>
                    </div>
                    <div className="grid-item-pic"
                        style={{
                            width: "250px",
                            height: "250px",
                            border: "2px solid #FFD6A5",
                            background: "#FFD8A8"
                        }}>
                        <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" className="p-2 h-100 w-100" alt="Pictures"></img>
                    </div>
                </div>

            </div>
        </div>
    )
}