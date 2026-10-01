import React from "react";
import './Home.css';
import './Testimonials.css';
import {Card, CardTesti} from '../components/Card'
import {BtshowBlue, BtShowYel, BtShowRed} from "../components/Btshow";
import { RoundImg, SquareImg } from "../components/Pictures";
import { Tit, Text } from "../components/Texts";
import logoImg from '/logo-ferz.png';
import { Link } from "react-router-dom";

export function Testimonials(){
    return(
        <div className="testimonials-container">
            <section style={{
                height: '300px',
            }}>
                <p>Aqui Você encontrará os Depoimentos dos amigos e familiares de Cauã :)</p>
            </section>
            <section>
                <CardTesti
                    title = {'Nascemos pra Cantar'}
                    aut = {'Rubi'}
                    text = {'Cauã e eu dançamos Rita até o dia de nascer, nascemos separados pela distância dos anos, e como fora definido pelos céus e por nós mesmos, vivemos cada qual sua vida. Após sua ida restou-me o prazer de ter conhecido-o, de ter convivido, e de saber que, nasci como ele, nasci pra cantar, nasci pra sentir, nasci pra existir espalhando a luz que ele espalhou. Espalhemos pois  a felicidade e a beleza de viver. E sei que assim que minha já cansada missão acabar, iremos novamente dançar Rita e cantar Gita. Cauã e eu dançamos Rita até o dia de nascer, nascemos separados pela distância dos anos, e como fora definido pelos céus e por nós mesmos, vivemos cada qual sua vida. Após sua ida restou-me o prazer de ter conhecido-o, de ter convivido, e de saber que, nasci como ele, nasci pra cantar, nasci pra sentir, nasci pra existir espalhando a luz que ele espalhou. Espalhemos pois  a felicidade e a beleza de viver. E sei que assim que minha já cansada missão acabar, iremos novamente dançar Rita e cantar Gita.'}
                />
                <CardTesti 
                    title = {'Nascemos pra Cantar'}
                    aut = {'Rubi'}
                    text = {'Cauã e eu dançamos Rita até o dia de nascer, nascemos separados pela distância dos anos, e como fora definido pelos céus e por nós mesmos, vivemos cada qual sua vida. Após sua ida restou-me o prazer.'}
                />
                <CardTesti 
                    title = {'Nascemos pra Cantar'}
                    aut = {'Rubi'}
                    text = {'Cauã e eu dançamos Rita até o dia de nascer, na.'}
                />
                 <CardTesti 
                    title = {'Nascemos pra Cantar'}
                    aut = {'Rubi'}
                    text = {'Cauã e eu dançamos Rita até o dia de nascer, nascemos separados pela distância dos anos, e como fora definido pelos céus e por nós mesmos, vivemos cada qual sua vida. Após sua ida restou-me o prazer de ter conhecido-o, de ter convivido, e de saber que, nasci como ele, nasci pra cantar, nasci pra sentir, nasci pra existir espalhando a luz que ele espalhou. Espalhemos pois  a felicidade e a beleza de viver. E sei que assim que minha já cansada missão acabar, iremos novamente dançar Rita e cantar Gita.Cauã e eu dançamos Rita até o dia de nascer, nascemos separados pela distância dos anos, e como fora definido pelos céus e por nós mesmos, vivemos cada qual sua vida. Após sua ida restou-me o prazer de ter conhecido-o, de ter convivido, e de saber que, nasci como ele, nasci pra cantar, nasci pra sentir, nasci pra existir espalhando a luz que ele espalhou. Espalhemos pois  a felicidade e a beleza de viver. E sei que assim que minha já cansada missão acabar, iremos novamente dançar Rita e cantar GitaCauã e eu dançamos Rita até o dia de nascer, nascemos separados pela distância dos anos, e como fora definido pelos céus e por nós mesmos, vivemos cada qual sua vida. Após sua ida restou-me o prazer de ter conhecido-o, de ter convivido, e de saber que, nasci como ele, nasci pra cantar, nasci pra sentir, nasci pra existir espalhando a luz que ele espalhou. Espalhemos pois  a felicidade e a beleza de viver. E sei que assim que minha já cansada missão acabar, iremos novamente dançar Rita e cantar Gita'}
                />
                 <CardTesti 
                    title = {'Nascemos pra Cantar'}
                    aut = {'Rubi'}
                    text = {'Cauã e eu dançamos Rita até o dia de nascer, nascemos separados pela distância dos anos, e como fora definido pelos céus e por nós mesmos, vivemos cada qual sua vida. Após sua ida restou-me o prazer de ter conhecido-o, de ter convivido, e de saber que, nasci como ele, nasci pra cantar, nasci pra sentir, nasci pra existir espalhando a luz que ele espalhou. Espalhemos pois  a felicidade e a beleza de viver. E sei que assim que minha já cansada missão acabar, iremos novamente dançar Rita e cantar Gita.'}
                />
                 <CardTesti 
                    title = {'Nascemos pra Cantar'}
                    aut = {'Rubi'}
                    text = {'Cauã e eu dançamos Rita até o dia de nascer, nascemos separados pela distância dos anos, e como fora definido pelos céus e por nós mesmos, vivemos cada qual sua vida. Após sua ida restou-me o prazer de ter conhecido-o, de ter convivido, e de saber que, nasci como ele, nasci pra cantar, nasci pra sentir, nasci pra existir espalhando a luz que ele espalhou. Espalhemos pois  a felicidade e a beleza de viver. E sei que assim que minha já cansada missão acabar, iremos novamente dançar Rita e cantar Gita.'}
                />
            </section>
        </div>
    );
}