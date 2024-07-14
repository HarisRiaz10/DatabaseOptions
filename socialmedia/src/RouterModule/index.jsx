import { useEffect } from "react";
import LoginPage from "../Pages/Login"
import MainPage from "../Pages/MainPage"
import SignUp from "../Pages/SignUp"
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

const RouterModule = () => {
    
    // useEffect(() => {
    //   localStorage.getItem('token') === 'true' && navigate('/home')
    //   localStorage.getItem('token') === (null) && (navigate('/'))
    // },[navigate])
    
    const navigate = useNavigate();
    const location = useLocation();
  
    useEffect(() => {
      const token = localStorage.getItem('token');
      if (token === 'true') {
        if (location.pathname === '/' || location.pathname === '/signup') {
          navigate('/home');
        }
      } else {
        if (location.pathname !== '/' && location.pathname !== '/signup') {
          navigate('/');
        }
      }
    }, [navigate, location]);
    return (
        <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<MainPage />} />
        <Route path="/signup" element={<SignUp />}/>
      </Routes>
    )
}

export default RouterModule;