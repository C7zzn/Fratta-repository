import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../services/firebase";

export function AddImage({ onImageAdded, adminColor = "#3b82f6" }) {
  const [title, setTitle] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [customColor, setCustomColor] = useState("#ffd700"); // Cor escolhida pelo Admin para a foto
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
    if (!title || !imageBase64) return alert("Preencha o título e selecione uma imagem!");

    try {
      setLoading(true);
      await addDoc(collection(db, "gallery"), {
        title,
        url: imageBase64,
        isApproved: true,
        isAdmin: true,
        cardColor: customColor, // Salvando a cor escolhida pelo admin!
        createdAt: new Date()
      });
      setTitle("");
      setImageBase64("");
      alert("Foto oficial enviada com sucesso!");
      if (onImageAdded) onImageAdded();
    } catch (error) {
      console.error("Erro ao adicionar imagem:", error);
      alert("Erro ao enviar imagem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "20px", background: "rgba(0,0,0,0.15)", padding: "15px", borderRadius: "8px", border: `1px dashed ${adminColor}` }}>
      <h4 style={{ fontSize: "14px", margin: 0, color: adminColor }}>👑 Adicionar Foto Oficial (Admin)</h4>
      
      <input 
        type="text" 
        placeholder="Título da foto oficial" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)}
        style={{ padding: "8px", borderRadius: "4px", border: `1px solid ${adminColor}`, background: "transparent", color: "var(--txt)" }}
      />
      
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(0,0,0,0.2)", padding: "6px 10px", borderRadius: "4px" }}>
        <label htmlFor="imgColor" style={{ fontSize: "12px", fontWeight: "bold" }}>🎨 Cor do Card/Borda:</label>
        <input 
          id="imgColor"
          type="color" 
          value={customColor} 
          onChange={(e) => setCustomColor(e.target.value)}
          style={{ width: "30px", height: "25px", border: "none", borderRadius: "4px", cursor: "pointer", background: "transparent" }}
        />
      </div>

      <input 
        type="file" 
        accept="image/*"
        onChange={handleImageChange}
        style={{ fontSize: "12px", color: "var(--txt)" }}
      />

      {imageBase64 && (
        <p style={{ fontSize: "11px", color: "#4BB543", margin: 0 }}>✓ Imagem selecionada!</p>
      )}

      <button 
        type="submit" 
        disabled={loading}
        style={{ background: adminColor, color: "#fff", border: "none", padding: "8px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
      >
        {loading ? "Enviando..." : "Publicar como Admin 🚀"}
      </button>
    </form>
  );
}