import React from 'react';
import { Package, Truck, ClipboardList, Wrench } from 'lucide-react';

/**
 * Placeholder for logistics management tab.
 * Will be expanded as logistics features are defined.
 */
const DashboardLogistica: React.FC = () => {
  const sections = [
    { icon: Package, label: 'Equipamentos', desc: 'Controle de equipamentos disponíveis para empréstimo' },
    { icon: Truck, label: 'Transporte', desc: 'Coordenação de veículos e logística de transporte' },
    { icon: ClipboardList, label: 'Check-in', desc: 'Lista de presença e verificação de equipamentos' },
    { icon: Wrench, label: 'Manutenção', desc: 'Status de manutenção de campo e instalações' },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-armor-gray border border-white/10 p-1">
        <div className="bg-ops-black/50 p-6 text-center">
          <div className="text-[10px] font-mono text-tactical-amber uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
            <div className="w-1.5 h-1.5 bg-tactical-amber"></div>
            Logística
          </div>
          <p className="font-mono text-xs text-zinc-500 uppercase">
            Módulo em desenvolvimento — funcionalidades serão habilitadas em breve.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {sections.map((s, i) => (
          <div key={i} className="bg-armor-gray border border-white/10 p-1 opacity-50">
            <div className="bg-ops-black/50 p-5 flex items-start gap-4">
              <div className="w-10 h-10 bg-zinc-800 border border-white/10 flex items-center justify-center flex-shrink-0">
                <s.icon className="w-5 h-5 text-zinc-600" />
              </div>
              <div>
                <div className="font-mono text-sm text-zinc-400 uppercase font-bold">{s.label}</div>
                <div className="font-mono text-[10px] text-zinc-600 mt-1">{s.desc}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardLogistica;
