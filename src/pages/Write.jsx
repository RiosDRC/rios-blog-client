import { useContext, useState } from "react";
import Layout from "../hocs/layouts/Layout";
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { AuthContext } from "../context/authContext";
import API_BASE_URL from "../apiConfig";
import { toast } from "react-toastify";

axios.defaults.withCredentials = true;


const Write = () => {
    const state = useLocation().state
    const [ loading, setLoading ] = useState("")
    const { currentUser, setLoginView } = useContext(AuthContext)

    const navigate = useNavigate()

    const [value, setValue] = useState(state?.desc || "");
    const [title, setTitle] = useState(state?.title || "");
    const [file, setFile] = useState(null);
    const [cat, setCat] = useState(state?.cat || "");
    
    const upload = async ()=>{
        try {
            const formData = new FormData();
            formData.append("file", file)
            const res = await axios.post(API_BASE_URL + "/api/upload", formData)
            return res.data.sharedLink
        } catch(err){
            console.log(err)
        }
    }

    const handleSubmit = async (action) =>{
        setLoading("Uploading...")
        const imgUrl = file ? await upload() : state?.img || "";

        setLoading("")

        try {
            state ? await axios.put(API_BASE_URL + "/api/posts/" + state.id, {
                title,
                desc: value,
                img: imgUrl,
                cat,
                status: action
            },
            {
                headers: {
                    'Authorization': `${currentUser.token}`
                  }
            })
            : await axios.post(API_BASE_URL + "/api/posts/", {
                title,
                desc:value,
                img:file ? imgUrl : "",
                cat,
                date: moment().format("YYYY-MM-DD HH:mm:ss"),
                status: action
            },
            {
                headers: {
                    'Authorization': `${currentUser.token}`
                  }
            })
            toast.success('Blog added successfully!')
            navigate("/rios-blog-client/")
        } catch(err) {
            console.log(err)
        }
    }

    return (
        <Layout>
            <div className="add">
                <div className="content">
                    <input type="text" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)}/>
                    <div className="editorContainer">
                        <ReactQuill className="editor" theme="snow" value={value} onChange={setValue} />
                    </div>
                    <div className="remaining">
                        <p style={value.length > 1000 ? {color: "red"} : null} >Remaining characters: {1000 - value.length}</p>
                    </div>
                </div>
                <div className="menu">
                    <div className="item">
                        <h1>Publish <span>{loading}</span></h1>
                        {currentUser &&<Link to="/rios-blog-client/drafts" className="draftsLink">Drafts</Link>}
                        <span>
                            <b>Status: </b> {state? <p>{state.status}</p>: "Draft"}
                        </span>
                        <span>
                            <b>Visibility: </b> Public
                        </span>
                        {file && (
                            <div className="imgUpload">
                                <img src={URL.createObjectURL(file)} alt="" />
                                <p onClick={() => setFile(null)}>Clear</p>
                            </div>
                        )}
                        <input style={{display: "none"}} type="file" id="file" onChange={e=>setFile(e.target.files[0])}/>
                        <label className="file" htmlFor="file">Upload image</label>
                        {currentUser ?
                        <div className="buttons">
                            <button disabled={!title || !value} onClick={()=>handleSubmit("draft")}>Save as a draft</button>
                            <button
                            disabled={!title || !value}
                            onClick={()=>handleSubmit("published")}>
                                {state?.status === "published"?"Update": "Publish"}
                            </button>
                        </div>
                        : <div className="buttons">
                            <button onClick={()=>setLoginView(true)}>Login</button>
                        </div>
                        }
                    </div>
                    <div className="item">
                        <h1>Category</h1>
                        <div className="cat">
                            <input type="radio" checked={cat === "art"} name="cat" value="art" id="art" onChange={e=>setCat(e.target.value)}/>
                            <label htmlFor="art">Art</label>
                        </div>
                        <div className="cat">
                            <input type="radio" checked={cat === "science"} name="cat" value="science" id="science" onChange={e=>setCat(e.target.value)}/>
                            <label htmlFor="science">Science</label>
                        </div>
                        <div className="cat">
                            <input type="radio" checked={cat === "technology"} name="cat" value="technology" id="technology" onChange={e=>setCat(e.target.value)}/>
                            <label htmlFor="technology">Technology</label>
                        </div>
                        <div className="cat">
                            <input type="radio" checked={cat === "cinema"} name="cat" value="cinema" id="cinema" onChange={e=>setCat(e.target.value)}/>
                            <label htmlFor="cinema">Cinema</label>
                        </div>
                        <div className="cat">
                            <input type="radio" checked={cat === "design"} name="cat" value="design" id="design" onChange={e=>setCat(e.target.value)}/>
                            <label htmlFor="design">Design</label>
                        </div>
                        <div className="cat">
                            <input type="radio" checked={cat === "food"} name="cat" value="food" id="food" onChange={e=>setCat(e.target.value)}/>
                            <label htmlFor="food">Food</label>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
 
export default Write;