import React from 'react'
import logo from "../assests/img/ChimpVine_Logo.png";
import { NavLink } from 'react-router-dom';

export default function NavBar() {
    return (
        <div>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <NavLink className="navbar-brand" to="/">
                        <img src={logo} alt="ChimpVineLogo" width="185" height="56" />
                    </NavLink>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <NavLink className="nav-link active" to="/">Quizzes</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="https://site.chimpvine.com/category/games/" target='_blank'>Games</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="https://site.chimpvine.com/category/interactive-content/" target='_blank'>Interactive Content</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="https://site.chimpvine.com/article/" target='_blank'>Articles</NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    )
}
