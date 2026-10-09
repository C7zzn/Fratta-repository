import React from 'react';
import { Link } from 'react-router-dom';
import './Btshow.css';

// Botão Azul com suporte a link e texto personalizado
export function BtshowBlue({ link = "#", text = "Ver mais" }) {
  return (
    <Link to={link} style={{ textDecoration: 'none' }}>
      <button className="showMoreBlue">
        {text} <span>&rarr;</span>
      </button>
    </Link>
  );
}

// Botão Amarelo com suporte a link e texto personalizado
export function BtShowYel({ link = "#", text = "Ver mais" }) {
  return (
    <Link to={link} style={{ textDecoration: 'none' }}>
      <button className="showMoreYel">
        {text} <span>&rarr;</span>
      </button>
    </Link>
  );
}

// Botão Vermelho com suporte a link e texto personalizado
export function BtShowRed({ link = "#", text = "Ver mais" }) {
  return (
    <Link to={link} style={{ textDecoration: 'none' }}>
      <button className="showMoreRed">
        {text} <span>&rarr;</span>
      </button>
    </Link>
  );
}