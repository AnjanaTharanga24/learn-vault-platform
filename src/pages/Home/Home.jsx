import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Sidebar from '../../components/Sidebar/Sidebar'
import Sidebar2 from '../../components/Sidebar/Sidebar2'

export default function Home() {
  return (
    <div className='container-fluid p-0'>
      <Navbar/>
      <div className="row g-0">
        <div className="col-lg-2">
          <Sidebar/>
        </div>
        <div className="col-lg-8 main-content">
          <div className="container-fluid p-4">
            <h1>Welcome to SkillShare</h1>

            {Array.from({ length: 20 }).map((_, index) => (
              <p key={index}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            ))}
          </div>
        </div>
        <div className="col-lg-2">
          <Sidebar2/>
        </div>
      </div>
    </div>
  )
}