import React, { useState } from "react";
import './Navbar.css';
import logoImg from '/logo-ferz.png';
import { Link } from "react-router-dom";

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
                <Link to="/" className="navBut">Inicio</Link>
                <Link to="/Timeline" className="navBut">Linha do Tempo</Link>
                
                <Link to="/Gallery" className="navBut">Galeria</Link>
                <Link to="/CozyArea" className="navBut">Área Descanso</Link>
                <Link to="/Testimonials" className="navBut">Depoimentos</Link>
            </div>
            
        </nav>
    );
}
