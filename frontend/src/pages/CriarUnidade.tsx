import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Crosshair, Users, Target, Save, ArrowLeft, Search, Plus, X } from 'lucide-react';
import { operadores } from '../services/data';

const BRAZILIAN_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const CriarUnidade: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    lema: '',
    estado: '',
    descricao: '',
    tipo: 'Assalto',
    imagemUrl: '',
    membros: [] as string[]
  });
  
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOperators = useMemo(() => {
    if (!searchTerm) return [];
    return operadores.filter(op => 
      (op.apelido.toLowerCase().includes(searchTerm.toLowerCase()) || 
       op.nome_completo.toLowerCase().includes(searchTerm.toLowerCase())) &&
      !formData.membros.includes(op.id)
    ).slice(0, 5);
  }, [searchTerm, formData.membros]);

  const selectedOperators = useMemo(() => {
    return operadores.filter(op => formData.membros.includes(op.id));
  }, [formData.membros]);

  const addMember = (operatorId: string) => {
    setFormData(prev => ({
      ...prev,
      membros: [...prev.membros, operatorId]
    }));
    setSearchTerm('');
  };

  const removeMember = (operatorId: string) => {
    setFormData(prev => ({
      ...prev,
      membros: prev.membros.filter(id => id !== operatorId)
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    console.log('Dados da Nova Unidade:', formData);
    alert('Solicitação de criação de unidade enviada com sucesso! Aguarde a aprovação do comando.');
    navigate('/times');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-white/10 pb-6">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-white/5 rounded-full transition-colors text-zinc-400 hover:text-white"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="font-header text-3xl font-bold text-white uppercase tracking-widest">
            Nova Unidade
          </h1>
          <p className="font-mono text-xs text-zinc-500 uppercase mt-1">
            Registro de novo Squad Tático
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Info Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section: Identificação */}
          <div className="bg-armor-gray/50 border border-white/5 p-6 space-y-6">
            <h2 className="flex items-center gap-2 font-header text-lg text-tactical-amber uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
              <Users className="w-5 h-5" />
              Identificação da Unidade
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-mono text-zinc-400 uppercase">Nome do Squad</label>
                <input
                  type="text"
                  name="nome"
                  required
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Ex: Bravo Team"
                  className="w-full bg-black/40 border border-white/10 px-4 py-3 text-white focus:border-tactical-amber focus:outline-none focus:ring-1 focus:ring-tactical-amber/50 font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-zinc-400 uppercase">Lema (Motto)</label>
                <input
                  type="text"
                  name="lema"
                  value={formData.lema}
                  onChange={handleChange}
                  placeholder="Ex: Semper Fidelis"
                  className="w-full bg-black/40 border border-white/10 px-4 py-3 text-white focus:border-tactical-amber focus:outline-none focus:ring-1 focus:ring-tactical-amber/50 font-mono text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-zinc-400 uppercase">Descrição da Unidade</label>
              <textarea
                name="descricao"
                required
                rows={4}
                value={formData.descricao}
                onChange={handleChange}
                placeholder="Descreva o foco tático e objetivos da unidade..."
                className="w-full bg-black/40 border border-white/10 px-4 py-3 text-white focus:border-tactical-amber focus:outline-none focus:ring-1 focus:ring-tactical-amber/50 font-mono text-sm resize-none"
              />
            </div>
          </div>

          {/* Section: Operacional */}
          <div className="bg-armor-gray/50 border border-white/5 p-6 space-y-6">
            <h2 className="flex items-center gap-2 font-header text-lg text-tactical-amber uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
              <Crosshair className="w-5 h-5" />
              Operacional
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Member Selection */}
              <div className="space-y-4 md:col-span-2">
                <label className="text-xs font-mono text-zinc-400 uppercase">Incluir Membros</label>
                
                {/* Search Input */}
                <div className="relative">
                    <div className="flex items-center bg-black/40 border border-white/10 px-4 py-3 w-full focus-within:border-tactical-amber focus-within:ring-1 focus-within:ring-tactical-amber/50">
                        <Search className="w-4 h-4 text-zinc-500 mr-2" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar operador por codinome..."
                            className="bg-transparent border-none outline-none text-white w-full font-mono text-sm placeholder:text-zinc-600"
                        />
                    </div>
                    
                    {/* Suggestions Dropdown */}
                    {searchTerm && filteredOperators.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-zinc-900 border border-white/10 shadow-xl max-h-60 overflow-y-auto">
                            {filteredOperators.map(op => (
                                <button
                                    key={op.id}
                                    type="button"
                                    onClick={() => addMember(op.id)}
                                    className="w-full text-left px-4 py-3 hover:bg-white/5 flex justify-between items-center group"
                                >
                                    <div>
                                        <div className="text-white font-bold text-sm">{op.apelido}</div>
                                        <div className="text-xs text-zinc-500">{op.nome_completo}</div>
                                    </div>
                                    <Plus className="w-4 h-4 text-tactical-amber opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Selected Members List */}
                {selectedOperators.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {selectedOperators.map(op => (
                            <div key={op.id} className="flex items-center gap-2 bg-tactical-amber/10 border border-tactical-amber/30 px-3 py-1.5 rounded-sm">
                                <span className="text-xs font-bold text-tactical-amber uppercase">{op.apelido}</span>
                                <button
                                    type="button"
                                    onClick={() => removeMember(op.id)}
                                    className="text-tactical-amber/70 hover:text-tactical-amber hover:bg-tactical-amber/20 rounded-full p-0.5 transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                 {selectedOperators.length === 0 && (
                    <p className="text-xs text-zinc-600 font-mono italic">
                        Nenhum operador selecionado. Adicione membros para formar o time.
                    </p>
                )}
              </div>

              {/* State Selection */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-zinc-400 uppercase">Estado</label>
                <div className="relative">
                  <select
                    name="estado"
                    required
                    value={formData.estado}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-white/10 px-4 py-3 text-white focus:border-tactical-amber focus:outline-none focus:ring-1 focus:ring-tactical-amber/50 font-mono text-sm appearance-none uppercase"
                  >
                    <option value="" disabled>Selecione UF</option>
                    {BRAZILIAN_STATES.map(uf => (
                        <option key={uf} value={uf}>{uf}</option>
                    ))}
                  </select>
                  <Target className="absolute right-3 top-3 w-4 h-4 text-zinc-500 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-zinc-400 uppercase">Especialidade</label>
                <div className="relative">
                  <select
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-white/10 px-4 py-3 text-white focus:border-tactical-amber focus:outline-none focus:ring-1 focus:ring-tactical-amber/50 font-mono text-sm appearance-none"
                  >
                    <option value="Assalto">Assalto</option>
                    <option value="Reconhecimento">Reconhecimento</option>
                    <option value="Suporte">Suporte</option>
                  </select>
                  <Target className="absolute right-3 top-3 w-4 h-4 text-zinc-500 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-armor-gray p-6 border border-white/10 h-full flex flex-col justify-between">
            <div>
              <h3 className="font-header text-lg text-white uppercase mb-4">Diretrizes de Criação</h3>
              <ul className="space-y-4 text-sm text-zinc-400 font-mono">
                <li className="flex gap-3">
                  <span className="text-tactical-amber font-bold">01.</span>
                  O nome da unidade deve ser único e respeitar as regras da comunidade.
                </li>
                <li className="flex gap-3">
                  <span className="text-tactical-amber font-bold">02.</span>
                  Uma unidade precisa de no mínimo 3 operadores para ser considerada ativa no ranking.
                </li>
                <li className="flex gap-3">
                  <span className="text-tactical-amber font-bold">03.</span>
                  O criador da unidade será automaticamente atribuído como Comandante.
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-8 border-t border-white/10">
              <button
                type="submit"
                className="w-full group relative bg-tactical-amber text-black font-bold uppercase py-4 px-6 tracking-widest clip-corner-br hover:bg-white transition-all duration-300"
              >
                 <span className="relative z-10 flex items-center justify-center gap-2">
                    <Save className="w-5 h-5" />
                    Registrar Unidade
                 </span>
                 <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CriarUnidade;
