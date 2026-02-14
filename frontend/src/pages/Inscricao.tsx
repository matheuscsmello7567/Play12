import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, CreditCard, Smartphone, CheckCircle, ShieldAlert, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Inscricao: React.FC = () => {
  const { isAuthenticated: isLoggedIn } = useAuth();
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const navigate = useNavigate();

  const evento = {
    nome: 'OPERAÇÃO RED WINGS',
    data: '15/02/2026',
    horario: '0100H',
    local: 'Serra do Rola Moça, Sector 7',
    valor: 80.00
  };

  const formasPagamento = [
    {
      id: 'pix',
      nome: 'PIX',
      icon: <Smartphone className="w-8 h-8" />,
      descricao: 'Pagamento instantâneo via PIX',
      desconto: '5% de desconto',
      valorFinal: evento.valor * 0.95
    },
    {
      id: 'cartao',
      nome: 'Cartão de Crédito',
      icon: <CreditCard className="w-8 h-8" />,
      descricao: 'Parcelado em até 3x sem juros',
      desconto: null,
      valorFinal: evento.valor
    }
  ];

  const handleConfirmarInscricao = () => {
    if (!selectedPayment) {
      alert('Por favor, selecione uma forma de pagamento.');
      return;
    }
    // TODO: Implementar lógica de confirmação de inscrição
    alert('Inscrição confirmada! Você receberá mais detalhes por email.');
    navigate('/eventos');
  };

  // Se o usuário não estiver logado, mostrar tela de aviso
  if (!isLoggedIn) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-armor-gray border border-tactical-amber/30 rounded-lg p-8 md:p-12">
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 p-4 bg-tactical-dim rounded-full">
                <ShieldAlert className="w-16 h-16 text-tactical-amber" />
              </div>
              
              <h2 className="text-3xl font-header font-bold text-white mb-4 uppercase">
                Acesso Restrito
              </h2>
              
              <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
                Apenas operadores registrados podem se inscrever em operações. 
                Faça login ou crie sua conta para confirmar sua participação.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link 
                  to="/login" 
                  className="bg-tactical-amber text-black hover:bg-white px-8 py-4 font-header font-bold uppercase tracking-widest clip-corner-br transition-all text-center"
                >
                  <User className="inline w-5 h-5 mr-2" />
                  Fazer Login
                </Link>
                
                <Link 
                  to="/eventos" 
                  className="bg-white/5 text-white hover:bg-white/10 border border-white/20 px-8 py-4 font-mono text-sm font-bold uppercase tracking-widest transition-all text-center"
                >
                  Voltar aos Eventos
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Se o usuário estiver logado, mostrar formulário de inscrição
  return (
    <div className="min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8 border-l-4 border-tactical-amber pl-6 py-2">
          <h1 className="font-header text-4xl font-bold text-white uppercase">Confirmar Inscrição</h1>
          <p className="font-mono text-sm text-zinc-500 uppercase mt-1">Selecione a forma de pagamento</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Resumo do Evento */}
          <div className="lg:col-span-1">
            <div className="bg-armor-gray border border-white/10 p-6 rounded-lg sticky top-4">
              <h3 className="font-header text-xl font-bold text-white mb-4 uppercase">Resumo da Operação</h3>
              
              <div className="space-y-3 mb-6">
                <div>
                  <div className="text-xs text-zinc-500 uppercase mb-1">Missão</div>
                  <div className="text-white font-bold">{evento.nome}</div>
                </div>
                <div>
                  <div className="text-xs text-zinc-500 uppercase mb-1">Data / Horário</div>
                  <div className="text-zinc-300 font-mono text-sm">{evento.data} - {evento.horario}</div>
                </div>
                <div>
                  <div className="text-xs text-zinc-500 uppercase mb-1">Local</div>
                  <div className="text-zinc-300 font-mono text-sm">{evento.local}</div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-zinc-400 text-sm">Valor Base</span>
                  <span className="text-zinc-300 font-mono">R$ {evento.valor.toFixed(2)}</span>
                </div>
                
                {selectedPayment && formasPagamento.find(f => f.id === selectedPayment)?.desconto && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-vision-green text-sm">Desconto</span>
                    <span className="text-vision-green font-mono">
                      {formasPagamento.find(f => f.id === selectedPayment)?.desconto}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between items-center pt-3 border-t border-white/10">
                  <span className="text-white font-bold uppercase text-sm">Total</span>
                  <span className="text-tactical-amber font-header font-bold text-2xl">
                    R$ {selectedPayment 
                      ? formasPagamento.find(f => f.id === selectedPayment)?.valorFinal.toFixed(2)
                      : evento.valor.toFixed(2)
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Formas de Pagamento */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              <h3 className="font-header text-2xl font-bold text-white mb-6 uppercase flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-tactical-amber" />
                Formas de Pagamento
              </h3>

              {formasPagamento.map((forma) => (
                <div
                  key={forma.id}
                  onClick={() => setSelectedPayment(forma.id)}
                  className={`
                    bg-armor-gray border-2 p-6 rounded-lg cursor-pointer transition-all
                    ${selectedPayment === forma.id 
                      ? 'border-tactical-amber bg-tactical-dim' 
                      : 'border-white/10 hover:border-white/30'
                    }
                  `}
                >
                  <div className="flex items-start gap-4">
                    <div className={`
                      p-3 rounded-lg
                      ${selectedPayment === forma.id ? 'bg-tactical-amber text-black' : 'bg-white/5 text-tactical-amber'}
                    `}>
                      {forma.icon}
                    </div>
                    
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-header text-xl font-bold text-white">{forma.nome}</h4>
                        {forma.desconto && (
                          <span className="text-xs bg-vision-green text-black px-2 py-1 rounded font-bold">
                            {forma.desconto}
                          </span>
                        )}
                      </div>
                      <p className="text-zinc-400 text-sm mb-2">{forma.descricao}</p>
                      <div className="text-tactical-amber font-mono font-bold">
                        R$ {forma.valorFinal.toFixed(2)}
                      </div>
                    </div>

                    {selectedPayment === forma.id && (
                      <CheckCircle className="w-6 h-6 text-tactical-amber flex-shrink-0" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Aviso Importante */}
            <div className="mt-8 bg-black/40 border-l-4 border-tactical-amber p-6 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-tactical-amber flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-bold mb-2 uppercase text-sm">Importante</h4>
                  <ul className="text-zinc-400 text-sm space-y-1 list-disc pl-5">
                    <li>A confirmação do pagamento pode levar até 24 horas.</li>
                    <li>Você receberá um email com os detalhes da inscrição.</li>
                    <li>Leve equipamento de proteção (óculos, mascara, etc).</li>
                    <li>Cancelamentos com menos de 48h não serão reembolsados.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleConfirmarInscricao}
                disabled={!selectedPayment}
                className={`
                  flex-grow px-8 py-4 font-header font-bold uppercase tracking-widest clip-corner-br transition-all
                  ${selectedPayment 
                    ? 'bg-tactical-amber text-black hover:bg-white' 
                    : 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
                  }
                `}
              >
                Confirmar Inscrição
              </button>
              
              <Link
                to="/eventos"
                className="px-8 py-4 bg-white/5 text-white hover:bg-white/10 border border-white/20 font-mono text-sm font-bold uppercase tracking-widest transition-all text-center"
              >
                Cancelar
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inscricao;
