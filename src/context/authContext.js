import axios from "axios";
import { createContext, useEffect, useState } from "react";
import API_BASE_URL from "../apiConfig"

axios.defaults.withCredentials = true;

export const AuthContext = createContext()

export const AuthContextProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(
        JSON.parse(localStorage.getItem("user")) || null
        );

    const [loginView, setLoginView] = useState(false);

    const login = async(inputs) =>{
        const res = await axios.post(API_BASE_URL + "/api/auth/login", inputs);
        setCurrentUser(res.data);
    };

    const logout = async(inputs) =>{
        await axios.post(API_BASE_URL + "/api/auth/logout");
        setCurrentUser(null);
    };

    useEffect(()=>{
        localStorage.setItem("user", JSON.stringify(currentUser))
    },[currentUser]);

    return <AuthContext.Provider value={{ currentUser, setCurrentUser, login, logout, loginView, setLoginView }}>
                {children}
            </AuthContext.Provider>
};