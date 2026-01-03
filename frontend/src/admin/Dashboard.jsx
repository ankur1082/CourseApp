import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../../public/logo.webp'
import toast, { Toaster } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { BACKEND_URL } from '../utils/utils'

const Dashboard = () => {
  const navigate = useNavigate()

  const admin = JSON.parse(localStorage.getItem('admin'))
  const token = admin?.token;


  const handleLogout = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/admin/logout`, { withCredentials: true })
      toast.success(response.data.message)
      localStorage.removeItem('admin')
      navigate('/admin/login')
    } catch (error) {
      if (error.response) {
        const errors = error.response?.data?.errors;
        toast.error(errors || 'Logout Failed')
      }
      else {
        toast.error('Login Failed');
        console.log(error.message);
      }
    }
  }

  useEffect(() => {
    if (!token) {
      toast.error('Please login to access the dashboard')
      navigate('/admin/login')
    }
  },[])



  return (
    <div className='flex bg-gray-900 h-screen text-white'>
      <Toaster position='top-right' reverseOrder={false} />

      <div className='p-4 flex flex-col h-full w-1/5 bg-gray-800'>
        <div className='flex gap-2 flex-col items-center mb-10'>
          <img className='h-14 w-14 rounded-full' src={logo} alt="" />
          <h2 className='text-lg font-bold'>I'm Admin</h2>
        </div>


        <div className='flex flex-col gap-3'>
          <Link to={'/admin/courses'} className='bg-green-500 px-8 py-2 text-md rounded text-center font-bold'>
            Our Courses
          </Link>
          <Link to={'/admin/create'} className='bg-orange-500 px-8 py-2 text-md rounded text-center font-bold'>
            Create Course
          </Link>
          <Link className='bg-red-500 px-8 py-2 text-md rounded text-center font-bold'>
            Home
          </Link>
          <button onClick={handleLogout} className='bg-yellow-500 px-8 py-2 text-md rounded text-center font-bold'>
            Logout
          </button>
        </div>

      </div>

      <div className='flex items-center mx-auto'>
        <p className='text-2xl font-bold'>Welcome to the Admin DashBoard</p>
      </div>

    </div>
  )
}

export default Dashboard
