import React from 'react';
import { Shield, AlertTriangle, Crosshair, CheckCircle } from 'lucide-react';

const Manual: React.FC = () => {
  return (
    <div className="bg-zinc-950 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-12 border-b border-zinc-800 pb-8">
          <h1 className="text-4xl font-black text-white uppercase tracking-wide">Manual do Airsoft</h1>
          <p className="text-xl text-zinc-400 mt-4">
            Regras oficiais de conduta, segurança e limites de FPS da Play12.
          </p>
        </div>

        <div className="space-y-12">
          
          <section>
            <div className="flex items-center gap-3 mb-6">
               <Shield className="w-8 h-8 text-orange-500" />
               <h2 className="text-2xl font-bold text-white">Regras Gerais</h2>
            </div>
            <div className="bg-zinc-900 rounded-xl p-8 border border-zinc-800 shadow-lg">
               <ul className="space-y-4">
                 <li className="flex items-start gap-3">
                   <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                   <span className="text-zinc-300">O respeito é imprescindível entre todos os operadores, organizadores e equipe de apoio.</span>
                 </li>
                 <li className="flex items-start gap-3">
                   <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                   <span className="text-zinc-300 font-bold">NUNCA remova seus óculos de proteção dentro da área de jogo (Safe Zone é a única exceção).</span>
                 </li>
                 <li className="flex items-start gap-3">
                   <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                   <span className="text-zinc-300">Siga estritamente as instruções dos Rangers/Juízes de campo.</span>
                 </li>
                 <li className="flex items-start gap-3">
                   <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                   <span className="text-zinc-300">Respeite os limites de FPS estabelecidos para cada categoria de armamento.</span>
                 </li>
               </ul>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6">
               <Crosshair className="w-8 h-8 text-orange-500" />
               <h2 className="text-2xl font-bold text-white">Limites de Energia (FPS)</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
                  <h3 className="font-bold text-white text-lg mb-2">Pistolas / Secundárias</h3>
                  <div className="text-3xl font-black text-orange-500">Até 350 FPS</div>
                  <p className="text-zinc-500 text-sm mt-2">Medido com BBs 0.20g. Sem distância mínima de engajamento (respeitando o bom senso).</p>
               </div>
               <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
                  <h3 className="font-bold text-white text-lg mb-2">Assault (Rifles)</h3>
                  <div className="text-3xl font-black text-orange-500">Até 400 FPS</div>
                  <p className="text-zinc-500 text-sm mt-2">Medido com BBs 0.20g. Sem distância mínima obrigatória, mas recomenda-se render a curta distância.</p>
               </div>
               <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
                  <h3 className="font-bold text-white text-lg mb-2">DMR</h3>
                  <div className="text-3xl font-black text-orange-500">Até 450 FPS</div>
                  <p className="text-zinc-500 text-sm mt-2">Medido com BBs 0.20g. Disparo apenas em semi-auto. Distância mínima: 10 metros.</p>
               </div>
               <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
                  <h3 className="font-bold text-white text-lg mb-2">Sniper (Bolt Action)</h3>
                  <div className="text-3xl font-black text-orange-500">Até 500 FPS</div>
                  <p className="text-zinc-500 text-sm mt-2">Medido com BBs 0.20g. Distância mínima obrigatória: 20 metros. Obrigatório secundária.</p>
               </div>
            </div>
          </section>

          <section>
             <div className="flex items-center gap-3 mb-6">
               <AlertTriangle className="w-8 h-8 text-orange-500" />
               <h2 className="text-2xl font-bold text-white">Conduta e Penalidades</h2>
            </div>
            <div className="bg-zinc-900 rounded-xl p-8 border-l-4 border-red-600 shadow-lg">
               <p className="text-zinc-300 mb-4">
                 A Play12 preza pela integridade física e moral de seus jogadores.
               </p>
               <ul className="list-disc pl-5 space-y-2 text-zinc-400">
                 <li>Qualquer agressão física ou verbal resultará em <strong>desqualificação imediata</strong> do evento.</li>
                 <li>A decisão dos Rangers é soberana e final.</li>
                 <li>Tolerância zero para assédio ou discriminação de qualquer natureza.</li>
                 <li>Violações graves de segurança (como tirar óculos em jogo) podem acarretar em <strong>banimento permanente</strong>.</li>
                 <li>Highlanders (não acusar o tiro) serão advertidos e, em reincidência, removidos do jogo.</li>
               </ul>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default Manual;
