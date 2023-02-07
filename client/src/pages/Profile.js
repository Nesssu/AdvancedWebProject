import { useEffect, useState } from "react";

 const Profile = (props) =>
 {
    const [user, setUser] = useState({});
    useEffect(() =>
    {
        setUser(props.user);
    }, [props.user]);

    return (
        <div className="ProfileArea">
            <h1>Profile</h1>
            <div className="ProfileUsernameArea" >
                <p>Username: {user.username}</p>
            </div>
            <div className="ProfileEmailArea" >
                <p>Email: {user.email}</p>
            </div>
        </div>
    )
 }

 export default Profile;