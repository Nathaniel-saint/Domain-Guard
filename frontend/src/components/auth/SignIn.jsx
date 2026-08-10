import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './SignIn.css'

function SignIn() {

    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    const handleChange = e =>{
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = e =>{
        e.preventDefault()

    }

  return (
    <>
     <form className="form sign-in" onSubmit={handleSubmit}>
            <div className="sigin-head-p">
                <h1>Sign In</h1>
                <p className='sign-in-p'>Access your domain portfolio securely</p>
            </div>
            <label className="email">Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required></input>
            <label className='pass'>Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} required></input>
            <button className="submit-in" type="submit">Sign In</button>
            <p>Don't have an account? <Link to="/register">Sign Up</Link>.</p>
        </form>
    </>
  )
}

export default SignIn