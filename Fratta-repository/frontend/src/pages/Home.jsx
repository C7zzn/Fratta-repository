import React from "react";
import './Home.css';
import { Card } from '../components/Card';
import { BtshowBlue, BtShowYel, BtShowRed } from "../components/Btshow";
import { RoundImg, SquareImg } from "../components/Pictures";
import logoImg from '/logo-ferz.png';
import CauaFazendoPose from '/CauaFazendoPose.jpeg';
import { Link } from "react-router-dom";

export function Home(){
    return(
        <div className="home-container">
            <section style={{
                height:'100vh',
                paddingBlockEnd:'40vh'
            }}>
                    <SquareImg
                        src={CauaFazendoPose}
                        wid={400}
                    />
                    <h3 style={{
                        width:'80%',
                        height:'3vh',
                        paddingBlock:'2vh',
                    }}>Cauã Rodrigues Fratta</h3>
                    <p style={{
                        width:'80%',
                        height:'3vh'
                    }}>"Pra quem tem fé, a vida nunca tem fim"</p>
            </section>
            
            <section>
                <div>
                    <Card
                        title={"Quem foi Cauã Fratta"}
                        text={'Cauã, um amigo, irmão, filho e ser humano de grande espírito. Seus 16 anos foi um exemplo de vida para quem o conheceu. Cauã amava Basquete, Música, a arte, o humanismo e a acima de tudo, A vida. Amou desde o brilho do sol até a mais pequena gentileza que fizeram por ele, foi grato sobretudo pela oportunidade de aproveitar e amar os seus. Sorriu, abraçou, ajudou, ouviu e com isso transformou aqueles com quem conviveu. Cauã teve de ir cedo, mas tal qual as estrelas que ele tanto admirava, brilhou e continua a brilhar, hoje junto com elas.'}
                    />
                     <br/>
                    <BtshowBlue 
                        link={'/Testimonials'}
                        text="Ver mais Depoimentos"
                    />
                </div>
                <div>
                    <RoundImg
                        src={logoImg}
                        wid={250}
                    />
                </div>
            </section>
            
            <section>
                {/* 1º Botão: Direciona para a página de Poesias */}
                <div>
                    <RoundImg
                        src={logoImg}
                        wid={200}
                    />
                    <br/>
                    <br/>
                    <BtshowBlue 
                        link={'/Poems'}
                        text="Poemas"
                    />
                </div>

                {/* 2º Botão: Direciona para a Linha do Tempo */}
                 <div>
                    <RoundImg
                        src={logoImg}
                        wid={200}
                    />
                    <br/>
                    <br/>
                    <BtShowYel 
                        link={'/Music'}
                        text="Músicas"
                    />
                </div>

                {/* 3º Botão: Direciona para a Área de Descanso */}
                <div>
                    <RoundImg
                        src={logoImg}
                        wid={200}
                    />
                     <br/>
                     <br/>
                    <BtShowRed 
                        link={'/Gallery'}
                        text="Imagens"
                    />
                </div>
            </section>
        </div>
    );
}