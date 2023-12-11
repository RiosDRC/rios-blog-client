import { Link, useLocation } from "react-router-dom";
import Layout from "../hocs/layouts/Layout"
import { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../apiConfig";

axios.defaults.withCredentials = true;

const Home = () => {
    const [posts,setPosts] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const cat = useLocation().search

    useEffect(()=>{
        const fetchData = async ()=>{
            try {
                const res = await axios.get(API_BASE_URL + "/api/posts/?cat=" + cat);
                setIsLoading(false)
                setPosts(res.data);
            } catch(err) {
                console.log(err);
            }
        };
        fetchData();
    },[cat])

    const getText = (html) =>{
        const doc = new DOMParser().parseFromString(html, "text/html")
        return doc.body.textContent
    }

    return (
        <Layout>
            <div className="home">
                {isLoading && (
                    <div style={{width: '100%', textAlign: 'center'}}>
                        Loading...
                    </div>
                )}
                <div className="posts">
                    {posts.map(post=>(
                        <div className="post" key={post.id}>
                            <div className="img">
                                <img src={post.img} alt=""/>
                            </div>
                            <div className="content">
                                <Link className="link" to={`/rios-blog-client/post/${post.id}`}>
                                    <h1>{post.title}</h1>
                                </Link>
                                <p>{getText(post.desc.substr(0, 355))}{post.desc.length > 355? "...":null}</p>
                                <Link to={`/rios-blog-client/post/${post.id}`}>
                                    <button>Read more</button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}
 
export default Home;