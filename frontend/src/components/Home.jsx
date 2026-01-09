import React, { useEffect, useState } from 'react'
import logo from '../../public/logo.webp'
import { Link } from 'react-router-dom'
import { FaFacebook } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import axios from 'axios'
import toast, { Toaster } from "react-hot-toast"
import { BACKEND_URL } from '../utils/utils'


const Home = () => {
  const [courses, setCourses] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [token, setToken] = useState(
    JSON.parse(localStorage.getItem('user'))?.token || null
  )

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/user/logout`, { withCredentials: true })
      toast.success(response.data.message)
      setIsLoggedIn(false);
      setToken(null)
      localStorage.removeItem('user')
    } catch (error) {
      if (error.response) {
        const errors = error.response.data.errors;
        toast.error(errors || "Logout Failed")
      }
      else {
        toast.error('Logout Failed')
      }
    }
  }
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/course/courses`)
        setCourses(response.data.courses)

      } catch (error) {
        console.log(error.message)
      }
    }
    fetchCourses()
  }, [])

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true)
    }
    else {
      setIsLoggedIn(false)
    }
  }, [token])


  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <div className='bg-gradient-to-r from-black to-blue-950'>
      <Toaster position='top-right' reverseOrder={false} />
      <div className='px-10 md:px-20 py-6 text-white min-h-screen'>
        {/* Header */}
        <header className='flex justify-between items-center'>
          <div className='flex gap-1 md:gap-2 items-center'>
            <img className='h-7 w-7 md:w-11 md:h-11 rounded-full' src={logo} alt="" />
            <h1 className='text-lg md:text-2xl text-orange-500 font-bold'>CourseHaven</h1>
          </div>
          <div className='space-x-4'>
            {
              isLoggedIn ? (
                <button onClick={handleLogout} className='text-white bg-transparent px-3 py-1 md:px-5 md:py-2 border border-white rounded'>Logout</button>
              ) :
                (
                  <div className='flex gap-1 md:gap-4'>
                    <Link to={'/login'} className='text-white bg-transparent px-2 py-1 md:px-5 md:py-2 border border-white rounded'>Login</Link>
                    <Link to={'/signup'} className='text-white bg-transparent px-1 py-1 md:px-5 md:py-2 border border-white rounded'>Signup</Link>
                  </div>

                )
            }


          </div>
        </header>

        {/* Main Section */}
        <section className='flex flex-col justify-center items-center w-full my-20'>
          <h1 className='text-2xl text-orange-500 font-semibold'>Course Heaven</h1>
          <br />
          <p className='text-base text-gray-400'>Sharpan your skills with courses crafted by experts</p>
          <div className='flex gap-4 mt-3'>
            <Link to={'/courses'} className='bg-green-500 py-3 px-6 text-white rounded font-semibold hover:bg-white duration-300 hover:text-black'>Explore Courses</Link>
            <Link to={'https://www.youtube.com/c/LearnCodingOfficial'} className='bg-white py-3 px-6 text-black rounded font-semibold hover:bg-green-500 duration-300 hover:text-white'>Courses Videos</Link>
          </div>
        </section>
        <section className='mb-10'>
          {courses.length > 0 && (
            <Slider {...settings}>
              {
                courses.map((course) => {
                  return <div key={course._id} className='p-4'>
                    <div className='relative w-full max-w-sm mx-auto transition-transform duration-300 transform hover:scale-105'>
                      <div className='bg-gray-900 rounded-lg overflow-hidden'>
                        <img className='h-40 w-full object-cover' src={course.image.url} alt="" />
                        <div className='text-center my-5'>
                          <h2 className='text-xl text-white font-bold'>{course.title}</h2>
                          <Link to={`/buy/${course._id}`} className='mt-4 bg-orange-500 inline-block text-white px-4 py-2 rounded-full'>Enroll Now</Link>
                        </div>
                      </div>

                    </div>
                  </div>
                })
              }
            </Slider>
          )}

        </section>

        {/* Footer*/}
        <hr />
        <footer className='mt-10'>

          <div className='grid grid-cols-1 md:grid-cols-3'>
            <div className='flex flex-col items-center md:items-start'>
              <div className='flex gap-2 items-center'>
                <img className='h-11 w-11 rounded-full' src={logo} alt="" />
                <h1 className='text-2xl text-orange-500 font-bold'>CourseHaven</h1>
              </div>
              <div className='mt-3 ml-2 md:ml-5'>
                <p className='mb-2'>Follow up</p>
                <div className='flex space-x-4'>
                  <a href=""><FaFacebook className='text-2xl hover:text-blue-400' /></a>
                  <a href=""><FaInstagramSquare className='text-2xl hover:text-pink-400' /></a>
                  <a href=""><FaTwitter className='text-2xl hover:text-blue-400' /></a>
                </div>
              </div>
            </div>


            <div className='flex flex-col items-center'>
              <h3 className='text-lg font-semibold mb-4 mt-2 md:mt-0'>Connects</h3>
              <ul className='space-y-2 text-gray-400'>
                <li className='cursor-pointer hover:text-white'>Youtube- learn coding</li>
                <li className='cursor-pointer hover:text-white'>Instagram- learn coding</li>
                <li className='cursor-pointer hover:text-white'>Github- learn coding</li>
              </ul>
            </div>

            <div className='flex flex-col items-center'>
              <h3 className='text-lg font-semibold mb-4 mt-2 md:mt-0'>Copyrights &#169; 2024</h3>
              <ul className='space-y-2 text-gray-400'>
                <li className='cursor-pointer hover:text-white'>Terms & Conditions</li>
                <li className='cursor-pointer hover:text-white'>Privacy Policy</li>
                <li className='cursor-pointer hover:text-white'>Refund & Cancellation</li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default Home
