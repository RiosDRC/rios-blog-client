import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext.js"

const Login = () => {

    const location = useLocation().pathname

    const { setLoginView } = useContext(AuthContext)

    const [inputs, setInputs] = useState({
        username: "",
        password: ""
    });

    const [err, setError] = useState(null);

    const navigate = useNavigate();

    const { login } = useContext(AuthContext)

    const handleChange = (e) => {
        setInputs((prev) => ({...prev, [e.target.name]: e.target.value}))
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            await login(inputs)
            if (location === "/rios-blog-client/login") {
                navigate("/rios-blog-client")}
            setLoginView(false)
        } catch (err) {
            setError(err.response.data)
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
                {err &&<p>{err}</p>}
                <span>Don't you have an account? <Link to="/rios-blog-client/register">Register</Link></span>
            </form>
        </div>
    );
}
 
export default Login;