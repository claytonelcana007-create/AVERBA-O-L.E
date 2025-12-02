import React from 'react';
import { 
  Users, Calendar, 
  BarChart2, ClipboardList, Settings, Shield 
} from 'lucide-react';
import { ViewName } from '../types';

interface SidebarProps {
  currentView: ViewName;
  onChangeView: (view: ViewName) => void;
}

const navItems: { id: ViewName; label: string; icon: React.ElementType }[] = [
  { id: 'policiais', label: 'Policiais', icon: Users },
  { id: 'linha', label: 'Linha do Tempo', icon: Calendar },
  { id: 'decenios', label: 'Decênios', icon: BarChart2 },
  { id: 'le', label: 'Licença Especial', icon: ClipboardList },
  { id: 'config', label: 'Configurações', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
  return (
    <aside className="w-[260px] bg-pmerj-dark text-white flex flex-col p-5 h-full fixed left-0 top-0 overflow-y-auto z-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-9 h-9 rounded-lg bg-white text-pmerj-dark font-bold grid place-items-center shrink-0">
          <Shield size={20} />
        </div>
        <div>
          <div className="font-bold leading-tight">PMERJ</div>
          <div className="text-xs text-gray-400 opacity-90">Decênios & Licença Esp.</div>
        </div>
      </div>
      
      <nav className="flex-1">
        {navItems.map((item) => (
          <a
            key={item.id}
            href="#"
            onClick={(e) => { e.preventDefault(); onChangeView(item.id); }}
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1.5 transition-colors text-sm font-medium
              ${currentView === item.id 
                ? 'bg-white/10 text-white' 
                : 'text-gray-300 hover:bg-white/5 hover:text-white'}
            `}
          >
            <item.icon size={18} />
            {item.label}
          </a>
        ))}
      </nav>

      <div className="mt-auto pt-4 border-t border-white/10 text-xs text-gray-500">
        v1.0.0 • React + Tailwind
      </div>
    </aside>
  );
};