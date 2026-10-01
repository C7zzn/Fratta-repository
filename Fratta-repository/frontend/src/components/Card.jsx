import React from "react";
import './Card.css';

export function Card({title, text}){
    return(
        <div className="card">
            <h3>{title}</h3>
            <p> 
                {text}
            </p>
        </div>
    );
}

export function CardTesti({title, aut, text}){
    return(
        <div className="cardTesti">
            <h3>{title}</h3>
            <p><em>{aut}</em></p>
            <p>{text}</p>
        </div>
    );
}
