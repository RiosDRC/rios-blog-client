import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext.js"
import { toast } from "react-toastify";

const Login = () => {
    const { login } = useContext(AuthContext)
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({
        username: "",
        password: ""
    });
    
    const handleChange = (e) => {
        setInputs((prev) => ({...prev, [e.target.name]: e.target.value}))
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            await login(inputs)
            navigate("/rios-blog-client")
        } catch (err) {
            toast.warning(err.response.data)
        }
    }

    return (
        <div className="auth">
            <h1>Login</h1>
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
                type="password"
                name="password"
                placeholder="password" />
                <button onClick={handleSubmit}>Login</button>
                <span>You don't have an account? <Link to="/rios-blog-client/register">Register</Link></span>
            </form>
        </div>
    );
}
 
export default Login;