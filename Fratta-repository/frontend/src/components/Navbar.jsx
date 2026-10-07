import React, { useState } from "react";
import './Navbar.css';
import logoImg from '/logo-ferz.png';
import { NavLink } from "react-router-dom"; // Mudou de Link para NavLink

export function Navbar(){

    const [isOpen, setIsOpen] = useState(false);
    const menu = () => {
        setIsOpen(!isOpen);
    };

    return(
        <nav className="navbar">

            <button className="menu" onClick={menu} aria-label="Menu">
                <span></span>
                <span></span>
                <span></span>
            </button>
            <img src="/logo-ferz.png" alt="Logo" />
            
            <div className={`nav-links ${isOpen ? 'active' : ''}`}>
                {}
                <NavLink to="/" end className={({ isActive }) => isActive ? "navBut active-link" : "navBut"}>
                    Inicio
                </NavLink>
                
                <NavLink to="/Timeline" className={({ isActive }) => isActive ? "navBut active-link" : "navBut"}>
                    Linha do Tempo
                </NavLink>
                
                <NavLink to="/Gallery" className={({ isActive }) => isActive ? "navBut active-link" : "navBut"}>
                    Galeria
                </NavLink>
                
                <NavLink to="/CozyArea" className={({ isActive }) => isActive ? "navBut active-link" : "navBut"}>
                    Área Descanso
                </NavLink>
                
                <NavLink to="/Testimonials" className={({ isActive }) => isActive ? "navBut active-link" : "navBut"}>
                    Depoimentos
                </NavLink>
                
                <NavLink to="/login" className={({ isActive }) => isActive ? "navBut active-link" : "navBut"}>
                    Admin
                </NavLink>
            </div>
              
        </nav>
    );
}