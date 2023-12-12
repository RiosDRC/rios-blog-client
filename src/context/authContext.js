import axios from "axios";
import { createContext, useEffect, useState } from "react";
import API_BASE_URL from "../apiConfig"
import { toast } from "react-toastify";

axios.defaults.withCredentials = true;

export const AuthContext = createContext()

export const AuthContextProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(
        JSON.parse(localStorage.getItem("user")) || null
        );

    const [loginView, setLoginView] = useState(false);

    const login = async(inputs) =>{
        try {
            const res = await axios.post(API_BASE_URL + "/api/auth/login", inputs);
            setCurrentUser(res.data);
            toast("Logged in succefully!")
        } catch (err) {
           console.log(err.response.data)
           toast.error(err.response.data) 
        }  
    };

    const logout = async(inputs) =>{
        await axios.post(API_BASE_URL + "/api/auth/logout");
        setCurrentUser(null);
        toast("Logged out successfully!")
    };

    useEffect(()=>{
        localStorage.setItem("user", JSON.stringify(currentUser))
    },[currentUser]);

    return <AuthContext.Provider value={{ currentUser, setCurrentUser, login, logout, loginView, setLoginView }}>
                {children}
            </AuthContext.Provider>
};