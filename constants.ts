
import { AppState } from './types';

export const INITIAL_STATE: AppState = {
  policial: {
    nome: "",
    posto: "",
    matricula: "",
    rg: "",
    praca: "",
  },
  params: { divisor: 365 },
  calc: { 
    dias: 0, 
    anos: 0, 
    dec: 0, 
    prox: "",
    decenio1: "—",
    decenio2: "—",
    decenio3: "—", // Inicializa o novo campo
    tempoFormatado: "0a 0m 0d"
  },
  afast: [],
  av: [],
  le: [],
  timeline: []
};