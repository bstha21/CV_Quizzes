import React from 'react'
import NavBar from './NavBar'
import { NavLink } from 'react-router-dom'
import {FaQuestionCircle, FaBookReader} from "react-icons/fa";

export default function MainPlanner() {
    return (
        <>
            <NavBar />
            <div className="container text-center">
                <h4 className="mt-5 pt-5">Choose any of the following ?</h4>
                <div className="row mt-5 pt-5">
                    <div className="col-md-6">
                       
                        <button className="btn btn-outline-primary btn-md btn-block">
                            <NavLink 
                                className="nav-link" 
                                to="/quiz-generator">
                                <FaQuestionCircle size={40}/> Quiz Generator
                            </NavLink>
                        </button>
                    </div>
                    <div className="col-md-6">
                        <button className="btn btn-outline-success btn-md btn-block">
                            <NavLink 
                                className="nav-link" 
                                to="/LessonPlanner">
                                <FaBookReader size={40}/> Lesson Planner
                            </NavLink>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
