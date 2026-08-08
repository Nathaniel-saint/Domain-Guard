import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Hero from './components/Hero'
import NextHero from './components/NextHero'
import Footer from './components/Footer'




function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<><Nav /> <Hero /> <NextHero /> <Footer /> </>} />
      </Routes> 
    </BrowserRouter>
    </>
  )
}

export default App