import DOMPurify from "dompurify";
import Layout from "../hocs/layouts/Layout";
import moment from "moment";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../apiConfig";
import { AuthContext } from "../context/authContext";

const Draft = () => {
    const [drafts, setDrafts] = useState([])

    const { currentUser } = useContext(AuthContext)

    useEffect(() => {
        const fetchData = async ()=>{
            try {
                const res = await axios.get(API_BASE_URL + "/api/posts/drafts",
                {
                    headers: {
                        'Authorization': `${currentUser.token}`
                      }
                })
                setDrafts(res.data)
            } catch (err) {
                console.log(err)
            }
        }

        fetchData()
    },[])

    const handleDelete = async (postId) =>{
        try {
            await axios.delete(`${API_BASE_URL}/api/posts/${postId}`,
            {
                headers: {
                    'Authorization': `${currentUser.token}`
                  }
            })
            const res = await axios.get(API_BASE_URL + "/api/posts/drafts",
            {
                headers: {
                    'Authorization': `${currentUser.token}`
                  }
            })
            setDrafts(res.data)
        } catch(err) {
            console.log(err)
        }
    }

    return (
        <Layout>
            <div className="drafts">
                <h1>Drafts</h1>
                {drafts.length > 0 ? drafts.map(draft=>(
                    <div className="item" key={draft.id}>
                        <h3>{draft.title}</h3>
                        {draft.img ?<img src={draft?.img} alt=""/>: <img alt=""/>}
                        <p
                        dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(draft.desc),
                        }}
                        ></p>
                        <span>Saved {moment(draft.date).fromNow()}</span>
                        <div className="actions">
                            <Link to={`/rios-blog-client/write?edit=2`} state={draft}>
                                <button id="button1">Continue editing</button>
                            </Link>
                            <Link>
                                <button onClick={()=>handleDelete(draft.id)}>Delete</button>
                            </Link>
                        </div>
                    </div>
                    ))
                    : <h2>No drafts</h2>
                }   
            </div>
        </Layout>
    );
}
 
export default Draft;