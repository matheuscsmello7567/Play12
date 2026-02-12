import React from 'react';
import { Trophy, Medal, Crown, Users } from 'lucide-react';
import { ranking } from '../services/data';

const Ranking: React.FC = () => {
  return (
    <div className="bg-zinc-950 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-white uppercase tracking-wide flex items-center justify-center gap-3">
            <Trophy className="w-10 h-10 text-orange-500" />
            Ranking de Times
          </h1>
          <p className="text-zinc-400 mt-4 max-w-2xl mx-auto">
            A classificação oficial da temporada 2026. Pontos são calculados baseados em vitórias, participação em eventos e cumprimento de objetivos.
          </p>
        </div>

        <div className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-zinc-950">
                <tr>
                  <th className="px-6 py-5 text-left text-xs font-black text-zinc-500 uppercase tracking-widest">Posição</th>
                  <th className="px-6 py-5 text-left text-xs font-black text-zinc-500 uppercase tracking-widest">Time</th>
                  <th className="px-6 py-5 text-center text-xs font-black text-zinc-500 uppercase tracking-widest">Operadores</th>
                  <th className="px-6 py-5 text-center text-xs font-black text-zinc-500 uppercase tracking-widest">Jogos</th>
                  <th className="px-6 py-5 text-center text-xs font-black text-zinc-500 uppercase tracking-widest">Pontos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {ranking.map((entry, index) => (
                  <tr key={entry.time.id} className={`group hover:bg-zinc-800/50 transition-colors ${index === 0 ? 'bg-gradient-to-r from-orange-900/10 to-transparent' : ''}`}>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-lg ${
                        index === 0 ? 'bg-yellow-500 text-yellow-950' :
                        index === 1 ? 'bg-zinc-400 text-zinc-900' :
                        index === 2 ? 'bg-orange-800 text-orange-200' :
                        'bg-zinc-800 text-zinc-400'
                      }`}>
                        {entry.posicao}º
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {index === 0 && <Crown className="w-5 h-5 text-yellow-500 mr-2 animate-pulse" />}
                        <span className={`text-lg font-bold ${index === 0 ? 'text-yellow-500' : 'text-white'}`}>
                          {entry.time.nome}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-center text-zinc-400 font-medium">
                      {entry.operadores_count}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-center text-zinc-400 font-medium">
                      {entry.jogos_jogados}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-black bg-green-900/30 text-green-400 border border-green-900">
                        {entry.pontos} PTS
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800 text-center">
              <Crown className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <h3 className="font-bold text-white">Líder da Temporada</h3>
              <p className="text-sm text-zinc-500">Bravo Team (150 pts)</p>
           </div>
           <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800 text-center">
              <Medal className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <h3 className="font-bold text-white">Mais Jogos</h3>
              <p className="text-sm text-zinc-500">Time do Chupa Cabra (4 jogos)</p>
           </div>
           <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800 text-center">
              <Users className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-bold text-white">Maior Squad</h3>
              <p className="text-sm text-zinc-500">Pimenta Maioral (8 ops)</p>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Ranking;
