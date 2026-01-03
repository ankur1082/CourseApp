import React from "react"
import { Link } from "react-router-dom"
import logo from "../../public/logo.webp"
import axios from "axios"
import toast, { Toaster } from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { BACKEND_URL } from '../utils/utils'

const AdminSignup = () => {
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault()
    const firstName = e.target.firstName.value
    const lastName = e.target.lastName.value
    const email = e.target.email.value
    const password = e.target.password.value

    try {
      const response = await axios.post(
        `${BACKEND_URL}/admin/signup`,
        { firstName, lastName, email, password },
        { withCredentials: true }
      )
      toast.success(response.data.message)
      navigate('/admin/login')
    } catch (error) {
      if (error.response) {
        const errors = error.response.data.errors
        if (Array.isArray(errors)) {
          errors.forEach((err) => toast.error(err))
        } else {
          toast.error(errors || "Signup Failed")
        }
      } else {
        toast.error("Signup Failed")
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-black to-blue-950 text-white">
      <Toaster position="top-right" reverseOrder={false} />
      
      {/* Navbar */}
      <header className="flex justify-between items-center px-10 md:px-20 py-6">
        <Link to={'/'} className="flex gap-2 items-center">
          <img className="h-7 w-7 md:h-11 md:w-11 rounded-full" src={logo} alt="logo" />
          <h1 className="text-lg md:text-2xl text-orange-500 font-bold">CourseHaven</h1>
        </Link>
        <div className="space-x-2 md:space-x-4">
          <Link
            to="/admin/login"
            className="text-white bg-transparent px-2 py-1 md:px-5 md:py-2 border border-white rounded"
          >
            Login
          </Link>
          <Link
            className="text-white bg-orange-500 px-1 py-1 md:px-5 md:py-2 border border-white rounded"
          >
            Join now
          </Link>
        </div>
      </header>

      {/* Signup Form */}
      <div className="flex items-center justify-center min-h-[calc(100vh-96px)] px-4">
        <div className="w-full max-w-md bg-gray-900 rounded-xl shadow-lg p-8">
          <div className="flex flex-col items-center mb-6">
            <h1 className="text-2xl font-bold text-orange-500">Welcome to CourseHaven</h1>
            <p className="text-gray-400 text-sm mt-1">Create your account as admin</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-3">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                className="w-1/2 px-4 py-2 rounded bg-gray-800 text-white outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                className="w-1/2 px-4 py-2 rounded bg-gray-800 text-white outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

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
              Sign Up
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            Already have an account?{" "}
            <Link to="/admin/login" className="text-orange-500 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdminSignup
