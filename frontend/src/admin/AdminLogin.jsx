import React from "react"
import { Link } from "react-router-dom"
import logo from "../../public/logo.webp"
import toast, { Toaster } from "react-hot-toast"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { BACKEND_URL } from '../utils/utils'

const AdminLogin = () => {
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault()
    const email = e.target.email.value
    const password = e.target.password.value
    try {
      const response = await axios.post(
        `${BACKEND_URL}/admin/login`,
        { email, password },
        { withCredentials: true }
      )
      toast.success(response.data.message)
      localStorage.setItem('admin', JSON.stringify(response.data.admin))
      navigate('/admin/dashboard')
      
    } catch (error) {
      if (error.response) {
        const errors = error.response.data.errors
        if (Array.isArray(errors)) {
          errors.forEach((err) => toast.error(err))
        } else {
          toast.error(errors || "Login Failed")
        }
      } else {
        toast.error("Login Failed")
      }
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-r from-black to-blue-950 text-white">
      <Toaster position="top-right" reverseOrder={false} />
      {/* Navbar */}
      <header className="flex justify-between items-center px-10 md:px-20 py-6">
        <Link className="flex gap-2 text-start md:text-center items-center">
          <img className="w-7 h-7 md:h-11 md:w-11 rounded-full" src={logo} alt="logo" />
          <h1 className="text-lg md:text-2xl text-orange-500 font-bold">CourseHaven</h1>
        </Link>
        <div className="space-x-2 md:space-x-4">
          <Link
            to="/admin/signup"
            className="text-white bg-transparent px-1 py-1 md:px-5 md:py-2 border border-white rounded"
          >
            Signup
          </Link>
          <Link
            className="text-white bg-orange-500 px-1 py-1 md:px-5 md:py-2 border border-white rounded"
          >
            Join now
          </Link>
        </div>
      </header>

      {/* Login Form */}
      <div className="flex items-center justify-center min-h-[calc(100vh-96px)] px-4">
        <div className="w-full max-w-md bg-gray-900 rounded-xl shadow-lg p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-6">
            <h1 className="text-2xl font-bold text-orange-500">Welcome CourseHaven</h1>
            <p className="text-gray-400 text-sm mt-1">Login to your account as Admin</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="w-full px-4 py-2 rounded bg-gray-800 text-white outline-none focus:ring-2 focus:ring-orange-500"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full px-4 py-2 rounded bg-gray-800 text-white outline-none focus:ring-2 focus:ring-orange-500"
              required
            />

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 transition duration-300 text-white py-2 rounded font-semibold"
            >
              Login
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-gray-400 text-sm mt-6">
            Don't have an account?{" "}
            <Link to="/admin/signup" className="text-orange-500 hover:underline">
              Signup
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
