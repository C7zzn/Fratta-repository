import React from "react";
import './Home.css';
import {Card} from '../components/Card'
import {BtshowBlue, BtShowYel, BtShowRed} from "../components/Btshow";
import { RoundImg, SquareImg } from "../components/Pictures";
import { Tit, Text } from "../components/Texts";
import logoImg from '/logo-ferz.png';
import { Link } from "react-router-dom";


export function Home(){
    return(

        <div className="home-container">
            <section style={{
                height:'100vh',
                paddingBlockEnd:'40vh'
            }}>
                    <SquareImg
                        src={logoImg}
                        wid={400}
                    />
                    <h3 style={{
                        width:'80%',
                        height:'3vh',
                    }}>Cauã Rodrigues Fratta</h3>
                    <p style={{
                        width:'80%',
                        height:'3vh'
                    }}>"Pra quem tem fé, a vida nunca tem fim"</p>
            </section>
            <section>
                <div>
                    <Card/>
                     <br/>
                    <BtshowBlue/>
                </div>
                <div>
                    <RoundImg
                        src={logoImg}
                        style={{width:'20px', height:'30px'}}
                    />
                </div>
            </section>
            <section>
                <div>
                    <RoundImg
                        src={logoImg}
                        wid={200}
                    />
                    <br/>
                    <br/>
                    <BtshowBlue/>
                </div>
                 <div>
                    <RoundImg
                        src={logoImg}
                        wid={200}
                    />
                     <br/>
                     <br/>
                    <BtShowYel/>
                </div>
                <div>
                    <RoundImg
                        src={logoImg}
                        wid = {200}
                    />
                     <br/>
                     <br/>
                    <BtShowRed/>
                </div>
            </section>
        </div>
    )
    
}