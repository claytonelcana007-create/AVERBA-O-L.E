import React from 'react';
import { Card } from '../ui/Card';
import { useApp } from '../../context/AppContext';

export const DeceniosView: React.FC = () => {
  const { state } = useApp();
  const { calc } = state;

  return (
    <div className="space-y-6">
      <Card title="Cálculo de Decênios">
        <div className="grid grid-cols-2 gap-4">
          <div>
             <label className="block text-xs font-medium text-gray-500 mb-1">Total Dias Válidos</label>
             <input 
               disabled 
               value={calc.dias.toLocaleString('pt-BR')} 
               className="w-full bg-white p-2 border border-gray-200 rounded-lg font-mono text-gray-900 font-bold" 
             />
          </div>
          <div>
             <label className="block text-xs font-medium text-gray-500 mb-1">Tempo Computado</label>
             <input 
               disabled 
               value={calc.tempoFormatado || ''} 
               className="w-full bg-white p-2 border border-gray-200 rounded-lg font-mono text-gray-900" 
             />
          </div>
          <div>
             <label className="block text-xs font-medium text-gray-500 mb-1">Decênios Alcançados</label>
             <input 
               disabled 
               value={calc.dec} 
               className="w-full bg-white p-2 border border-gray-200 rounded-lg font-mono font-bold text-pmerj-blue" 
             />
          </div>
          <div>
             <label className="block text-xs font-medium text-gray-500 mb-1">Próxima Data (Projeção)</label>
             <input 
               value={calc.prox ? new Date(calc.prox).toLocaleDateString('pt-BR') : ''} 
               className="w-full p-2 border border-gray-300 rounded-lg font-mono text-gray-900 bg-white" 
               readOnly 
             />
          </div>
        </div>
      </Card>
    </div>
  );
};