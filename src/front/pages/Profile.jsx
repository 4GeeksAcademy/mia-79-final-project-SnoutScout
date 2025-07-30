export const Profile = () => {
    // need to distinguish between self-view and visitor-view 

    //===============
    //  Self View
    //===============

    // Name/username should not be able to edit?

    // Bio should be able to edit 

    // "My Posts" button should work the same no matter what, for whoever's page it is
    // you should be able to view the associated posts in a MODAL, column of posts like 
    // name: (post/pic) ......... => click on it, it takes you to the post where you can like or comment 

    // Self view => your messages page, no contact or convo selected, default view with your list of contacts on the left
    // Visitor view => takes you to message page, saves user in your list of contacts, starts a convo 
    // "envelop" icon no matter the view 

    // edit profile => profile pic, bio 
    // form pops up as modal 

    // ===== EDIT PROFILE MODAL LOGIC =====
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({
        profile_pic_url: '',
        bio: '',
        dog_pics: Array(4).fill('')
    });

        // Fetch current data when modal opens
    const editProfile = () => {
        // Is the modal open?
    }

    // user should be able to insert a picture into each of the 4 pictures slots to show off their dogs 


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
                            <h2>Name</h2>
                        </div>

                        {/* Bio, 250 max characters */}
                        <div className="bio">
                            <h5>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor.</h5>
                        </div>
                        <div className="buttons d-flex gap-2">
                            {/* Changes what's below from pics/posts, both are squares */}
                            <button type="button" class="btn btn-info">My Posts</button>
                            {/* viewing your own page => your messages page 
                                viewing someone else's page => create new contact, open fresh new conversation that */}
                            <button type="button" class="btn btn-info">Message Me</button>
                            <button onclick="myFunction()">Edit Profile</button>
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