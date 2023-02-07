import { useEffect, useState } from "react";

 const Profile = (props) =>
 {
    const [user, setUser] = useState({});
    const [emailEdit, setEmailEdit] = useState(true);
    const [usernameEdit, setUsernameEdit] = useState(true);
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");

    useEffect(() =>
    {
        setUser(props.user);
        setEmail(props.user.email);
        setUsername(props.user.username);
    }, [props.user, emailEdit, usernameEdit]);

    const handleUsernameChange = (event) => { setUsername(event.target.value); }
    const handleEmailChange = (event) => { setEmail(event.target.value); }
    const formatTime = (time) => 
    {
        const splittedTime = time.split("T");
        const date = splittedTime[0];
        let hour = splittedTime[1];
        hour = hour.split(":");
        hour = hour[0] + ":" + hour[1];
        return (date + " " + hour);
    }
    const handleUsernameEdit = () =>
    {
        if (!usernameEdit)
        {
            console.log("New username: " + username);
        }
        setUsernameEdit(!usernameEdit);
    }
    const handleEmailEdit = () =>
    {
        if (!emailEdit)
        {
            console.log("New email: " + email);
        }
        setEmailEdit(!emailEdit);
    }

    return (
        <div className="ProfileArea">
            <h1>Profile</h1>
            <div className="Separator"/>
            <div className="ProfileUsernameArea" >
                <label>Username</label>
                <div className="ProfileInputArea">
                    <input type="text" id="ProfileUsername" className="ProfileInput" value={username} readOnly={usernameEdit} onChange={handleUsernameChange} />
                    <input type="button" id="EditProfile" className="EditProfile" value={usernameEdit ? "Edit" : "Save"} onClick={handleUsernameEdit} />
                </div>
            </div>
            <div className="ProfileEmailArea" >
                <label>Email</label>
                <div className="ProfileInputArea">
                    <input type="email" id="ProfileEmail" className="ProfileInput" value={email} readOnly={emailEdit} onChange={handleEmailChange} />
                    <input type="button" id="EditProfile" className="EditProfile" value={emailEdit ? "Edit" : "Save"} onClick={handleEmailEdit} />
                </div>
            </div>
            {
                user.joined && 
                     <p className="JoinedData">Joined: {formatTime(user.joined)}</p>
            }
        </div>
    )
 }

 export default Profile;