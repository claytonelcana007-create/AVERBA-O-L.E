import React from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../ui/Card';
import { RefreshCw } from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { state, updatePolicial, recalculate } = useApp();
  const { calc, policial } = state;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-blue-50 text-pmerj-dark p-4 rounded-xl flex items-center gap-3 border border-blue-100">
        <span className="text-xl">ℹ️</span>
        <span className="text-sm font-medium">Bem-vindo! Use o menu lateral para navegar entre os módulos do sistema.</span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="text-center">
          <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Dias Válidos</label>
          <div className="text-3xl font-bold text-pmerj-dark mt-1">{calc.dias.toLocaleString('pt-BR')}</div>
        </Card>
        <Card className="text-center">
          <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Anos (dias/365)</label>
          <div className="text-3xl font-bold text-pmerj-dark mt-1">{calc.anos.toFixed(2).replace('.', ',')}</div>
        </Card>
        <Card className="text-center">
          <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Decênios</label>
          <div className="text-3xl font-bold text-pmerj-dark mt-1">{calc.dec}</div>
        </Card>
        <Card className="text-center">
          <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Próx. Decênio</label>
          <div className="text-3xl font-bold text-pmerj-dark mt-1">
             {new Date(calc.prox).toLocaleDateString('pt-BR')}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Resumo do policial">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Nome</label>
              <input 
                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pmerj-blue"
                value={policial.nome}
                onChange={(e) => updatePolicial({...policial, nome: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Posto/Grad</label>
              <input 
                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pmerj-blue"
                value={policial.posto}
                onChange={(e) => updatePolicial({...policial, posto: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Matrícula</label>
              <input 
                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pmerj-blue"
                value={policial.matricula}
                onChange={(e) => updatePolicial({...policial, matricula: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">RG</label>
              <input 
                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pmerj-blue"
                value={policial.rg}
                onChange={(e) => updatePolicial({...policial, rg: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Data de Praça</label>
              <input 
                type="date"
                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pmerj-blue"
                value={policial.praca}
                onChange={(e) => updatePolicial({...policial, praca: e.target.value})}
              />
            </div>
            <div className="flex items-end">
              <button 
                onClick={recalculate}
                className="w-full bg-pmerj-green text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-800 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw size={16} /> Recalcular
              </button>
            </div>
          </div>
        </Card>

        <Card title="Notificações">
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-yellow-50 text-yellow-800 rounded-lg text-sm border border-yellow-100">
              <span>⚠️</span>
              <span>Falta anexar documento na averbação de Serviço Público.</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 text-green-800 rounded-lg text-sm border border-green-100">
              <span>✅</span>
              <span>2º decênio atingido em 27/03/2024.</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 text-blue-800 rounded-lg text-sm border border-blue-100">
              <span>ℹ️</span>
              <span>LE do 2º decênio disponível para solicitação.</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
