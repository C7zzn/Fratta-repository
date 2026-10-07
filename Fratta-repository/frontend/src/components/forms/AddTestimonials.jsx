import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../services/firebase"; // Ajuste o caminho se a sua pasta services estiver em outro nível
import './AddTestimonials.css';
import '../Btshow.css';

export function AddTestimonials(){
    const [title, setTitle] = useState('');
    const [aut, setAut] = useState('');
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await addDoc(collection(db, "testimonials"), {
                title,
                author: aut,
                text,
                isApproved: false,
                createdAt: serverTimestamp()
            });

            alert("Depoimento enviado com sucesso! Ele passará por moderação antes de aparecer no memorial. 💙");
            
            setTitle('');
            setAut('');
            setText('');
        } catch (error) {
            console.error("Erro ao enviar depoimento: ", error);
            alert("Ocorreu um erro ao enviar. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return(
        <div className="form-container">
            <h3>Deixe Seu depoimento</h3>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text"
                    placeholder="Título"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)} 
                    required
                    id="title"
                />
                
                <input 
                    type="text"
                    placeholder="Seu Nome"
                    value={aut}
                    onChange={(e) => setAut(e.target.value)}
                    required  
                    id="name"    
                />
                
                <textarea
                    placeholder="Escreva seu depoimento"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={10}
                    required
                    id="text"
                />
                
                <div>
                    <button type="submit" disabled={loading}>
                        {loading ? "Enviando..." : "Enviar"}
                    </button>
                </div>
            </form>
        </div>
    );
}