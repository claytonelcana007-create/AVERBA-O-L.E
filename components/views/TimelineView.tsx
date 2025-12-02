
import React, { useMemo } from 'react';
import { Card } from '../ui/Card';
import { useApp } from '../../context/AppContext';
import { Calendar, AlertCircle, FileText, Star, Flag, ArrowRight } from 'lucide-react';

export const TimelineView: React.FC = () => {
  const { state } = useApp();
  const { policial, av, afast, calc } = state;

  // Aggregate and sort timeline events automatically
  const timelineEvents = useMemo(() => {
    const events = [];

    // 1. Início (Data de Praça)
    if (policial.praca) {
      events.push({
        id: 'praca',
        date: policial.praca,
        endDate: null,
        title: 'Ingresso na Corporação',
        subtitle: 'Início da contagem de tempo',
        type: 'start',
        color: 'bg-blue-600',
        icon: Star
      });
    }

    // 2. Averbações
    av.forEach(item => {
      if (item.ini && item.fim) {
        events.push({
          id: `av-${item.id}`,
          date: item.ini,
          endDate: item.fim,
          title: `Averbação: ${item.orig}`,
          subtitle: `+${item.dias} dias adicionados (${item.status})`,
          type: 'averbacao',
          color: item.status === 'Validado' ? 'bg-green-600' : 'bg-green-400 opacity-70',
          icon: FileText
        });
      }
    });

    // 3. Afastamentos
    afast.forEach(item => {
      if (item.ini && item.fim) {
        const isNegative = item.nat === 'Não conta';
        events.push({
          id: `af-${item.id}`,
          date: item.ini,
          endDate: item.fim,
          title: `Afastamento: ${item.fund || 'Sem fundamento'}`,
          subtitle: isNegative ? 'Período não computado (Interrupção)' : 'Período computado',
          type: 'afastamento',
          color: isNegative ? 'bg-red-600' : 'bg-yellow-500',
          icon: AlertCircle
        });
      }
    });

    // 4. Próximo Decênio (Projeção)
    if (calc.prox) {
      events.push({
        id: 'prox',
        date: calc.prox,
        endDate: null,
        title: `${calc.dec + 1}º Decênio (Projeção)`,
        subtitle: 'Data estimada baseada nos dados atuais',
        type: 'future',
        color: 'bg-gray-500',
        icon: Flag
      });
    }

    // Sort by Date
    return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [policial, av, afast, calc]);

  // Helper formatting date
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  };

  return (
    <div className="space-y-6">
      <Card title="Linha do Tempo Automática">
        <div className="bg-blue-50 text-blue-800 text-sm p-4 rounded-lg border border-blue-100 mb-6 flex items-center gap-2">
          <Calendar size={18} />
          <span>Esta visualização é gerada automaticamente a partir dos dados lançados na aba <strong>Policiais</strong>.</span>
        </div>

        <div className="relative border-l-2 border-gray-200 ml-3 space-y-8 py-2">
          {timelineEvents.map((event, index) => {
            const Icon = event.icon;
            return (
              <div key={event.id} className="relative pl-8">
                {/* Dot / Icon */}
                <div className={`absolute -left-[11px] top-0 w-6 h-6 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-white ${event.color}`}>
                  <Icon size={12} />
                </div>

                {/* Content Card */}
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                    <h4 className="text-sm font-bold text-gray-800">{event.title}</h4>
                    <div className="flex items-center gap-2 text-xs font-mono font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                      <span>{formatDate(event.date)}</span>
                      {event.endDate && (
                        <>
                          <ArrowRight size={10} />
                          <span>{formatDate(event.endDate)}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <p className={`text-xs ${event.type === 'afastamento' && event.color.includes('red') ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
                    {event.subtitle}
                  </p>
                </div>
              </div>
            );
          })}

          {timelineEvents.length === 0 && (
            <div className="pl-8 text-gray-400 text-sm italic">
              Nenhum evento registrado. Preencha a Data de Praça na aba Policiais.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
