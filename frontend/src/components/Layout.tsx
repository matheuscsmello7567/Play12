import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Crosshair, Radio, Shield, Map, Users, BarChart2, ShoppingBag, LogOut, User, ChevronDown, Crown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { operator, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
    navigate('/login');
  };

  const navLinks = [
    { name: 'LINHA DE FRENTE', path: '/', icon: Crosshair },
    { name: 'OPERADORES', path: '/operadores', icon: Shield },
    { name: 'UNIDADES', path: '/times', icon: Users },
    { name: 'MISSÕES', path: '/eventos', icon: Map },
    { name: 'RANKING', path: '/ranking-times', icon: BarChart2 },
    { name: 'SUPRIMENTOS', path: '/loja', icon: ShoppingBag },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex flex-col bg-ops-black text-zinc-300 font-mono relative overflow-hidden scanlines">
      {/* HUD Grid Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-10" 
           style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      {/* Top HUD Bar */}
      <header className="sticky top-0 z-50 bg-ops-black/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Brand / System Status */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-tactical-amber text-black clip-corner-br flex items-center justify-center">
                <Crosshair className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h1 className="font-header font-bold text-xl tracking-widest text-white leading-none">BATTLE MANAGER</h1>
                <div className="flex items-center gap-2 text-[10px] text-vision-green uppercase tracking-wider">
                  <div className="w-2 h-2 bg-vision-green rounded-full animate-blink"></div>
                  System Online // v2.0
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`relative px-4 py-2 flex items-center gap-2 text-xs font-bold tracking-widest transition-all duration-300 group
                      ${active ? 'text-tactical-amber' : 'text-zinc-500 hover:text-white'}
                    `}
                  >
                    {active && (
                      <span className="absolute inset-0 bg-tactical-dim border-b-2 border-tactical-amber opacity-50 skew-x-12"></span>
                    )}
                    <Icon className={`w-4 h-4 ${active ? 'animate-pulse' : ''}`} />
                    <span className="relative z-10">{link.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* User / Login */}
            <div className="hidden md:flex items-center">
              {isAuthenticated && operator ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-3 border border-white/20 px-3 py-1.5 hover:bg-white/5 hover:border-tactical-amber/50 transition-all clip-corner-br group"
                  >
                    {/* Avatar */}
                    {operator.avatarUrl ? (
                      <img
                        src={operator.avatarUrl}
                        alt={operator.nickname}
                        className="w-8 h-8 rounded-full object-cover border-2 border-tactical-amber/60"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-tactical-amber/20 border-2 border-tactical-amber/60 flex items-center justify-center">
                        <User className="w-4 h-4 text-tactical-amber" />
                      </div>
                    )}
                    <div className="text-left">
                      <div className="text-xs font-bold text-white leading-none">{operator.nickname}</div>
                      <div className="text-[9px] font-mono text-vision-green uppercase">Online</div>
                    </div>
                    <ChevronDown className={`w-3 h-3 text-zinc-500 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-armor-gray border border-white/10 backdrop-blur-md z-50 shadow-xl">
                      <div className="px-4 py-3 border-b border-white/10">
                        <div className="text-xs font-mono text-zinc-500 uppercase">Operador Ativo</div>
                        <div className="text-sm text-white font-bold mt-1">{operator.nickname}</div>
                        <div className="text-[10px] font-mono text-zinc-500 mt-0.5">{operator.email}</div>
                      </div>
                      <div className="py-1">
                        <Link
                          to={`/operadores/${operator.id}`}
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-xs font-mono text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <User className="w-3.5 h-3.5" /> PERFIL DO OPERADOR
                        </Link>
                        {operator.role === 'ADMIN' && (
                          <Link
                            to="/admin"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-xs font-mono text-tactical-amber hover:text-white hover:bg-tactical-amber/10 transition-colors"
                          >
                            <Crown className="w-3.5 h-3.5" /> DASHBOARD
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-mono text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5" /> ENCERRAR SESSÃO
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="flex items-center gap-2 border border-white/20 px-4 py-2 hover:bg-white/5 hover:border-tactical-amber/50 transition-all clip-corner-br text-xs font-bold text-hud-blue">
                  <Radio className="w-4 h-4" />
                  LINK_START
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-tactical-amber p-2 border border-white/10 bg-white/5"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-ops-black border-b border-tactical-amber/30 relative z-50">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-3 text-sm font-header font-bold tracking-widest border-l-2 pl-4 transition-colors ${
                    isActive(link.path)
                      ? 'border-tactical-amber text-tactical-amber bg-tactical-dim'
                      : 'border-transparent text-zinc-500 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              {isAuthenticated && operator ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-3 mt-4 border-t border-white/10">
                    {operator.avatarUrl ? (
                      <img src={operator.avatarUrl} alt={operator.nickname} className="w-8 h-8 rounded-full object-cover border-2 border-tactical-amber/60" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-tactical-amber/20 border-2 border-tactical-amber/60 flex items-center justify-center">
                        <User className="w-4 h-4 text-tactical-amber" />
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-bold text-white">{operator.nickname}</div>
                      <div className="text-[9px] font-mono text-vision-green uppercase">Online</div>
                    </div>
                  </div>
                  <button
                    onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                    className="block w-full px-3 py-3 text-sm font-header font-bold text-red-400 border border-red-500/30 text-center bg-red-500/10 mt-2"
                  >
                    ENCERRAR SESSÃO
                  </button>
                  {operator.role === 'ADMIN' && (
                    <Link
                      to="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-3 mt-2 text-sm font-header font-bold text-tactical-amber border border-tactical-amber/30 text-center bg-tactical-amber/10"
                    >
                      DASHBOARD
                    </Link>
                  )}
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-3 mt-4 text-sm font-header font-bold text-hud-blue border border-hud-blue/30 text-center bg-hud-blue/10"
                >
                  INICIAR LINK
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-grow relative z-10 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Footer / Status Bar */}
      <footer className="border-t border-white/10 bg-ops-black py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-[10px] text-zinc-600 uppercase font-mono tracking-widest">
          <div className="flex gap-4">
            <span>Server: SA_EAST_1</span>
            <span>Latency: 12ms</span>
            <span>Encryption: AES-256</span>
          </div>
          <div className="mt-2 md:mt-0">
            &copy; 2026 SILENT ECHO PROTOCOL // PLAY12 MILSIM
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
