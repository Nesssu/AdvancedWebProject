import { useState, useEffect } from "react";
import {BsArrowDownSquareFill, BsArrowUpSquareFill} from 'react-icons/bs';
import {BiEditAlt} from 'react-icons/bi';
import {RxCrossCircled, RxCheckCircled} from 'react-icons/rx';
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
    const [time, setTime] = useState("");
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [editable, setEditable] = useState(false);
    const [code, setCode] = useState(props.snippet.code);
    const [codeHistory, setCodeHistory] = useState(props.snippet.code);

    useEffect(() =>
    {
        setTime(formatTime(props.snippet.createdAt));
        
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
        
        // Gets all the comments that are made for this post and sets them to the state
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
    }, [props.snippet.creator, props.snippet.createdAt, editable]);

    // This funtions handles the upvote
    const handleUpvote = () =>
    {
        // Check what the protocol should be
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

        // Creates the body for the request
        let body = {
            username: user.username,
            id: props.snippet._id,
            vote: "up"
        };

        // Sends the body to the server
        fetch('/api/vote/' + protocol, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer " + props.token
            },
            body: JSON.stringify(body)
        })
        .then(props.updateTheView);
    }

    // This functions handles the downvotes
    const handleDownvote = () => 
    {
        // Checks what the protocol should be
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

        // Creates the body for the request
        let body = {
            username: user.username,
            id: props.snippet._id,
            vote: "down"
        };

        // Sends the data to the server
        fetch('/api/vote/' + protocol, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer " + props.token
            },
            body: JSON.stringify(body)
        })
        .then(props.updateTheView);
    }
    const handleCommentChange = (event) => setNewComment(event.target.value);

    // Function that handles adding new comments
    const handleComment = () => 
    {
        // Comment can only be posted if it's not empty
        if (newComment !== "")
        {
            const body = {
                comment: newComment,
                creator: user.username,
                post: props.snippet._id
            };

            // Sends the data to the server
            fetch('/api/comment', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": "Bearer " + props.token
                },
                body: JSON.stringify(body)
            })
            .then(response => response.json())
            .then(json => {
                // If the server responds with a success, a succesful message is shown in a toast message
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
        // If the input is empty, message is shown in a toast message
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
    // Function to format the MongoDB 'createdAt' time to a better format
    const formatTime = (time) => 
    {
        const splittedTime = time.split("T");
        const date = splittedTime[0];
        let hour = splittedTime[1];
        hour = hour.split(":");
        hour = hour[0] + ":" + hour[1];
        return (date + " " + hour);
    }
    const handleEditClick = () => 
    {
        setEditable(true);
    }
    const handleEdit = (event) => setCode(event.target.value);
    // Function to handle the post editing
    const handleEditSave = () =>
    {
        const body = {
            _id: props.snippet._id,
            code: code
        }
        // Sends the new code to the server
        fetch('/api/update/code', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer " + props.token
            },
            body: JSON.stringify(body)
        })
        .then(response => response.json())
        .then(json => {
            // If server responds with a success, succesful message is shown in a toast message
            if (json.success)
            {
                toast.success(json.message, {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    });
                
                setCodeHistory(code);
            }
            // If the update is not succesful, the error message is shown in a toast message
            else
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
        });
        setEditable(false);
        props.updateTheView();
    }
    // Function that handles the cancelling of code editing
    const handleEditCancel = () =>
    {
        // Gets the original code from the state and updates it to the codes state
        setCode(codeHistory);
        setEditable(false);
        props.updateTheView();
    }

    return (
        <div className="SnippetArea">
            <div className="SnippetBackground">
                <div className="SnippetInputArea">
                    <textarea value={code} className="SnippetInput" readOnly={!editable} onChange={handleEdit} />
                    {/* If the currently logged in user is the same as the creator of this post, editing is allowed */}
                    {creatorUsername === user.username &&
                        <div className="EditButtonArea" >
                            <BiEditAlt className="EditIcon" onClick={handleEditClick} style={editable && {opacity: 0, cursor: 'default'}} />
                            <div className="ApproveEditArea">
                                <RxCheckCircled className="SaveEditIcon" style={!editable && {opacity: 0, cursor: 'default'}} onClick={editable ? handleEditSave : undefined} />
                                <RxCrossCircled className="CancelEditIcon" style={!editable && {opacity: 0, cursor: 'default'}} onClick={editable ? handleEditCancel : undefined} />
                            </div>
                        </div>
                    }
                </div>
                <div className="SnippetInfoArea">
                    <div className="SnippetCreatorArea">
                        <p className="CreatorText"><span className="CreatorTextSpan">Publisher:</span> {creatorUsername}</p>
                        <p className="CreatorText"><span className="CreatorTextSpan">Posted:</span> {time}</p>
                    </div>
                    <div className="SnippetVoteArea">
                        <div className="VoteArrowArea">
                            {/* If the user is logged in voting is allowed, otherwise onClicks are disabled */}
                            <BsArrowUpSquareFill className={voted === "up" ? "VoteArrow IconVoted": "VoteArrow IconUnvoted"} onClick={props.token && handleUpvote}/>
                            <BsArrowDownSquareFill className={voted === "down" ? "VoteArrow IconVoted": "VoteArrow IconUnvoted"} onClick={props.token && handleDownvote} />
                        </div>
                        <div className="VoteAmountArea">
                            <p className="VotesText">{props.snippet.votes}</p>
                        </div>
                    </div>
                </div>
                <div>
                    {/* Map all the comments made for this post */}
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
                {/* If the user is logged in, ability to comment the post is available */}
                {props.token &&
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
        })

    }, [update]);

    const updateTheView = () => { setUpdate(!update); } 

    return (
        <div className="App">
            <div className="Home">
                <h1>Home</h1>
                <div className="Separator"/>
                {/* If the localStorage has a token, the NewSnippet component is shown, which allows the user to post new code snippets */}
                {jwt &&
                    <NewSnippet token={jwt} user={props.user} />
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