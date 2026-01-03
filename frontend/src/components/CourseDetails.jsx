import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { BACKEND_URL } from '../utils/utils'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'


const CourseDetails = () => {
  const { courseId } = useParams()
  const [course, setCourse] = useState({})

  useEffect(() => {
    const getCourse = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/course/${courseId}`, { withCredentials: true })
        setCourse(response.data.course)
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data?.errors || 'Error in getting Details')
        }
        else {
          toast.error('Error in getting Details')
        }
      }
    }
    getCourse()
  }, [courseId])
  return (
    <div className="min-h-screen bg-gray-100 px-6 py-2">
      <Toaster position='top-right' reverseOrder={false}/>
      <h1 className='text-gray-700 text-2xl md:text-3xl font-bold mb-5'>Course Details</h1>
      <div className="max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

        <div className="w-full">
          <img
            src={course.image?.url}
            alt="Course"
            className="border-2 border-gray-300 w-full h-[350px] object-cover rounded-xl shadow-2xl"
          />
        </div>

        <div className="space-y-6">
          <h1 className="text-xl md:text-3xl font-bold">
            {course.title}
          </h1>

          <div className="h-1 w-20 bg-indigo-500 rounded"></div>

          <p className="leading-relaxed text-lg">
            {course.description}
          </p>
        </div>

      </div>
    </div>


  )
}

export default CourseDetails
