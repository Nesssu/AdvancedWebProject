import { useState, useEffect } from "react";
import {BsArrowDownSquareFill, BsArrowUpSquareFill} from 'react-icons/bs';
import {Buffer} from 'buffer';
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const NewSnippet = (props) =>
{
    const [snippet, setSnippet] = useState("");

    const handleSnippetChange = (event) =>
    { 
        setSnippet(event.target.value); 
    }
    const addSnippet = () =>
    {
        if (snippet !== "")
        {
            const body = {
                code: snippet,
                email: props.user.email,
            };
            // Sends the new code to the server
            fetch('/api/code/add', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": "Bearer " + props.token
                },
                body: JSON.stringify(body)
            })
            .then(response => response.json())
            .then(json => 
                {
                    // If the server responds with a message, the code wasn't posted to the server and the error is shwon in a toast message
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
                    // If the code is posted succesfully, the success message is shown in a toast message
                    else
                    {
                        setSnippet("");
                        toast.success('Code posted!', {
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
                })
        }
        // If the textarea is empty, the code cannot be posted and the error message is shown in a toast message
        else
        {
            toast.error('Cannot post empty code snippets', {
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
        props.updateTheView();
    }

    return (
        <div className="NewSnippetArea">
            <div className="NewSnippetBackground">
                <div className="NewSnippetInputArea">
                    <textarea value={snippet} onChange={handleSnippetChange} className="NewSnippetInput" placeholder="Add new code snippet" />
                </div>
                <div>
                    <input type="submit" value="Add" onClick={addSnippet} className="NewSnippetSubmitButton"/>
                </div>
            </div>
            <div className="Separator"/>
        </div>
    )
}

const Snippet = (props) =>
{
    const [voted, setVoted] = useState("");
    const [creatorUsername, setCreatorUsername] = useState("");
    const [user, setUser] = useState({});
    const navigate = useNavigate();

    useEffect(() =>
    {   
        // Gets the information about the creator of the snippets creator and sets their username to the state
        fetch('/api/user/' + props.snippet.creator, {
        })
        .then(response => response.json())
        .then(json =>
            {
                if (json.user) 
                {
                    setCreatorUsername(json.user.username);
                }
            })
        
        if (props.token)
        {
            const user = JSON.parse(Buffer.from(props.token.split(".")[1], "base64").toString());
            setUser(user);

            // Gets the current user vote on this post and sets it to the state
            fetch('/api/voted/' + props.snippet._id, {
                method: "GET",
                headers: {
                    "authorization": "Bearer " + props.token
                }
            })
            .then(response => response.json())
            .then(res => {
                setVoted(res.vote);
            });
        }
    }, [props]);

    // Function to format the MongoDB 'createdAt' time to a better format
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

    const handlePostClick = () =>
    {
        navigate("/post/" + props.snippet._id);
    }
    return (
        <div className="SnippetArea">
            <div className="SnippetBackground"  onClick={handlePostClick}>
                <div className="SnippetInputArea">
                    <textarea value={props.snippet.code} className="SnippetInput SnippetInputHome" readOnly={true} />
                </div>
                <div className="SnippetInfoArea">
                    <div className="SnippetCreatorArea">
                        <p className="CreatorText"><span className="CreatorTextSpan">Publisher: </span>{creatorUsername}</p>
                        {
                            props.snippet.createdAt === props.snippet.updatedAt ?
                            <p className="CreatorText"><span className="CreatorTextSpan">Posted: </span>{formatTime(props.snippet.createdAt)}</p>
                            :
                            <p className="CreatorText"><span className="CreatorTextSpan">Updated: </span>{formatTime(props.snippet.updatedAt)}</p>
                        }
                    </div>
                    <div className="SnippetVoteArea">
                        <div className="VoteArrowArea">
                            {/* If the user is logged in voting is allowed, otherwise onClicks are disabled */}
                            <BsArrowUpSquareFill className={voted === "up" ? "VoteArrow IconVoted": "VoteArrow IconUnvoted"}/>
                            <BsArrowDownSquareFill className={voted === "down" ? "VoteArrow IconVoted": "VoteArrow IconUnvoted"} />
                        </div>
                        <div className="VoteAmountArea">
                            <p className="VotesText">{props.snippet.votes}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const Home = (props) =>
{
    const [jwt, setJwt] = useState(null);
    const [codeSnippets, setCodeSnippets] = useState([]);
    const [update, setUpdate] = useState(true);

    useEffect(() =>
    {
        const token = localStorage.getItem('auth_token');
        if (token)
        {
            setJwt(token);
        }
        // Getting all the posted code snippets from the database
        fetch('/api/code/list', {
            method: "GET"
        })
        .then(response => response.json())
        .then(json => {
            // If the server doesn't respond with a message, errors didn't happen
            if (!json.message)
            {
                setCodeSnippets(json.posts);
            }
        });
    }, [update]);

    const updateTheView = () => { setUpdate(!update); } 

    return (
        <div className="App">
            <div className="Home">
                <h1>Home</h1>
                <div className="Separator"/>
                {/* If the localStorage has a token, the NewSnippet component is shown, which allows the user to post new code snippets */}
                {jwt &&
                    <NewSnippet token={jwt} user={props.user} updateTheView={updateTheView} />
                }
                <div>
                    {/* Maps all the code snippets that are already posted */}
                    {codeSnippets.map((item) => 
                        {
                            return <Snippet key={item._id} snippet={item} voted={true} updateTheView={updateTheView} user={props.user} token={jwt} />
                        })}
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Home;