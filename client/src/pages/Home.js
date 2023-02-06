import { useState, useEffect } from "react";
import {AiFillLike} from 'react-icons/ai';
import {BsArrowDownSquareFill, BsArrowUpSquareFill} from 'react-icons/bs';
import {Buffer} from 'buffer';
import { ToastContainer, toast } from "react-toastify";

const NewSnippet = (props) =>
{
    const [snippet, setSnippet] = useState("");
    const [height, setHeight] = useState(1);

    const handleSnippetChange = (event) =>
    { 
        setSnippet(event.target.value); 
        const textareaLineHeight = 24;
		const previousRows = event.target.rows;
  	    event.target.rows = 5;
		const currentRows = ~~(event.target.scrollHeight / textareaLineHeight);
        if (currentRows === previousRows) {
    	    event.target.rows = currentRows;
        }
		if (currentRows >= 30) {
			event.target.rows = 30;
			event.target.scrollTop = event.target.scrollHeight;
		}
  	    setHeight(currentRows < 30 ? currentRows : 30);
    }
    const addSnippet = () =>
    {
        if (snippet !== "")
        {
            const user = JSON.parse(Buffer.from(props.token.split(".")[1], "base64").toString());
            const body = {
                code: snippet,
                email: user.email,
            };

            fetch('/api/code/add', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            })
            .then(response => response.json())
            .then(json => 
                {
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
    }

    return (
        <div className="NewSnippetArea">
            <div className="NewSnippetBackground">
                <div className="NewSnippetInputArea">
                    <textarea value={snippet} onChange={handleSnippetChange} className="NewSnippetInput" placeholder="Add new code snippet" rows={height} />
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
    const [username, setUsername] = useState("");
    const [time, setTime] = useState("");

    useEffect(() =>
    {
        const splittedTime = props.snippet.createdAt.split("T");
        const date = splittedTime[0];
        let hour = splittedTime[1];
        hour = hour.split(":");
        hour = hour[0] + ":" + hour[1];
        setTime(date + " " + hour);

        fetch('/api/user/' + props.snippet.creator, {
        })
        .then(response => response.json())
        .then(json =>
            {
                if (json.user) 
                {
                    setUsername(json.user.username);
                }
            })
    }, []);

    const handleUpvote = () =>
    {
        let body = {
            username,
            id: props.snippet._id,
            newVote: true,
            removeVote: false,
            vote: "up"
        };
        if (voted === "")
        {
            setVoted("up");
        }
        else if (voted === "down")
        {
            body.newVote = false;
            setVoted("up");
        }
        else 
        {
            body.newVote = false;
            body.removeVote = true;
            body.vote = "";
            setVoted("");
        }

        fetch('/api/vote/update', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
        .then(props.updateTheView);
    }

    const handleDownvote = () => 
    {
        let body = {
            username,
            id: props.snippet._id,
            newVote: true,
            removeVote: false,
            vote: "down"
        };
        if (voted === "")
        {
            setVoted("down");
        }
        else if (voted === "down")
        {
            body.newVote = false;
            body.removeVote = true;
            body.vote = "";
            setVoted("");
        }
        else 
        {
            body.newVote = false;
            setVoted("down");
        }

        fetch('/api/vote/update', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
        .then(props.updateTheView);
    }

    return (
        <div className="SnippetArea">
            <div className="SnippetBackground">
                <div className="SnippetInputAre">
                    <textarea value={props.snippet.code} className="SnippetInput" readOnly={true}  />
                </div>
                <div className="SnippetInfoArea">
                    <div className="SnippetCreatorArea">
                        <p className="CreatorText"><span className="CreatorTextSpan">Publisher:</span> {username}</p>
                        <p className="CreatorText"><span className="CreatorTextSpan">Posted:</span> {time}</p>
                    </div>
                    <div className="SnippetVoteArea">
                        <div className="VoteArrowArea">
                            <BsArrowUpSquareFill className={voted === "up" ? "VoteArrow IconVoted": "VoteArrow IconUnvoted"} onClick={handleUpvote}/>
                            <BsArrowDownSquareFill className={voted === "down" ? "VoteArrow IconVoted": "VoteArrow IconUnvoted"} onClick={handleDownvote} />
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

        fetch('/api/code/list', {
            method: "GET"
        })
        .then(response => response.json())
        .then(json => {
            if (json.message)
            {
                console.log(json.message)
            }
            else
            {
                setCodeSnippets(json.posts);
            }
        })

    }, []);

    useEffect(() => {
        console.log("Updated");
    }, [update]);

    const updateTheView = () => { setUpdate(!update); } 

    return (
        <div className="App">
            <div className="Home">
                {jwt &&
                    <NewSnippet token={jwt} />
                }
                <div>
                    {codeSnippets.map((item) => 
                        {
                            return <Snippet key={item._id} snippet={item} voted={true} updateTheView={updateTheView}/>
                        })}
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Home;