import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Hero from './components/Hero'
import NextHero from './components/NextHero'
import Footer from './components/Footer'
import AuthLayout from './components/auth/AuthLayout'
import Register from './components/auth/Register'
import SignIn from './components/auth/SignIn'




function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<><Nav /> <Hero /> <NextHero /> <Footer /> </>} />
        <Route path='/register' element={ <AuthLayout  />}>
        <Route index element={<Register />}/>
        <Route path='signin' element={ <SignIn /> } />
        </Route>
      </Routes> 
    </BrowserRouter>
    </>
  )
}

export default App