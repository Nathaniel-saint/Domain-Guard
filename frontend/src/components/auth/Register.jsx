import React from 'react'
import './Register.css'
import { Link } from 'react-router-dom'
import { useState } from 'react'

function Register() {

    const [form, setForm] = useState({
        fullName: '',
        email: '',
        password: '',
    })

    const handleChange = e =>{
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }
    const handleSubmit = e =>{
        
    }
  return (
    <>
        <div className="form-bg">
            <form className="form-wrapper" onSubmit={handleSubmit} >

                <div className="form-head-p">
                    <h1 className="form-head">Create Your Account</h1>
                    <p className='sign-up-p'>Start Managing your Domain Securely</p>
                </div>

                <label>Full Name</label>
                <input type="text" required name="fullName" value={form.fullName} onChange={handleChange}></input>
                <label>Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required></input>
                <label>Password</label>
                <input type="password" name="password" value={form.password} onChange={handleChange} required></input>
                <p className="instruct">Must be at least 8 characters with symbols</p>
                <button type="submit">Create Account</button>

                <span>Already have an account? <Link to='signin'>Sign In</Link></span>
            </form>
        </div>
    </>
  )
}

export default Register