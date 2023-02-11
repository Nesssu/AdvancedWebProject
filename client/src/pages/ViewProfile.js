import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

const ViewProfile = (props) =>
{
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [joined, setJoined] = useState("");

    const {id} = useParams();

    useEffect(() =>
    {
        console.log(id);
        fetch('/api/user/' + id)
        .then(response => response.json())
        .then(json => {
            if (json.user)
            {
                setEmail(json.user.email);
                setUsername(json.user.username);
                setJoined(json.user.createdAt);
            }
        });
    }, [id]);

    const formatTime = (time) =>
    {
        const splittedTime = time.split("T");
        const date = splittedTime[0];
        let hour = splittedTime[1];
        hour = hour.split(":");
        hour = hour[0] + ":" + hour[1];
        return (date + " " + hour);
    }

    return (
        <div className="ProfileArea">
            <p><span>Username: </span>{username}</p>
            <p><span>Email: </span>{email}</p>
            <p><span>Joined: </span>{formatTime(joined)}</p>

            <div className="ProfileBioArea" >

            </div>
        </div>
    )
}

export default ViewProfile;