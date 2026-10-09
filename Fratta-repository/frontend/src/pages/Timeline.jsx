import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";

export function Timeline() {
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, "timeline"));
        
        const eventsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setTimelineEvents(eventsList);
      } catch (error) {
        console.error("Erro ao carregar a linha do tempo:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeline();
  }, []);

  if (loading) {
    return <p style={{ color: "var(--txt)", textAlign: "center", padding: "40px" }}>Carregando linha do tempo...</p>;
  }

  if (timelineEvents.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: "var(--txt)" }}>
        <p>Nenhum marco cadastrado na linha do tempo no momento.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "850px", margin: "0 auto", padding: "40px 20px", color: "var(--txt)" }}>
      <h2 style={{ textAlign: "center", marginBottom: "40px", fontSize: "clamp(24px, 4vw, 32px)" }}>
        Nossa História ⏳
      </h2>

      <div style={{ position: "relative", borderLeft: "3px solid rgba(255, 255, 255, 0.2)", marginLeft: "20px", paddingLeft: "30px", display: "flex", flexDirection: "column", gap: "40px" }}>
        {timelineEvents.map((item) => {
          const cardColor = item.cardColor || "#ffd700";

          return (
            <div key={item.id} style={{ position: "relative" }}>
              
              {/* Bolinha indicadora na linha */}
              <div style={{ 
                position: "absolute", 
                left: "-44.5px", 
                top: "15px", 
                width: "16px", 
                height: "16px", 
                borderRadius: "50%", 
                background: cardColor,
                border: "3px solid var(--aescuro, #121212)",
                boxShadow: `0 0 10px ${cardColor}`
              }} />

              {/* Card do Marco */}
              <div style={{ 
                background: "rgba(0, 0, 0, 0.25)", 
                padding: "20px", 
                borderRadius: "12px", 
                borderLeft: `5px solid ${cardColor}`,
                borderTop: "1px solid rgba(255, 255, 255, 0.05)",
                borderRight: "1px solid rgba(255, 255, 255, 0.05)",
                borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                boxSizing: "border-box",
                wordBreak: "break-word"
              }}>
                
                {/* Seção com layout Flexbox para deixar Imagem e Texto lado a lado */}
                <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", alignItems: "flex-start" }}>
                  
                  {/* Coluna da Imagem (se houver) */}
                  {item.imageUrl && (
                    <div style={{ flexShrink: 0, width: "160px", maxWidth: "100%" }}>
                      <img 
                        src={item.imageUrl} 
                        alt={item.title} 
                        style={{ 
                          width: "100%", 
                          height: "120px", 
                          objectFit: "cover", 
                          borderRadius: "8px", 
                          border: `1px solid ${cardColor}40`,
                          display: "block"
                        }} 
                      />
                    </div>
                  )}

                  {/* Coluna do Conteúdo (Data, Título e Descrição) */}
                  <div style={{ flex: 1, minWidth: "220px" }}>
                    
                    {/* Data / Período */}
                    <span style={{ 
                      display: "inline-block", 
                      fontSize: "12px", 
                      background: `${cardColor}20`, 
                      color: cardColor, 
                      padding: "3px 8px", 
                      borderRadius: "6px", 
                      fontWeight: "bold",
                      marginBottom: "6px" 
                    }}>
                      {item.date}
                    </span>

                    {/* Título */}
                    <h3 style={{ fontSize: "18px", margin: "2px 0 8px 0", color: "var(--txt)" }}>
                      {item.title}
                    </h3>

                    {/* Descrição */}
                    <p style={{ fontSize: "14px", opacity: 0.85, margin: 0, lineHeight: "1.5" }}>
                      {item.description}
                    </p>

                  </div>

                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Exporta também como TimeLine para evitar qualquer erro de digitação no App.jsx
export { Timeline as TimeLine };