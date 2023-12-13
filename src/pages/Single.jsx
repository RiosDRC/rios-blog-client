import Layout from "../hocs/layouts/Layout";
import Edit from "../img/edit.png"
import Delete from "../img/delete.png"
import Like from "../img/like.png"
import { Link, useNavigate, useParams } from "react-router-dom";
import Menu from "../components/Menu"
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import moment from "moment"
import { AuthContext } from "../context/authContext";
import DOMPurify from "dompurify"
import API_BASE_URL from "../apiConfig"
import { toast } from "react-toastify";

const Single = () => {
    const [post, setPost] = useState({});
    const postId = useParams().id;

    const { currentUser, setLoginView } = useContext(AuthContext);
    const navigate = useNavigate();

    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("");
    const [editIdComment, setEditIdComment] = useState("");
    const [editCommentText, setEditCommentText] = useState("");

    const [likes, setLikes] = useState(0);

    const fetchComments = async ()=>{
        try {
            const res = await axios.get(`${API_BASE_URL}/api/comments/${postId}`)
            setComments(res.data)
        } catch(err) {
            console.log(err)
        }
    }

    useEffect(()=>{
        const fetchData = async ()=>{
            try {
                const res = await axios.get(API_BASE_URL + "/api/posts/" + postId);
                setPost(res.data);
                const likesRes = await axios.get(`${API_BASE_URL}/api/posts/likes/${postId}/${currentUser ?currentUser.id : 0}`)
                setLikes(likesRes.data)
                console.log(likesRes.data)
                const response = await axios.get(`${API_BASE_URL}/api/comments/${postId}`)
                setComments(response.data)
            } catch(err) {
                console.log(err);
            }
        };
        fetchData();
    },[postId, currentUser])


    const handleDelete = async () =>{
        try {
            await axios.delete(`${API_BASE_URL}/api/posts/${postId}`,
            {
                headers: {
                    'Authorization': `${currentUser.token}`
                  }
            })
            navigate("/rios-blog-client/")
        } catch(err) {
            console.log(err)
        }
    }

    const handleCommenting = async () =>{
        try {
            const res = await axios.post(`${API_BASE_URL}/api/comments/${postId}`, {
                comment,
                date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
            },
            {
                headers: {
                    'Authorization': `${currentUser.token}`
                  }
            })
            console.log(res.data)
            setComment("")
            fetchComments()
        } catch(err) {
            console.log(err)
        }
    }

    const handleDeleteComment = async (commentId) =>{
        try {
            const res = await axios.delete(`${API_BASE_URL}/api/comments/${postId}/${commentId}`,
            {
                headers: {
                    'Authorization': `${currentUser.token}`
                  }
            })
            console.log(res.data)
            fetchComments()
        } catch(err) {
            console.log(err)
        }
    }

    const handleStartEditing = (comment) =>{
        if (!editIdComment) {
            setEditIdComment(comment.id)
            setEditCommentText(comment.comment)
        } else {
            setEditIdComment("")
        }
    }

    const handleSave = async ()=>{
        try{
            const res = await axios.put(`${API_BASE_URL}/api/comments/update/${editIdComment}`,{
                comment: editCommentText
            },
            {
                headers: {
                    'Authorization': `${currentUser.token}`
                  }
            })
            console.log(res.data)
            fetchComments()
            setEditIdComment("")
        } catch(err) {
            console.log(err)
        }
    }

    const handleLike = async ()=>{
        try {
            const res = await axios.put(`${API_BASE_URL}/api/posts/likes/${postId}`, {},
            {
                headers: {
                    'Authorization': `${currentUser.token}`
                  }
            })
            toast.success(res.data)
            const likesRes = await axios.get(`${API_BASE_URL}/api/posts/likes/${postId}/${currentUser.id}`)
            setLikes(likesRes.data)
        } catch(err) {
            console.log(err)
        }
    }

    return (
        <Layout>
            <div className="single">
                <div className="content">
                    {post.img ?<img src={post?.img} alt=""/>: <img alt=""/>}
                    <div className="user">
                        <div className="left">
                            {post.userImg &&<img src={post.userImg} alt="" />}
                            <div className="info">
                                <span>{post.username}</span>
                                <p>Posted {moment(post.date).fromNow()}</p>
                            </div>
                        </div>
                        <div className="right">
                            {currentUser?.username === post.username &&<div className="edit">
                                <Link to={`/rios-blog-client/write?edit=2`} state={post}>
                                    <img src={Edit} alt=""/>
                                </Link>
                                <img onClick={handleDelete} src={Delete} alt="" />
                            </div>}
                            <div className="likes">
                                {currentUser &&<img onClick={handleLike} src={Like} alt=""  style={{filter: `${!likes.liked ? 'invert(0.7)' : ''}`}}/>}
                                    <span>{likes.count} {likes.count === 1 ? 'person likes' : 'people like'} this post.</span>
                            </div>
                        </div>
                    </div>
                    <h1>{ post.title }</h1>
                    <p
                    dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(post.desc),
                    }}
                    ></p>
                    <div className="commentsSection">
                        <h2>Comments</h2>
                        {comments.length > 0 ?
                        comments.map(comment=>(
                            <div className="singleComment" key={comment.id}>
                                <div className="userOptions">
                                    <span>{comment.username}</span>
                                    {comment.username === currentUser?.username &&<div className="options">
                                        <img src={Edit} alt="" onClick={()=>{handleStartEditing(comment)}}/>
                                        <img onClick={()=>{handleDeleteComment(comment.id)}} src={Delete} alt="" />  
                                    </div>}
                                </div>
                                <div className="text">
                                    {editIdComment !== comment.id
                                    ? <>
                                        <p>{comment.comment}</p>
                                        <span>{moment(comment.date).fromNow()}</span>
                                        </>
                                    : <div className="textEditing">
                                        <textarea
                                        rows="3"
                                        value={editCommentText}
                                        onChange={e=>{setEditCommentText(e.target.value)}}
                                        ></textarea>
                                        <button onClick={handleSave}>Save</button>
                                    </div>
                                    }
                                </div>
                            </div>
                        ))
                        : <h3>No comments so far</h3>}
                        <div className="addComment">
                            <input type="text" value={comment} onChange={e=>(setComment(e.target.value))} />
                            {currentUser
                                ?<button onClick={handleCommenting}>Post</button>
                                :<button onClick={()=>setLoginView(true)}>Login</button>
                            }
                        </div>
                    </div>
                </div>
                {post.cat && <Menu cat={post.cat}/>}
            </div>
        </Layout>
    );
}
 
export default Single;