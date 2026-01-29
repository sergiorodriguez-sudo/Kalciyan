import React from 'react';
import * as Tabs from '@radix-ui/react-tabs';

interface CategoryTabsProps {
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
}

const CATEGORIES = [
    "General",
    "Calidad",
    "Seguridad",
    "Medio Ambiente",
    "Producción",
    "Admin"
];

export const CategoryTabs: React.FC<CategoryTabsProps> = ({ selectedCategory, onSelectCategory }) => {
    return (
        <div className="w-full flex justify-center mb-8">
            <Tabs.Root value={selectedCategory} onValueChange={onSelectCategory} className="w-full max-w-3xl">
                <Tabs.List className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide justify-start md:justify-center">
                    {CATEGORIES.map((cat) => (
                        <Tabs.Trigger
                            key={cat}
                            value={cat}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${selectedCategory === cat ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-zinc-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800'}`}
                        >
                            {cat}
                        </Tabs.Trigger>
                    ))}
                </Tabs.List>
            </Tabs.Root>
        </div>
    );
};
