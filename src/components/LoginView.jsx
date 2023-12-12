import React, { useState } from 'react'
import { useContext } from "react"
import { AuthContext } from '../context/authContext'
import { Link } from 'react-router-dom'

export default function LoginView() {
    const { setLoginView, login } = useContext(AuthContext)
    const [inputs, setInputs] = useState({
        username: '',
        password: ''
    })

    const handleChange = e => {
        setInputs(prev => ({...prev, [e.target.name]: e.target.value}))
    }

    const handleSubmit = e => {
        e.preventDefault();
        login(inputs);
        setLoginView(false);
    }

  return (
    <div id="loginView" onClick={() => setLoginView(false)} onSubmit={handleSubmit}>
        <div className="loginWindow">
            <form onClick={e => e.stopPropagation()}>
                <h2>Login</h2> 
                <input
                    type="text"
                    value={inputs.username}
                    name='username'
                    placeholder="username"
                    onChange={handleChange}
                />
                <input
                    type="password"
                    value={inputs.password}
                    name='password'
                    placeholder="password"
                    onChange={handleChange}
                />
                <button>Login</button>
                <p>You do not have an account?</p>
                <p>Click <Link to='rios-blog-client/register' onClick={() => setLoginView(false)}>here</Link> to register.</p>
            </form>
            <p id='close' onClick={() => setLoginView(false)}>Close</p>
        </div>
  </div>
  )
}
