"use client";

import { useState } from 'react';
import axios from 'axios';
import { EvidencePanel } from '../components/EvidencePanel';
import { CategoryTabs } from '../components/CategoryTabs';
import { generatePDF } from './utils/pdfGenerator';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function Home() {
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('General');
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<{ answer: string; evidence: any[] } | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setResponse(null);

        try {
            // In a real app, send category to backend
            const res = await axios.post(`${API_URL}/api/v1/query`, { query, category });
            setResponse(res.data);
        } catch (error) {
            console.error("Search error:", error);
            setResponse({
                answer: "Error conectando con el servidor SGI. Por favor intente más tarde.",
                evidence: []
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur dark:bg-zinc-950/80 dark:border-zinc-800">
                <div className="container flex h-14 items-center pl-4">
                    <div className="mr-4 hidden md:flex">
                        <a className="mr-6 flex items-center space-x-2" href="/">
                            <span className="hidden font-bold sm:inline-block">SGI Kalciyan</span>
                        </a>
                    </div>
                    {/* Nav links could go here */}
                    <div className="flex gap-4 ml-auto mr-4 text-sm font-medium">
                        <a href="/training" className="hover:text-blue-600 transition-colors">Training</a>
                        <a href="/exam" className="hover:text-blue-600 transition-colors">Examen</a>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 flex-col lg:flex-row">
                {/* Main Content Area */}
                <div className={`flex-1 flex flex-col items-center p-8 ${response ? 'lg:w-2/3' : 'w-full justify-center'}`}>

                    {/* Hero / Search Section */}
                    <div className={`w-full max-w-3xl transition-all duration-500 ease-in-out ${response ? 'mt-0' : 'mt-20 text-center'}`}>
                        {!response && (
                            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-8 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                                Buscador Inteligente SGI
                            </h1>
                        )}

                        <CategoryTabs selectedCategory={category} onSelectCategory={setCategory} />

                        <form onSubmit={handleSearch} className="w-full flex gap-2 relative">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Ej: ¿Cuál es el procedimiento de corte de vidrio laminado?"
                                className="w-full p-4 pl-6 rounded-full border border-gray-200 dark:border-zinc-800 shadow-sm focus:ring-2 focus:ring-blue-500 bg-white dark:bg-zinc-900 text-lg transition-all"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="absolute right-2 top-2 bottom-2 px-6 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 font-medium transition-colors"
                            >
                                {loading ? '...' : 'Buscar'}
                            </button>
                        </form>
                    </div>

                    {/* Answer Section */}
                    {response && (
                        <div className="w-full max-w-3xl mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="prose dark:prose-invert max-w-none">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Respuesta</h2>
                                    <button
                                        onClick={() => generatePDF(query, response.answer, response.evidence)}
                                        className="text-sm px-3 py-1 bg-gray-100 dark:bg-zinc-800 rounded border border-gray-300 dark:border-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors flex items-center gap-2"
                                    >
                                        📄 Exportar PDF
                                    </button>
                                </div>
                                <div className="p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm leading-relaxed whitespace-pre-line text-lg">
                                    {response.answer}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Evidence Panel (Right Side) */}
                {response && response.evidence.length > 0 && (
                    <EvidencePanel evidence={response.evidence} />
                )}
            </div>
        </div>
    )
}
