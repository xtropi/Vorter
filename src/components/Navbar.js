import React from 'react'
import {Link, NavLink} from 'react-router-dom'

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-sm navbar-light bg-light">
            <div className="container">
            <a className="brand-logo">WEBSITE</a>
            <ul className="navbar-nav navbar-right">
                <li className="nav-item mr-3"><Link className="nav-link" to="/">Home</Link></li>
                <li className="nav-item mr-3"><Link className="nav-link" to="/about">About</Link></li>
            </ul>
            </div>
        </nav>
    )
}

export default Navbar