import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Error404Page from '../pages/Error404Page'
import LessonPlanner from '../components/LessonPlanner.jsx';
import QuizUI from '../components/QuizUI.jsx';
import MainPlanner from '../components/MainPlanner.jsx';


export default function RoutingConfig() {
  return (
    <>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainPlanner/>}></Route>
                <Route path="/LessonPlanner" element={<LessonPlanner/>}></Route>
                <Route path="/quiz-generator" element={<QuizUI/>}></Route>
                <Route path="*" element={<Error404Page/>}></Route>
            </Routes>
        </BrowserRouter>
    </>
  )
}
