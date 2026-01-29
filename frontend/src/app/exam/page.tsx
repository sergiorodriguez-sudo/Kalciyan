"use client";

import { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function ExamPage() {
    const [category, setCategory] = useState("Seguridad");
    const [questions, setQuestions] = useState<any[]>([]);
    const [answers, setAnswers] = useState<{ [key: number]: number }>({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    const startExam = async () => {
        try {
            const res = await axios.post(`${API_URL}/api/v1/exam/generate`, { category, num_questions: 3 });
            setQuestions(res.data.questions);
            setAnswers({});
            setSubmitted(false);
            setScore(0);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = () => {
        let correct = 0;
        questions.forEach((q, idx) => {
            if (answers[idx] === q.correct_option_index) correct++;
        });
        setScore(correct);
        setSubmitted(true);
    };

    return (
        <div className="container mx-auto p-8 min-h-screen max-w-4xl">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">📝 Examen de Certificación</h1>

            {!questions.length && (
                <div className="text-center py-20 bg-gray-50 dark:bg-zinc-900 rounded-xl border border-dashed border-gray-300 dark:border-zinc-700">
                    <h2 className="text-xl mb-4">Generar nuevo examen</h2>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="p-3 border rounded-lg mr-4 dark:bg-zinc-800"
                    >
                        <option>Seguridad</option>
                        <option>Calidad</option>
                        <option>Medio Ambiente</option>
                    </select>
                    <button
                        onClick={startExam}
                        className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 font-bold"
                    >
                        Comenzar Examen
                    </button>
                </div>
            )}

            {questions.length > 0 && (
                <div className="space-y-8">
                    {questions.map((q, idx) => (
                        <div key={idx} className={`p-6 rounded-xl border ${submitted ? (answers[idx] === q.correct_option_index ? 'border-green-500 bg-green-50/10' : 'border-red-500 bg-red-50/10') : 'border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900'}`}>
                            <h3 className="text-lg font-bold mb-4">{idx + 1}. {q.question_text}</h3>
                            <div className="space-y-2">
                                {q.options.map((opt: string, optIdx: number) => (
                                    <label key={optIdx} className={`flex items-center p-3 rounded cursor-pointer border ${answers[idx] === optIdx ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-transparent hover:bg-gray-50 dark:hover:bg-zinc-800'}`}>
                                        <input
                                            type="radio"
                                            name={`q-${idx}`}
                                            value={optIdx}
                                            checked={answers[idx] === optIdx}
                                            onChange={() => !submitted && setAnswers({ ...answers, [idx]: optIdx })}
                                            disabled={submitted}
                                            className="mr-3 w-4 h-4"
                                        />
                                        {opt}
                                    </label>
                                ))}
                            </div>
                            {submitted && (
                                <div className="mt-4 text-sm p-3 bg-gray-100 dark:bg-zinc-800 rounded">
                                    <p className="font-bold">Explicación:</p>
                                    {q.explanation}
                                </div>
                            )}
                        </div>
                    ))}

                    {!submitted ? (
                        <button onClick={handleSubmit} className="w-full py-4 bg-blue-600 text-white text-xl font-bold rounded-xl hover:bg-blue-700 shadow-lg">
                            Finalizar y Calificar
                        </button>
                    ) : (
                        <div className="text-center p-8 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-gray-200 dark:border-zinc-800">
                            <p className="text-2xl mb-4">Resultado Final</p>
                            <div className="text-6xl font-black text-blue-600 mb-4">{Math.round((score / questions.length) * 100)}%</div>
                            <p className="text-gray-500 mb-6">Respondiste correctamente {score} de {questions.length} preguntas</p>
                            <button onClick={() => setQuestions([])} className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-700">
                                Intentar Otro
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
