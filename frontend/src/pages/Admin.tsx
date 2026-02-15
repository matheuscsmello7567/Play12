import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Crosshair, Users, Shield, Gamepad2, Truck, Crown
} from 'lucide-react';

import DashboardNextGame from './admin/DashboardNextGame';
import DashboardOperadores from './admin/DashboardOperadores';
import DashboardTimes from './admin/DashboardTimes';
import DashboardJogos from './admin/DashboardJogos';
import DashboardLogistica from './admin/DashboardLogistica';

const API = 'http://localhost:3333/api/v1';

type TabKey = 'proximo-jogo' | 'operadores' | 'times' | 'jogos' | 'logistica';

interface Tab {
  key: TabKey;
  label: string;
  icon: React.FC<{ className?: string }>;
}

const TABS: Tab[] = [
  { key: 'proximo-jogo', label: 'PROXIMO JOGO', icon: Crosshair },
  { key: 'operadores', label: 'OPERADORES', icon: Users },
  { key: 'times', label: 'TIMES', icon: Shield },
  { key: 'jogos', label: 'JOGOS', icon: Gamepad2 },
  { key: 'logistica', label: 'LOGISTICA', icon: Truck },
];

interface Operator {
  id: number;
  nickname: string;
  fullName: string;
  engagementScore: number;
  role: string;
  isActive: boolean;
  isVerified: boolean;
  squad?: { name: string; tag: string | null } | null;
}

const Admin: React.FC = () => {
  const { operator: authOp } = useAuth();
  const [activeTab, setActiveTab] = useState<TabKey>('proximo-jogo');
  const [stats, setStats] = useState<any>(null);
  const [operators, setOperators] = useState<Operator[]>([]);
  const [isFirstAdmin, setIsFirstAdmin] = useState(false);

  // Check first admin
  useEffect(() => {
    fetch(`${API}/admin/is-first-admin`, { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : false))
      .then((val) => setIsFirstAdmin(val === true))
      .catch(() => setIsFirstAdmin(false));
  }, []);

  // Fetch stats for "Proximo Jogo" tab
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`${API}/admin/stats`, { credentials: 'include' });
      if (res.ok) setStats(await res.json());
    } catch {
      /* silent */
    }
  }, []);

  // Fetch operators for "Operadores" tab
  const fetchOperators = useCallback(async () => {
    try {
      const res = await fetch(`${API}/admin/operators?limit=200`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        const mapped: Operator[] = (data.data || []).map((op: any) => ({
          id: op.id,
          nickname: op.nickname,
          fullName: op.fullName || '',
          engagementScore: op.engagementScore ?? 0,
          role: op.role,
          isActive: op.isActive,
          isVerified: op.verified,
          squad: op.squads?.[0]?.squad || op.ledSquads?.[0] || null,
        }));
        setOperators(mapped);
      }
    } catch {
      /* silent */
    }
  }, []);

  // Load data based on active tab
  useEffect(() => {
    if (activeTab === 'proximo-jogo') fetchStats();
    if (activeTab === 'operadores') fetchOperators();
  }, [activeTab, fetchStats, fetchOperators]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'proximo-jogo':
        return <DashboardNextGame stats={stats} onRefresh={fetchStats} />;
      case 'operadores':
        return <DashboardOperadores operators={operators} onRefresh={fetchOperators} />;
      case 'times':
        return <DashboardTimes />;
      case 'jogos':
        return <DashboardJogos />;
      case 'logistica':
        return <DashboardLogistica />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-armor-gray border border-white/10 p-1">
        <div className="bg-ops-black/50 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-tactical-amber/20 border-2 border-tactical-amber/50 flex items-center justify-center">
              <Crown className="w-6 h-6 text-tactical-amber" />
            </div>
            <div>
              <h1 className="font-header text-3xl font-bold text-white uppercase tracking-wider">Dashboard</h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="font-mono text-[10px] text-zinc-500 uppercase">
                  Admin: <span className="text-tactical-amber">{authOp?.nickname}</span>
                </span>
                {isFirstAdmin && (
                  <span className="font-mono text-[9px] bg-tactical-amber/20 border border-tactical-amber/40 text-tactical-amber px-2 py-0.5 uppercase">
                    Admin Principal
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1.5">
        {TABS.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2.5 font-mono text-[10px] uppercase tracking-widest border transition-all ${
                isActive
                  ? 'bg-tactical-amber/20 border-tactical-amber/40 text-tactical-amber'
                  : 'bg-armor-gray border-white/10 text-zinc-500 hover:text-white hover:border-white/20'
              }`}
            >
              <Icon className="w-3.5 h-3.5" /> {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};

export default Admin;
