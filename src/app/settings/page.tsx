"use client";

import { useTheme, ManaColor } from '@/lib/theme-context';
import { Palette, Check } from 'lucide-react';
import clsx from 'clsx';
import ManaIcon from '@/components/ManaIcon';

const colorOptions: { id: ManaColor; name: string; description: string }[] = [
    { id: 'white', name: 'Blanco', description: 'Orden y luz' },
    { id: 'blue', name: 'Azul', description: 'Conocimiento y control' },
    { id: 'black', name: 'Negro', description: 'Poder y ambición' },
    { id: 'red', name: 'Rojo', description: 'Pasión y caos' },
    { id: 'green', name: 'Verde', description: 'Naturaleza y crecimiento' },
];

export default function SettingsPage() {
    const { color, setColor } = useTheme();

    return (
        <div className="min-h-screen pt-4 md:pt-24 px-4 pb-24">
            <div className="max-w-2xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                        <Palette className="text-white" size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold mb-0" style={{
                            background: 'linear-gradient(to right, var(--color-primary-light), var(--color-accent))',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}>
                            Configuración
                        </h1>
                        <p className="text-slate-400 text-sm">Personaliza tu experiencia</p>
                    </div>
                </div>

                {/* Theme Section */}
                <div className="glass-panel p-6 rounded-2xl space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                        <Palette size={20} className="text-primary" />
                        <h2 className="text-xl font-bold text-white">Color de Tema</h2>
                    </div>
                    <p className="text-slate-400 text-sm mb-6">
                        Elige tu color de maná favorito para personalizar la interfaz
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {colorOptions.map((option) => {
                            const isSelected = color === option.id;
                            return (
                                <button
                                    key={option.id}
                                    onClick={() => setColor(option.id)}
                                    className={clsx(
                                        "relative p-4 rounded-xl border-2 transition-all duration-300 text-left",
                                        "hover:scale-[1.02] active:scale-[0.98]",
                                        isSelected
                                            ? "border-primary bg-primary/10 shadow-[0_0_20px_var(--color-glow)]"
                                            : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
                                    )}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 flex items-center justify-center">
                                                <ManaIcon color={option.id} size={48} />
                                            </div>
                                            <div>
                                                <div className="font-bold text-white">{option.name}</div>
                                                <div className="text-xs text-slate-400">{option.description}</div>
                                            </div>
                                        </div>
                                        {isSelected && (
                                            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                                                <Check size={16} className="text-white" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Color Preview Bar */}
                                    <div
                                        className={clsx(
                                            "absolute bottom-0 left-0 right-0 h-1 rounded-b-xl transition-opacity",
                                            isSelected ? "opacity-100" : "opacity-30"
                                        )}
                                        style={{
                                            background: `linear-gradient(to right, var(--color-primary-light), var(--color-primary-dark))`,
                                        }}
                                    />
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Preview Section */}
                <div className="glass-panel p-6 rounded-2xl space-y-4">
                    <h3 className="text-lg font-bold text-white mb-4">Vista Previa</h3>
                    <div className="space-y-3">
                        <button className="w-full btn-primary py-3">
                            Botón Principal
                        </button>
                        <div className="p-4 rounded-lg border-2 border-primary bg-primary/5">
                            <p className="text-primary font-medium">Elemento Destacado</p>
                            <p className="text-slate-400 text-sm mt-1">Así se verán los elementos importantes</p>
                        </div>
                        <div className="flex gap-2">
                            <div className="w-12 h-12 rounded-lg bg-primary shadow-[0_0_15px_var(--color-glow)]"></div>
                            <div className="w-12 h-12 rounded-lg bg-primary-light"></div>
                            <div className="w-12 h-12 rounded-lg bg-primary-dark"></div>
                        </div>
                    </div>
                </div>

                {/* Info */}
                <div className="text-center text-xs text-slate-500 pt-4">
                    Los cambios se guardan automáticamente y se aplican en toda la aplicación
                </div>
            </div>
        </div>
    );
}
