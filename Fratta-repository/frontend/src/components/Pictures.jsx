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

export function GalPictures({src, title, borderColor, isAdmin}){
    const customStyle = borderColor ? {
        borderColor: borderColor,
        boxShadow: `0vh 0vh 1.5vh ${borderColor}`
    } : {};

    return(
        <div className='gallery-picture'>
            <div style={{ position: 'relative', display: 'inline-block' }}>
                <img 
                    src={src} 
                    alt={title || "Foto da galeria"} 
                    style={customStyle}
                />
                {isAdmin && (
                    <span style={{ 
                        position: 'absolute', 
                        top: '8px', 
                        right: '8px', 
                        background: borderColor || '#ffd700', 
                        color: '#000', 
                        fontSize: '10px', 
                        fontWeight: 'bold', 
                        padding: '3px 8px', 
                        borderRadius: '10px',
                        zIndex: 2,
                        boxShadow: '0 2px 5px rgba(0,0,0,0.5)'
                    }}>
                        👑 OFICIAL
                    </span>
                )}
            </div>
            {title && <p>{title}</p>}
        </div>
    );
}

// Função utilitária para converter link do YouTube em embed
function getYouTubeEmbedUrl(url) {
    if (!url) return "";
    let videoId = "";
    if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1]?.split("?")[0];
    } else if (url.includes("watch?v=")) {
        videoId = url.split("watch?v=")[1]?.split("&")[0];
    } else if (url.includes("/shorts/")) {
        videoId = url.split("/shorts/")[1]?.split("?")[0];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
}

export function GalVideos({ src, title, borderColor, isAdmin }) {
    const embedUrl = getYouTubeEmbedUrl(src);

    const customStyle = borderColor ? {
        borderColor: borderColor,
        boxShadow: `0vh 0vh 1.5vh ${borderColor}`
    } : {};

    return (
        <div className='gallery-picture'>
            <div style={{ position: 'relative', display: 'inline-block' }}>
                <div style={{ 
                    width: "200px", 
                    height: "200px", 
                    borderRadius: "1vh", 
                    overflow: "hidden", 
                    border: "3px solid var(--aclaro)",
                    ...customStyle,
                    background: "#000"
                }}>
                    <iframe 
                        src={embedUrl} 
                        title={title || "Vídeo da galeria"} 
                        style={{ width: "100%", height: "100%", border: "none", pointerEvents: "none" }} 
                    />
                </div>
                {isAdmin && (
                    <span style={{ 
                        position: 'absolute', 
                        top: '8px', 
                        right: '8px', 
                        background: borderColor || '#ffd700', 
                        color: '#000', 
                        fontSize: '10px', 
                        fontWeight: 'bold', 
                        padding: '3px 8px', 
                        borderRadius: '10px',
                        zIndex: 2,
                        boxShadow: '0 2px 5px rgba(0,0,0,0.5)'
                    }}>
                        👑 OFICIAL
                    </span>
                )}
            </div>
            {title && <p>{title}</p>}
        </div>
    );
}