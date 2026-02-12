import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Construction } from 'lucide-react';

const Evolucao: React.FC = () => {
  const data = [
    { name: 'Jan', jogos: 2, pontos: 300 },
    { name: 'Fev', jogos: 3, pontos: 450 },
    { name: 'Mar', jogos: 1, pontos: 150 },
    { name: 'Abr', jogos: 4, pontos: 600 },
    { name: 'Mai', jogos: 2, pontos: 320 },
    { name: 'Jun', jogos: 5, pontos: 800 },
  ];

  return (
    <div className="bg-zinc-950 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-10">
          <h1 className="text-3xl font-black text-white uppercase tracking-wide">Evolução do Operador</h1>
          <p className="text-zinc-400 mt-2">Acompanhe seu desempenho tático ao longo da temporada.</p>
        </div>

        <div className="bg-orange-900/20 border border-orange-600/50 rounded-lg p-4 mb-8 flex items-center gap-3">
          <Construction className="text-orange-500 w-6 h-6" />
          <span className="text-orange-200 font-medium">Esta seção está em desenvolvimento. Dados demonstrativos abaixo.</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 shadow-xl">
             <h3 className="text-white font-bold mb-6">Progressão de Pontos (XP)</h3>
             <div className="h-80 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={data}>
                   <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                   <XAxis dataKey="name" stroke="#71717a" />
                   <YAxis stroke="#71717a" />
                   <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                   <Line type="monotone" dataKey="pontos" stroke="#ea580c" strokeWidth={3} activeDot={{ r: 8 }} />
                 </LineChart>
               </ResponsiveContainer>
             </div>
          </div>

          <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 shadow-xl">
             <h3 className="text-white font-bold mb-6">Jogos Participados</h3>
             <div className="h-80 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={data}>
                   <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                   <XAxis dataKey="name" stroke="#71717a" />
                   <YAxis stroke="#71717a" />
                   <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', color: '#fff' }} cursor={{fill: '#27272a'}} />
                   <Bar dataKey="jogos" fill="#ea580c" radius={[4, 4, 0, 0]} />
                 </BarChart>
               </ResponsiveContainer>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
           <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 text-center">
             <div className="text-3xl font-black text-white">17</div>
             <div className="text-xs uppercase tracking-widest text-zinc-500 mt-1">Total de Jogos</div>
           </div>
           <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 text-center">
             <div className="text-3xl font-black text-green-500">2.620</div>
             <div className="text-xs uppercase tracking-widest text-zinc-500 mt-1">Pontos Totais</div>
           </div>
           <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 text-center">
             <div className="text-3xl font-black text-blue-500">92%</div>
             <div className="text-xs uppercase tracking-widest text-zinc-500 mt-1">Precisão Estimada</div>
           </div>
           <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 text-center">
             <div className="text-3xl font-black text-yellow-500">3</div>
             <div className="text-xs uppercase tracking-widest text-zinc-500 mt-1">MVP Matches</div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Evolucao;
