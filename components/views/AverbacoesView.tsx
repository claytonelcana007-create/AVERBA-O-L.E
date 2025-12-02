import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useApp } from '../../context/AppContext';
import { Trash2, CheckCircle, Plus } from 'lucide-react';
import { Averbacao } from '../../types';
import { v4 as uuidv4 } from 'uuid';

export const AverbacoesView: React.FC = () => {
  const { state, addAverbacao, updateAverbacao, removeAverbacao } = useApp();
  const [newAv, setNewAv] = useState<Partial<Averbacao>>({
    orig: 'Forças Armadas',
    dias: 0,
    ini: '',
    fim: ''
  });

  const handleAdd = () => {
    if (!newAv.ini || !newAv.fim || !newAv.dias) return alert('Preencha todos os campos');
    addAverbacao({
      id: uuidv4(),
      orig: newAv.orig as any,
      ini: newAv.ini!,
      fim: newAv.fim!,
      dias: Number(newAv.dias),
      doc: '—',
      status: 'Pendente'
    });
    setNewAv({ orig: 'Forças Armadas', dias: 0, ini: '', fim: '' });
  };

  return (
    <div className="space-y-6">
      <Card title="Averbações">
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm text-left">
            <thead className="bg-pmerj-light text-pmerj-dark uppercase font-semibold text-xs">
              <tr>
                <th className="px-4 py-3 rounded-tl-lg">Origem</th>
                <th className="px-4 py-3">Início</th>
                <th className="px-4 py-3">Fim</th>
                <th className="px-4 py-3">Dias</th>
                <th className="px-4 py-3">Doc</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 rounded-tr-lg text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {state.av.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{item.orig}</td>
                  <td className="px-4 py-3">{item.ini}</td>
                  <td className="px-4 py-3">{item.fim}</td>
                  <td className="px-4 py-3 font-mono font-medium">{item.dias}</td>
                  <td className="px-4 py-3 text-gray-500">{item.doc}</td>
                  <td className="px-4 py-3">
                    <Badge type={item.status === 'Validado' ? 'success' : 'warning'}>
                      {item.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right flex justify-end gap-2">
                    {item.status !== 'Validado' && (
                      <button 
                        onClick={() => updateAverbacao(item.id, { status: 'Validado' })}
                        className="text-pmerj-green hover:bg-green-50 p-1 rounded" 
                        title="Validar"
                      >
                        <CheckCircle size={16} />
                      </button>
                    )}
                    <button 
                      onClick={() => removeAverbacao(item.id)}
                      className="text-pmerj-red hover:bg-red-50 p-1 rounded" 
                      title="Remover"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-sm font-bold text-gray-700 mb-3">Nova Averbação</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Origem</label>
              <select className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                 value={newAv.orig} onChange={e => setNewAv({...newAv, orig: e.target.value as any})}
              >
                <option>Forças Armadas</option>
                <option>Serviço público</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Início</label>
              <input type="date" className="w-full p-2 border border-gray-300 rounded-lg text-sm" 
                 value={newAv.ini} onChange={e => setNewAv({...newAv, ini: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Fim</label>
              <input type="date" className="w-full p-2 border border-gray-300 rounded-lg text-sm" 
                 value={newAv.fim} onChange={e => setNewAv({...newAv, fim: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Dias Válidos</label>
              <input type="number" min="0" className="w-full p-2 border border-gray-300 rounded-lg text-sm" 
                 value={newAv.dias} onChange={e => setNewAv({...newAv, dias: parseInt(e.target.value)})}
              />
            </div>
            <div className="md:col-start-3 flex items-end">
              <button 
                onClick={handleAdd}
                className="w-full bg-pmerj-blue text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium text-sm"
              >
                <Plus size={16} /> Adicionar
              </button>
            </div>
          </div>
          <div className="mt-4 bg-blue-50 text-blue-800 text-xs p-3 rounded-lg border border-blue-100">
            ℹ️ Averbações contam como tempo efetivo apenas após validação documental.
          </div>
        </div>
      </Card>
    </div>
  );
};
