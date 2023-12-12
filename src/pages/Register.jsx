import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"
import API_BASE_URL from "../apiConfig"
import { toast } from "react-toastify";

const Register = () => {
    const [inputs, setInputs] = useState({
        username:"",
        email:"",
        password:""
    })

    const navigate = useNavigate()

    const handleChange = e =>{
        setInputs(prev=>({...prev, [e.target.name]: e.target.value}))
    }

    const handleSubmit = async e =>{
        e.preventDefault()
        try {
            await axios.post(API_BASE_URL + "/api/auth/register", inputs);
            toast.success("User created succefully!")
            navigate("/rios-blog-client/login")
        } catch(err){
            console.log(err)
            toast.warning(err.response.data)
        }
    }

    return (
        <div className="auth">
            <h1>Register</h1>
            <form>
                <input
                required
                onChange={handleChange} 
                type="text"
                name="username" 
                placeholder="username" />
                <input 
                required
                onChange={handleChange}
                type="email"
                name="email" 
                placeholder="email" />
                <input
                required
                onChange={handleChange} 
                type="password"
                name="password" 
                placeholder="password" />
                <button onClick={handleSubmit}>Register</button>
                <span>Do you have an account?<div><Link to="/rios-blog-client/login">Login</Link></div></span>
            </form>
        </div>
    );
}
 
export default Register;