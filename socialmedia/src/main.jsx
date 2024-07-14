import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import { Toaster } from 'react-hot-toast';
import Signup from './Pages/SignUp.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <Toaster/>
  <App />
  {/* <Signup/> */}
</BrowserRouter>
)
