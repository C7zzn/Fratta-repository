import React, { useEffect, useState } from "react";
import './Home.css';
import './Gallery.css';
import { GalPictures, GalVideos } from "../components/Pictures";
import { Fade } from "react-awesome-reveal";
import { motion } from 'framer-motion';
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../services/firebase";

export function Gallery(){
    const [imagesList, setImagesList] = useState([]);
    const [loading, setLoading] = useState(true);

    const [title, setTitle] = useState("");
    const [imageBase64, setImageBase64] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // Estado para o Lightbox (Modal de zoom)
    const [selectedItem, setSelectedItem] = useState(null);

    const fetchApprovedGallery = async () => {
        try {
            setLoading(true);
            const querySnapshot = await getDocs(collection(db, "gallery"));
            
            const list = querySnapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(item => item.isApproved === true); 
            
            setImagesList(list);
        } catch (error) {
            console.error("Erro ao carregar galeria:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApprovedGallery();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImageBase64(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !imageBase64) return alert("Preencha o título e selecione uma imagem!");

        try {
            setSubmitting(true);
            await addDoc(collection(db, "gallery"), {
                title,
                url: imageBase64,
                type: "image", // Identifica explicitamente como foto
                isApproved: false, 
                createdAt: new Date()
            });
            setTitle("");
            setImageBase64("");
            alert("Foto enviada com sucesso! Ela passará pela moderação antes de aparecer publicamente.");
        } catch (error) {
            console.error("Erro ao enviar foto:", error);
            alert("Erro ao enviar a imagem. O arquivo pode ser muito pesado.");
        } finally {
            setSubmitting(false);
        }
    };

    // Função utilitária para converter link do YouTube no Lightbox
    const getYouTubeEmbedUrl = (url) => {
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
    };

    return(
        <div className="gallery-container">
            <section style={{
                    height:'auto',
                    padding: '40px 20px',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center'
                }}
            >   
                <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ marginBottom: '20px' }}
                > 
                  Essa é a galeria de Cauã. Envie sua foto para participar (sujeita à aprovação)! :)
                </motion.p>

                {/* Formulário de Envio Público (Apenas Fotos) */}
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", maxWidth: "400px", background: "rgba(0,0,0,0.2)", padding: "20px", borderRadius: "12px", border: "1px solid var(--aclaro)" }}>
                    <h4 style={{ fontSize: "16px", margin: 0, color: "var(--txt)" }}>➕ Sugerir foto para a galeria</h4>
                    <input 
                        type="text" 
                        placeholder="Legenda / Título da foto" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)}
                        style={{ padding: "10px", borderRadius: "6px", border: "1px solid var(--aclaro)", background: "transparent", color: "var(--txt)" }}
                    />
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ fontSize: "12px", color: "var(--txt)" }}
                    />
                    <button 
                        type="submit" 
                        disabled={submitting}
                        style={{ background: "var(--aclaro)", color: "#000", border: "none", padding: "10px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
                    >
                        {submitting ? "Enviando..." : "Enviar para Moderação"}
                    </button>
                </form>
            </section>

            {/* Listagem da Galeria (Fotos e Vídeos) */}
            <section style={{ width: '900px', maxWidth: '100%', paddingBottom: '50px', margin: '0 auto', boxSizing: 'border-box', paddingLeft: '15px', paddingRight: '15px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
                {loading ? (
                    <p style={{ textAlign: 'center', color: 'var(--txt)', width: '100%' }}>Carregando galeria...</p>
                ) : imagesList.length === 0 ? (
                    <p style={{ textAlign: 'center', color: 'var(--txt)', opacity: 0.8, width: '100%' }}>Nenhum item aprovado na galeria ainda.</p>
                ) : (
                    imagesList.map((item, index) => {
                        const isOfficialAdmin = item.isAdmin === true;
                        const cardColor = item.cardColor || "#ffd700";
                        const isVideo = item.type === "video";
                        const imageUrl = item.url || item.imageUrl;

                        return (
                            <Fade key={item.id} triggerOnce direction={index % 2 === 0 ? "left" : "right"}>
                                <div 
                                    onClick={() => setSelectedItem(item)} 
                                    style={{ cursor: 'pointer', display: 'inline-block' }}
                                >
                                    {isVideo ? (
                                        <GalVideos
                                            src={imageUrl}
                                            title={item.title}
                                            borderColor={isOfficialAdmin ? cardColor : undefined}
                                            isAdmin={isOfficialAdmin}
                                        />
                                    ) : (
                                        <GalPictures
                                            src={imageUrl}
                                            title={item.title}
                                            borderColor={isOfficialAdmin ? cardColor : undefined}
                                            isAdmin={isOfficialAdmin}
                                        />
                                    )}
                                </div>
                            </Fade>
                        );
                    })
                )}
            </section>

            {/* LIGHTBOX / MODAL DE TELA CHEIA (Para Fotos e Vídeos) */}
            {selectedItem && (
                <div 
                    onClick={() => setSelectedItem(null)} 
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: "rgba(0, 0, 0, 0.9)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 9999,
                        padding: "20px",
                        boxSizing: "border-box"
                    }}
                >
                    <div 
                        onClick={(e) => e.stopPropagation()} 
                        style={{
                            position: "relative",
                            maxWidth: "90%",
                            maxHeight: "90%",
                            background: "#121212",
                            borderRadius: "12px",
                            overflow: "hidden",
                            display: "flex",
                            flexDirection: "column",
                            border: selectedItem.isAdmin ? `2px solid ${selectedItem.cardColor || "#ffd700"}` : "1px solid rgba(255,255,255,0.2)",
                            boxShadow: "0 10px 30px rgba(0,0,0,0.8)"
                        }}
                    >
                        {/* Botão de Fechar */}
                        <button 
                            onClick={() => setSelectedItem(null)}
                            style={{
                                position: "absolute",
                                top: "10px",
                                right: "10px",
                                background: "rgba(0,0,0,0.7)",
                                color: "#fff",
                                border: "none",
                                borderRadius: "50%",
                                width: "35px",
                                height: "35px",
                                fontSize: "18px",
                                cursor: "pointer",
                                zIndex: 10,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            ✕
                        </button>

                        {/* Conteúdo Ampliado (Vídeo ou Imagem) */}
                        <div style={{ maxWidth: "100%", maxHeight: "75vh", display: "flex", justifyContent: "center", background: "#000", minWidth: selectedItem.type === "video" ? "500px" : "auto", minHeight: selectedItem.type === "video" ? "350px" : "auto" }}>
                            {selectedItem.type === "video" ? (
                                <iframe 
                                    src={getYouTubeEmbedUrl(selectedItem.url)} 
                                    title={selectedItem.title}
                                    style={{ width: "100%", height: "70vh", border: "none" }}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : (
                                <img 
                                    src={selectedItem.url || selectedItem.imageUrl} 
                                    alt={selectedItem.title} 
                                    style={{ maxWidth: "100%", maxHeight: "75vh", objectFit: "contain" }}
                                />
                            )}
                        </div>

                        {/* Informações no rodapé do Modal */}
                        <div style={{ padding: "20px", color: "#fff" }}>
                            <h3 style={{ margin: "0 0 5px 0", color: selectedItem.isAdmin ? (selectedItem.cardColor || "#ffd700") : "#fff" }}>
                                {selectedItem.title || "Sem título"}
                            </h3>
                            {selectedItem.isAdmin && (
                                <span style={{ fontSize: "12px", color: selectedItem.cardColor || "#ffd700", fontWeight: "bold" }}>
                                    👑 Publicação Oficial da Administração
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}