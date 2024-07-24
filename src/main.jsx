import React from 'react'
import ReactDOM from 'react-dom/client'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import RoutingConfig from "./routing/RoutingConfig"
import "./assests/css/style.css";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RoutingConfig/>
  </React.StrictMode>,
)
