import React, { useState, useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { BACKEND_URL } from '../utils/utils'
const OurCourses = () => {
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  const admin = JSON.parse(localStorage.getItem('admin'))
  const token = admin?.token


  // fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/course/courses`,
          { withCredentials: true }
        )
        setCourses(response.data.courses)
        setLoading(false)
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.errors);
        }
        else {
          toast.error("Error in fetching course")
        }
      }
    }
    fetchCourses()
  }, [])
  
  useEffect(() => {
    if (!token) {
      toast.error("Please login to admin")
      navigate('/admin/login')
    }
  }, [])

  const handleDeleteCourse = async (courseId) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/v1/course/delete/${courseId}`,
        {
          headers: {
            authorization: `Bearer ${token}`
          }
          , withCredentials: true
        }
      );
      toast.success(response.data.message)
      const updatedCourses = courses.filter((course) => course._id !== courseId)
      setCourses(updatedCourses)
    } catch (error) {
      toast.error(error.response.data.errors || "Error in deleting course")
    }
  }


  return (
    <div>
      <Toaster position='top-right' reverseOrder={false} />
      <h1 className='text-3xl font-bold text-center'>Our Courses</h1>
      <Link to={'/admin/dashboard'} className='ml-6 mt-3 inline-block bg-orange-500 px-3 py-2 rounded text-white'>Go to Dashboard</Link>
      <div className="p-6 overflow-y-auto flex-1">
        {loading ? (
          <p className="text-base text-gray-900 text-center">Loading....</p>
        ) : courses.length === 0 ? (
          <p className="text-base text-gray-900">
            No courses available yet
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <div
                className="bg-gray-900 rounded-lg overflow-hidden"
                key={course._id}
              >
                <img
                  className="h-40 w-full object-cover"
                  src={course.image.url}
                  alt=""
                />
                <div className="py-4 px-3">
                  <h2 className="text-xl text-white">{course.title}</h2>
                  <p className="text-sm text-gray-300 mt-2">
                    {course.description}
                  </p>

                  <div className="flex justify-between items-center mt-4">
                    <div>
                      <p className="text-white font-semibold">
                        ${course.price}
                      </p>
                      <Link to={`/admin/update/${course._id}`} className="inline-block bg-blue-500 mt-4 py-2 px-4 rounded-lg text-white">
                        Update
                      </Link>
                    </div>
                    <div>
                      <p className="text-green-500 font-semibold">20% off</p>
                      <button onClick={() => handleDeleteCourse(course._id)} className='bg-red-500 mt-4 py-2 px-4 rounded-lg text-white'>Delete</button>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default OurCourses
