import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useApp } from '../../context/AppContext';
import { Trash2, CheckCircle, Plus } from 'lucide-react';
import { Afastamento } from '../../types';
import { v4 as uuidv4 } from 'uuid';

export const AfastamentosView: React.FC = () => {
  const { state, addAfastamento, updateAfastamento, removeAfastamento } = useApp();
  const [newAf, setNewAf] = useState<Partial<Afastamento>>({
    nat: 'Conta',
    fund: '',
    ini: '',
    fim: ''
  });

  const handleAdd = () => {
    if (!newAf.ini || !newAf.fim) return alert('Datas obrigatórias');
    addAfastamento({
      id: uuidv4(),
      nat: newAf.nat as any,
      fund: newAf.fund || '—',
      ini: newAf.ini!,
      fim: newAf.fim!,
      status: 'Pendente'
    });
    setNewAf({ nat: 'Conta', fund: '', ini: '', fim: '' });
  };

  return (
    <div className="space-y-6">
      <Card title="Cadastro de Afastamentos">
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm text-left">
            <thead className="bg-pmerj-light text-pmerj-dark uppercase font-semibold text-xs">
              <tr>
                <th className="px-4 py-3 rounded-tl-lg">Início</th>
                <th className="px-4 py-3">Fim</th>
                <th className="px-4 py-3">Natureza</th>
                <th className="px-4 py-3">Fundamento</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 rounded-tr-lg text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {state.afast.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{item.ini}</td>
                  <td className="px-4 py-3">{item.fim}</td>
                  <td className="px-4 py-3">{item.nat}</td>
                  <td className="px-4 py-3 text-gray-500">{item.fund}</td>
                  <td className="px-4 py-3">
                    <Badge type={item.status === 'Validado' ? 'success' : 'warning'}>
                      {item.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right flex justify-end gap-2">
                    {item.status !== 'Validado' && (
                      <button 
                        onClick={() => updateAfastamento(item.id, { status: 'Validado' })}
                        className="text-pmerj-green hover:bg-green-50 p-1 rounded" 
                        title="Validar"
                      >
                        <CheckCircle size={16} />
                      </button>
                    )}
                    <button 
                      onClick={() => removeAfastamento(item.id)}
                      className="text-pmerj-red hover:bg-red-50 p-1 rounded" 
                      title="Remover"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {state.afast.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-400">Nenhum afastamento registrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-sm font-bold text-gray-700 mb-3">Novo Registro</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Início</label>
              <input type="date" className="w-full p-2 border border-gray-300 rounded-lg text-sm" 
                 value={newAf.ini} onChange={e => setNewAf({...newAf, ini: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Fim</label>
              <input type="date" className="w-full p-2 border border-gray-300 rounded-lg text-sm" 
                 value={newAf.fim} onChange={e => setNewAf({...newAf, fim: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Natureza</label>
              <select className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                 value={newAf.nat} onChange={e => setNewAf({...newAf, nat: e.target.value as any})}
              >
                <option value="Conta">Conta</option>
                <option value="Não conta">Não conta</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">Fundamento</label>
              <input placeholder="Ex: Art. 63" className="w-full p-2 border border-gray-300 rounded-lg text-sm" 
                 value={newAf.fund} onChange={e => setNewAf({...newAf, fund: e.target.value})}
              />
            </div>
            <div className="flex items-end">
              <button 
                onClick={handleAdd}
                className="w-full bg-pmerj-blue text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium text-sm"
              >
                <Plus size={16} /> Adicionar
              </button>
            </div>
          </div>
          <div className="mt-4 bg-yellow-50 text-yellow-800 text-xs p-3 rounded-lg border border-yellow-100 flex items-center gap-2">
            ⚠️ Após validar, a natureza não poderá ser alterada (simulação).
          </div>
        </div>
      </Card>
    </div>
  );
};
