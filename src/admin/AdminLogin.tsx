import React, { useState } from 'react';
import { isFirebaseConfigured, auth } from '../lib/firebase.ts';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { Lock, Mail, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: (userEmail: string) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isFirebaseConfigured || !auth) {
      onLoginSuccess(email || 'demo@byrobsonbrito.com.br');
      return;
    }

    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      onLoginSuccess(cred.user.email || email);
    } catch (err: any) {
      console.error('Firebase Auth error:', err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setError('E-mail ou senha incorretos.');
      } else if (err.code === 'auth/user-not-found') {
        setError('Usuário não encontrado.');
      } else {
        setError('Erro ao autenticar. Verifique sua conexão e tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Digite seu e-mail acima para receber o link de recuperação.');
      return;
    }
    if (!isFirebaseConfigured || !auth) {
      setError('No modo demonstração a redefinição de senha não está ativa.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
      setError('');
    } catch (err: any) {
      setError('Não foi possível enviar o e-mail de recuperação.');
    }
  };

  return (
    <div className="min-h-screen bg-[#050506] flex flex-col justify-center items-center p-6 text-[#FAF7F2] select-none">
      <div className="w-full max-w-md bg-[#0B0B0E] border border-[rgba(242,238,232,0.08)] p-8 rounded-[2px] shadow-[0_20px_60px_rgba(0,0,0,0.9)] space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-[#D4B679]" />
            <span className="label-editorial text-[9px]">ACESSO RESTRITO</span>
            <span className="w-1 h-1 rounded-full bg-[#D4B679]" />
          </div>
          <h1 className="font-cormorant text-3xl text-[#FAF7F2] font-light italic">
            Painel do Robson
          </h1>
          <p className="text-xs text-[#8E8982] font-inter font-light">
            Gerencie fotos, agenda, contatos e serviços pelo celular ou computador.
          </p>
        </div>

        {!isFirebaseConfigured && (
          <div className="p-3 bg-[#0E0E12] border border-[rgba(212,182,121,0.22)] rounded-[2px] text-xs font-inter space-y-1.5 text-[#8E8982]">
            <div className="flex items-center gap-1.5 text-[#D4B679] font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Modo Demonstração Ativo</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              O Firebase ainda não foi vinculado no arquivo .env. Você pode entrar imediatamente para testar todas as funcionalidades.
            </p>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-[2px] flex items-center gap-2 text-xs text-red-200 font-inter">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {resetSent && (
          <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-[2px] text-xs text-emerald-200 font-inter">
            E-mail de recuperação enviado com instruções!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#8E8982] mb-1 font-inter">
              E-mail do Fotógrafo
            </label>
            <div className="relative">
              <input
                type="email"
                required={isFirebaseConfigured}
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="contato@byrobsonbrito.com.br"
                className="w-full bg-[#050506] border border-[rgba(242,238,232,0.08)] pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-[#FAF7F2] rounded-[2px] focus:outline-none focus:border-[#D4B679] font-inter"
              />
              <Mail className="w-4 h-4 text-[#8E8982] absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#8E8982] mb-1 font-inter">
              Senha
            </label>
            <div className="relative">
              <input
                type="password"
                required={isFirebaseConfigured}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#050506] border border-[rgba(242,238,232,0.08)] pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-[#FAF7F2] rounded-[2px] focus:outline-none focus:border-[#D4B679] font-inter"
              />
              <Lock className="w-4 h-4 text-[#8E8982] absolute left-3.5 top-3" />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-inter">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-[#8E8982] hover:text-[#D4B679] transition-colors"
            >
              Esqueci a senha
            </button>
            <a href="/" className="text-[#8E8982] hover:text-[#FAF7F2]">
              Voltar ao site
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#D4B679] text-[#050506] font-inter text-xs uppercase tracking-[0.2em] font-medium rounded-[2px] hover:bg-[#e0c793] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md"
          >
            <span>
              {loading
                ? 'Conectando...'
                : !isFirebaseConfigured
                ? 'Entrar no Painel (Modo Demo)'
                : 'Entrar no Painel'}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
