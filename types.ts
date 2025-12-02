
export interface Policial {
  nome: string;
  posto: string;
  matricula: string;
  rg: string;
  praca: string;
}

export interface Calculo {
  dias: number;
  anos: number;
  dec: number;
  prox: string;
  decenio1: string; // Novo campo
  tempoFormatado?: string;
}

export interface Afastamento {
  id: string;
  ini: string;
  fim: string;
  nat: 'Conta' | 'Não conta';
  fund: string;
  status: 'Pendente' | 'Validado';
}

export interface Averbacao {
  id: string;
  orig: string;
  ini: string;
  fim: string;
  dias: number;
  doc: string;
  status: 'Pendente' | 'Validado';
}

export interface LicencaEspecial {
  id: string;
  decenio: string;
  dataConcessao: string; // ou data base
  status: 'Concedido' | 'Disponível' | 'Solicitada';
  periodoGozo?: string;
}

export interface TimelineItem {
  id: string;
  tipo: 'active' | 'valid' | 'invalid';
  ini: string;
  fim: string;
  rotulo: string;
  detalhe?: string;
}

export interface AppState {
  policial: Policial;
  params: { divisor: number };
  calc: Calculo;
  afast: Afastamento[];
  av: Averbacao[];
  le: LicencaEspecial[];
  timeline: TimelineItem[];
}

export type ViewName = 
  | 'policiais' 
  | 'linha' 
  | 'decenios' 
  | 'le' 
  | 'config';
