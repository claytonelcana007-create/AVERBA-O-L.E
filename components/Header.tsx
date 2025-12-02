import React from 'react';
import { Download, Save } from 'lucide-react';

interface HeaderProps {
  title: string;
  onSave: () => void;
  onExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, onSave, onExport }) => {
  const getBreadcrumbTitle = (view: string) => {
    switch (view) {
      case 'policiais': return 'Policiais';
      case 'linha': return 'Linha do Tempo';
      case 'decenios': return 'Decênios';
      case 'le': return 'Licença Especial';
      case 'config': return 'Configurações';
      default: return 'Policiais';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 h-16 px-5 flex items-center justify-between sticky top-0 z-20 shadow-sm">
      <div className="flex items-center gap-3">
        <strong className="text-gray-500 text-sm font-medium">PMERJ</strong>
        <span className="text-gray-300">/</span>
        <strong className="text-pmerj-dark text-lg">{getBreadcrumbTitle(title)}</strong>
        <span className="bg-pmerj-light text-pmerj-dark text-xs font-semibold px-2.5 py-0.5 rounded-full ml-2">
          Conectado
        </span>
      </div>
      <div className="flex items-center gap-3">
        <button 
          onClick={onSave}
          className="flex items-center gap-2 bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          <Save size={16} />
          Salvar tudo
        </button>
        <button 
          onClick={onExport}
          className="flex items-center gap-2 bg-pmerj-blue text-white hover:bg-blue-700 px-3 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
        >
          <Download size={16} />
          Exportar JSON
        </button>
      </div>
    </header>
  );
};