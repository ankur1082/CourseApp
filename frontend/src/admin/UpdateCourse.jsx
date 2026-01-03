import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../utils/utils'

const UpdateCourse = () => {
  const navigate = useNavigate()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [selectedFile, setSelectedFile] = useState(null)
  const { courseId } = useParams()

  const admin = JSON.parse(localStorage.getItem('admin'))
  const token = admin?.token;

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description)
    formData.append('price', price)
    if(selectedFile) {
      formData.append('image', selectedFile);
    }
    
    try {
      const response = await axios.put(`${BACKEND_URL}/course/update/${courseId}`, formData, {
        headers: {
          authorization: `Bearer ${token}`
        },
        withCredentials: true
      })
      toast.success(response.data.message)
      navigate('/admin/courses')
      setSelectedFile(null)
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.errors || 'Error in Course Updation')
      }
      else {
        console.log(error)
        toast.error('Error in Course Updation')
      }
    }
  }

  useEffect(() => {
    const getCourse = async () => {
      if (!token) {
        toast.error('You have to login first')
        navigate('/admin/login')
        return;
      }
      try {
        const response = await axios.get(`${BACKEND_URL}/course/${courseId}`, { withCredentials: true })
        const course = response.data.course;
        setTitle(course.title)
        setDescription(course.description)
        setPrice(course.price)
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.errors || 'Error in getting course')
        } else {
          toast.error('Error in getting course')
        }
      }

    }
    getCourse()
  }, [courseId])


  return (
    <div className='h-screen flex justify-center bg-gray-900 text-white'>
      <Toaster position='top-right' reverseOrder={false} />
      <div className='w-1/2 h-[80%] border-2 border-gray-600 shadow-lg shadow-gray-800 p-6 mt-10 rounded'>

        <form onSubmit={handleSubmit} method='POST' encType='multipart/form-data' className='flex flex-col gap-4'>
          <h2 className='text-2xl font-bold mb-5'>Update Course</h2>

          <label className='text-lg'>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className='px-2 py-2 rounded border-2 border-gray-400 bg-transparent' type="text" placeholder='Enter your course title' name='title' required />

          <label className='text-lg'>Description</label>
          <input value={description} onChange={(e) => setDescription(e.target.value)} className='px-2 py-2 rounded border-2 border-gray-400 bg-transparent' type="text" placeholder='Enter your course description' name='description' required />

          <label className='text-lg'>Price</label>
          <input value={price} onChange={(e) => setPrice(e.target.value)} className='px-2 py-2 rounded border-2 border-gray-400 bg-transparent' type="text" placeholder='Enter your course price' name='price' required />

          <label className='text-lg'>Course Image</label>
          <div>
            <input onChange={handleFileChange} className='w-full px-2 py-2 rounded border-2 border-gray-400 bg-transparent' type="file" placeholder='Enter your course title' name='image' />

            {(selectedFile &&
              <p>Selected: {selectedFile.name}</p>
            )}

            <button className='px-2 py-2 bg-green-500 rounded mt-4 w-full'>Update Course</button>
          </div>

        </form>

      </div>
    </div>
  )
}

export default UpdateCourse
