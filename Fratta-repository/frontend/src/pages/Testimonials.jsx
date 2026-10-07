import React, { useEffect, useState } from "react";
import './Home.css';
import './Testimonials.css';
import { CardTesti, CardSpecial } from '../components/Card';
import { AddTestimonials } from "../components/forms/AddTestimonials";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../services/firebase"; // Ajuste o caminho do seu firebase.js se necessário

export function Testimonials() {
    const [approvedList, setApprovedList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApprovedTestimonials = async () => {
            try {
                // Busca no Firestore apenas os depoimentos com isApproved == true
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
                height: '300px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center'
            }}>
                <p>Aqui Você encontrará os Depoimentos dos amigos e familiares de Cauã :)</p>
            </section>

            {/* Seção dinamicamente populada com os depoimentos aprovados do Firebase */}
            <section>
                {/* Exemplo de card especial fixo (se quiser manter a homenagem da Lainara) */}

                {loading ? (
                    <p style={{ textAlign: 'center', color: 'var(--txt)', marginTop: '20px' }}>Carregando depoimentos...</p>
                ) : approvedList.length === 0 ? (
                    <p style={{ textAlign: 'center', color: 'var(--txt)', marginTop: '20px', opacity: 0.8 }}>Nenhum depoimento aprovado no momento. Seja o primeiro a deixar uma mensagem!</p>
                ) : (
                    approvedList.map((item) => {
                        const isOfficialAdmin = item.isAdmin === true;
                        const cardColor = item.cardColor || "#ffd700"; // Cor personalizada ou dourado padrão

                        // Se for depoimento oficial do Admin, renderizamos com o estilo customizado e a cor dele
                        if (isOfficialAdmin) {
                            return (
                                <div
                                    key={item.id}
                                    style={{
                                        background: `linear-gradient(135deg, ${cardColor}20, var(--aescuro))`,
                                        padding: "20px",
                                        width: "40vw",
                                        textAlign:"start",
                                        borderRadius: "12px",
                                        borderLeft: `6px solid ${cardColor}`,
                                        borderTop: `1px solid ${cardColor}40`,
                                        borderRight: `1px solid ${cardColor}40`,
                                        borderBottom: `1px solid ${cardColor}40`,
                                        boxShadow: `0 4px 20px ${cardColor}20`,
                                        marginBottom: "20px",
                                        color: "var(--txt)"
                                    }}
                                >
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                                        <h3 style={{ color: cardColor, margin: 0, fontSize: "18px" }}>
                                            {item.title}
                                        </h3>
                                        <span style={{ background: cardColor, color: "#000", fontSize: "11px", fontWeight: "bold", padding: "3px 8px", borderRadius: "12px" }}>
                                            👑 OFICIAL
                                        </span>
                                    </div>

                                    <p style={{ fontSize: "15px", margin: "15px 0", lineHeight: "1.6", opacity: 0.9 }}>
                                        "{item.text}"
                                    </p>

                                    <span style={{ fontSize: "13px", opacity: 0.9, color: cardColor, display: "block" }}>
                                        Por: <strong>{item.author}</strong> ✨ (Administração)
                                    </span>
                                </div>
                            );
                        }

                        // Se for um depoimento normal de um visitante/mortal, usa o componente padrão
                        return (
                            <CardTesti
                                key={item.id}
                                title={item.title}
                                aut={item.author}
                                text={item.text}
                            />
                        );
                    })
                )}
            </section>

            {/* Formulário para enviar novos depoimentos */}
            <section style={{ marginTop: '50px', display: 'flex', justifyContent: 'center' }}>
                <AddTestimonials />
            </section>
        </div>
    );
}