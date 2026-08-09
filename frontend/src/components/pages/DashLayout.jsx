import React from 'react'
import { NavLink, Outlet } from "react-router-dom";
import logo from '../../assets/logo.png'
import { IoIosNotificationsOutline } from "react-icons/io"
import { CiSettings } from "react-icons/ci";
import { LuLayoutDashboard } from "react-icons/lu";
import './DashLayout.css'


function DashLayout() {
  return (
    <>
        <div className="dashboard">
            <div className="side-links-layout">
                <div className="logo-head-dashlayout">
                    <img src={logo} alt="logo" className='dash-logo'/>
                    <span>Domain Guard</span>
                </div>
                <aside className="side-bar">
                    <nav className="side-links">
                    <NavLink to="/dashboard" end><LuLayoutDashboard />Dashboard</NavLink>
                    <NavLink to="notification"><IoIosNotificationsOutline />Notifications</NavLink>
                    <NavLink to="setting"><CiSettings />Settings</NavLink>
                    </nav>
                    <NavLink className="last-dash-link" to="#logout">Logout</NavLink>
                </aside>
            </div>
            <main>
                <Outlet />
            </main>
        </div>

    </>
  )
}

export default DashLayout