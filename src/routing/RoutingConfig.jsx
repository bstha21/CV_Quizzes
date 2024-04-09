import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Error404Page from '../pages/Error404Page'
import QuizUI from '../components/QuizUI'

export default function RoutingConfig() {
  return (
    <>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<QuizUI/>}></Route>
                <Route path="*" element={<Error404Page/>}></Route>
            </Routes>
        </BrowserRouter>
    </>
  )
}
