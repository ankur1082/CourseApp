import React, { useEffect, useState } from 'react'
import axios from 'axios'
import logo from '../../public/logo.webp'
import toast, { Toaster } from "react-hot-toast"
import { Link, useNavigate } from 'react-router-dom'
import { BACKEND_URL } from '../utils/utils'

const Purchases = () => {
    const navigate = useNavigate()

    const [courses, setCourses] = useState([])
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [loading, setLoading] = useState(true)

    const user = JSON.parse(localStorage.getItem('user'))
    const token = user?.token

    const handleLogout = async () => {
        if(!token) {
            toast.error('Please login first')
            return
        }
        try {
            const response = await axios.get(
                `${BACKEND_URL}/user/logout`,
                { withCredentials: true }
            )
            toast.success(response.data.message)
            localStorage.removeItem('user')
            setIsLoggedIn(false)
            navigate('/')
        } catch (error) {
            toast.error(error?.response?.data?.errors || "Logout Failed")
        }
    }

    useEffect(() => {
        if (!token) {
            toast.error("Please login to access purchased Courses")
            setLoading(false)
            return
        }

        const fetchCourses = async () => {
            try {
                setLoading(true)
                const response = await axios.get(
                    `${BACKEND_URL}/user/purchases`,
                    {
                        headers: {
                            authorization: `Bearer ${token}`
                        },
                        withCredentials: true
                    }
                )
                setCourses(response.data.courseData || [])
            } catch (error) {
                toast.error(
                    error?.response?.data?.errors || "Error in fetching course"
                )
            } finally {
                setLoading(false)
            }
        }

        fetchCourses()
    }, [])

    useEffect(() => {
        if(token) {
            setIsLoggedIn(true)
        }
        else setIsLoggedIn(false)
    }, [])

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Toaster position="top-right" reverseOrder={false} />

            {/* Sidebar */}
            <aside className="sticky top-0 h-screen w-40 md:w-64 bg-gray-50 border-r border-gray-200 p-4">
                <Link to="/" className="flex flex-col items-start mb-6">
                    <img src={logo} alt="profile" className="w-14 h-14 rounded-full" />
                </Link>

                <nav className="space-y-4 text-gray-700">
                    <Link to="/" className="flex items-center gap-3 hover:text-blue-600">
                        🏠 <span>Home</span>
                    </Link>

                    <Link to="/courses" className="flex items-center gap-3 hover:text-blue-600">
                        📘 <span>Courses</span>
                    </Link>

                    <div className="flex items-center gap-3 font-semibold text-blue-600">
                        🛒 <span>Purchases</span>
                    </div>

                    <div className="flex items-center gap-3 hover:text-blue-600">
                        ⚙️ <span>Settings</span>
                    </div>

                    {isLoggedIn ? (
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 mt-6 hover:text-red-500"
                        >
                            🚪 <span>Logout</span>
                        </button>
                    ) : (
                        <Link
                            to="/login"
                            className="flex items-center gap-3 mt-6 hover:text-red-500"
                        >
                            🚪 <span>Login</span>
                        </Link>
                    )}
                </nav>
            </aside>

            {/* Right Content */}
            <main className="flex-1 flex flex-col">
                <h1 className="mt-4 pl-6 text-2xl text-gray-500 font-bold">
                    Purchases
                </h1>

                <div className="p-6 overflow-y-auto flex-1">
                    {courses.length === 0 || !isLoggedIn ? (<p className='text-base text-gray-500'>You have no purchased course yet</p>) : loading ? (
                        <p className="text-base text-gray-900 text-center">
                            Loading....
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {courses.map((course) => (
                                <div
                                    key={course._id}
                                    className="bg-gray-900 rounded-xl shadow-lg overflow-hidden"
                                >
                                    
                                    <img
                                        src={course.image.url}
                                        alt={course.title}
                                        className="w-full h-40 object-cover"
                                    />

                                    
                                    <div className="py-4 px-3">
                                        <h2 className="text-xl text-white">
                                            {course.title}
                                        </h2>

                                        <p className="text-sm text-gray-300 mt-2">
                                            {course.description}
                                        </p>

                                        <div className="flex justify-between items-center mt-4">
                                            <div>

                                                <Link
                                                    to={`/${course._id}`}
                                                    className="inline-block bg-orange-500 mt-4 py-2 px-4 rounded-lg text-white"
                                                >
                                                    View Course
                                                </Link>
                                            </div>

                                        </div>
                                    </div>
                                    
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}

export default Purchases
