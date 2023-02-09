import { useEffect, useState } from "react"; 
import { useNavigate } from "react-router-dom";
import {ToastContainer, toast} from 'react-toastify';
import {Buffer} from 'buffer';
import 'react-toastify/dist/ReactToastify.css';

const Login = (props) =>
{
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleEmailChange = (event) => { setEmail(event.target.value); }
    const handlePasswordChange = (event) => { setPassword(event.target.value); }
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (token)
        {
            navigate('/home');
        }
    }, []);

    const login = () =>
    {
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
                if (json.token)
                {
                    props.setJwt(json.token);
                    const user = JSON.parse(Buffer.from(json.token.split(".")[1], "base64").toString());
                    props.setUser(user);
                    localStorage.setItem('auth_token', json.token);
                    navigate("/home");
                }
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