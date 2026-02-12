import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Crosshair, Radio, Shield, Map, Users, BarChart2, ShoppingBag, LogOut } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

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
                <h1 className="font-header font-bold text-xl tracking-widest text-white leading-none">PLAY12</h1>
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
               <Link to="/login" className="flex items-center gap-2 border border-white/20 px-4 py-2 hover:bg-white/5 hover:border-tactical-amber/50 transition-all clip-corner-br text-xs font-bold text-hud-blue">
                  <Radio className="w-4 h-4" />
                  LINK_START
               </Link>
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
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-3 mt-4 text-sm font-header font-bold text-hud-blue border border-hud-blue/30 text-center bg-hud-blue/10"
              >
                INICIAR LINK
              </Link>
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
