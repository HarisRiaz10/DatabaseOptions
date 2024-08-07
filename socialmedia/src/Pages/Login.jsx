
import { useState } from "react"
import axios from './axiosConfig';
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";
// add cors



export default function LoginPage() {
  let [email, setEmail] = useState("")
  let [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const override = {
    display: "block",
    margin: "0 0",
    borderColor: "red",
  };
  


  function log_in(e){
    setLoading(true)
    e.preventDefault()
    console.log(e)
    axios.post('/login', {email: email, password: password})
    .then((response) => {
      console.log("The response from backend is: ",response);
        //console.log(response)
        if(response.status == 200)
        {
          console.log(response)
         setLoading(false) 
         localStorage.setItem('name', response.data.message[1] )
         localStorage.setItem('token', 'true')
         toast.success("Login successful") 
          navigate('/home', {state : response.data.message[1]})
        }
    }, (error) => {
      setLoading(false) 
      navigate('/')
      toast.error("Login failed")
      console.log(error);
    });
  }

    return (
      <>
        {/*
          This example requires updating your template:
  
          ```
          <html class="h-full bg-white">
          <body class="h-full">
          ```
        */}
        {loading ? <ClipLoader cssOverride={override} color="blue" loading={loading} size={50} /> : (
          <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              className="mx-auto h-10 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              alt="Your Company"
            />
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Sign in to your account
            </h2>
          </div>
  
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
  
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                    Password
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
  
              <div>
                <button
                  onClick={log_in}
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Sign in
                </button>
              </div>
            </form>
            <div>
            <p className="mt-10 text-center text-sm text-gray-500">
              Not a member?{' '}
              {/* <a href="/signup" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500" onClick={(e) => {e.preventDefault(); window.location.href = '/signup';}}>
                Sign up here
              </a> */}
              <Link to="/signup" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500" unstable_viewTransition>
                Sign up here
              </Link>
               
            </p>
            {/* <button
                onClick={(e) => {e.preventDefault(); debugger; navigate('/signup', { replace: true });}}
                // className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
              >
                Sign up here
              </button> */}
              </div>
          </div>
        </div>  
        )}
        
      </>
    )
  }



