import React, { useState } from 'react';
import { Save, Search, Shield, User } from 'lucide-react';

const API = 'http://localhost:3333/api/v1';

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

interface Props {
  operators: Operator[];
  onRefresh: () => void;
}

const DashboardOperadores: React.FC<Props> = ({ operators, onRefresh }) => {
  const [search, setSearch] = useState('');
  const [editingPoints, setEditingPoints] = useState<Record<number, number>>({});
  const [saving, setSaving] = useState<number | null>(null);
  const [toast, setToast] = useState('');

  const filtered = operators.filter(
    (op) =>
      op.nickname.toLowerCase().includes(search.toLowerCase()) ||
      op.fullName.toLowerCase().includes(search.toLowerCase())
  );

  const handlePointsChange = (id: number, value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num)) setEditingPoints((prev) => ({ ...prev, [id]: num }));
  };

  const handleSave = async (id: number) => {
    const points = editingPoints[id];
    if (points === undefined) return;
    setSaving(id);
    try {
      const res = await fetch(`${API}/admin/operators/${id}/points`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ points }),
      });
      if (!res.ok) throw new Error('Erro ao salvar pontos');
      setToast(`Pontos de #${id} atualizados.`);
      setEditingPoints((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      onRefresh();
      setTimeout(() => setToast(''), 3000);
    } catch {
      setToast('Erro ao salvar.');
      setTimeout(() => setToast(''), 3000);
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="space-y-4">
      {toast && (
        <div className="bg-vision-green/20 border border-vision-green/40 px-4 py-2 font-mono text-xs text-vision-green">
          {toast}
        </div>
      )}

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          placeholder="Buscar operador..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-ops-black/70 border border-white/10 pl-10 pr-4 py-2.5 font-mono text-sm text-white placeholder-zinc-600 focus:border-tactical-amber/50 focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="bg-armor-gray border border-white/10 p-1 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-ops-black/80">
              {['APELIDO', 'NOME', 'SQUAD', 'PONTOS', 'AÇÕES'].map((h) => (
                <th
                  key={h}
                  className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest px-4 py-3 text-left border-b border-white/5"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((op) => (
              <tr key={op.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-zinc-800 border border-white/10 flex items-center justify-center">
                      <User className="w-3 h-3 text-zinc-500" />
                    </div>
                    <span className="font-mono text-sm text-white">{op.nickname}</span>
                    {op.role === 'ADMIN' && (
                      <span className="text-[9px] bg-tactical-amber/20 text-tactical-amber px-1.5 py-0.5 font-mono uppercase">ADM</span>
                    )}
                    {op.role === 'SQUAD_LEADER' && (
                      <span className="text-[9px] bg-hud-blue/20 text-hud-blue px-1.5 py-0.5 font-mono uppercase">LDR</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-zinc-400">{op.fullName}</td>
                <td className="px-4 py-3">
                  {op.squad ? (
                    <span className="font-mono text-xs text-zinc-300">
                      {op.squad.tag ? `[${op.squad.tag}] ` : ''}
                      {op.squad.name}
                    </span>
                  ) : (
                    <span className="font-mono text-xs text-zinc-600">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    value={editingPoints[op.id] !== undefined ? editingPoints[op.id] : op.engagementScore}
                    onChange={(e) => handlePointsChange(op.id, e.target.value)}
                    className="w-20 bg-ops-black border border-white/10 px-2 py-1 font-mono text-sm text-tactical-amber text-center focus:border-tactical-amber/50 focus:outline-none"
                  />
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleSave(op.id)}
                    disabled={saving === op.id || editingPoints[op.id] === undefined}
                    className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider bg-tactical-amber/20 border border-tactical-amber/40 text-tactical-amber px-3 py-1.5 hover:bg-tactical-amber/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <Save className="w-3 h-3" />
                    {saving === op.id ? '...' : 'Salvar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-8 font-mono text-xs text-zinc-600 uppercase">
            Nenhum operador encontrado
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardOperadores;
