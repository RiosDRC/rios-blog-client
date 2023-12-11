import { useContext, useEffect, useState } from "react";
import Layout from "../hocs/layouts/Layout";
import { AuthContext } from "../context/authContext";
import { Link } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../apiConfig";


const User = () => {
    const { currentUser, setCurrentUser } = useContext(AuthContext);
    const [userImg, setUserImg] = useState("");
    const [message, setMessage] = useState(null);

    const [inputs, setInputs] = useState({
        username: currentUser?.username,
        email: currentUser?.email,
        old_password: "",
        new_password: "",
        conf_password: ""
    })

    const [file, setFile] = useState(null);

    const upload = async ()=>{
        try {
            const formData = new FormData();
            formData.append("file", file)
            setMessage('Uploading File...')
            const res = await axios.post(API_BASE_URL + "/api/upload", formData)
            setMessage('File uploaded')
            return res.data.sharedLink
        } catch(err){
            console.log(err)
        }
    }

    const handleChange = e=>{
        setInputs(prev=>({...prev, [e.target.name]: e.target.value}))
    }
    
    useEffect(()=>{
        const fetchData = async () =>{
            try {
                const res = await axios(`${API_BASE_URL}/api/users/userImg/${currentUser.id}`)
                setUserImg(res.data.img)
            } catch(err) {
                console.log(err)
            };
        };
        fetchData();
    },[currentUser.img])

    const handleSubmit = async e =>{
        e.preventDefault()
        if (inputs.old_password !== "") {
            const imgUrl = file? await upload() : userImg;
            try {            
                const res = await axios.put(API_BASE_URL + "/api/users/updateInfo",{
                    username: inputs.username,
                    email: inputs.email,
                    old_password: inputs.old_password,
                    new_password: inputs.new_password === ""? inputs.old_password : inputs.new_password,
                    conf_password: inputs.conf_password,
                    img: imgUrl
                },
                {
                    headers: {
                        'Authorization': `${currentUser.token}`
                      }
                })
                setCurrentUser({
                    email: inputs.email,
                    username: inputs.username,
                    img: imgUrl,
                    token: currentUser.token,
                    id: currentUser.id
                })
                setUserImg(imgUrl)
                setMessage(res.data)
            } catch(err) {
                console.log(err)
                setMessage(err.response.data)
            }
        } else {
            setMessage("Current password required!")
        }
    }

    return (
        <Layout>
            {currentUser ?
            <div className="userEdit">                
                <form>
                <span>Username</span>
                    <input
                        required
                        name="username"
                        value={inputs.username}
                        onChange={handleChange}
                        type="text"/>
                    <span>Email</span>
                    <input
                        required
                        name="email"
                        value={inputs.email}
                        onChange={handleChange}
                        type="email"/>
                    <span>Current password</span>
                    <input
                        required
                        name="old_password"
                        value={inputs.old_password}
                        onChange={handleChange}
                        type="password"/>
                    <span>New password</span>
                    <input
                        name="new_password"
                        value={inputs.new_password}
                        onChange={handleChange}
                        type="password"/>
                    <span>Confirm password</span>
                    <input
                        style={inputs.new_password === inputs.conf_password ?{backgroundColor: "teal"}:{backgroundColor: "red"}}
                        name="conf_password"
                        value={inputs.conf_password}
                        onChange={handleChange}
                        type="password"/>
                    <input disabled={(inputs.new_password !== inputs.conf_password)} onClick={handleSubmit} className="button" type="button" value="Save"/>
                    {message? <span className="message">{message}</span> :null}
                </form>
                <div className="imageSection">
                    <span>Profile picture</span>
                    {userImg && !file ?<img src={userImg} alt="" /> : null}
                    { file ? <img src={URL.createObjectURL(file)} alt=''/>: null}
                    <input style={{display: "none"}} type="file" id="file" onChange={e=>setFile(e.target.files[0])}/>
                    <label className="file" htmlFor="file">Upload image</label>
                </div>
            </div>
            :
            <>
                Please <Link to="/login">login</Link> to edit your profile.
            </>
            }
        </Layout>
    )
}

export default User