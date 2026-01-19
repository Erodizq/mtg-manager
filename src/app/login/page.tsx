"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, LogIn, UserPlus, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

export default function LoginPage() {
    const { user, signInWithEmail, signUpWithEmail } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            router.push('/');
        }
    }, [user, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isSignUp) {
                await signUpWithEmail(email, password);
                alert("¡Cuenta creada! Revisa tu email para confirmar (si está activado) o inicia sesión.");
            } else {
                await signInWithEmail(email, password);
                router.push('/');
            }
        } catch (err: any) {
            setError(err.message || "Error de autenticación");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-950">
            {/* Background Decoration */}
            <div className="fixed inset-0 overflow-hidden -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full"></div>
            </div>

            <div className="w-full max-w-md">
                <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft size={20} />
                    <span>Volver a la colección</span>
                </Link>

                <div className="glass-panel p-8 rounded-3xl shadow-2xl border border-white/10">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white text-3xl mx-auto mb-4 shadow-xl shadow-blue-500/20">
                            M
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            {isSignUp ? 'Únete a MTG Manager' : 'Bienvenido de nuevo'}
                        </h1>
                        <p className="text-slate-400">
                            {isSignUp ? 'Crea tu cuenta para sincronizar tu colección en la nube.' : 'Inicia sesión para acceder a tu colección desde cualquier dispositivo.'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase px-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3.5 pl-12 pr-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="tu@email.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase px-1">Contraseña</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3.5 pl-12 pr-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="******"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-400 text-sm text-center bg-red-900/20 p-3 rounded-xl border border-red-500/20 animate-in fade-in zoom-in duration-200">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary py-4 flex items-center justify-center gap-2 mt-6 text-lg"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                isSignUp ? <><UserPlus size={20} /> Registrarse</> : <><LogIn size={20} /> Iniciar Sesión</>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/5 text-center">
                        <p className="text-slate-400 mb-2">
                            {isSignUp ? '¿Ya tienes una cuenta?' : '¿Aún no tienes cuenta?'}
                        </p>
                        <button
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="font-bold text-blue-400 hover:text-blue-300 hover:underline transition-all"
                        >
                            {isSignUp ? 'Inicia sesión aquí' : 'Regístrate gratis ahora'}
                        </button>
                    </div>
                </div>

                <p className="text-center mt-8 text-xs text-slate-600 px-8">
                    Al unirte, aceptas que tus datos de colección se almacenen de forma segura en la nube para permitir el acceso multi-dispositivo.
                </p>
            </div>
        </div>
    );
}
