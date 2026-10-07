import React, { useState } from "react";
import './CozyArea.css';

export function CozyArea() {
    const [letterText, setLetterText] = useState("");
    const [isBurning, setIsBurning] = useState(false);
    const [burnedSuccessfully, setBurnedSuccessfully] = useState(false);

    const handleBurnLetter = (e) => {
        e.preventDefault();
        if (!letterText.trim()) return alert("Escreva algo na carta antes de entregá-la ao vento e ao fogo...");

        setIsBurning(true);
        setBurnedSuccessfully(false);

        // Tempo de duração da animação de fogo antes de resetar a tela
        setTimeout(() => {
            setIsBurning(false);
            setLetterText("");
            setBurnedSuccessfully(true);
        }, 2000); // 2 segundos de queima
    };

    return (
        <div className="cozy-container">
            <div className="cozy-header">
                <h2>Cartas ao Vento</h2>
                <p>
                    Um espaço seguro e reservado para desabafar, escrever o que quiser para o universo, para o vento ou para Cauã. 
                    Aqui nada é guardado ou salvo: você escreve, assiste o fogo consumir, e deixa ir.
                </p>
            </div>

            {/* Fogueira / Ícone decorativo */}
            <div className="fire-container" title="A fogueira está acesa">
                🪵🔥
            </div>

            {/* Caixa da Carta */}
            <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: "20px" }}>
                <form 
                    onSubmit={handleBurnLetter} 
                    className={`letter-box ${isBurning ? "burning" : ""}`}
                >
                    <textarea 
                        className="letter-textarea"
                        placeholder="Escreva seus pensamentos, segredos, desabafos ou recados ao vento..."
                        value={letterText}
                        onChange={(e) => setLetterText(e.target.value)}
                        disabled={isBurning}
                    />

                    <button 
                        type="submit" 
                        className="burn-btn"
                        disabled={isBurning || !letterText.trim()}
                    >
                        {isBurning ? "Queimando..." : "🔥 Queimar Carta"}
                    </button>
                </form>
            </div>

            {/* Mensagem após queimar */}
            {burnedSuccessfully && !isBurning && (
                <div className="success-message">
                    <p>✨ Suas palavras viraram fumaça e se perderam no vento. O que pesava, agora se foi.</p>
                </div>
            )}
        </div>
    );
}