import React, { useEffect, useState } from "react";
import './Home.css';
import './Testimonials.css';
import { CardTesti, CardSpecial } from '../components/Card';
import { AddTestimonials } from "../components/forms/AddTestimonials";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../services/firebase";

export function Testimonials() {
    const [approvedList, setApprovedList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApprovedTestimonials = async () => {
            try {
                const q = query(collection(db, "testimonials"), where("isApproved", "==", true));
                const querySnapshot = await getDocs(q);
                const lista = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setApprovedList(lista);
            } catch (error) {
                console.error("Erro ao carregar depoimentos aprovados:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchApprovedTestimonials();
    }, []);

    return (
        <div className="testimonials-container">
            <section style={{
                height: 'auto',
                minHeight: '200px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                padding: '40px 20px'
            }}>
                <p style={{ fontSize: 'clamp(16px, 2.5vw, 20px)' }}>
                    Aqui Você encontrará os Depoimentos dos amigos e familiares de Cauã :)
                </p>
            </section>

            {/* Seção dinamicamente populada com os depoimentos aprovados do Firebase */}
            <section style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
                {loading ? (
                    <p style={{ textAlign: 'center', color: 'var(--txt)', marginTop: '20px', width: '100%' }}>Carregando depoimentos...</p>
                ) : approvedList.length === 0 ? (
                    <p style={{ textAlign: 'center', color: 'var(--txt)', marginTop: '20px', opacity: 0.8, width: '100%' }}>
                        Nenhum depoimento aprovado no momento. Seja o primeiro a deixar uma mensagem!
                    </p>
                ) : (
                    approvedList.map((item) => {
                        const isOfficialAdmin = item.isAdmin === true;
                        const cardColor = item.cardColor || "#ffd700";

                        if (isOfficialAdmin) {
                            return (
                                <div
                                    key={item.id}
                                    style={{
                                        background: `linear-gradient(135deg, ${cardColor}20, var(--aescuro))`,
                                        padding: "24px",
                                        width: "100%",
                                        maxWidth: "600px", // Limita a largura máxima no desktop para não esticar demais
                                        margin: "0 auto 20px auto", // Centraliza o card perfeitamente
                                        textAlign: "start",
                                        borderRadius: "16px",
                                        borderLeft: `6px solid ${cardColor}`,
                                        borderTop: `1px solid ${cardColor}40`,
                                        borderRight: `1px solid ${cardColor}40`,
                                        borderBottom: `1px solid ${cardColor}40`,
                                        boxShadow: `0 4px 20px ${cardColor}20`,
                                        color: "var(--txt)",
                                        boxSizing: "border-box"
                                    }}
                                >
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px", gap: "10px", flexWrap: "wrap" }}>
                                        <h3 style={{ color: cardColor, margin: 0, fontSize: "clamp(16px, 3vw, 20px)", wordBreak: "break-word" }}>
                                            {item.title}
                                        </h3>
                                        <span style={{ background: cardColor, color: "#000", fontSize: "11px", fontWeight: "bold", padding: "4px 10px", borderRadius: "12px", whiteSpace: "nowrap" }}>
                                            👑 OFICIAL
                                        </span>
                                    </div>

                                    <p style={{ fontSize: "clamp(14px, 2vw, 16px)", margin: "15px 0", lineHeight: "1.6", opacity: 0.9, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                                        "{item.text}"
                                    </p>

                                    <span style={{ fontSize: "13px", opacity: 0.9, color: cardColor, display: "block" }}>
                                        Por: <strong>{item.author}</strong> ✨ (Administração)
                                    </span>
                                </div>
                            );
                        }

                        // Se for um depoimento normal
                        return (
                            <div key={item.id} style={{ width: "100%", maxWidth: "600px", margin: "0 auto" }}>
                                <CardTesti
                                    title={item.title}
                                    aut={item.author}
                                    text={item.text}
                                />
                            </div>
                        );
                    })
                )}
            </section>

            {/* Formulário para enviar novos depoimentos */}
            <section style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', width: '100%', paddingBottom: '50px' }}>
                <AddTestimonials />
            </section>
        </div>
    );
}