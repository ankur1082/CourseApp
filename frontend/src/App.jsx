import React from 'react'
import {Route, Routes} from 'react-router-dom'
import Home from './components/Home'
import Signup from './components/Signup'
import Login from './components/Login'
import Courses from './components/Courses'
import Buy from './components/Buy'
import Purchases from './components/Purchases'
import CourseDetails from './components/CourseDetails'
import AdminSignup from './admin/AdminSignup'
import AdminLogin from './admin/AdminLogin'
import Dashboard from './admin/Dashboard'
import CreateCourse from './admin/CreateCourse'
import UpdateCourse from './admin/UpdateCourse'
import OurCourses from './admin/OurCourses'

function App() {

  return (
    <div>
      <Routes>
        {/* User Routes */}
        <Route  path='/' element={<Home />}/>
        <Route path='/signup' element={<Signup />}/>
        <Route path='/login' element={<Login />}/>
         
         {/* Other Routes */}
        <Route path='/courses' element={<Courses />}/>
        <Route path='/buy/:courseId' element={<Buy />}/>
        <Route path='/:courseId' element={<CourseDetails />}/>
        <Route path='/purchases' element={<Purchases />}/>

        {/* Admin Routes */}
        <Route path='/admin/signup' element={<AdminSignup />}/>
        <Route path='/admin/login' element={<AdminLogin />}/>
        <Route path='/admin/dashboard' element={<Dashboard />}/>
        <Route path='/admin/create' element={<CreateCourse />}/>
        <Route path='/admin/update/:courseId' element={<UpdateCourse />}/>
        <Route path='/admin/courses' element={<OurCourses />}/>
      </Routes>
    </div>
  )
}

export default App
