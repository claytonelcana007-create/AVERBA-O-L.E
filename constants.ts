
import { AppState } from './types';

export const INITIAL_STATE: AppState = {
  policial: {
    nome: "Madelon de Souza Candido",
    posto: "Maj PM",
    matricula: "4189347-6",
    rg: "80.961",
    praca: "2004-04-01",
  },
  params: { divisor: 365 },
  calc: { 
    dias: 7300, 
    anos: 20.00, 
    dec: 2, 
    prox: "2034-03-25",
    decenio1: "2014-04-01", // Valor inicial placeholder
    tempoFormatado: "20a 0m 0d"
  },
  afast: [
    { 
      id: '1', 
      ini: "2022-01-01", 
      fim: "2022-12-31", 
      nat: "Não conta", 
      fund: "Art. 63", 
      status: "Validado" 
    },
  ],
  av: [
    { 
      id: '1', 
      orig: "Forças Armadas", 
      ini: "1998-01-01", 
      fim: "1999-12-31", 
      dias: 730, 
      doc: "PDF", 
      status: "Validado" 
    },
    { 
      id: '2', 
      orig: "Serviço público", 
      ini: "2000-01-01", 
      fim: "2001-12-31", 
      dias: 730, 
      doc: "—", 
      status: "Pendente" 
    },
  ],
  le: [
    {
      id: '1',
      decenio: '1º',
      dataConcessao: '2014-03-30',
      status: 'Concedido',
      periodoGozo: '2014-06-01 – 2014-08-30'
    },
    {
      id: '2',
      decenio: '2º',
      dataConcessao: '2024-03-27',
      status: 'Disponível',
      periodoGozo: '—'
    }
  ],
  timeline: [
    { id: '1', tipo: 'active', ini: '2004', fim: '2022', rotulo: 'Ativo', detalhe: '★ 1º Decênio 30/03/2014' },
    { id: '2', tipo: 'invalid', ini: '2022', fim: '2023', rotulo: 'LTS', detalhe: 'Licença para Tratamento de Saúde' }
  ]
};
