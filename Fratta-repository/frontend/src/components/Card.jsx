import React from "react";
import './Card.css';

export function Card({title, text}){
    return(
        <div className="card">
            <h3>{title}</h3>
            <p>{text}</p>
        </div>
    );
}

export function CardTesti({title, aut, text}){
    return(
        <div className="cardTesti">
            <h3>{title}</h3>
            {aut && <span className="cardTesti-author"><em>{aut}</em></span>}
            <p className="cardTesti-text">{text}</p>
        </div>
    );
}

export function CardSpecial({ title, aut, text, cardColor }) {
    const customStyle = cardColor ? {
        borderLeftColor: cardColor,
        background: `linear-gradient(145deg, var(--bg) 60%, ${cardColor}15)`
    } : {};

    return(
        <div className="card-special" style={customStyle}>
            <div className="card-special-banner" style={{ backgroundColor: cardColor || "var(--atencao)" }}>
                <span>👑 COMUNICADO OFICIAL DA ADMINISTRAÇÃO</span>
            </div>
            <div className="card-special-content">
                <h3 style={{ color: cardColor || "inherit" }}>{title}</h3>
                {aut && <span className="card-special-author">Por <strong>{aut}</strong></span>}
                <p className="card-special-text">{text}</p>
            </div>
        </div>
    );
}