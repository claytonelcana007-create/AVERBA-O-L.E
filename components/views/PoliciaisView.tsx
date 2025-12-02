
import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Trash2, CheckCircle, FileText, AlertCircle, Calculator, User, Calendar, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { v4 as uuidv4 } from 'uuid';
import { Afastamento, Averbacao } from '../../types';

const ORGAOS_AVERBACAO = [
  "Exército Brasileiro",
  "Marinha do Brasil",
  "Força Aérea Brasileira",
  "Polícia Militar (Outros Estados)",
  "Corpo de Bombeiros Militar",
  "Polícia Federal",
  "Polícia Rodoviária Federal",
  "Polícia Civil",
  "Guarda Municipal",
  "Serviço Público Federal",
  "Serviço Público Estadual (RJ)",
  "Serviço Público Estadual (Outros)",
  "Serviço Público Municipal",
  "INSS / Iniciativa Privada",
  "Outros"
];

export const PoliciaisView: React.FC = () => {
  const { 
    state, 
    updatePolicial,
    addAfastamento, updateAfastamento, removeAfastamento,
    addAverbacao, updateAverbacao, removeAverbacao
  } = useApp();
  
  // State for new Afastamento
  const [newAf, setNewAf] = useState<Partial<Afastamento>>({
    nat: 'Não conta',
    fund: '',
    ini: '',
    fim: ''
  });

  // State for new Averbacao
  const [newAv, setNewAv] = useState<Partial<Averbacao>>({
    orig: 'Exército Brasileiro',
    dias: 0,
    ini: '',
    fim: ''
  });

  // Auto-calculate days when dates change for Averbacao
  useEffect(() => {
    if (newAv.ini && newAv.fim) {
      const d1 = new Date(newAv.ini);
      const d2 = new Date(newAv.fim);
      
      // Check if dates are valid
      if (!isNaN(d1.getTime()) && !isNaN(d2.getTime())) {
        const diffTime = d2.getTime() - d1.getTime();
        // Calculate days inclusive (+1)
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
        
        setNewAv(prev => ({ 
          ...prev, 
          dias: diffDays > 0 ? diffDays : 0 
        }));
      }
    }
  }, [newAv.ini, newAv.fim]);

  const handleAddAf = () => {
    if (!newAf.ini || !newAf.fim) return alert('Datas obrigatórias');
    addAfastamento({
      id: uuidv4(),
      nat: 'Não conta',
      fund: newAf.fund || '—',
      ini: newAf.ini!,
      fim: newAf.fim!,
      status: 'Pendente'
    });
    setNewAf({ nat: 'Não conta', fund: '', ini: '', fim: '' });
  };

  const handleAddAv = () => {
    if (!newAv.ini || !newAv.fim || !newAv.dias) return alert('Preencha todos os campos');
    addAverbacao({
      id: uuidv4(),
      orig: newAv.orig!,
      ini: newAv.ini!,
      fim: newAv.fim!,
      dias: Number(newAv.dias),
      doc: '—',
      status: 'Validado' // Auto-validate for immediate calculation
    });
    setNewAv({ orig: 'Exército Brasileiro', dias: 0, ini: '', fim: '' });
  };

  // Helper to calculate duration in days between two dates string
  const calculateDays = (ini: string, fim: string) => {
    if (!ini || !fim) return 0;
    const d1 = new Date(ini);
    const d2 = new Date(fim);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return 0;
    const diffTime = d2.getTime() - d1.getTime();
    return Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  // Helper to format days into Years, Months, Days (Gregorian Calendar Logic)
  const formatTempo = (totalDias: number) => {
    if (totalDias <= 0) return { anos: 0, meses: 0, dias: 0 };
    
    const today = new Date();
    // Create a virtual start date by subtracting total days from today
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - totalDias);

    let anos = today.getFullYear() - startDate.getFullYear();
    let meses = today.getMonth() - startDate.getMonth();
    let dias = today.getDate() - startDate.getDate();

    if (dias < 0) {
      meses--;
      const lastDayPrevMonth = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
      dias += lastDayPrevMonth;
    }

    if (meses < 0) {
      anos--;
      meses += 12;
    }

    return { anos, meses, dias };
  };

  const tempoFormatado = formatTempo(state.calc.dias);

  return (
    <div className="space-y-6">
      {/* Data Entry Section */}
      <Card title="Dados do Policial">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">
              <User size={12} /> Nome Completo
            </label>
            <input 
              className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pmerj-blue outline-none bg-white text-gray-900"
              value={state.policial.nome}
              onChange={(e) => updatePolicial({...state.policial, nome: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">RG</label>
            <input 
              className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pmerj-blue outline-none bg-white text-gray-900"
              value={state.policial.rg}
              onChange={(e) => updatePolicial({...state.policial, rg: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Posto/Graduação</label>
            <input 
              className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pmerj-blue outline-none bg-white text-gray-900"
              value={state.policial.posto}
              onChange={(e) => updatePolicial({...state.policial, posto: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">
              <Calendar size={12} /> Data de Praça (Início)
            </label>
            <input 
              type="date"
              className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pmerj-blue outline-none bg-white text-gray-900"
              value={state.policial.praca}
              onChange={(e) => updatePolicial({...state.policial, praca: e.target.value})}
            />
          </div>
        </div>
      </Card>

      {/* Split View: Stats + Averbacao Input */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Stats */}
        <div className="bg-blue-50/80 rounded-xl p-5 border border-blue-100 flex flex-col justify-between">
           <div>
             <h3 className="text-sm font-bold text-pmerj-dark mb-4 flex items-center gap-2">
                <Calculator size={16} className="text-pmerj-blue" />
                Resumo e Projeção
             </h3>
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm text-center">
                   <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Dias Válidos</div>
                   <div className="text-3xl font-bold text-gray-800">{state.calc.dias.toLocaleString('pt-BR')}</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm text-center">
                   <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Tempo (A-M-D)</div>
                   <div className="text-xl font-bold text-gray-800 flex items-center justify-center h-9">
                      {tempoFormatado.anos}a {tempoFormatado.meses}m {tempoFormatado.dias}d
                   </div>
                </div>
                
                {/* 1º Decênio */}
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm text-center border-l-4 border-l-pmerj-dark">
                   <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">1º Decênio</div>
                   <div className="text-xl font-bold text-pmerj-dark truncate mt-1">
                      {state.calc.decenio1 ? new Date(state.calc.decenio1).toLocaleDateString('pt-BR') : '—'}
                   </div>
                </div>

                {/* 2º Decênio */}
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm text-center border-l-4 border-l-pmerj-blue">
                   <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">2º Decênio</div>
                   <div className="text-xl font-bold text-pmerj-blue truncate mt-1">
                      {state.calc.decenio2 ? new Date(state.calc.decenio2).toLocaleDateString('pt-BR') : '—'}
                   </div>
                </div>

                {/* 3º Decênio */}
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm text-center border-l-4 border-l-pmerj-green col-span-2">
                   <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">3º Decênio</div>
                   <div className="text-xl font-bold text-pmerj-green truncate mt-1">
                      {state.calc.decenio3 ? new Date(state.calc.decenio3).toLocaleDateString('pt-BR') : '—'}
                   </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm text-center border-b-2 border-b-pmerj-yellow col-span-2">
                   <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Decênios Completos</div>
                   <div className="text-3xl font-bold text-pmerj-dark">{state.calc.dec}</div>
                </div>
             </div>
           </div>
           <div className="mt-4 text-[10px] text-gray-500 text-center">
             * Decênio = Praça + (10/20/30 anos) + Afastamentos - Averbações.
           </div>
        </div>

        {/* Right: Averbacao Input Form */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-pmerj-yellow"></div>
          <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FileText size={16} className="text-pmerj-yellow" />
            Lançar Averbação
          </h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-[10px] font-medium text-gray-500 mb-1">Órgão / Origem</label>
              <select 
                className="w-full p-2 border border-gray-300 rounded text-xs bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-pmerj-yellow"
                value={newAv.orig} 
                onChange={e => setNewAv({...newAv, orig: e.target.value})}
              >
                {ORGAOS_AVERBACAO.map((orgao) => (
                  <option key={orgao} value={orgao} className="text-gray-900">
                    {orgao}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-medium text-gray-500 mb-1">Início</label>
                <input type="date" className="w-full p-2 border border-gray-300 rounded text-xs bg-white text-gray-900" 
                   value={newAv.ini} onChange={e => setNewAv({...newAv, ini: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-500 mb-1">Fim</label>
                <input type="date" className="w-full p-2 border border-gray-300 rounded text-xs bg-white text-gray-900" 
                   value={newAv.fim} onChange={e => setNewAv({...newAv, fim: e.target.value})}
                />
              </div>
            </div>

            <div>
               <label className="block text-[10px] font-medium text-gray-500 mb-1">Dias Líquidos (para contagem)</label>
               <input type="number" min="0" className="w-full p-2 border border-gray-300 rounded text-xs bg-white text-gray-900" 
                  value={newAv.dias} onChange={e => setNewAv({...newAv, dias: parseInt(e.target.value)})}
               />
            </div>

            <button 
              onClick={handleAddAv}
              className="w-full mt-2 bg-pmerj-dark text-white py-2 rounded hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2 text-xs font-semibold"
            >
              <Plus size={14} /> Adicionar Averbação
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Afastamentos Table */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-pmerj-dark font-bold text-sm">
            <AlertCircle className="w-4 h-4" />
            <h3>Histórico de Afastamentos</h3>
          </div>
          <Card>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-600 uppercase font-semibold text-[10px]">
                  <tr>
                    <th className="px-3 py-2">Período</th>
                    <th className="px-3 py-2">Dias Líquidos</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {state.afast.map((item) => {
                    const days = calculateDays(item.ini, item.fim);
                    return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-xs">
                        <div className="font-medium">{item.ini}</div>
                        <div className="text-gray-500">{item.fim}</div>
                      </td>
                      <td className="px-3 py-2 font-mono text-xs font-bold text-red-600">
                        {item.nat === 'Não conta' ? `+${days}` : '0'}
                      </td>
                      <td className="px-3 py-2">
                        <Badge type={item.status === 'Validado' ? 'success' : 'warning'}>
                          {item.status}
                        </Badge>
                      </td>
                      <td className="px-3 py-2 text-right flex justify-end gap-1">
                        <button onClick={() => removeAfastamento(item.id)} className="text-gray-400 hover:text-red-600 p-1">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  )})}
                  {state.afast.length === 0 && <tr><td colSpan={4} className="text-center py-4 text-xs text-gray-400">Vazio</td></tr>}
                </tbody>
              </table>
            </div>

            <div className="border-t pt-3 bg-gray-50/50 -mx-5 px-5 -mb-5 pb-5 rounded-b-xl">
              <h4 className="text-[10px] font-bold text-gray-500 mb-2 uppercase">Novo Afastamento</h4>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <input type="date" className="w-full p-1.5 border border-gray-300 rounded text-xs bg-white text-gray-900" 
                   value={newAf.ini} onChange={e => setNewAf({...newAf, ini: e.target.value})}
                />
                <input type="date" className="w-full p-1.5 border border-gray-300 rounded text-xs bg-white text-gray-900" 
                   value={newAf.fim} onChange={e => setNewAf({...newAf, fim: e.target.value})}
                />
              </div>
              <input placeholder="Fundamento (Ex: Art. 63)" className="w-full p-1.5 mb-2 border border-gray-300 rounded text-xs bg-white text-gray-900" 
                  value={newAf.fund} onChange={e => setNewAf({...newAf, fund: e.target.value})}
              />
              <button onClick={handleAddAf} className="w-full bg-gray-200 text-gray-700 py-1.5 rounded hover:bg-gray-300 text-xs font-semibold">
                Adicionar
              </button>
            </div>
          </Card>
        </div>

        {/* Averbacoes Table */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-pmerj-dark font-bold text-sm">
            <FileText className="w-4 h-4" />
            <h3>Histórico de Averbações</h3>
          </div>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-5 text-gray-600 uppercase font-semibold text-[10px]">
                  <tr>
                    <th className="px-3 py-2 w-1/3">Origem / Período</th>
                    <th className="px-3 py-2">Dias</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {state.av.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-xs">
                        <div className="text-pmerj-dark font-semibold truncate max-w-[180px]" title={item.orig}>{item.orig}</div>
                        <div className="text-gray-500 text-[10px]">{item.ini} à {item.fim}</div>
                      </td>
                      <td className="px-3 py-2 font-mono text-xs font-bold text-green-700">+{item.dias}</td>
                      <td className="px-3 py-2">
                        <Badge type={item.status === 'Validado' ? 'success' : 'warning'}>
                          {item.status}
                        </Badge>
                      </td>
                      <td className="px-3 py-2 text-right flex justify-end gap-1">
                        {item.status !== 'Validado' && (
                          <button onClick={() => updateAverbacao(item.id, { status: 'Validado' })} className="text-green-600 hover:bg-green-50 p-1 rounded">
                            <CheckCircle size={14} />
                          </button>
                        )}
                        <button onClick={() => removeAverbacao(item.id)} className="text-gray-400 hover:text-red-600 p-1 rounded">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                   {state.av.length === 0 && (
                    <tr><td colSpan={4} className="text-center py-4 text-gray-400 text-xs">Nenhuma averbação registrada.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
