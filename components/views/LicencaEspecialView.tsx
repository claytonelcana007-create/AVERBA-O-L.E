
import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useApp } from '../../context/AppContext';
import { LicencaEspecial } from '../../types';
import { v4 as uuidv4 } from 'uuid';

export const LicencaEspecialView: React.FC = () => {
  const { state, addLE } = useApp();
  const [newLE, setNewLE] = useState({
    dec: '3º',
    ini: '',
    fim: ''
  });

  const handleRequest = () => {
    if(!newLE.ini || !newLE.fim) return alert('Preencha as datas de gozo.');
    
    addLE({
      id: uuidv4(),
      decenio: newLE.dec,
      dataConcessao: new Date().toISOString().split('T')[0],
      status: 'Solicitada',
      periodoGozo: `${newLE.ini} – ${newLE.fim}`
    });
    setNewLE({dec: '3º', ini: '', fim: ''});
  };

  return (
    <div className="space-y-6">
      <Card title="Licenças Especiais">
        <table className="w-full text-sm text-left mb-4">
          <thead className="bg-pmerj-light text-pmerj-dark uppercase font-semibold text-xs">
            <tr>
              <th className="px-4 py-3 rounded-tl-lg">Decênio</th>
              <th className="px-4 py-3">Data Base/Concessão</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Período de Gozo</th>
              <th className="px-4 py-3 rounded-tr-lg">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {state.le.map(le => (
               <tr key={le.id} className="hover:bg-gray-50">
                 <td className="px-4 py-3 font-medium">{le.decenio}</td>
                 <td className="px-4 py-3">{le.dataConcessao}</td>
                 <td className="px-4 py-3">
                   <Badge type={le.status === 'Concedido' ? 'success' : le.status === 'Solicitada' ? 'warning' : 'info'}>
                     {le.status}
                   </Badge>
                 </td>
                 <td className="px-4 py-3 text-gray-600">{le.periodoGozo || '—'}</td>
                 <td className="px-4 py-3">
                   {le.status === 'Disponível' && (
                     <button className="text-pmerj-blue text-xs font-bold uppercase hover:underline">Solicitar</button>
                   )}
                   {le.status === 'Concedido' && (
                     <button className="text-gray-500 text-xs font-bold uppercase hover:underline">Histórico</button>
                   )}
                 </td>
               </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card title="Solicitar LE">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Decênio Referente</label>
            <select 
              className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900"
              value={newLE.dec}
              onChange={e => setNewLE({...newLE, dec: e.target.value})}
            >
              <option>1º</option>
              <option>2º</option>
              <option>3º</option>
              <option>4º</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Início do Gozo</label>
            <input 
              type="date"
              className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900"
              value={newLE.ini}
              onChange={e => setNewLE({...newLE, ini: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Fim do Gozo</label>
            <input 
              type="date"
              className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900"
              value={newLE.fim}
              onChange={e => setNewLE({...newLE, fim: e.target.value})}
            />
          </div>
          <div className="flex items-end">
            <button 
              onClick={handleRequest}
              className="w-full bg-pmerj-blue text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
            >
              Registrar Solicitação
            </button>
          </div>
        </div>
        <div className="mt-4 bg-green-50 text-green-800 text-xs p-3 rounded-lg border border-green-100">
           ✅ LE registrada e não deduz tempo (conforme art. 131, §2º).
        </div>
      </Card>
    </div>
  );
};
