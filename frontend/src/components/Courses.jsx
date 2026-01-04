import axios from 'axios'
import React, { useEffect, useState } from 'react'
import logo from '../../public/logo.webp'
import profile from '../../public/profile.png'
import toast, { Toaster } from "react-hot-toast"
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { BACKEND_URL } from '../utils/utils'

const Courses = () => {
    const navigate = useNavigate()
    const [courses, setCourses] = useState([])
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [loading, setLoading] = useState(true)

    const handleLogout = async () => {
        try {
            const response = await axios.get(
                `${BACKEND_URL}/user/logout`,
                { withCredentials: true }
            )
            toast.success(response.data.message)
            setIsLoggedIn(false)
            localStorage.removeItem('user')
            navigate('/')
        } catch (error) {
            toast.error(error.response.data.errors || "Logout Failed")
        }
    }

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
        const user = JSON.parse(localStorage.getItem('user'))
        const token = user?.token
        if (token) {
            setIsLoggedIn(true)
        } else {
            setIsLoggedIn(false)
        }
    }, [])

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Toaster position="top-right" reverseOrder={false} />

            {/* Sidebar */}
            <aside className="sticky top-0 h-screen w-64 bg-gray-50 border-r border-gray-200 p-4">
                <Link to={'/'} className="flex flex-col items-start mb-6">
                    <img src={logo} alt="profile" className="w-14 h-14 rounded-full" />
                </Link>

                <nav className="space-y-4 text-gray-700">
                    <Link to={'/'} className="flex items-center gap-3 cursor-pointer hover:text-blue-600">
                        🏠 <span>Home</span>
                    </Link>

                    <div className="flex items-center gap-3 text-blue-600 cursor-pointer font-semibold">
                        📘 <span>Courses</span>
                    </div>

                    <Link to={'/purchases'} className="flex items-center gap-3 cursor-pointer hover:text-blue-600">
                        🛒 <span>Purchases</span>
                    </Link>

                    <div className="flex items-center gap-3 cursor-pointer hover:text-blue-600">
                        ⚙️ <span>Settings</span>
                    </div>

                    {
                        isLoggedIn ? (
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 cursor-pointer hover:text-red-500 mt-6"
                            >
                                🚪 <span>Logout</span>
                            </button>
                        ) : (
                            <Link to={'/login'} className="flex items-center gap-3 cursor-pointer hover:text-red-500 mt-6">
                                🚪 <span>Login</span>
                            </Link>
                        )
                    }

                </nav>
            </aside>

            {/* Right Content */}
            <main className="flex-1 flex flex-col">
                {/* Navbar */}
                <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-3 py-2 md:px-6 md:py-4 flex justify-between items-center">

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Type here to search..."
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                🔍
                            </span>
                        </div>


                    </div>
                    <img
                        src={profile}
                        alt="profile"
                        className="w-13 h-10 rounded-full"
                    />
                </div>

                {/* Courses Content */}
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
                                                <Link to={`/buy/${course._id}`} className="inline-block bg-orange-500 mt-4 py-2 px-4 rounded-lg text-white">
                                                    BuyNow
                                                </Link>
                                            </div>
                                            <p className="text-green-500 font-semibold">20% off</p>
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

export default Courses
