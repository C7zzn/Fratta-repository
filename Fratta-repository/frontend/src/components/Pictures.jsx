import React from 'react';
import './Pictures.css';

export function RoundImg({src, alt = "Imagem Padrão", wid}){
    return(
        <img className='rounded' src={src} alt={alt} width={wid}/>
    );
}
export function SquareImg({src, alt = "Imagem Padrão", wid}){
    return(
        <img className='square' src={src} alt={alt} width={wid}/>
    );
}
export function GalPictures({src, title}){
    return(
        <div className='gallery-picture' onClick={''}>
            <img src={src}/>
                <p>{title}</p>
        </div>
    );
}

