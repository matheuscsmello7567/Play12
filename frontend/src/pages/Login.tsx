import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crosshair, Lock, Fingerprint, Scan, ArrowRight, UserPlus, Shield, CheckCircle, AlertTriangle, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type ToastType = 'success' | 'error';

interface Toast {
  type: ToastType;
  message: string;
}

const Login: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const navigate = useNavigate();
  const { login, register } = useAuth();

  // Form state
  const [nickname, setNickname] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const showToast = (type: ToastType, message: string) => {
    setToast({ type, message });
    if (type === 'success') {
      setTimeout(() => setToast(null), 4000);
    } else {
      setTimeout(() => setToast(null), 6000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isRegister && password !== confirmPassword) {
      showToast('error', 'As senhas não coincidem.');
      return;
    }

    setScanning(true);

    try {
      if (isRegister) {
        await register({ nickname, email, password, fullName: fullName || undefined, phone: phone || undefined });
        showToast('success', `Operador "${nickname}" registrado com sucesso! Bem-vindo à unidade.`);
        setTimeout(() => navigate('/'), 2000);
      } else {
        await login(email, password);
        showToast('success', 'Autenticação concluída. Link estabelecido com sucesso.');
        setTimeout(() => navigate('/'), 1500);
      }
    } catch (err: any) {
      const msg = err?.message || 'Erro desconhecido. Tente novamente.';
      showToast('error', msg);
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center relative">

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md animate-[slideDown_0.3s_ease-out]`}>
          <div className={`mx-4 flex items-start gap-3 p-4 border backdrop-blur-md rounded-sm clip-corner-br ${
            toast.type === 'success'
              ? 'bg-vision-green/10 border-vision-green/40 text-vision-green'
              : 'bg-red-500/10 border-red-500/40 text-red-400'
          }`}>
            {toast.type === 'success' 
              ? <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              : <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            }
            <div className="flex-1">
              <div className="font-mono text-[10px] uppercase tracking-widest mb-1 opacity-70">
                {toast.type === 'success' ? '// OPERAÇÃO BEM-SUCEDIDA' : '// FALHA NA OPERAÇÃO'}
              </div>
              <p className="font-mono text-sm">{toast.message}</p>
            </div>
            <button onClick={() => setToast(null)} className="opacity-50 hover:opacity-100 transition-opacity">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      
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
                          value={nickname}
                          onChange={(e) => setNickname(e.target.value)}
                          className="w-full bg-ops-black border border-white/10 px-4 py-3 text-white font-mono text-sm focus:border-hud-blue focus:outline-none transition-colors placeholder-zinc-800"
                          placeholder="EX: GHOST, VIPER, SANDMAN"
                        />
                     </div>
                     <div className="group">
                        <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1 group-focus-within:text-hud-blue transition-colors">Nome Completo</label>
                        <input 
                          type="text" 
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full bg-ops-black border border-white/10 px-4 py-3 text-white font-mono text-sm focus:border-hud-blue focus:outline-none transition-colors placeholder-zinc-800"
                          placeholder="NOME DO OPERADOR"
                        />
                     </div>
                     <div className="group">
                        <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1 group-focus-within:text-hud-blue transition-colors">Canal de Comunicação (Telefone)</label>
                        <input 
                          type="tel" 
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-ops-black border border-white/10 px-4 py-3 text-white font-mono text-sm focus:border-hud-blue focus:outline-none transition-colors placeholder-zinc-800"
                      placeholder="OPERADOR@PLAY12.COM"
                    />
                 </div>
                 <div className="group">
                    <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1 group-focus-within:text-hud-blue transition-colors">Chave de Acesso (Senha)</label>
                    <input 
                      type="password" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-ops-black border border-white/10 px-4 py-3 text-white font-mono text-sm focus:border-hud-blue focus:outline-none transition-colors placeholder-zinc-800"
                        placeholder="••••••••••••"
                      />
                   </div>
                 )}
              </div>

              <button 
                type="submit"
                disabled={scanning}
                className="w-full bg-white/5 border border-tactical-amber/50 text-tactical-amber font-header font-bold uppercase tracking-widest py-4 hover:bg-tactical-amber hover:text-black transition-all clip-corner-br flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
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
