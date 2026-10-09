import React, { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, deleteDoc, doc, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../services/firebase";
import { AddImage } from "../../components/AddImage";

export function AdminDashboard() {
  const [testimonials, setTestimonials] = useState([]);
  const [images, setImages] = useState([]);
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [poems, setPoems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para o depoimento oficial (Criação)
  const [adminTestimonialTitle, setAdminTestimonialTitle] = useState("");
  const [adminTestimonialAuthor, setAdminTestimonialAuthor] = useState("");
  const [adminTestimonialText, setAdminTestimonialText] = useState("");
  const [adminCardColor, setAdminCardColor] = useState("#ffd700");

  // Estado de Edição de Depoimento
  const [editingTestimonialId, setEditingTestimonialId] = useState(null);
  const [editTestTitle, setEditTestTitle] = useState("");
  const [editTestAuthor, setEditTestAuthor] = useState("");
  const [editTestText, setEditTestText] = useState("");
  const [editTestColor, setEditTestColor] = useState("#ffd700");

  // Estados para a Poesia Oficial (Criação)
  const [adminPoemTitle, setAdminPoemTitle] = useState("");
  const [adminPoemAuthor, setAdminPoemAuthor] = useState("");
  const [adminPoemSentBy, setAdminPoemSentBy] = useState("Administração");
  const [adminPoemText, setAdminPoemText] = useState("");
  const [adminPoemColor, setAdminPoemColor] = useState("#ffd700");

  // Estado de Edição de Poesia
  const [editingPoemId, setEditingPoemId] = useState(null);
  const [editPoemTitle, setEditPoemTitle] = useState("");
  const [editPoemAuthor, setEditPoemAuthor] = useState("");
  const [editPoemSentBy, setEditPoemSentBy] = useState("");
  const [editPoemText, setEditPoemText] = useState("");
  const [editPoemColor, setEditPoemColor] = useState("#ffd700");

  // Estados para o Vídeo Oficial do Admin (Criação)
  const [adminVideoTitle, setAdminVideoTitle] = useState("");
  const [adminVideoUrl, setAdminVideoUrl] = useState("");
  const [adminVideoColor, setAdminVideoColor] = useState("#ffd700");
  const [submittingVideo, setSubmittingVideo] = useState(false);

  // Estado de Edição de Galeria (Foto/Vídeo)
  const [editingImageId, setEditingImageId] = useState(null);
  const [editImageTitle, setEditImageTitle] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editImageColor, setEditImageColor] = useState("#ffd700");

  // Estados para a Linha do Tempo (Timeline - Criação)
  const [timelineTitle, setTimelineTitle] = useState("");
  const [timelineDate, setTimelineDate] = useState("");
  const [timelineDescription, setTimelineDescription] = useState("");
  const [timelineImageBase64, setTimelineImageBase64] = useState("");
  const [timelineColor, setTimelineColor] = useState("#ffd700");
  const [submittingTimeline, setSubmittingTimeline] = useState(false);

  // Estado de Edição de Timeline
  const [editingTimelineId, setEditingTimelineId] = useState(null);
  const [editTimelineTitle, setEditTimelineTitle] = useState("");
  const [editTimelineDate, setEditTimelineDate] = useState("");
  const [editTimelineDescription, setEditTimelineDescription] = useState("");
  const [editTimelineColor, setEditTimelineColor] = useState("#ffd700");

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
      setTestimonials(testimonialsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const imagesSnapshot = await getDocs(collection(db, "gallery"));
      setImages(imagesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const timelineSnapshot = await getDocs(collection(db, "timeline"));
      setTimelineEvents(timelineSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const poemsSnapshot = await getDocs(collection(db, "poems"));
      setPoems(poemsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

    } catch (error) {
      console.error("Erro ao carregar dados do painel:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- DEPOIMENTOS: Criar e Atualizar ---
  const handleCreateAdminTestimonial = async (e) => {
    e.preventDefault();
    if (!adminTestimonialTitle || !adminTestimonialAuthor || !adminTestimonialText) {
      return alert("Preencha todos os campos do depoimento!");
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
      fetchData();
    } catch (error) {
      console.error("Erro ao postar depoimento:", error);
    }
  };

  const handleUpdateTestimonial = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, "testimonials", editingTestimonialId), {
        title: editTestTitle,
        author: editTestAuthor,
        text: editTestText,
        cardColor: editTestColor
      });
      setEditingTestimonialId(null);
      fetchData();
    } catch (error) {
      console.error("Erro ao atualizar depoimento:", error);
    }
  };

  // --- POESIAS: Criar e Atualizar ---
  const handleCreateAdminPoem = async (e) => {
    e.preventDefault();
    if (!adminPoemTitle || !adminPoemText) {
      return alert("Preencha o título e o texto da poesia!");
    }
    try {
      await addDoc(collection(db, "poems"), {
        title: adminPoemTitle,
        author: adminPoemAuthor || "Desconhecido",
        sentBy: adminPoemSentBy,
        text: adminPoemText,
        isApproved: true,
        isAdmin: true,
        cardColor: adminPoemColor,
        createdAt: new Date()
      });
      setAdminPoemTitle("");
      setAdminPoemAuthor("");
      setAdminPoemText("");
      fetchData();
    } catch (error) {
      console.error("Erro ao postar poesia:", error);
    }
  };

  const handleUpdatePoem = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, "poems", editingPoemId), {
        title: editPoemTitle,
        author: editPoemAuthor,
        sentBy: editPoemSentBy,
        text: editPoemText,
        cardColor: editPoemColor
      });
      setEditingPoemId(null);
      fetchData();
    } catch (error) {
      console.error("Erro ao atualizar poesia:", error);
    }
  };

  // --- GALERIA: Criar e Atualizar ---
  const handleCreateAdminVideo = async (e) => {
    e.preventDefault();
    if (!adminVideoTitle || !adminVideoUrl) return alert("Preencha título e link!");
    try {
      setSubmittingVideo(true);
      await addDoc(collection(db, "gallery"), {
        title: adminVideoTitle,
        url: adminVideoUrl,
        type: "video",
        isApproved: true,
        isAdmin: true,
        cardColor: adminVideoColor,
        createdAt: new Date()
      });
      setAdminVideoTitle("");
      setAdminVideoUrl("");
      fetchData();
    } catch (error) {
      console.error("Erro ao salvar vídeo:", error);
    } finally {
      setSubmittingVideo(false);
    }
  };

  const handleUpdateImage = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, "gallery", editingImageId), {
        title: editImageTitle,
        url: editImageUrl,
        cardColor: editImageColor
      });
      setEditingImageId(null);
      fetchData();
    } catch (error) {
      console.error("Erro ao atualizar item da galeria:", error);
    }
  };

  // --- TIMELINE: Criar e Atualizar ---
  const handleTimelineImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setTimelineImageBase64(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCreateTimeline = async (e) => {
    e.preventDefault();
    if (!timelineTitle || !timelineDate || !timelineDescription) return alert("Preencha os campos obrigatórios!");
    try {
      setSubmittingTimeline(true);
      await addDoc(collection(db, "timeline"), {
        title: timelineTitle,
        date: timelineDate,
        description: timelineDescription,
        imageUrl: timelineImageBase64 || "",
        cardColor: timelineColor,
        createdAt: serverTimestamp()
      });
      setTimelineTitle("");
      setTimelineDate("");
      setTimelineDescription("");
      setTimelineImageBase64("");
      fetchData();
    } catch (error) {
      console.error("Erro ao salvar marco:", error);
    } finally {
      setSubmittingTimeline(false);
    }
  };

  const handleUpdateTimeline = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, "timeline", editingTimelineId), {
        title: editTimelineTitle,
        date: editTimelineDate,
        description: editTimelineDescription,
        cardColor: editTimelineColor
      });
      setEditingTimelineId(null);
      fetchData();
    } catch (error) {
      console.error("Erro ao atualizar timeline:", error);
    }
  };

  // --- AÇÕES GERAIS DE DELEÇÃO E APROVAÇÃO ---
  const handleApprove = async (collectionName, id) => {
    await updateDoc(doc(db, collectionName, id), { isApproved: true });
    fetchData();
  };

  const handleDelete = async (collectionName, id) => {
    if (window.confirm("Deseja realmente excluir este registro?")) {
      await deleteDoc(doc(db, collectionName, id));
      fetchData();
    }
  };

  const getYouTubeThumbnail = (url) => {
    if (!url) return "";
    let videoId = "";
    if (url.includes("youtu.be/")) videoId = url.split("youtu.be/")[1]?.split("?")[0];
    else if (url.includes("watch?v=")) videoId = url.split("watch?v=")[1]?.split("&")[0];
    else if (url.includes("/shorts/")) videoId = url.split("/shorts/")[1]?.split("?")[0];
    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "";
  };

  if (loading) return <p style={{ color: "var(--txt)", textAlign: "center", marginTop: "50px" }}>Carregando painel...</p>;

  return (
    <div style={{ padding: "80px 15px", color: "var(--txt)", maxWidth: "1400px", margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
      
      {/* CABEÇALHO */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px", marginBottom: "30px", borderBottom: `2px solid ${adminThemeColor}`, paddingBottom: "15px" }}>
        <div>
          <h1 style={{ fontSize: "clamp(22px, 4vw, 32px)", margin: 0, color: adminThemeColor }}>Painel Administrativo 💙</h1>
          <p style={{ margin: "5px 0 0 0", opacity: 0.8, fontSize: "clamp(13px, 2vw, 15px)" }}>
            Gerencie o site, modere conteúdos e edite registros livremente.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "rgba(0,0,0,0.2)", padding: "10px 15px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)" }}>
          <label htmlFor="colorPicker" style={{ fontSize: "13px", fontWeight: "bold" }}>🎨 Tema:</label>
          <input 
            id="colorPicker"
            type="color" 
            value={adminThemeColor} 
            onChange={handleColorChange}
            style={{ width: "35px", height: "30px", border: "none", borderRadius: "4px", cursor: "pointer", background: "transparent" }}
          />
        </div>
      </div>

      {/* Grid com as colunas */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "30px", alignItems: "start" }}>
        
        {/* COLUNA 1: DEPOIMENTOS */}
        <div style={{ background: "var(--aescuro)", padding: "20px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", boxSizing: "border-box" }}>
          <h3 style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "8px" }}>💬 Depoimentos ({testimonials.length})</h3>
          
          {/* Formulário de Edição (Se ativo) */}
          {editingTestimonialId ? (
            <form onSubmit={handleUpdateTestimonial} style={{ background: "rgba(33, 150, 243, 0.15)", padding: "12px", borderRadius: "8px", border: "1px solid #2196f3", marginBottom: "15px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <h4 style={{ fontSize: "13px", color: "#2196f3", margin: 0 }}>✏️ Editando Depoimento</h4>
              <input type="text" value={editTestTitle} onChange={(e) => setEditTestTitle(e.target.value)} style={{ padding: "6px", borderRadius: "4px", background: "transparent", color: "var(--txt)", border: "1px solid #2196f3" }} required />
              <input type="text" value={editTestAuthor} onChange={(e) => setEditTestAuthor(e.target.value)} style={{ padding: "6px", borderRadius: "4px", background: "transparent", color: "var(--txt)", border: "1px solid #2196f3" }} required />
              <textarea value={editTestText} onChange={(e) => setEditTestText(e.target.value)} rows="2" style={{ padding: "6px", borderRadius: "4px", background: "transparent", color: "var(--txt)", border: "1px solid #2196f3" }} required />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <input type="color" value={editTestColor} onChange={(e) => setEditTestColor(e.target.value)} style={{ width: "30px", height: "22px", background: "transparent", border: "none" }} />
                <div style={{ display: "flex", gap: "6px" }}>
                  <button type="submit" style={{ background: "#4BB543", color: "#fff", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer", fontSize: "11px" }}>Salvar</button>
                  <button type="button" onClick={() => setEditingTestimonialId(null)} style={{ background: "#777", color: "#fff", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer", fontSize: "11px" }}>Cancelar</button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleCreateAdminTestimonial} style={{ background: "rgba(0, 0, 0, 0.2)", padding: "12px", borderRadius: "8px", border: `1px dashed ${adminCardColor}`, marginBottom: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <h4 style={{ fontSize: "13px", color: adminCardColor, margin: 0 }}>👑 Criar Oficial</h4>
              <input type="text" placeholder="Título" value={adminTestimonialTitle} onChange={(e) => setAdminTestimonialTitle(e.target.value)} style={{ padding: "6px", borderRadius: "4px", border: `1px solid ${adminCardColor}`, background: "transparent", color: "var(--txt)", fontSize: "13px" }} />
              <input type="text" placeholder="Nome" value={adminTestimonialAuthor} onChange={(e) => setAdminTestimonialAuthor(e.target.value)} style={{ padding: "6px", borderRadius: "4px", border: `1px solid ${adminCardColor}`, background: "transparent", color: "var(--txt)", fontSize: "13px" }} />
              <textarea placeholder="Mensagem..." value={adminTestimonialText} onChange={(e) => setAdminTestimonialText(e.target.value)} rows="2" style={{ padding: "6px", borderRadius: "4px", border: `1px solid ${adminCardColor}`, background: "transparent", color: "var(--txt)", fontSize: "13px" }} />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <label style={{ fontSize: "12px" }}>Cor:</label>
                <input type="color" value={adminCardColor} onChange={(e) => setAdminCardColor(e.target.value)} style={{ width: "30px", height: "22px", background: "transparent", border: "none" }} />
              </div>
              <button type="submit" style={{ background: adminCardColor, color: "#000", fontWeight: "bold", border: "none", padding: "6px", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}>Publicar ✨</button>
            </form>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "15px", maxHeight: "500px", overflowY: "auto" }}>
            {testimonials.map((item) => {
              const isOfficial = item.isAdmin === true;
              const cardColor = item.cardColor || "#ffd700";
              return (
                <div key={item.id} style={{ background: isOfficial ? `linear-gradient(135deg, ${cardColor}20, rgba(0,0,0,0.3))` : "rgba(0,0,0,0.25)", padding: "14px", borderRadius: "8px", borderLeft: `5px solid ${cardColor}` }}>
                  <h4 style={{ fontSize: "15px", color: isOfficial ? cardColor : "var(--txt)", margin: "0 0 4px 0" }}>{item.title}</h4>
                  <span style={{ fontSize: "12px", opacity: 0.8 }}>Por: <b>{item.author}</b></span>
                  <p style={{ fontSize: "14px", margin: "8px 0" }}>{item.text}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px", flexWrap: "wrap", gap: "5px" }}>
                    <span style={{ fontSize: "12px", color: item.isApproved ? "#4BB543" : "#ffcc00", fontWeight: "bold" }}>{item.isApproved ? "✓ Aprovado" : "⏳ Pendente"}</span>
                    <div style={{ display: "flex", gap: "6px" }}>
                      {!item.isApproved && <button onClick={() => handleApprove("testimonials", item.id)} style={{ background: "#4BB543", color: "#fff", border: "none", padding: "4px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}>Aprovar</button>}
                      <button onClick={() => { setEditingTestimonialId(item.id); setEditTestTitle(item.title); setEditTestAuthor(item.author); setEditTestText(item.text); setEditTestColor(item.cardColor || "#ffd700"); }} style={{ background: "#2196f3", color: "#fff", border: "none", padding: "4px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}>✏️</button>
                      <button onClick={() => handleDelete("testimonials", item.id)} style={{ background: "#ff4d4d", color: "#fff", border: "none", padding: "4px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}>🗑️</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* COLUNA 2: POESIAS */}
        <div style={{ background: "var(--aescuro)", padding: "20px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", boxSizing: "border-box" }}>
          <h3 style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "8px" }}>📜 Poesias ({poems.length})</h3>
          
          {editingPoemId ? (
            <form onSubmit={handleUpdatePoem} style={{ background: "rgba(33, 150, 243, 0.15)", padding: "12px", borderRadius: "8px", border: "1px solid #2196f3", marginBottom: "15px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <h4 style={{ fontSize: "13px", color: "#2196f3", margin: 0 }}>✏️ Editando Poesia</h4>
              <input type="text" value={editPoemTitle} onChange={(e) => setEditPoemTitle(e.target.value)} style={{ padding: "6px", borderRadius: "4px", background: "transparent", color: "var(--txt)", border: "1px solid #2196f3" }} required />
              <input type="text" value={editPoemAuthor} onChange={(e) => setEditPoemAuthor(e.target.value)} style={{ padding: "6px", borderRadius: "4px", background: "transparent", color: "var(--txt)", border: "1px solid #2196f3" }} />
              <textarea value={editPoemText} onChange={(e) => setEditPoemText(e.target.value)} rows="3" style={{ padding: "6px", borderRadius: "4px", background: "transparent", color: "var(--txt)", border: "1px solid #2196f3" }} required />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <input type="color" value={editPoemColor} onChange={(e) => setEditPoemColor(e.target.value)} style={{ width: "30px", height: "22px", background: "transparent", border: "none" }} />
                <div style={{ display: "flex", gap: "6px" }}>
                  <button type="submit" style={{ background: "#4BB543", color: "#fff", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer", fontSize: "11px" }}>Salvar</button>
                  <button type="button" onClick={() => setEditingPoemId(null)} style={{ background: "#777", color: "#fff", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer", fontSize: "11px" }}>Cancelar</button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleCreateAdminPoem} style={{ background: "rgba(0, 0, 0, 0.2)", padding: "12px", borderRadius: "8px", border: `1px dashed ${adminPoemColor}`, marginBottom: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <h4 style={{ fontSize: "13px", color: adminPoemColor, margin: 0 }}>👑 Criar Oficial</h4>
              <input type="text" placeholder="Título" value={adminPoemTitle} onChange={(e) => setAdminPoemTitle(e.target.value)} style={{ padding: "6px", borderRadius: "4px", border: `1px solid ${adminPoemColor}`, background: "transparent", color: "var(--txt)", fontSize: "13px" }} />
              <input type="text" placeholder="Autor" value={adminPoemAuthor} onChange={(e) => setAdminPoemAuthor(e.target.value)} style={{ padding: "6px", borderRadius: "4px", border: `1px solid ${adminPoemColor}`, background: "transparent", color: "var(--txt)", fontSize: "13px" }} />
              <textarea placeholder="Texto..." value={adminPoemText} onChange={(e) => setAdminPoemText(e.target.value)} rows="2" style={{ padding: "6px", borderRadius: "4px", border: `1px solid ${adminPoemColor}`, background: "transparent", color: "var(--txt)", fontSize: "13px" }} />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <label style={{ fontSize: "12px" }}>Cor:</label>
                <input type="color" value={adminPoemColor} onChange={(e) => setAdminPoemColor(e.target.value)} style={{ width: "30px", height: "22px", background: "transparent", border: "none" }} />
              </div>
              <button type="submit" style={{ background: adminPoemColor, color: "#000", fontWeight: "bold", border: "none", padding: "6px", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}>Publicar 📜</button>
            </form>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "15px", maxHeight: "500px", overflowY: "auto" }}>
            {poems.map((poem) => {
              const isOfficial = poem.isAdmin === true;
              const cardColor = poem.cardColor || "#ffd700";
              return (
                <div key={poem.id} style={{ background: isOfficial ? `linear-gradient(135deg, ${cardColor}20, rgba(0,0,0,0.3))` : "rgba(0,0,0,0.25)", padding: "14px", borderRadius: "8px", borderLeft: `4px solid ${cardColor}` }}>
                  <h4 style={{ fontSize: "15px", color: isOfficial ? cardColor : "var(--txt)", margin: "0 0 4px 0" }}>{poem.title}</h4>
                  <span style={{ fontSize: "12px", opacity: 0.8 }}>Autor: <b>{poem.author}</b></span>
                  <p style={{ fontSize: "13px", fontStyle: "italic", margin: "6px 0" }}>"{poem.text}"</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px", flexWrap: "wrap", gap: "5px" }}>
                    <span style={{ fontSize: "12px", color: poem.isApproved ? "#4BB543" : "#ffcc00", fontWeight: "bold" }}>{poem.isApproved ? "✓ Aprovado" : "⏳ Pendente"}</span>
                    <div style={{ display: "flex", gap: "6px" }}>
                      {!poem.isApproved && <button onClick={() => handleApprove("poems", poem.id)} style={{ background: "#4BB543", color: "#fff", border: "none", padding: "4px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}>Aprovar</button>}
                      <button onClick={() => { setEditingPoemId(poem.id); setEditPoemTitle(poem.title); setEditPoemAuthor(poem.author || ""); setEditPoemSentBy(poem.sentBy || ""); setEditPoemText(poem.text); setEditPoemColor(poem.cardColor || "#ffd700"); }} style={{ background: "#2196f3", color: "#fff", border: "none", padding: "4px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}>✏️</button>
                      <button onClick={() => handleDelete("poems", poem.id)} style={{ background: "#ff4d4d", color: "#fff", border: "none", padding: "4px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}>🗑️</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* COLUNA 3: GALERIA */}
        <div style={{ background: "var(--aescuro)", padding: "20px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", boxSizing: "border-box" }}>
          <h3 style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "8px" }}>🖼️ Galeria ({images.length})</h3>
          
          {editingImageId ? (
            <form onSubmit={handleUpdateImage} style={{ background: "rgba(33, 150, 243, 0.15)", padding: "12px", borderRadius: "8px", border: "1px solid #2196f3", marginBottom: "15px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <h4 style={{ fontSize: "13px", color: "#2196f3", margin: 0 }}>✏️ Editando Mídia</h4>
              <input type="text" value={editImageTitle} onChange={(e) => setEditImageTitle(e.target.value)} placeholder="Título/Legenda" style={{ padding: "6px", borderRadius: "4px", background: "transparent", color: "var(--txt)", border: "1px solid #2196f3" }} required />
              <input type="text" value={editImageUrl} onChange={(e) => setEditImageUrl(e.target.value)} placeholder="Link ou URL" style={{ padding: "6px", borderRadius: "4px", background: "transparent", color: "var(--txt)", border: "1px solid #2196f3" }} required />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <input type="color" value={editImageColor} onChange={(e) => setEditImageColor(e.target.value)} style={{ width: "30px", height: "22px", background: "transparent", border: "none" }} />
                <div style={{ display: "flex", gap: "6px" }}>
                  <button type="submit" style={{ background: "#4BB543", color: "#fff", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer", fontSize: "11px" }}>Salvar</button>
                  <button type="button" onClick={() => setEditingImageId(null)} style={{ background: "#777", color: "#fff", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer", fontSize: "11px" }}>Cancelar</button>
                </div>
              </div>
            </form>
          ) : (
            <>
              <AddImage onImageAdded={fetchData} adminThemeColor={adminThemeColor} />
              <form onSubmit={handleCreateAdminVideo} style={{ background: "rgba(0, 0, 0, 0.2)", padding: "12px", borderRadius: "8px", border: `1px dashed #e09f3e`, margin: "15px 0", display: "flex", flexDirection: "column", gap: "8px" }}>
                <h4 style={{ fontSize: "13px", color: "#e09f3e", margin: 0 }}>🎬 Vídeo Oficial YouTube</h4>
                <input type="text" placeholder="Título" value={adminVideoTitle} onChange={(e) => setAdminVideoTitle(e.target.value)} style={{ padding: "6px", borderRadius: "4px", border: `1px solid #e09f3e`, background: "transparent", color: "var(--txt)", fontSize: "13px" }} />
                <input type="text" placeholder="Link do YouTube" value={adminVideoUrl} onChange={(e) => setAdminVideoUrl(e.target.value)} style={{ padding: "6px", borderRadius: "4px", border: `1px solid #e09f3e`, background: "transparent", color: "var(--txt)", fontSize: "13px" }} />
                <button type="submit" disabled={submittingVideo} style={{ background: "#e09f3e", color: "#000", fontWeight: "bold", border: "none", padding: "6px", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}>Publicar Vídeo</button>
              </form>
            </>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "15px", maxHeight: "400px", overflowY: "auto", marginTop: "15px" }}>
            {images.map((item) => {
              const isOfficial = item.isAdmin === true;
              const cardColor = item.cardColor || "#ffd700";
              const isVideo = item.type === "video";
              const mediaSource = isVideo ? getYouTubeThumbnail(item.url) : (item.url || item.imageUrl);
              return (
                <div key={item.id} style={{ display: "flex", gap: "10px", background: "rgba(0,0,0,0.25)", padding: "10px", borderRadius: "8px", borderLeft: `4px solid ${cardColor}`, alignItems: "center" }}>
                  <img src={mediaSource} alt="Mídia" style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "4px" }} />
                  <div style={{ flex: 1, minWidth: "120px" }}>
                    <h4 style={{ fontSize: "13px", margin: "0 0 4px 0", color: isOfficial ? cardColor : "var(--txt)" }}>{item.title || "Sem título"}</h4>
                    <span style={{ fontSize: "11px", color: item.isApproved ? "#4BB543" : "#ffcc00", fontWeight: "bold", display: "block", marginBottom: "6px" }}>{item.isApproved ? "✓ Aprovado" : "⏳ Pendente"}</span>
                    <div style={{ display: "flex", gap: "5px" }}>
                      {!item.isApproved && <button onClick={() => handleApprove("gallery", item.id)} style={{ background: "#4BB543", color: "#fff", border: "none", padding: "3px 6px", borderRadius: "4px", fontSize: "10px", fontWeight: "bold", cursor: "pointer" }}>Aprovar</button>}
                      <button onClick={() => { setEditingImageId(item.id); setEditImageTitle(item.title || ""); setEditImageUrl(item.url || item.imageUrl || ""); setEditImageColor(item.cardColor || "#ffd700"); }} style={{ background: "#2196f3", color: "#fff", border: "none", padding: "3px 6px", borderRadius: "4px", fontSize: "10px", fontWeight: "bold", cursor: "pointer" }}>✏️</button>
                      <button onClick={() => handleDelete("gallery", item.id)} style={{ background: "#ff4d4d", color: "#fff", border: "none", padding: "3px 6px", borderRadius: "4px", fontSize: "10px", fontWeight: "bold", cursor: "pointer" }}>🗑️</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* COLUNA 4: LINHA DO TEMPO */}
        <div style={{ background: "var(--aescuro)", padding: "20px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", boxSizing: "border-box" }}>
          <h3 style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "8px" }}>⏳ Linha do Tempo ({timelineEvents.length})</h3>
          
          {editingTimelineId ? (
            <form onSubmit={handleUpdateTimeline} style={{ background: "rgba(33, 150, 243, 0.15)", padding: "12px", borderRadius: "8px", border: "1px solid #2196f3", marginBottom: "15px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <h4 style={{ fontSize: "13px", color: "#2196f3", margin: 0 }}>✏️ Editando Marco</h4>
              <input type="text" value={editTimelineTitle} onChange={(e) => setEditTimelineTitle(e.target.value)} placeholder="Título" style={{ padding: "6px", borderRadius: "4px", background: "transparent", color: "var(--txt)", border: "1px solid #2196f3" }} required />
              <input type="text" value={editTimelineDate} onChange={(e) => setEditTimelineDate(e.target.value)} placeholder="Data" style={{ padding: "6px", borderRadius: "4px", background: "transparent", color: "var(--txt)", border: "1px solid #2196f3" }} required />
              <textarea value={editTimelineDescription} onChange={(e) => setEditTimelineDescription(e.target.value)} placeholder="Descrição" rows="2" style={{ padding: "6px", borderRadius: "4px", background: "transparent", color: "var(--txt)", border: "1px solid #2196f3" }} required />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <input type="color" value={editTimelineColor} onChange={(e) => setEditTimelineColor(e.target.value)} style={{ width: "30px", height: "22px", background: "transparent", border: "none" }} />
                <div style={{ display: "flex", gap: "6px" }}>
                  <button type="submit" style={{ background: "#4BB543", color: "#fff", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer", fontSize: "11px" }}>Salvar</button>
                  <button type="button" onClick={() => setEditingTimelineId(null)} style={{ background: "#777", color: "#fff", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer", fontSize: "11px" }}>Cancelar</button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleCreateTimeline} style={{ background: "rgba(0,0,0,0.2)", padding: "12px", borderRadius: "8px", border: `1px dashed ${adminThemeColor}`, marginBottom: "15px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <h4 style={{ fontSize: "13px", margin: 0, color: adminThemeColor }}>⏳ Adicionar Marco</h4>
              <input type="text" placeholder="Título" value={timelineTitle} onChange={(e) => setTimelineTitle(e.target.value)} style={{ padding: "6px", borderRadius: "4px", border: `1px solid ${adminThemeColor}`, background: "transparent", color: "var(--txt)", fontSize: "13px" }} required />
              <input type="text" placeholder="Data (Ex: 2023)" value={timelineDate} onChange={(e) => setTimelineDate(e.target.value)} style={{ padding: "6px", borderRadius: "4px", border: `1px solid ${adminThemeColor}`, background: "transparent", color: "var(--txt)", fontSize: "13px" }} required />
              <textarea placeholder="Descrição..." value={timelineDescription} onChange={(e) => setTimelineDescription(e.target.value)} rows="2" style={{ padding: "6px", borderRadius: "4px", border: `1px solid ${adminThemeColor}`, background: "transparent", color: "var(--txt)", fontSize: "13px" }} required />
              <input type="file" accept="image/*" onChange={handleTimelineImageChange} style={{ fontSize: "11px", color: "var(--txt)" }} />
              <button type="submit" disabled={submittingTimeline} style={{ background: adminThemeColor, color: "#000", border: "none", padding: "6px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", fontSize: "12px" }}>Publicar Marco</button>
            </form>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "15px", maxHeight: "500px", overflowY: "auto" }}>
            {timelineEvents.map((item) => {
              const cardColor = item.cardColor || "#ffd700";
              return (
                <div key={item.id} style={{ background: "rgba(0,0,0,0.25)", padding: "12px", borderRadius: "8px", borderLeft: `4px solid ${cardColor}` }}>
                  {item.imageUrl && <img src={item.imageUrl} alt="Timeline" style={{ width: "100%", height: "80px", objectFit: "cover", borderRadius: "4px", marginBottom: "6px" }} />}
                  <span style={{ fontSize: "11px", background: `${cardColor}20`, color: cardColor, padding: "2px 6px", borderRadius: "4px", fontWeight: "bold" }}>{item.date}</span>
                  <h4 style={{ fontSize: "14px", margin: "4px 0" }}>{item.title}</h4>
                  <p style={{ fontSize: "12px", opacity: 0.8, margin: "0 0 10px 0" }}>{item.description}</p>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button onClick={() => { setEditingTimelineId(item.id); setEditTimelineTitle(item.title); setEditTimelineDate(item.date); setEditTimelineDescription(item.description); setEditTimelineColor(item.cardColor || "#ffd700"); }} style={{ background: "#2196f3", color: "#fff", border: "none", padding: "4px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}>✏️ Editar</button>
                    <button onClick={() => handleDelete("timeline", item.id)} style={{ background: "#ff4d4d", color: "#fff", border: "none", padding: "4px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}>🗑️ Excluir</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

export { AdminDashboard as Dashboard };