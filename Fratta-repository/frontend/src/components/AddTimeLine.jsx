import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../services/firebase"; // Ajuste o caminho do firebase se necessário para o seu projeto

export function AddTimeline({ onTimelineAdded, adminColor = "#3b82f6" }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [customColor, setCustomColor] = useState("#ffd700");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !date || !description) {
      return alert("Preencha o título, a data e a descrição do marco!");
    }

    try {
      setLoading(true);
      await addDoc(collection(db, "timeline"), {
        title,
        date,
        description,
        imageUrl: imageBase64 || "", // Imagem opcional
        cardColor: customColor,
        createdAt: serverTimestamp()
      });

      setTitle("");
      setDate("");
      setDescription("");
      setImageBase64("");
      alert("Marco da linha do tempo adicionado com sucesso! 🕊️");
      if (onTimelineAdded) onTimelineAdded();
    } catch (error) {
      console.error("Erro ao adicionar item na timeline:", error);
      alert("Erro ao salvar marco.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "15px", background: "rgba(0,0,0,0.2)", padding: "12px", borderRadius: "8px", border: `1px dashed ${adminColor}` }}>
      <h4 style={{ fontSize: "13px", margin: 0, color: adminColor }}>⏳ Adicionar Marco na Linha do Tempo</h4>
      
      <input 
        type="text" 
        placeholder="Título do Momento" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)}
        style={{ padding: "6px", borderRadius: "4px", border: `1px solid ${adminColor}`, background: "transparent", color: "var(--txt)", fontSize: "13px" }}
        required
      />

      <input 
        type="text" 
        placeholder="Data ou Período (Ex: 2023 ou 12/05/2024)" 
        value={date} 
        onChange={(e) => setDate(e.target.value)}
        style={{ padding: "6px", borderRadius: "4px", border: `1px solid ${adminColor}`, background: "transparent", color: "var(--txt)", fontSize: "13px" }}
        required
      />

      <textarea 
        placeholder="Descrição do momento..." 
        value={description} 
        onChange={(e) => setDescription(e.target.value)}
        rows="3"
        style={{ padding: "6px", borderRadius: "4px", border: `1px solid ${adminColor}`, background: "transparent", color: "var(--txt)", fontSize: "13px", resize: "vertical" }}
        required
      />
      
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(0,0,0,0.2)", padding: "6px 8px", borderRadius: "4px" }}>
        <label htmlFor="timelineColor" style={{ fontSize: "12px", fontWeight: "bold" }}>🎨 Cor do Marco:</label>
        <input 
          id="timelineColor"
          type="color" 
          value={customColor} 
          onChange={(e) => setCustomColor(e.target.value)}
          style={{ width: "30px", height: "22px", border: "none", borderRadius: "4px", cursor: "pointer", background: "transparent" }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <label style={{ fontSize: "11px", opacity: 0.8 }}>Foto opcional (se não enviar, será apenas texto):</label>
        <input 
          type="file" 
          accept="image/*"
          onChange={handleImageChange}
          style={{ fontSize: "12px", color: "var(--txt)" }}
        />
      </div>

      {imageBase64 && (
        <p style={{ fontSize: "11px", color: "#4BB543", margin: 0 }}>✓ Imagem anexada!</p>
      )}

      <button 
        type="submit" 
        disabled={loading}
        style={{ background: adminColor, color: "#000", border: "none", padding: "6px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", fontSize: "12px" }}
      >
        {loading ? "Salvando..." : "Publicar na Linha do Tempo 🚀"}
      </button>
    </form>
  );
}