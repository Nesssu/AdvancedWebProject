import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

 const Profile = (props) =>
 {
    const [user, setUser] = useState({});
    const [emailEdit, setEmailEdit] = useState(true);
    const [usernameEdit, setUsernameEdit] = useState(true);
    const [bioEdit, setBioEdit] = useState(true);
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const navigate = useNavigate();

    useEffect(() =>
    {
        setUser(props.user);
        setEmail(props.user.email);
        setUsername(props.user.username);
        setBio(props.user.bio);
        
        const token = localStorage.getItem('auth_token');
        // If the localStorage doesn't have a token, the user is redirected to the home page, because they are not logged in
        if (!token)
        {
            navigate('/');
        }
    }, [props.user, emailEdit, usernameEdit]);
    // Functions that handle the state changes for the inputs
    const handleUsernameChange = (event) => { setUsername(event.target.value); }
    const handleEmailChange = (event) => { setEmail(event.target.value); }
    const handleBioChange = (event) => { setBio(event.target.value); }
    // Function to format the 'createdAt' time from mongoDB to better format
    const formatTime = (time) => 
    {
        if (time) 
        {
            const splittedTime = time.split("T");
            const date = splittedTime[0];
            let hour = splittedTime[1];
            hour = hour.split(":");
            hour = hour[0] + ":" + hour[1];
            return (date + " " + hour);
        }
        return time;
    }
    const handleUsernameEdit = () =>
    {
        if (!usernameEdit)
        {
            // Sends the new username to the server
            fetch('/api/users/update/username', {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": "Bearer " + props.token
                },
                body: JSON.stringify({newUsername: username})
            })
            .then(response => response.json())
            .then(json => {
                // If the server responds with a success, a succesful toast message is shown
                if (json.success)
                {
                    toast.success(json.message, {
                        position: "top-center",
                        autoClose: 2000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                        });
                }
                // Otherwise an error message is shown in a toast message
                else
                {
                    toast.error(json.message, {
                        position: "top-center",
                        autoClose: 2000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                        });
                }
            });
        }
        setUsernameEdit(!usernameEdit);
    }
    const handleEmailEdit = () =>
    {
        if (!emailEdit)
        {
            // New email is sent to the server
            fetch('/api/users/update/email', {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": "Bearer " + props.token
                },
                body: JSON.stringify({newEmail: email})
            })
            .then(response => response.json())
            .then(json => {
                // If the server responds with a success, a succesful toast message is shown
                if (json.success)
                {
                    toast.success(json.message, {
                        position: "top-center",
                        autoClose: 2000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                        });
                }
                // Otherwise a error message is shown in a toast message
                else
                {
                    toast.error(json.message, {
                        position: "top-center",
                        autoClose: 2000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                        });
                }
            });
        }
        setEmailEdit(!emailEdit);
    }

    const handleBioEdit = () =>
    {
        if (!bioEdit)
        {
            // New bio is sent to the server
            fetch('/api/add/bio', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": "Bearer " + props.token
                },
                body: JSON.stringify({newBio: bio})
            })
            .then(response => response.json())
            .then(json => {
                // If the server responds with a success, a succesful toast message is shown
                if (json.success)
                {
                    toast.success(json.message, {
                        position: "top-center",
                        autoClose: 2000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                        });
                }
                // Otherwise a error message is shown in a toast message
                else
                {
                    toast.error(json.message, {
                        position: "top-center",
                        autoClose: 2000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                        });
                }
            });
        }
        setBioEdit(!bioEdit);
    }

    return (
        <div className="ProfileArea">
            <h1>Profile</h1>
            <div className="Separator"/>
            <div className="ProfileUsernameArea" >
                <label>Username</label>
                <div className="ProfileInputArea">
                    <input type="text" id="ProfileUsername" className="ProfileInput" value={username ? username : ""} readOnly={usernameEdit} onChange={handleUsernameChange} />
                    <input type="button" id="EditProfile" className="EditProfile" value={usernameEdit ? "Edit" : "Save"} onClick={handleUsernameEdit} />
                </div>
            </div>
            <div className="ProfileEmailArea" >
                <label>Email</label>
                <div className="ProfileInputArea">
                    <input type="email" id="ProfileEmail" className="ProfileInput" value={email ? email : ""} readOnly={emailEdit} onChange={handleEmailChange} />
                    <input type="button" id="EditProfile" className="EditProfile" value={emailEdit ? "Edit" : "Save"} onClick={handleEmailEdit} />
                </div>
            </div>
            <div className="ProfileBioArea" >
                <label>Bio</label>
                <div className="ProfileBioInputArea">
                    <textarea type="text" id="ProfileBio" className="ProfileBioInput" value={bio ? bio : ""} readOnly={bioEdit} onChange={handleBioChange} placeholder="Add a bio for your profile" />
                    <input type="button" id="EditProfile" className="EditProfile" value={bioEdit ? "Edit" : "Save"} onClick={handleBioEdit} />
                </div>
            </div>
            <p className="JoinedData">Joined: {formatTime(user.joined)}</p>
            <ToastContainer />
        </div>
    )
 }

 export default Profile;