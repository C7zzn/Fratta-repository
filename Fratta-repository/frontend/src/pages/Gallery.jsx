import React from "react";
import './Home.css';
import './Gallery.css'
import {Card} from '../components/Card'
import {BtshowBlue, BtShowYel, BtShowRed} from "../components/Btshow";
import { GalPictures, RoundImg, SquareImg } from "../components/Pictures";
import { Tit, Text } from "../components/Texts";
import logoImg from '/logo-ferz.png';
import { Link } from "react-router-dom";

export function Gallery(){
    return(
        <div className="gallery-container">
            <section style={{
                    height:'80vh',
                    width: '100%',
                    alignItems: 'center',
                }}
            >
                <p>Essa é a galeria de Cauã, aqui você encontrará registros fotográficos feitos por/com ele. Aproveite :)</p>
            </section>
            <section style={{
                width: '900px'
                
                }}>
                <GalPictures
                    src={logoImg}
                    title={'Ferz'}
                />
                <GalPictures
                    src={logoImg}
                    title={'Sol'}
                />
                <GalPictures
                    src={logoImg}
                    title={'Lainara vuado na motoca'}
                />
                <GalPictures
                    src={logoImg}
                    title={'Caio destruindo itens de valor'}
                />
                <GalPictures
                    src={logoImg}
                    title={'Alcione cantando no trio eletrico'}
                />
                <GalPictures
                    src={logoImg}
                    title={'Lua'}
                />
                <GalPictures
                    src={''}
                    title={'Caco, Mel e Mavie em completa harmonia'}
                />
                <GalPictures
                    src={logoImg}
                    title={'Perdi a criatividade'}
                />
            </section>
        </div>
    );
}