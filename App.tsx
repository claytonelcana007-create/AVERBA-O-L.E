
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { PoliciaisView } from './components/views/PoliciaisView';
import { TimelineView } from './components/views/TimelineView';
import { DeceniosView } from './components/views/DeceniosView';
import { LicencaEspecialView } from './components/views/LicencaEspecialView';
import { ConfigView } from './components/views/ConfigView';
import { AppProvider, useApp } from './context/AppContext';
import { ViewName } from './types';
import { Modal } from './components/Modal';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewName>('policiais');
  const [isExportModalOpen, setExportModalOpen] = useState(false);
  const { state, saveData } = useApp();

  const renderView = () => {
    switch (currentView) {
      case 'policiais': return <PoliciaisView />;
      case 'linha': return <TimelineView />;
      case 'decenios': return <DeceniosView />;
      case 'le': return <LicencaEspecialView />;
      case 'config': return <ConfigView />;
      default: return <PoliciaisView />;
    }
  };

  const handleExport = () => {
    setExportModalOpen(true);
  };

  const handleSaveAll = () => {
    saveData();
    alert('Dados salvos com sucesso no navegador!');
  };

  return (
    <div className="flex h-screen bg-pmerj-light overflow-hidden">
      <Sidebar currentView={currentView} onChangeView={setCurrentView} />
      <div className="flex-1 flex flex-col ml-[260px]">
        <Header 
          title={currentView} 
          onSave={handleSaveAll} 
          onExport={handleExport} 
        />
        <main className="flex-1 overflow-y-auto p-6 relative">
          {/* Background watermark */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] bg-[url('https://picsum.photos/1200/800')] bg-center bg-cover bg-no-repeat filter grayscale" />
          <div className="relative z-10 max-w-6xl mx-auto">
             {renderView()}
          </div>
        </main>
      </div>

      <Modal 
        isOpen={isExportModalOpen} 
        onClose={() => setExportModalOpen(false)} 
        title="Exportar JSON"
      >
        <div className="space-y-4">
          <textarea 
            className="w-full h-64 p-3 border border-gray-300 rounded-lg font-mono text-xs bg-white text-gray-900 focus:outline-none"
            readOnly
            value={JSON.stringify(state, null, 2)}
          />
          <div className="flex justify-end gap-2">
            <button 
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(state, null, 2));
                alert('Copiado para a área de transferência!');
              }}
              className="px-4 py-2 bg-pmerj-blue text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
            >
              Copiar
            </button>
            <button 
              onClick={() => setExportModalOpen(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-300"
            >
              Fechar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
