import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

const ViewProfile = (props) =>
{
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [joined, setJoined] = useState("");
    const [bio, setBio] = useState("");

    const {id} = useParams();

    useEffect(() =>
    {
        // fetching data about the user
        fetch('/api/user/' + id)
        .then(response => response.json())
        .then(json => {
            // if the user is found their data is updated to the states
            if (json.user)
            {
                setEmail(json.user.email);
                setUsername(json.user.username);
                setJoined(json.user.createdAt);
                setBio(json.user.bio);
            }
        });
    }, [id]);

    // function to format the time to a nicer format
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

    return (
        <div className="ProfileArea">
            <h1>Profile</h1>
            <div className="ProfileAreaBackground" >
                <div className="ProfileInfoArea">
                    <div className="ProfileDataArea">
                        <p className="Username">{username}</p>
                        <p className="Email">{email}</p>
                        <p className="Joined"><span style={{fontWeight: "bold"}}>Joined: </span>{formatTime(joined)}</p>
                    </div>
                </div>
                <div className="ProfileBioArea">
                    <textarea className="BioInput" value={bio} placeholder="The users bio is empty." readOnly={true}  />
                </div>
            </div>
        </div>
    )
}

export default ViewProfile;