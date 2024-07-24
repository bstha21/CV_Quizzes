import React from 'react'
import NavBar from '../components/NavBar'

export default function Error404Page() {
  return (
    <>
      <NavBar/>
      <div className="d-flex align-items-center justify-content-center vh-100">
          <div className="text-center">
              <h1 className="display-1 fw-bold">404</h1>
              <p className="fs-3"><span className="text-danger">Opps !</span> Page not found.</p>
              <p className="lead">
                  The page you are looking for does not exist.
              </p>
          </div>
      </div>
    </>  
  )
}
