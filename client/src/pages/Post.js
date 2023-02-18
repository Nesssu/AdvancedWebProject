import { useState, useEffect } from "react";
import {BsArrowDownSquareFill, BsArrowUpSquareFill} from 'react-icons/bs';
import {BiEditAlt} from 'react-icons/bi';
import {RxCrossCircled, RxCheckCircled} from 'react-icons/rx';
import {Buffer} from 'buffer';
import { ToastContainer, toast } from "react-toastify";
import { useParams } from "react-router-dom";

const Post = (props) =>
{
    const {id} = useParams();
    const [voted, setVoted] = useState("");
    const [post, setPost] = useState({});
    const [user, setUser] = useState({});
    const [creator, setCreator] = useState({});
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [editablePost, setEditablePost] = useState(false);
    const [editableComment, setEditableComment] = useState(false);
    const [code, setCode] = useState("");
    const [codeHistory, setCodeHistory] = useState("");
    const [update, setUpdate] = useState(true);

    useEffect(() =>
    {   
        // Gets the post from the database
        fetch('/api/code/data/' + id)
        .then(response => response.json())
        .then(json =>
            {
                if (json.post) 
                {
                    setPost(json.post);
                    setCode(json.post.code);
                    setCodeHistory(json.post.code);

                    fetch("/api/user/" + json.post.creator)
                    .then(response => response.json())
                    .then(creator =>
                        {
                            if (creator.user)
                            {
                                setCreator(creator.user);
                            }
                        })
                }
            })
        
        // Gets all the comments that are made for this post and sets them to the state
        fetch('/api/code/comments/' + id, {
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
            fetch('/api/voted/' + id, {
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
    }, [props, voted, update]);

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
            id: id,
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
            id: id,
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
                post: id
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
                    
                    setUpdate(!update);
                }
            })
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
    const handlePostEditClick = () => { setEditablePost(true); }
    const handlePostEdit = (event) => setCode(event.target.value);
    // Function to handle the post editing
    const handlePostEditSave = () =>
    {
        const body = {
            _id: id,
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
        setEditablePost(false);
    }
    // Function that handles the cancelling of code editing
    const handlePostEditCancel = () =>
    {
        // Gets the original code from the state and updates it to the codes state
        setCode(codeHistory);
        setEditablePost(false);
    }

    const handleCommentEditClick = () => { setEditableComment(true); }

    const handleCommentEditSave = () =>
    {


        setEditableComment(false);
    }

    const handleCommentEditCancel = () =>
    {

        setEditableComment(false);
    }

    return (
        <div className="App">
            <div className="Post">
                <h1>Post</h1>
                <div className="Separator" />
                <div className="SnippetArea">
                    <div className="CodeBackground">
                        <div className="SnippetInputArea">
                            <textarea value={code} className="SnippetInput" readOnly={!editablePost} onChange={handlePostEdit} />
                            {/* If the currently logged in user is the same as the creator of this post, editing is allowed */}
                            {creator.username === user.username &&
                                <div className="EditButtonArea" >
                                    <BiEditAlt className="EditIcon" onClick={handlePostEditClick} style={editablePost && {opacity: 0, cursor: 'default'}} />
                                    <div className="ApproveEditArea">
                                        <RxCheckCircled className="SaveEditIcon" style={!editablePost && {opacity: 0, cursor: 'default'}} onClick={editablePost ? handlePostEditSave : undefined} />
                                        <RxCrossCircled className="CancelEditIcon" style={!editablePost && {opacity: 0, cursor: 'default'}} onClick={editablePost ? handlePostEditCancel : undefined} />
                                    </div>
                                </div>
                            }
                        </div>
                        <div className="SnippetInfoArea">
                            <div className="SnippetCreatorArea">
                                <p className="CreatorText"><span className="CreatorTextSpan">Publisher: </span><a href={"/profile/" + creator._id}>{creator.username}</a></p>
                                {
                                    post.createdAt === post.updatedAt ?
                                    <p className="CreatorText"><span className="CreatorTextSpan">Posted: </span>{formatTime(post.createdAt)}</p>
                                    :
                                    <p className="CreatorText"><span className="CreatorTextSpan">Updated: </span>{formatTime(post.updatedAt)}</p>
                                }
                            </div>
                            <div className="SnippetVoteArea">
                                <div className="VoteArrowArea">
                                    {/* If the user is logged in voting is allowed, otherwise onClicks are disabled */}
                                    <BsArrowUpSquareFill className={voted === "up" ? "VoteArrow IconVoted": "VoteArrow IconUnvoted"} onClick={props.token && handleUpvote}/>
                                    <BsArrowDownSquareFill className={voted === "down" ? "VoteArrow IconVoted": "VoteArrow IconUnvoted"} onClick={props.token && handleDownvote} />
                                </div>
                                <div className="VoteAmountArea">
                                    <p className="VotesText">{post.votes}</p>
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
                                                <textarea value={comment.comment} className="SnippetComment" readOnly={!editableComment} />
                                                <div className="EditButtonArea" >
                                                    <BiEditAlt className="EditIcon" onClick={handleCommentEditClick} style={editableComment && {opacity: 0, cursor: 'default'}} />
                                                    <div className="ApproveEditArea">
                                                        <RxCheckCircled className="SaveEditIcon" style={!editableComment && {opacity: 0, cursor: 'default'}} onClick={editableComment ? handleCommentEditSave : undefined}/>
                                                        <RxCrossCircled className="CancelEditIcon" style={!editableComment && {opacity: 0, cursor: 'default'}} onClick={editableComment ? handleCommentEditCancel : undefined}/>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="CommentInfoText" >{comment.creator}</p>
                                            <p className="CommentInfoText" >{formatTime(comment.createdAt)}</p>
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
            </div>
            <ToastContainer />
        </div>
    )
} 

export default Post;