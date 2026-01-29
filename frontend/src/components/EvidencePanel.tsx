import React from 'react';

interface Evidence {
    text: string;
    doc_id: string;
    page: number;
}

interface EvidencePanelProps {
    evidence: Evidence[];
}

export const EvidencePanel: React.FC<EvidencePanelProps> = ({ evidence }) => {
    if (!evidence || evidence.length === 0) return null;

    return (
        <div className="w-full lg:w-1/3 bg-gray-50 dark:bg-zinc-900 border-l border-gray-200 dark:border-zinc-800 p-6 overflow-y-auto h-[calc(100vh-100px)]">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                📂 Evidencias SGI
            </h3>
            <div className="space-y-4">
                {evidence.map((item, idx) => (
                    <div key={idx} className="p-4 bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-gray-100 dark:border-zinc-700 hover:border-blue-500 transition-colors cursor-pointer">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-semibold uppercase text-blue-600 dark:text-blue-400">
                                Doc: {item.doc_id}
                            </span>
                            <span className="text-xs text-gray-500">
                                Pág. {item.page}
                            </span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-4 italic">
                            "{item.text}"
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};
