import React, { useState } from 'react';
import { Crosshair, Lock, Fingerprint, Scan, ArrowRight, UserPlus, Shield } from 'lucide-react';

const Login: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setScanning(true);
    setTimeout(() => {
        setScanning(false);
    }, 2000);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center relative">
      
      <div className="max-w-md w-full relative z-10">
        
        <div className="text-center mb-12">
           <div className="mx-auto w-16 h-16 border border-tactical-amber flex items-center justify-center rounded-full mb-6 relative">
              <div className="absolute inset-0 rounded-full animate-ping bg-tactical-amber/20"></div>
              {isRegister ? <UserPlus className="w-8 h-8 text-tactical-amber" /> : <Scan className="w-8 h-8 text-tactical-amber" />}
           </div>
           <h2 className="font-header text-3xl font-bold text-white tracking-[0.2em] mb-2">
              {isRegister ? 'NOVO OPERADOR' : 'ACESSO BIOMÉTRICO'}
           </h2>
           <p className="font-mono text-xs text-zinc-500 uppercase">
              {isRegister ? 'Registre-se para ingressar na unidade' : 'Insira credenciais para iniciar link'}
           </p>
        </div>

        {/* Toggle Login / Cadastro */}
        <div className="flex mb-6 border border-white/10 bg-armor-gray/30">
           <button
             type="button"
             onClick={() => setIsRegister(false)}
             className={`flex-1 py-3 text-xs font-mono font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
               !isRegister ? 'bg-tactical-amber/20 text-tactical-amber border-b-2 border-tactical-amber' : 'text-zinc-500 hover:text-white hover:bg-white/5'
             }`}
           >
             <Scan className="w-3 h-3" /> AUTENTICAR
           </button>
           <button
             type="button"
             onClick={() => setIsRegister(true)}
             className={`flex-1 py-3 text-xs font-mono font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
               isRegister ? 'bg-tactical-amber/20 text-tactical-amber border-b-2 border-tactical-amber' : 'text-zinc-500 hover:text-white hover:bg-white/5'
             }`}
           >
             <UserPlus className="w-3 h-3" /> ALISTAR-SE
           </button>
        </div>

        <div className={`bg-armor-gray/50 border border-white/10 p-8 clip-corner-both backdrop-blur-md relative transition-all duration-500 ${scanning ? 'opacity-50 blur-sm' : 'opacity-100'}`}>
           
           <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-tactical-amber"></div>
           <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-tactical-amber"></div>
           <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-tactical-amber"></div>
           <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-tactical-amber"></div>

           <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">

                 {/* Campos exclusivos do cadastro */}
                 {isRegister && (
                   <>
                     <div className="group">
                        <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1 group-focus-within:text-hud-blue transition-colors">Callsign (Apelido)</label>
                        <input 
                          type="text" 
                          required
                          className="w-full bg-ops-black border border-white/10 px-4 py-3 text-white font-mono text-sm focus:border-hud-blue focus:outline-none transition-colors placeholder-zinc-800"
                          placeholder="EX: GHOST, VIPER, SANDMAN"
                        />
                     </div>
                     <div className="group">
                        <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1 group-focus-within:text-hud-blue transition-colors">Nome Completo</label>
                        <input 
                          type="text" 
                          required
                          className="w-full bg-ops-black border border-white/10 px-4 py-3 text-white font-mono text-sm focus:border-hud-blue focus:outline-none transition-colors placeholder-zinc-800"
                          placeholder="NOME DO OPERADOR"
                        />
                     </div>
                     <div className="group">
                        <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1 group-focus-within:text-hud-blue transition-colors">Canal de Comunicação (Telefone)</label>
                        <input 
                          type="tel" 
                          required
                          className="w-full bg-ops-black border border-white/10 px-4 py-3 text-white font-mono text-sm focus:border-hud-blue focus:outline-none transition-colors placeholder-zinc-800"
                          placeholder="(00) 00000-0000"
                        />
                     </div>
                   </>
                 )}

                 <div className="group">
                    <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1 group-focus-within:text-hud-blue transition-colors">Identificação (Email)</label>
                    <input 
                      type="email" 
                      required
                      className="w-full bg-ops-black border border-white/10 px-4 py-3 text-white font-mono text-sm focus:border-hud-blue focus:outline-none transition-colors placeholder-zinc-800"
                      placeholder="OPERADOR@PLAY12.COM"
                    />
                 </div>
                 <div className="group">
                    <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1 group-focus-within:text-hud-blue transition-colors">Chave de Acesso (Senha)</label>
                    <input 
                      type="password" 
                      required
                      className="w-full bg-ops-black border border-white/10 px-4 py-3 text-white font-mono text-sm focus:border-hud-blue focus:outline-none transition-colors placeholder-zinc-800"
                      placeholder="••••••••••••"
                    />
                 </div>

                 {/* Confirmar senha no cadastro */}
                 {isRegister && (
                   <div className="group">
                      <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1 group-focus-within:text-hud-blue transition-colors">Confirmar Chave de Acesso</label>
                      <input 
                        type="password" 
                        required
                        className="w-full bg-ops-black border border-white/10 px-4 py-3 text-white font-mono text-sm focus:border-hud-blue focus:outline-none transition-colors placeholder-zinc-800"
                        placeholder="••••••••••••"
                      />
                   </div>
                 )}
              </div>

              <button 
                type="submit"
                className="w-full bg-white/5 border border-tactical-amber/50 text-tactical-amber font-header font-bold uppercase tracking-widest py-4 hover:bg-tactical-amber hover:text-black transition-all clip-corner-br flex items-center justify-center gap-2 group"
              >
                {scanning ? 'PROCESSANDO...' : isRegister ? 'REGISTRAR OPERADOR' : 'INICIAR LINK'}
                {!scanning && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </button>
           </form>

        </div>

        {/* Texto alternativo abaixo do form */}
        <div className="text-center mt-6">
           <button
             type="button"
             onClick={() => setIsRegister(!isRegister)}
             className="font-mono text-xs text-zinc-600 hover:text-tactical-amber transition-colors uppercase tracking-wider"
           >
             {isRegister ? '// JÁ POSSUI CREDENCIAIS? AUTENTICAR' : '// NOVO RECRUTA? ALISTAR-SE'}
           </button>
        </div>
        
        {scanning && (
            <div className="absolute inset-0 flex items-center justify-center z-50">
                <div className="w-full h-1 bg-vision-green shadow-[0_0_20px_#00FF94] animate-[scan_1s_ease-in-out_infinite]"></div>
                <div className="absolute text-vision-green font-mono text-xs bg-black px-2">
                   {isRegister ? 'REGISTRANDO BIOMETRIA...' : 'VERIFICANDO DNA...'}
                </div>
            </div>
        )}

      </div>

    </div>
  );
};

export default Login;
