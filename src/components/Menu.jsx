import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_BASE_URL from "../apiConfig";

const Menu = ({cat}) => {
    const [posts, setPosts] = useState([])

    useEffect(()=>{
        const fetchData = async ()=>{
            try {
                const res = await axios.get(API_BASE_URL + "/api/posts/?cat=" + cat);
                setPosts(res.data);
            } catch(err) {
                console.log(err);
            }
        };
        fetchData();
    },[cat])

    return (
        <div className="menu">
            <h1>Other posts you may like</h1>
        {posts && posts.map(post=>(
            <div className="post" key={post.id}>
                {post.img ?<img src={post.img} alt="" /> :<img alt=""/>}
                <h2>{post.title}</h2>
                <Link to={`/rios-blog-client/post/${post.id}`}>
                    <button>Read More</button>
                </Link>
            </div>
        ))}
        </div>
    );
}
 
export default Menu;