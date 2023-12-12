import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../img/logo.png"
import { useContext } from "react";
import { AuthContext } from "../context/authContext";

const Navbar = () => {
    const pathname = useLocation().pathname;
    const navigate = useNavigate()
    
    const { currentUser, logout, loginView, setLoginView } = useContext(AuthContext)


    const handleLogout = ()=>{
        if (pathname === "/rios-blog-client/user") {
            navigate("/rios-blog-client/")
        }
        logout()
    }

    
    return (
        <div className="navbarView">
            <nav id="nav" className="navbar navbar-expand-lg fixed-top">
                <div className="container-fluid">
                    <a className="navbar-brand" href="/rios-blog-client">
                        <img id="mainLogo" src={Logo} alt="" />
                    </a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                        <Link className="nav-link"  to="/rios-blog-client/?cat=art">ART</Link>
                        </li>
                        <li className="nav-item">
                        <Link className="nav-link"  to="/rios-blog-client/?cat=science">SCIENCE</Link>
                        </li>
                        <li className="nav-item">
                        <Link className="nav-link"  to="/rios-blog-client/?cat=technology">TECHNOLOGY</Link>
                        </li>
                        <li className="nav-item">
                        <Link className="nav-link" to="/rios-blog-client/?cat=cinema">CINEMA</Link>
                        </li>
                        <li className="nav-item">
                        <Link className="nav-link" to="/rios-blog-client/?cat=design">DESIGN</Link>
                        </li>
                        <li className="nav-item">
                        <Link className="nav-link" to="/rios-blog-client/?cat=food">FOOD</Link>
                        </li>
                        {currentUser &&<li className="nav-item">
                        <Link className="nav-link" to="/rios-blog-client/user">
                            <div id="userbar">
                                <span>{currentUser?.username}</span>
                                {currentUser.img &&<img src={currentUser.img} alt=""/>}
                            </div>
                        </Link>
                        </li>}
                        {!currentUser &&<li className="nav-item">
                            <span className="nav-link" onClick={()=>loginView? setLoginView(false): setLoginView(true)} data-bs-toggle="collapse" data-bs-target="#navbarNav">Login</span>
                        </li>}
                        {currentUser &&<li className="nav-item">
                            <span className="nav-link" onClick={handleLogout}>Logout</span>
                        </li>}
                        <li className="nav-item">
                        <Link id="writeIcon" className="nav-link" to="/rios-blog-client/write">
                            <span>Write</span>
                        </Link>
                        </li>
                    </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
}
 
export default Navbar;