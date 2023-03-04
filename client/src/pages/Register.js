import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Register = () =>
{
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");

    // Functions that handle the state changes for the inputs
    const handleEmailChange = (event) => { setEmail(event.target.value); }
    const handlePasswordChange = (event) => { setPassword(event.target.value); }
    const handleUsernameChange = (event) => { setUsername(event.target.value); } 
    const navigate = useNavigate();

    const register = () =>
    {
        // Sending the data to the server
        fetch("/api/users/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email, password, username})
        })
        .then(response => response.json())
        .then(json => {
            // If the server responds with a message, the data is invalid and the message
            // is shown in a 'react-toastify' toast message
            if (json.message)
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
            else
            {
                // If the server responds with a empty object, the user is redirected to the login page
                navigate("/login");
            }
        })
    }

    return (
        <div className="InformationArea">
            <h1>Register</h1>

            <input id="registerUsername" className="RegisterUsername" type="username" placeholder="Username" value={username} onChange={handleUsernameChange}/>
            <input id="registerEmail" className="RegisterEmail" type="email" placeholder="Email" value={email} onChange={handleEmailChange}/>
            <input id="registerPassword" className="RegisterPassword" type="password" placeholder="Password" value={password} onChange={handlePasswordChange}/>
            <input id="registerSubmit" className="RegisterSubmit" type="submit" value="Register" onClick={register}/>

            <p className="InfoText1">Already have an account? <a href="/login">Login</a></p>

            <ToastContainer/>
        </div>
    )
}

export default Register;