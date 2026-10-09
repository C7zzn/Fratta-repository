import React, { useState, useEffect } from "react";
import './Navbar.css';
import { NavLink } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";

export function Navbar(){
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);

    // Monitora se o admin está logado para mudar o comportamento do botão
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const menu = () => {
        setIsOpen(!isOpen);
    };

    // Fecha o menu ao clicar em qualquer link
    const closeMenu = () => {
        setIsOpen(false);
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
                <NavLink to="/" end onClick={closeMenu} className={({ isActive }) => isActive ? "navBut active-link" : "navBut"}>
                    Inicio
                </NavLink>
                
                <NavLink to="/Timeline" onClick={closeMenu} className={({ isActive }) => isActive ? "navBut active-link" : "navBut"}>
                    Linha do Tempo
                </NavLink>
                
                <NavLink to="/Gallery" onClick={closeMenu} className={({ isActive }) => isActive ? "navBut active-link" : "navBut"}>
                    Galeria
                </NavLink>
                
                <NavLink to="/CozyArea" onClick={closeMenu} className={({ isActive }) => isActive ? "navBut active-link" : "navBut"}>
                    Área Descanso
                </NavLink>
                
                <NavLink to="/Testimonials" onClick={closeMenu} className={({ isActive }) => isActive ? "navBut active-link" : "navBut"}>
                    Depoimentos
                </NavLink>
                
                <NavLink to="/poems" onClick={closeMenu} className={({ isActive }) => isActive ? "navBut active-link" : "navBut"}>
                    Poesias
                </NavLink>
                
                {/* Botão Admin Inteligente */}
                <NavLink 
                    to={user ? "/admin/dashboard" : "/login"} 
                    onClick={closeMenu}
                    className={({ isActive }) => isActive ? "navBut active-link" : "navBut"}
                >
                    Admin
                </NavLink>
            </div>
        </nav>
    );
}