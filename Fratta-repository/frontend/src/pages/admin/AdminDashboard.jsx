import React, { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, deleteDoc, doc, addDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { AddImage } from "../../components/AddImage";

export function AdminDashboard() {
  const [testimonials, setTestimonials] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para o depoimento oficial
  const [adminTestimonialTitle, setAdminTestimonialTitle] = useState("");
  const [adminTestimonialAuthor, setAdminTestimonialAuthor] = useState("");
  const [adminTestimonialText, setAdminTestimonialText] = useState("");
  const [adminCardColor, setAdminCardColor] = useState("#ffd700");

  // Estados para o Vídeo Oficial do Admin
  const [adminVideoTitle, setAdminVideoTitle] = useState("");
  const [adminVideoUrl, setAdminVideoUrl] = useState("");
  const [adminVideoColor, setAdminVideoColor] = useState("#ffd700");
  const [submittingVideo, setSubmittingVideo] = useState(false);

  const [adminThemeColor, setAdminThemeColor] = useState(() => {
    return localStorage.getItem("adminThemeColor") || "#3b82f6";
  });

  const handleColorChange = (e) => {
    const newColor = e.target.value;
    setAdminThemeColor(newColor);
    localStorage.setItem("adminThemeColor", newColor);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const testimonialsSnapshot = await getDocs(collection(db, "testimonials"));
      const testimonialsList = testimonialsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTestimonials(testimonialsList);

      const imagesSnapshot = await getDocs(collection(db, "gallery"));
      const imagesList = imagesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setImages(imagesList);

    } catch (error) {
      console.error("Erro ao carregar dados do painel:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Publicar Depoimento Oficial do Admin
  const handleCreateAdminTestimonial = async (e) => {
    e.preventDefault();
    if (!adminTestimonialTitle || !adminTestimonialAuthor || !adminTestimonialText) {
      return alert("Preencha o título, o seu nome e o texto do depoimento!");
    }

    try {
      await addDoc(collection(db, "testimonials"), {
        title: adminTestimonialTitle,
        text: adminTestimonialText,
        author: adminTestimonialAuthor,
        isApproved: true,
        isAdmin: true,
        cardColor: adminCardColor,
        createdAt: new Date()
      });
      setAdminTestimonialTitle("");
      setAdminTestimonialAuthor("");
      setAdminTestimonialText("");
      alert("Depoimento oficial publicado com sucesso!");
      fetchData();
    } catch (error) {
      console.error("Erro ao postar depoimento oficial:", error);
    }
  };

  // Publicar Vídeo Oficial do Admin na Galeria
  const handleCreateAdminVideo = async (e) => {
    e.preventDefault();
    if (!adminVideoTitle || !adminVideoUrl) {
      return alert("Preencha o título e o link do YouTube do vídeo!");
    }

    try {
      setSubmittingVideo(true);
      await addDoc(collection(db, "gallery"), {
        title: adminVideoTitle,
        url: adminVideoUrl,
        type: "video",       // Identifica explicitamente como vídeo
        isApproved: true,    // Já nasce aprovado
        isAdmin: true,       // Selo de admin
        cardColor: adminVideoColor,
        createdAt: new Date()
      });
      setAdminVideoTitle("");
      setAdminVideoUrl("");
      alert("Vídeo oficial adicionado à galeria com sucesso!");
      fetchData();
    } catch (error) {
      console.error("Erro ao adicionar vídeo oficial:", error);
      alert("Erro ao salvar vídeo.");
    } finally {
      setSubmittingVideo(false);
    }
  };

  const handleApproveTestimonial = async (id) => {
    try {
      await updateDoc(doc(db, "testimonials", id), { isApproved: true });
      fetchData();
    } catch (error) {
      console.error("Erro ao aprovar depoimento:", error);
    }
  };

  const handleDeleteTestimonial = async (id) => {
    if (window.confirm("Deseja realmente excluir este depoimento?")) {
      try {
        await deleteDoc(doc(db, "testimonials", id));
        fetchData();
      } catch (error) {
        console.error("Erro ao excluir depoimento:", error);
      }
    }
  };

  const handleApproveImage = async (id) => {
    try {
      await updateDoc(doc(db, "gallery", id), { isApproved: true });
      fetchData();
    } catch (error) {
      console.error("Erro ao aprovar item:", error);
    }
  };

  const handleDeleteImage = async (id) => {
    if (window.confirm("Deseja realmente remover este item da galeria?")) {
      try {
        await deleteDoc(doc(db, "gallery", id));
        fetchData();
      } catch (error) {
        console.error("Erro ao excluir item:", error);
      }
    }
  };

  // Função auxiliar para extrair ID do YouTube e mostrar uma prévia na miniatura do admin
  const getYouTubeThumbnail = (url) => {
    if (!url) return "";
    let videoId = "";
    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0];
    } else if (url.includes("watch?v=")) {
      videoId = url.split("watch?v=")[1]?.split("&")[0];
    } else if (url.includes("/shorts/")) {
      videoId = url.split("/shorts/")[1]?.split("?")[0];
    }
    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "";
  };

  if (loading) return <p style={{ color: "var(--txt)", textAlign: "center", marginTop: "50px" }}>Carregando painel...</p>;

  return (
    <div style={{ padding: "80px 15px", color: "var(--txt)", maxWidth: "1200px", margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
      
      {/* CABEÇALHO */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px", marginBottom: "30px", borderBottom: `2px solid ${adminThemeColor}`, paddingBottom: "15px" }}>
        <div>
          <h1 style={{ fontSize: "clamp(22px, 4vw, 32px)", margin: 0, color: adminThemeColor }}>Painel Administrativo 💙</h1>
          <p style={{ margin: "5px 0 0 0", opacity: 0.8, fontSize: "clamp(13px, 2vw, 15px)" }}>
            Gerencie o site, modere conteúdos e publique mídias oficiais da administração.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "rgba(0,0,0,0.2)", padding: "10px 15px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)" }}>
          <label htmlFor="colorPicker" style={{ fontSize: "13px", fontWeight: "bold" }}>🎨 Tema do Painel:</label>
          <input 
            id="colorPicker"
            type="color" 
            value={adminThemeColor} 
            onChange={handleColorChange}
            style={{ width: "35px", height: "30px", border: "none", borderRadius: "4px", cursor: "pointer", background: "transparent" }}
          />
        </div>
      </div>

      {/* Grid responsivo */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "30px", alignItems: "start" }}>
        
        {/* COLUNA 1: DEPOIMENTOS */}
        <div style={{ background: "var(--aescuro)", padding: "20px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", boxSizing: "border-box" }}>
          <h3 style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "8px" }}>💬 Depoimentos ({testimonials.length})</h3>
          
          {/* Formulário para criar Depoimento Oficial do Admin */}
          <form onSubmit={handleCreateAdminTestimonial} style={{ background: "rgba(0, 0, 0, 0.2)", padding: "12px", borderRadius: "8px", border: `1px dashed ${adminCardColor}`, marginBottom: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <h4 style={{ fontSize: "13px", color: adminCardColor, margin: 0 }}>👑 Criar Depoimento Oficial</h4>
            
            <input 
              type="text" 
              placeholder="Título do recado" 
              value={adminTestimonialTitle} 
              onChange={(e) => setAdminTestimonialTitle(e.target.value)}
              style={{ padding: "6px", borderRadius: "4px", border: `1px solid ${adminCardColor}`, background: "transparent", color: "var(--txt)", fontSize: "13px" }}
            />

            <input 
              type="text" 
              placeholder="Seu Nome (Ex: Carlos / Equipe)" 
              value={adminTestimonialAuthor} 
              onChange={(e) => setAdminTestimonialAuthor(e.target.value)}
              style={{ padding: "6px", borderRadius: "4px", border: `1px solid ${adminCardColor}`, background: "transparent", color: "var(--txt)", fontSize: "13px" }}
            />
            
            <textarea 
              placeholder="Escreva sua mensagem oficial..." 
              value={adminTestimonialText} 
              onChange={(e) => setAdminTestimonialText(e.target.value)}
              rows="2"
              style={{ padding: "6px", borderRadius: "4px", border: `1px solid ${adminCardColor}`, background: "transparent", color: "var(--txt)", fontSize: "13px", resize: "vertical" }}
            />

            {/* Seletor de cor do card */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(0,0,0,0.2)", padding: "6px 8px", borderRadius: "4px" }}>
              <label htmlFor="adminCardColorPicker" style={{ fontSize: "12px", fontWeight: "bold" }}>🎨 Cor do Card:</label>
              <input 
                id="adminCardColorPicker"
                type="color" 
                value={adminCardColor} 
                onChange={(e) => setAdminCardColor(e.target.value)}
                style={{ width: "30px", height: "22px", border: "none", borderRadius: "4px", cursor: "pointer", background: "transparent" }}
              />
            </div>

            <button type="submit" style={{ background: adminCardColor, color: "#000", fontWeight: "bold", border: "none", padding: "6px", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}>
              Publicar com esta cor ✨
            </button>
          </form>

          {testimonials.length === 0 ? (
            <p style={{ fontSize: "14px" }}>Nenhum depoimento enviado.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "15px", maxHeight: "500px", overflowY: "auto" }}>
              {testimonials.map((item) => {
                const isOfficialAdmin = item.isAdmin === true;
                const cardColor = item.cardColor || "#ffd700";

                return (
                  <div 
                    key={item.id} 
                    style={{ 
                      background: isOfficialAdmin ? `linear-gradient(135deg, ${cardColor}20, rgba(0,0,0,0.3))` : "rgba(0,0,0,0.25)", 
                      padding: "14px", 
                      borderRadius: "8px", 
                      borderLeft: isOfficialAdmin ? `5px solid ${cardColor}` : "4px solid rgba(255,255,255,0.2)",
                      borderTop: isOfficialAdmin ? `1px solid ${cardColor}50` : "1px solid rgba(255,255,255,0.05)",
                      borderRight: isOfficialAdmin ? `1px solid ${cardColor}50` : "1px solid rgba(255,255,255,0.05)",
                      borderBottom: isOfficialAdmin ? `1px solid ${cardColor}50` : "1px solid rgba(255,255,255,0.05)",
                      wordBreak: "break-word" 
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
                      <h4 style={{ fontSize: "15px", color: isOfficialAdmin ? cardColor : "var(--txt)", margin: 0 }}>
                        {item.title}
                      </h4>
                      {isOfficialAdmin && (
                        <span style={{ background: cardColor, color: "#000", fontSize: "10px", fontWeight: "bold", padding: "2px 6px", borderRadius: "10px" }}>
                          👑 OFICIAL
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: "12px", opacity: 0.8, color: isOfficialAdmin ? cardColor : "inherit" }}>
                      Por: <strong>{item.author}</strong> {isOfficialAdmin && "(Admin)"}
                    </span>
                    <p style={{ fontSize: "14px", margin: "8px 0" }}>{item.text}</p>
                    
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px", flexWrap: "wrap", gap: "8px" }}>
                      <span style={{ fontSize: "12px", color: item.isApproved ? "#4BB543" : "#ffcc00", fontWeight: "bold" }}>
                        {item.isApproved ? "✓ Aprovado" : "⏳ Pendente"}
                      </span>
                      <div style={{ display: "flex", gap: "8px" }}>
                        {!item.isApproved && (
                          <button 
                            onClick={() => handleApproveTestimonial(item.id)}
                            style={{ background: "#4BB543", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}
                          >
                            Aprovar
                          </button>
                        )}
                        <button 
                          onClick={() => handleDeleteTestimonial(item.id)}
                          style={{ background: "#ff4d4d", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* COLUNA 2: GALERIA (FOTOS E VÍDEOS) */}
        <div style={{ background: "var(--aescuro)", padding: "20px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", boxSizing: "border-box" }}>
          <h3 style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "8px" }}>🖼️ Moderação da Galeria ({images.length})</h3>
          <p style={{ fontSize: "13px", opacity: 0.7, marginBottom: "15px" }}>Envie fotos oficiais, adicione vídeos ou modere os itens dos visitantes.</p>

          {/* Componente para adicionar Fotos */}
          <AddImage onImageAdded={fetchData} adminThemeColor={adminThemeColor} />

          {/* Formulário para Adicionar Vídeo Oficial do Admin */}
          <form onSubmit={handleCreateAdminVideo} style={{ background: "rgba(0, 0, 0, 0.2)", padding: "12px", borderRadius: "8px", border: `1px dashed #e09f3e`, margin: "20px 0", display: "flex", flexDirection: "column", gap: "8px" }}>
            <h4 style={{ fontSize: "13px", color: "#e09f3e", margin: 0 }}>🎬 Adicionar Vídeo Oficial (YouTube)</h4>
            
            <input 
              type="text" 
              placeholder="Título / Legenda do vídeo" 
              value={adminVideoTitle} 
              onChange={(e) => setAdminVideoTitle(e.target.value)}
              style={{ padding: "6px", borderRadius: "4px", border: `1px solid #e09f3e`, background: "transparent", color: "var(--txt)", fontSize: "13px" }}
            />

            <input 
              type="text" 
              placeholder="Link do YouTube (watch?v=... ou youtu.be/...)" 
              value={adminVideoUrl} 
              onChange={(e) => setAdminVideoUrl(e.target.value)}
              style={{ padding: "6px", borderRadius: "4px", border: `1px solid #e09f3e`, background: "transparent", color: "var(--txt)", fontSize: "13px" }}
            />

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(0,0,0,0.2)", padding: "6px 8px", borderRadius: "4px" }}>
              <label htmlFor="adminVideoColorPicker" style={{ fontSize: "12px", fontWeight: "bold" }}>🎨 Cor do Card:</label>
              <input 
                id="adminVideoColorPicker"
                type="color" 
                value={adminVideoColor} 
                onChange={(e) => setAdminVideoColor(e.target.value)}
                style={{ width: "30px", height: "22px", border: "none", borderRadius: "4px", cursor: "pointer", background: "transparent" }}
              />
            </div>

            <button 
              type="submit" 
              disabled={submittingVideo}
              style={{ background: "#e09f3e", color: "#000", fontWeight: "bold", border: "none", padding: "6px", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}
            >
              {submittingVideo ? "Enviando..." : "Publicar Vídeo Oficial 🎥"}
            </button>
          </form>

          {images.length === 0 ? (
            <p style={{ fontSize: "14px", marginTop: "20px" }}>Nenhum item cadastrado.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "15px", maxHeight: "500px", overflowY: "auto", marginTop: "20px" }}>
              {images.map((item) => {
                const isOfficialAdmin = item.isAdmin === true;
                const cardColor = item.cardColor || "#ffd700";
                const isVideo = item.type === "video";
                const mediaSource = isVideo ? getYouTubeThumbnail(item.url) : (item.url || item.imageUrl);

                return (
                  <div 
                    key={item.id} 
                    style={{ 
                      display: "flex", 
                      gap: "12px", 
                      background: isOfficialAdmin ? `linear-gradient(135deg, ${cardColor}20, rgba(0,0,0,0.3))` : "rgba(0,0,0,0.25)", 
                      padding: "10px", 
                      borderRadius: "8px", 
                      borderLeft: isOfficialAdmin ? `5px solid ${cardColor}` : "4px solid rgba(255,255,255,0.2)",
                      borderTop: isOfficialAdmin ? `1px solid ${cardColor}50` : "1px solid rgba(255,255,255,0.05)",
                      borderRight: isOfficialAdmin ? `1px solid ${cardColor}50` : "1px solid rgba(255,255,255,0.05)",
                      borderBottom: isOfficialAdmin ? `1px solid ${cardColor}50` : "1px solid rgba(255,255,255,0.05)",
                      alignItems: "center", 
                      flexWrap: "wrap" 
                    }}
                  >
                    <div style={{ position: "relative", flexShrink: 0 }}>
                      <img 
                        src={mediaSource} 
                        alt="Mídia da Galeria" 
                        style={{ width: "70px", height: "70px", objectFit: "cover", borderRadius: "6px", border: isOfficialAdmin ? `2px solid ${cardColor}` : "1px solid rgba(255,255,255,0.2)" }} 
                      />
                      {isVideo && (
                        <span style={{ position: "absolute", bottom: "4px", right: "4px", background: "rgba(0,0,0,0.8)", color: "#fff", fontSize: "9px", padding: "1px 4px", borderRadius: "4px" }}>
                          ▶ Vídeo
                        </span>
                      )}
                    </div>
                    
                    <div style={{ flex: 1, minWidth: "140px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h4 style={{ fontSize: "14px", margin: "0 0 5px 0", color: isOfficialAdmin ? cardColor : "var(--txt)", wordBreak: "break-word" }}>
                          {item.title || "Sem título"}
                        </h4>
                        {isOfficialAdmin && (
                          <span style={{ background: cardColor, color: "#000", fontSize: "9px", fontWeight: "bold", padding: "2px 5px", borderRadius: "8px" }}>
                            👑 OFICIAL
                          </span>
                        )}
                      </div>
                      
                      <span style={{ fontSize: "12px", display: "block", marginBottom: "8px", color: item.isApproved ? "#4BB543" : "#ffcc00", fontWeight: "bold" }}>
                        {item.isApproved ? "✓ Aprovado" : "⏳ Pendente"}
                      </span>
                      
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        {!item.isApproved && (
                          <button 
                            onClick={() => handleApproveImage(item.id)}
                            style={{ background: "#4BB543", color: "#fff", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}
                          >
                            Aprovar
                          </button>
                        )}
                        <button 
                          onClick={() => handleDeleteImage(item.id)}
                          style={{ background: "#ff4d4d", color: "#fff", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export { AdminDashboard as Dashboard };