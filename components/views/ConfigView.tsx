
import React from 'react';
import { Card } from '../ui/Card';
import { useApp } from '../../context/AppContext';

export const ConfigView: React.FC = () => {
  const { state, updateParams } = useApp();

  return (
    <Card title="Parâmetros Legais">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Divisor (anos)</label>
          <input 
            type="number"
            className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900"
            value={state.params.divisor}
            onChange={(e) => updateParams({ divisor: parseInt(e.target.value) || 365 })}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Artigos Base</label>
          <input 
            className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900"
            defaultValue="63, 64, 65, 131, 132"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Portaria Regulamentadora</label>
          <input 
            className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900"
            defaultValue="PMERJ nº 104/1986"
          />
        </div>
      </div>
      <div className="mt-6 flex justify-end">
         <button className="bg-gray-800 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-gray-900 transition-colors">
            Salvar Configurações
         </button>
      </div>
      <div className="mt-4 bg-blue-50 text-blue-800 text-xs p-3 rounded-lg border border-blue-100">
        ℹ️ Alterar parâmetros globais impacta imediatamente todos os cálculos do sistema.
      </div>
    </Card>
  );
};
