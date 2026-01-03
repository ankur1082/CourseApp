import React, { useEffect, useState } from 'react'
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../utils/utils'

const CourseCreate = () => {
  const navigate = useNavigate()
  const admin = JSON.parse(localStorage.getItem('admin'))
  const token = admin?.token;


  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", e.target.title.value);
    formData.append("description", e.target.description.value);
    formData.append("price", e.target.price.value);
    formData.append("image", e.target.image.files[0]);
    try {
      const response = await axios.post(`${BACKEND_URL}/course/create`,
        formData
        , {
          headers: {
            authorization: `Bearer ${token}`
          },
          withCredentials: true
        })
      toast.success(response.data.message)
      e.target.reset();
    } catch (error) {
      if (error.response) {
        const errors = error.response?.data?.errors;
        toast.error(errors || 'Course creation failed')
      }
      else {
        toast.error("Course creation failed")
      }
    }
  }

  useEffect(() => {
    if(!token) {
      toast.error('You have to logged in as a Admin')
      navigate('/admin/login')
    }
  },[])
  return (
    <div className='h-screen flex justify-center bg-gray-900 text-white'>
      <Toaster position='top-right' reverseOrder={false} />
      <div className='w-1/2 h-[80%] border-2 border-gray-600 shadow-lg shadow-gray-800 p-6 mt-10 rounded'>

        <form onSubmit={handleSubmit} action="" method='POST' encType='multipart/form-data' className='flex flex-col gap-4'>
          <h2 className='text-2xl font-bold mb-5'>Create Course</h2>

          <label className='text-lg'>Title</label>
          <input className='px-2 py-2 rounded border-2 border-gray-400 bg-transparent' type="text" placeholder='Enter your course title' name='title' required />

          <label className='text-lg'>Description</label>
          <input className='px-2 py-2 rounded border-2 border-gray-400 bg-transparent' type="text" placeholder='Enter your course description' name='description' required />

          <label className='text-lg'>Price</label>
          <input className='px-2 py-2 rounded border-2 border-gray-400 bg-transparent' type="text" placeholder='Enter your course price' name='price' required />

          <label className='text-lg'>Course Image</label>
          <input className='px-2 py-2 rounded border-2 border-gray-400 bg-transparent' type="file" placeholder='Enter your course title' name='image' required />

          <button className='px-2 py-2 bg-green-500 rounded mt-4'>Create Course</button>
        </form>

      </div>
    </div>
  )
}

export default CourseCreate
