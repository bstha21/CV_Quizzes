import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import QuizUI from '../components/QuizUI'

export default function RoutingConfig() {
  return (
    <>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<QuizUI/>}></Route>
            </Routes>
        </BrowserRouter>
    </>
  )
}
