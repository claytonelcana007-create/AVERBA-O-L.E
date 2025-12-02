
import React, { createContext, useContext, useState, useCallback } from 'react';
import { AppState, Policial, Afastamento, Averbacao, LicencaEspecial, TimelineItem, Calculo } from '../types';
import { INITIAL_STATE } from '../constants';

interface AppContextType {
  state: AppState;
  updatePolicial: (p: Policial) => void;
  addAfastamento: (a: Afastamento) => void;
  updateAfastamento: (id: string, updates: Partial<Afastamento>) => void;
  removeAfastamento: (id: string) => void;
  addAverbacao: (a: Averbacao) => void;
  updateAverbacao: (id: string, updates: Partial<Averbacao>) => void;
  removeAverbacao: (id: string) => void;
  addTimelineItem: (item: TimelineItem) => void;
  addLE: (le: LicencaEspecial) => void;
  updateParams: (params: { divisor: number }) => void;
  saveData: () => void;
  recalculate: () => void; // Mantido para compatibilidade, mas a lógica agora é automática
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Função pura para realizar os cálculos baseados no estado atual
const calculateStats = (
  policial: Policial, 
  av: Averbacao[], 
  afast: Afastamento[], 
  params: { divisor: number }
): Calculo => {
  // 1. Somar dias de Averbações validadas
  const diasAverbados = av.reduce((acc, curr) => acc + (curr.status === 'Validado' ? curr.dias : 0), 0);
  
  // 2. Somar dias de Afastamentos que "Não contam"
  const diasAfastNaoConta = afast.reduce((acc, curr) => {
    if (curr.nat === 'Não conta' && curr.ini && curr.fim) {
       const d1 = new Date(curr.ini);
       const d2 = new Date(curr.fim);
       if (!isNaN(d1.getTime()) && !isNaN(d2.getTime())) {
         const diffTime = Math.abs(d2.getTime() - d1.getTime());
         const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 
         return acc + diffDays;
       }
    }
    return acc;
  }, 0);

  // 3. Calcular dias desde a Praça até Hoje (Brutos)
  let rawDays = 0;
  let effectiveStartDate = new Date(); // Fallback para hoje
  
  if (policial.praca) {
    const pracaDate = new Date(policial.praca);
    const today = new Date();
    if (!isNaN(pracaDate.getTime())) {
      const diffTime = today.getTime() - pracaDate.getTime();
      rawDays = diffTime > 0 ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : 0;
    }
  }

  // 4. Totais
  // Fórmula: Dias Válidos = (Dias corridos desde praça) + (Averbações) - (Afastamentos)
  const diasTotais = rawDays + diasAverbados - diasAfastNaoConta;
  const diasValidos = Math.max(diasTotais, 0);

  // 5. Cálculo de Tempo (Anos/Meses) baseado em calendário (Data Efetiva)
  // Data Efetiva = Hoje - Dias Válidos
  const today = new Date();
  effectiveStartDate = new Date(today);
  effectiveStartDate.setDate(today.getDate() - diasValidos);

  // Diferença de calendário entre Hoje e Data Efetiva
  // Isso já considera anos bissextos automaticamente
  let anos = today.getFullYear() - effectiveStartDate.getFullYear();
  let meses = today.getMonth() - effectiveStartDate.getMonth();
  
  // Ajuste fino para meses negativos
  if (meses < 0 || (meses === 0 && today.getDate() < effectiveStartDate.getDate())) {
    anos--;
    // Opcional: calcular meses exatos se necessário, mas para "Decênios completos" o ano basta
  }
  
  // Decênios completos (apenas anos inteiros)
  const dec = Math.max(0, Math.floor(anos / 10));

  // 6. Projeção do Próximo Decênio
  // Data Próx = Data Efetiva + (Decênios Atuais + 1) * 10 anos
  const nextDecenioDate = new Date(effectiveStartDate);
  nextDecenioDate.setFullYear(nextDecenioDate.getFullYear() + ((dec + 1) * 10));
  
  // 7. Cálculo Específico do 1º Decênio
  // Regra: Data Praça + 3650 dias + Afastamentos - Averbações
  let decenio1DateStr = "—";
  if (policial.praca) {
    const d1Date = new Date(policial.praca);
    if (!isNaN(d1Date.getTime())) {
      // Adiciona 3650 dias (10 anos fixos em dias)
      // Adiciona dias de afastamento (atrasa o decênio)
      // Remove dias de averbação (adianta o decênio)
      const diasParaAdicionar = 3650 + diasAfastNaoConta - diasAverbados;
      d1Date.setDate(d1Date.getDate() + diasParaAdicionar);
      decenio1DateStr = d1Date.toISOString().split('T')[0];
    }
  }

  return {
    dias: diasValidos,
    anos: diasValidos / 365, // Mantido numérico para compatibilidade
    dec: dec,
    prox: nextDecenioDate.toISOString().split('T')[0],
    decenio1: decenio1DateStr,
    tempoFormatado: "" // Calculado na View para precisão de display
  };
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('pmjer_react_v1');
    return saved ? JSON.parse(saved) : INITIAL_STATE;
  });

  // Wrapper para atualizar estado e recalcular automaticamente
  const updateStateWithCalc = (updater: (prev: AppState) => Partial<AppState>) => {
    setState(prev => {
      const partialState = updater(prev);
      const newState = { ...prev, ...partialState };
      
      // Recalcular métricas com base no novo estado
      const newCalc = calculateStats(
        newState.policial,
        newState.av,
        newState.afast,
        newState.params
      );

      return { ...newState, calc: newCalc };
    });
  };

  const updatePolicial = (p: Policial) => {
    updateStateWithCalc(() => ({ policial: p }));
  };
  
  const addAfastamento = (a: Afastamento) => {
    updateStateWithCalc(prev => ({ afast: [...prev.afast, a] }));
  };

  const updateAfastamento = (id: string, updates: Partial<Afastamento>) => {
    updateStateWithCalc(prev => ({
      afast: prev.afast.map(item => item.id === id ? { ...item, ...updates } : item)
    }));
  };

  const removeAfastamento = (id: string) => {
    updateStateWithCalc(prev => ({
      afast: prev.afast.filter(item => item.id !== id)
    }));
  };

  const addAverbacao = (a: Averbacao) => {
    updateStateWithCalc(prev => ({ av: [...prev.av, a] }));
  };

  const updateAverbacao = (id: string, updates: Partial<Averbacao>) => {
    updateStateWithCalc(prev => ({
      av: prev.av.map(item => item.id === id ? { ...item, ...updates } : item)
    }));
  };

  const removeAverbacao = (id: string) => {
    updateStateWithCalc(prev => ({
      av: prev.av.filter(item => item.id !== id)
    }));
  };

  const updateParams = (params: { divisor: number }) => {
    updateStateWithCalc(() => ({ params }));
  };

  // Funções que não afetam o cálculo principal de dias
  const addTimelineItem = (item: TimelineItem) => setState(prev => ({ ...prev, timeline: [...prev.timeline, item] }));
  const addLE = (le: LicencaEspecial) => setState(prev => ({ ...prev, le: [...prev.le, le] }));
  
  // Função explícita (agora redundante, mas mantida)
  const recalculate = () => {
    setState(prev => {
      const newCalc = calculateStats(prev.policial, prev.av, prev.afast, prev.params);
      return { ...prev, calc: newCalc };
    });
  };

  const saveData = () => {
    localStorage.setItem('pmjer_react_v1', JSON.stringify(state));
  };

  return (
    <AppContext.Provider value={{
      state,
      updatePolicial,
      addAfastamento,
      updateAfastamento,
      removeAfastamento,
      addAverbacao,
      updateAverbacao,
      removeAverbacao,
      recalculate,
      addTimelineItem,
      addLE,
      updateParams,
      saveData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
