import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_BASE_URL from "../apiConfig";

const Menu = ({cat, postId}) => {
    const [posts, setPosts] = useState([])

    useEffect(()=>{
        const fetchData = async ()=>{
            try {
                const res = await axios.get(API_BASE_URL + "/api/posts/?cat=" + cat);
                const filteredRes = res.data.filter(prev => prev.id !== postId)
                setPosts(filteredRes);
            } catch(err) {
                console.log(err);
            }
        };
        fetchData();
    },[cat])

    return (
        <div className="menu">
        {posts.length !== 0 ?
            posts.map(post=>(
                <>
                    <h1>Other posts you may like</h1>
                    <div className="post" key={post.id}>
                        {post.img ?<img src={post.img} alt="" /> :<img alt=""/>}
                        <h2>{post.title}</h2>
                        <Link to={`/rios-blog-client/post/${post.id}`}>
                            <button>Read More</button>
                        </Link>
                    </div>
                </>
            ))
        :
            <h1>No similar posts so far!</h1>
        }        
        </div>
    );
}
 
export default Menu;