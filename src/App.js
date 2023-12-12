import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Single from "./pages/Single"
import Write from "./pages/Write"
import Error from "./pages/Error"
import User from "./pages/User"
import "./style.scss"
import Drafts from "./pages/Drafts"
import LoginView from "./components/LoginView"
import { useContext } from "react"
import { AuthContext } from "./context/authContext"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  const { loginView } = useContext(AuthContext)
  return (
    <Router>
      <div className="app">
        <div className="container">
          <Routes>
              <Route path="/rios-blog-client/" element={<Home />}/>
              <Route path="/rios-blog-client/login" element={<Login />}/>
              <Route path="/rios-blog-client/register" element={<Register />}/>
              <Route path="/rios-blog-client/post/:id" element={<Single />}/>
              <Route path="/rios-blog-client/write" element={<Write />}/>
              <Route path="/rios-blog-client/user" element={<User />} />
              <Route path="/rios-blog-client/drafts" element={<Drafts />} />

              <Route path="*" element={<Error />}/>
          </Routes>
        </div>
          <ToastContainer
            position='bottom-right'
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme='light'
          />
        { loginView &&
          <LoginView />
        }
      </div>
    </Router>
  );
}

export default App;
