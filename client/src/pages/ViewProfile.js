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
        <div>
            <h1>username: {username}</h1>
            <h1>email: {email}</h1>
            <h1>joined: {formatTime(joined)}</h1>
        </div>
    )
}

export default ViewProfile;