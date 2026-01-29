"use client";

import { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function TrainingPage() {
    const [department, setDepartment] = useState('Producción');
    const [routes, setRoutes] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const loadRoutes = async () => {
        setLoading(true);
        try {
            const res = await axios.post(`${API_URL}/api/v1/training/routes`, { department });
            setRoutes(res.data.routes);
        } catch (error) {
            console.error("Error loading routes", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-8 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">🎓 Entrenamiento SGI</h1>

            <div className="flex gap-4 mb-8">
                <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="p-3 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700"
                >
                    <option value="Producción">Producción</option>
                    <option value="Calidad">Calidad</option>
                    <option value="Seguridad">Seguridad</option>
                </select>
                <button
                    onClick={loadRoutes}
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Cargando...' : 'Ver Rutas de Aprendizaje'}
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {routes.map((route, idx) => (
                    <div key={idx} className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
                        <h3 className="text-xl font-bold mb-2 text-blue-600 dark:text-blue-400">{route.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">{route.description}</p>
                        <div className="space-y-2">
                            {route.steps.map((step: any) => (
                                <div key={step.order} className="flex items-start gap-3 p-2 bg-gray-50 dark:bg-zinc-800/50 rounded">
                                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                                        {step.order}
                                    </span>
                                    <div>
                                        <h4 className="font-semibold text-sm mb-1">{step.title}</h4>
                                        {/* <p className="text-xs text-gray-500">{step.content}</p> */}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                            Iniciar Módulo
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
