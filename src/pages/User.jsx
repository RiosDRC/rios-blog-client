import { useContext, useState } from "react";
import Layout from "../hocs/layouts/Layout";
import { AuthContext } from "../context/authContext";
import { Link } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../apiConfig";
import { toast } from "react-toastify";


const User = () => {
    const { currentUser, setCurrentUser } = useContext(AuthContext);
    const [ isUploading, setIsUploading ] = useState(false);

    const [ inputs, setInputs ] = useState({
        username: currentUser?.username,
        email: currentUser?.email,
        img: currentUser?.img,
        old_password: "",
        new_password: "",
        conf_password: ""
    })

    const [file, setFile] = useState(null);

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

    const handleChange = e=>{
        setInputs(prev=>({...prev, [e.target.name]: e.target.value}))
    }

    const handleSubmit = async e =>{
        e.preventDefault()
        if (inputs.old_password !== "") {
            setIsUploading(true)
            const imgUrl = file ? await upload() : inputs.img;
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
                if (res.status === 200) {
                    setCurrentUser(prev => ({
                        ...prev,
                        email: inputs.email,
                        username: inputs.username,
                        img: imgUrl,
                    }))
                    toast.success('Info ipdated!')
                }
            } catch(err) {
                console.log(err)
                toast.error(err.response.data)
            }
        } else {
            toast.error("Current password required!")
        }
        setIsUploading(false)
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
                    <button disabled={inputs.new_password !== inputs.conf_password || isUploading} onClick={handleSubmit} className="button"
                    >{isUploading ? 'Uploading...' : 'Save'}</button>
                </form>
                <div className="imageSection">
                    <span>Profile picture</span>
                    <div className="profileImg">
                        {!file && inputs.img !== '' ?
                            <img src={inputs.img} alt="" />
                        : ''}
                        {file &&
                            <img src={URL.createObjectURL(file)} alt=''/>
                        }
                    </div>
                    <input style={{display: "none"}} type="file" id="file" onChange={e=>setFile(e.target.files[0])}/>
                    <label className="file" htmlFor="file">Upload image</label>
                    <div className="imageOptions">
                        <p onClick={() => {setInputs(prev => ({...prev, img: currentUser.img})); setFile(null)}}>Reset</p>
                        <p onClick={() => {setFile(null); setInputs(prev => ({...prev, img: ''}))}}>Clear</p>
                    </div>
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