import { useState, useEffect } from "react";
import {BsArrowDownSquareFill, BsArrowUpSquareFill} from 'react-icons/bs';
import {BiEditAlt} from 'react-icons/bi';
import {Buffer} from 'buffer';
import { ToastContainer, toast } from "react-toastify";

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
    const [user, setUser] = useState();
    const [time, setTime] = useState("");
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [editable, setEditable] = useState(false);

    useEffect(() =>
    {
        setTime(formatTime(props.snippet.createdAt));

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
        
        fetch('/api/code/comments/' + props.snippet._id, {
            method: "GET"
        })
        .then(response => response.json())
        .then(comments => {
            if (comments.comments)
            {
                setComments(comments.comments);
            }
        })
        
        if (props.jwt)
        {
            const user = JSON.parse(Buffer.from(props.jwt.split(".")[1], "base64").toString());
            setUser(user);
            fetch('/api/voted/' + user.email + "/" + props.snippet._id, {
                method: "GET"
            })
            .then(response => response.json())
            .then(res => {
                setVoted(res.vote);
            });
        }
    }, [props.snippet.creator, props.snippet.createdAt]);

    const handleUpvote = () =>
    {
        let protocol = "add";
        if (voted === "")
        {
            setVoted("up");
        }
        else if (voted === "down")
        {
            setVoted("up");
            protocol = "update";
        }
        else if (voted == "up")
        {
            setVoted("");
            protocol = "remove";
        }

        let body = {
            username: user.username,
            id: props.snippet._id,
            vote: "up"
        };

        fetch('/api/vote/' + protocol, {
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
        let protocol = "add";
        if (voted === "")
        {
            setVoted("down");
        }
        else if (voted === "up")
        {
            setVoted("down");
            protocol = "update";
        }
        else if (voted == "down")
        {
            setVoted("");
            protocol = "remove";
        }

        let body = {
            username: user.username,
            id: props.snippet._id,
            vote: "down"
        };

        fetch('/api/vote/' + protocol, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
        .then(props.updateTheView);
    }
    const handleCommentChange = (event) => setNewComment(event.target.value);
    const handleComment = () => 
    {
        if (newComment !== "")
        {
            const body = {
                comment: newComment,
                creator: user.username,
                post: props.snippet._id
            };

            fetch('/api/comment', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            })
            .then(response => response.json())
            .then(json => {
                if (json.success)
                {
                    setNewComment("");
                    toast.success('Comment posted!', {
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
            props.updateTheView();
        }
        else 
        {
            toast.error("Comment can't be empty", {
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
    const formatTime = (time) => 
    {
        const splittedTime = time.split("T");
        const date = splittedTime[0];
        let hour = splittedTime[1];
        hour = hour.split(":");
        hour = hour[0] + ":" + hour[1];
        return (date + " " + hour);
    }
    const handleEdit = () => 
    {
        setEditable(!editable);
    }

    return (
        <div className="SnippetArea">
            <div className="SnippetBackground">
                <div className="SnippetInputArea">
                    <textarea value={props.snippet.code} className="SnippetInput" readOnly={true} />
                    <div className="EditButtonArea" >
                        <BiEditAlt className="EditIcon" />
                    </div>
                </div>
                <div className="SnippetInfoArea">
                    <div className="SnippetCreatorArea">
                        <p className="CreatorText"><span className="CreatorTextSpan">Publisher:</span> {creatorUsername}</p>
                        <p className="CreatorText"><span className="CreatorTextSpan">Posted:</span> {time}</p>
                    </div>
                    <div className="SnippetVoteArea">
                        <div className="VoteArrowArea">
                            <BsArrowUpSquareFill className={voted === "up" ? "VoteArrow IconVoted": "VoteArrow IconUnvoted"} onClick={props.jwt && handleUpvote}/>
                            <BsArrowDownSquareFill className={voted === "down" ? "VoteArrow IconVoted": "VoteArrow IconUnvoted"} onClick={props.jwt && handleDownvote} />
                        </div>
                        <div className="VoteAmountArea">
                            <p className="VotesText">{props.snippet.votes}</p>
                        </div>
                    </div>
                </div>
                <div>
                    {
                        comments.map((comment, i) => 
                            {
                                return (<div key={i} className="CommentArea">
                                    <div className="CommentBackground">
                                        <p className="CommentText">{comment.comment}</p>
                                        <div className="CommentInfo">
                                            <p className="CommentInfoText" >{comment.creator}</p>
                                            <p className="CommentInfoText" >{formatTime(comment.createdAt)}</p>
                                        </div>
                                    </div>
                                </div>)
                            })
                    }
                </div>
                {props.jwt &&
                    <div className="NewCommentArea">
                        <textarea className="CommentInput" id="commentInput" value={newComment} onChange={handleCommentChange} placeholder="Comment" />
                        <input id="commentSubmit" className="CommentSubmit" type="submit" value="Comment" onClick={handleComment} />
                    </div>
                }
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

    }, [update]);

    const updateTheView = () => { setUpdate(!update); } 

    return (
        <div className="App">
            <div className="Home">
                <h1>Home</h1>
                <div className="Separator"/>
                {jwt &&
                    <NewSnippet token={jwt} user={props.user} />
                }
                <div>
                    {codeSnippets.map((item) => 
                        {
                            return <Snippet key={item._id} snippet={item} voted={true} updateTheView={updateTheView} user={props.user} jwt={jwt} />
                        })}
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Home;