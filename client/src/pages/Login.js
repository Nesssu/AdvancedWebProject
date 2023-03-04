import { useEffect, useState } from "react"; 
import { useNavigate } from "react-router-dom";
import {ToastContainer, toast} from 'react-toastify';
import {Buffer} from 'buffer';
import 'react-toastify/dist/ReactToastify.css';

const Login = (props) =>
{
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Functions that handle the state changes for the inputs
    const handleEmailChange = (event) => { setEmail(event.target.value); }
    const handlePasswordChange = (event) => { setPassword(event.target.value); }
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        // If the localStorage has a token, the user is already logged in and is redirected to the home page
        if (token)
        {
            navigate('/');
        }
    }, []);

    const login = () =>
    {
        // Sends the data to the server
        fetch("/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email, password})
        })
        .then(response => response.json())
        .then(json =>
            {
                // If the server responds with a token, the login info is valid
                if (json.token)
                {
                    props.setJwt(json.token);
                    const user = JSON.parse(Buffer.from(json.token.split(".")[1], "base64").toString());
                    props.setUser(user);
                    // The token is stored into localStorage
                    localStorage.setItem('auth_token', json.token);
                    // And the user is redirected to the home page
                    navigate("/");
                }
                // If the login info is invalid the error message is shown inside a toast message
                else {
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
                    
                    setPassword("");
                }
            })
    }

    return (
        <div className="InformationArea">
            <h1>Login</h1>

            <input id="loginEmail" className="LoginEmail" type="email" placeholder="Email" value={email} onChange={handleEmailChange}/>
            <input id="loginPassword" className="LoginPassword" type="password" placeholder="Password" value={password} onChange={handlePasswordChange}/>
            <input id="loginSubmit" className="LoginSubmit" type="submit" value="Login" onClick={login}/>

            <p className="InfoText1">Don't have an account yet? <a href="/register">Register</a></p>

            <ToastContainer/>
        </div>
    )
}

export default Login;