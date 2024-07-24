import React from 'react'
import loading from '../assests/img/Loading.gif'

export default function Spinner() {
  return (
    <div className="text-center mt-3">
        <img src={loading} className="img-fluid" alt="loading"/>
    </div>
  )
}
