import React, { useEffect, useState } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { db, auth } from "../services/firebase";
import { onAuthStateChanged } from "firebase/auth";

export function Poems() {
  const [poems, setPoems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Estados do formulário de envio público (Visitantes)
  const [formTitle, setFormTitle] = useState("");
  const [formSentBy, setFormSentBy] = useState("");
  const [formAuthor, setFormAuthor] = useState("");
  const [formText, setFormText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Estados para edição (Caso o Admin use direto na página)
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editSentBy, setEditSentBy] = useState("");
  const [editAuthor, setEditAuthor] = useState("");
  const [editText, setEditText] = useState("");
  const [editCardColor, setEditCardColor] = useState("#ffd700");
  const [showEditModal, setShowEditModal] = useState(false);

  // Verifica se o usuário é admin
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAdmin(!!user);
    });
    return () => unsubscribe();
  }, []);

  // Busca as poesias aprovadas do Firestore (ou todas se for admin)
  const fetchPoems = async () => {
    try {
      setLoading(true);
      let querySnapshot;
      
      if (isAdmin) {
        // Se for admin, pode ver tudo para gerenciar se quiser
        querySnapshot = await getDocs(collection(db, "poems"));
      } else {
        // Usuários comuns veem apenas as aprovadas
        const q = query(collection(db, "poems"), where("isApproved", "==", true));
        querySnapshot = await getDocs(q);
      }

      const list = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPoems(list);
    } catch (error) {
      console.error("Erro ao carregar poesias:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoems();
  }, [isAdmin]);

  // Envio de poesia por visitantes (Pendente de moderação)
  const handlePublicSubmit = async (e) => {
    e.preventDefault();
    if (!formTitle || !formText || !formSentBy) {
      return alert("Preencha o Título, o seu Nome e o Texto da poesia!");
    }

    try {
      setSubmitting(true);
      await addDoc(collection(db, "poems"), {
        title: formTitle,
        sentBy: formSentBy,
        author: formAuthor || formSentBy,
        text: formText,
        cardColor: "#ffd700",
        isApproved: false, // 🛑 Requer moderação
        isAdmin: false,
        createdAt: new Date()
      });

      setFormTitle("");
      setFormSentBy("");
      setFormAuthor("");
      setFormText("");
      setSuccessMsg("Poesia enviada com sucesso! Ela passará por moderação antes de aparecer no site.");
      setTimeout(() => setSuccessMsg(""), 6000);
    } catch (error) {
      console.error("Erro ao enviar poesia:", error);
      alert("Erro ao enviar poesia. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  // Salvar Edição
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingId) return;

    try {
      const poemRef = doc(db, "poems", editingId);
      await updateDoc(poemRef, {
        title: editTitle,
        sentBy: editSentBy,
        author: editAuthor,
        text: editText,
        cardColor: editCardColor
      });
      handleCancelEdit();
      fetchPoems();
    } catch (error) {
      console.error("Erro ao atualizar poesia:", error);
    }
  };

  const handleEdit = (poem) => {
    setEditingId(poem.id);
    setEditTitle(poem.title || "");
    setEditSentBy(poem.sentBy || "");
    setEditAuthor(poem.author || "");
    setEditText(poem.text || "");
    setEditCardColor(poem.cardColor || "#ffd700");
    setShowEditModal(true);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setShowEditModal(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Deseja realmente excluir esta poesia?")) {
      try {
        await deleteDoc(doc(db, "poems", id));
        fetchPoems();
      } catch (error) {
        console.error("Erro ao excluir poesia:", error);
      }
    }
  };

  if (loading) {
    return <p style={{ color: "var(--txt)", textAlign: "center", padding: "40px" }}>Carregando poesias...</p>;
  }

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 20px", color: "var(--txt)", boxSizing: "border-box" }}>
      <h2 style={{ textAlign: "center", marginBottom: "10px", fontSize: "clamp(24px, 4vw, 32px)" }}>
        Poesias & Lembranças 📜
      </h2>
      <p style={{ textAlign: "center", marginBottom: "40px", opacity: 0.8, fontSize: "clamp(14px, 2vw, 16px)" }}>
        Um espaço dedicado a versos e sentimentos em homenagem a Cauã.
      </p>

      {/* Listagem das Poesias */}
      {poems.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", opacity: 0.7, background: "rgba(0,0,0,0.2)", borderRadius: "12px", marginBottom: "40px" }}>
          <p>Nenhuma poesia publicada no momento. Seja o primeiro a compartilhar uma!</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "30px", marginBottom: "50px" }}>
          {poems.map((poem) => {
            const color = poem.cardColor || "#ffd700";
            const isPending = poem.isApproved === false;
            const isOfficial = poem.isAdmin === true;

            // Se não for admin e a poesia estiver pendente, não exibe
            if (!isAdmin && isPending) return null;

            return (
              <div 
                key={poem.id} 
                style={{ 
                  background: isOfficial ? `linear-gradient(135deg, ${color}20, rgba(0,0,0,0.3))` : "rgba(0, 0, 0, 0.25)", 
                  padding: "30px", 
                  borderRadius: "16px", 
                  borderLeft: `6px solid ${color}`,
                  borderTop: `1px solid ${isOfficial ? color + "50" : "rgba(255, 255, 255, 0.05)"}`,
                  borderRight: `1px solid ${isOfficial ? color + "50" : "rgba(255, 255, 255, 0.05)"}`,
                  borderBottom: `1px solid ${isOfficial ? color + "50" : "rgba(255, 255, 255, 0.05)"}`,
                  position: "relative",
                  opacity: isPending ? 0.7 : 1
                }}
              >
                {isPending && isAdmin && (
                  <span style={{ background: "#ffcc00", color: "#000", fontSize: "11px", fontWeight: "bold", padding: "3px 8px", borderRadius: "10px", display: "inline-block", marginBottom: "10px" }}>
                    ⏳ Aguardando Aprovação
                  </span>
                )}
                {isOfficial && (
                  <span style={{ background: color, color: "#000", fontSize: "11px", fontWeight: "bold", padding: "3px 8px", borderRadius: "10px", display: "inline-block", marginBottom: "10px" }}>
                    👑 OFICIAL
                  </span>
                )}

                <h3 style={{ fontSize: "22px", margin: "0 0 12px 0", color: isOfficial ? color : "var(--txt)" }}>
                  {poem.title}
                </h3>

                <p style={{ fontSize: "16px", fontStyle: "italic", whiteSpace: "pre-wrap", lineHeight: "1.8", margin: "0 0 20px 0", opacity: 0.9, wordBreak: "break-word" }}>
                  "{poem.text}"
                </p>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "10px", fontSize: "13px", opacity: 0.8, borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "12px" }}>
                  <div>
                    {poem.author && <span>Autor: <b>{poem.author}</b></span>}
                  </div>
                  <div>
                    {poem.sentBy && <span>Enviado por: <b>{poem.sentBy}</b></span>}
                  </div>
                </div>

                {isAdmin && (
                  <div style={{ display: "flex", gap: "10px", marginTop: "15px", justifyContent: "flex-end", alignItems: "center" }}>
                    {!poem.isApproved && (
                      <button 
                        onClick={async () => {
                          await updateDoc(doc(db, "poems", poem.id), { isApproved: true });
                          fetchPoems();
                        }}
                        style={{ background: "#4BB543", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}
                      >
                        ✓ Aprovar
                      </button>
                    )}
                    <button 
                      onClick={() => handleEdit(poem)}
                      style={{ background: "#2196f3", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}
                    >
                      ✏️ Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(poem.id)}
                      style={{ background: "#f44336", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}
                    >
                      🗑️ Excluir
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal / Bloco de Edição Rápida para Admin */}
      {showEditModal && (
        <div style={{ background: "rgba(0,0,0,0.85)", padding: "25px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.2)", marginBottom: "40px" }}>
          <h3 style={{ margin: "0 0 15px 0" }}>Editar Poesia</h3>
          <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <input 
              type="text" 
              placeholder="Título" 
              value={editTitle} 
              onChange={(e) => setEditTitle(e.target.value)} 
              required 
              style={{ padding: "10px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.2)", background: "rgba(0,0,0,0.3)", color: "#fff" }}
            />
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <input 
                type="text" 
                placeholder="Autor" 
                value={editAuthor} 
                onChange={(e) => setEditAuthor(e.target.value)} 
                style={{ flex: 1, padding: "10px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.2)", background: "rgba(0,0,0,0.3)", color: "#fff" }}
              />
              <input 
                type="text" 
                placeholder="Enviado por" 
                value={editSentBy} 
                onChange={(e) => setEditSentBy(e.target.value)} 
                style={{ flex: 1, padding: "10px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.2)", background: "rgba(0,0,0,0.3)", color: "#fff" }}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <label>Cor do destaque:</label>
              <input 
                type="color" 
                value={editCardColor} 
                onChange={(e) => setEditCardColor(e.target.value)} 
                style={{ border: "none", width: "40px", height: "35px", cursor: "pointer", background: "transparent" }}
              />
            </div>
            <textarea 
              placeholder="Texto da poesia" 
              value={editText} 
              onChange={(e) => setEditText(e.target.value)} 
              rows="4" 
              required 
              style={{ padding: "10px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.2)", background: "rgba(0,0,0,0.3)", color: "#fff", resize: "vertical" }}
            />
            <div style={{ display: "flex", gap: "10px" }}>
              <button type="submit" style={{ background: "#4caf50", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>Salvar</button>
              <button type="button" onClick={handleCancelEdit} style={{ background: "#777", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {/* Formulário Público para Visitantes Enviarem Poesias */}
      <div style={{ background: "var(--aescuro)", padding: "30px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.1)", boxSizing: "border-box" }}>
        <h3 style={{ margin: "0 0 10px 0", fontSize: "20px" }}>Deixe sua Poesia ou Homenagem ✍️</h3>
        <p style={{ fontSize: "14px", opacity: 0.8, marginBottom: "20px" }}>
          Sua mensagem será revisada pela administração antes de ser publicada no memorial.
        </p>

        {successMsg && (
          <div style={{ background: "rgba(75, 181, 67, 0.2)", border: "1px solid #4BB543", color: "#4BB543", padding: "12px", borderRadius: "8px", marginBottom: "20px", fontSize: "14px" }}>
            {successMsg}
          </div>
        )}

        <form onSubmit={handlePublicSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
            <input 
              type="text" 
              placeholder="Título da Poesia" 
              value={formTitle} 
              onChange={(e) => setFormTitle(e.target.value)} 
              required 
              style={{ flex: 1, minWidth: "250px", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.2)", background: "rgba(0,0,0,0.2)", color: "#fff", fontSize: "14px" }}
            />
            <input 
              type="text" 
              placeholder="Seu Nome (Quem está enviando)" 
              value={formSentBy} 
              onChange={(e) => setFormSentBy(e.target.value)} 
              required 
              style={{ flex: 1, minWidth: "250px", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.2)", background: "rgba(0,0,0,0.2)", color: "#fff", fontSize: "14px" }}
            />
          </div>

          <input 
            type="text" 
            placeholder="Autor da Poesia (Opcional, se foi você mesmo ou outra pessoa)" 
            value={formAuthor} 
            onChange={(e) => setFormAuthor(e.target.value)} 
            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.2)", background: "rgba(0,0,0,0.2)", color: "#fff", fontSize: "14px", boxSizing: "border-box" }}
          />

          <textarea 
            placeholder="Escreva sua poesia ou verso aqui..." 
            value={formText} 
            onChange={(e) => setFormText(e.target.value)} 
            rows="6" 
            required 
            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.2)", background: "rgba(0,0,0,0.2)", color: "#fff", fontSize: "14px", resize: "vertical", boxSizing: "border-box" }}
          />

          <button 
            type="submit" 
            disabled={submitting}
            style={{ background: "var(--aclaro, #ffd700)", color: "#121212", border: "none", padding: "12px 24px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", fontSize: "15px", alignSelf: "flex-start" }}
          >
            {submitting ? "Enviando..." : "Enviar Poesia para Moderação ✨"}
          </button>
        </form>
      </div>
    </div>
  );
}

export { Poems as TimeLine };