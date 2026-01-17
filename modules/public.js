// Public Results Page
export function renderPublicResults(state) {
    if (!state.isPublished) {
        return `
            <div class="min-h-screen flex items-center justify-center bg-slate-50">
                <div class="text-center">
                    <h1 class="text-4xl font-bold text-slate-900 mb-4">🔒 Resultados Indisponíveis</h1>
                    <p class="text-slate-600 mb-8">As listas ainda não foram publicadas pela administração.</p>
                    <button id="backBtn" class="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">← Voltar ao Painel</button>
                </div>
            </div>
        `;
    }

    const approved = state.candidates.filter(c => c.status === 'Aprovado');
    const rejected = state.candidates.filter(c => c.status === 'Reprovado');

    return `
        <div class="min-h-screen bg-slate-50">
            <div class="max-w-6xl mx-auto p-8">
                <div class="flex justify-between items-center mb-8">
                    <div>
                        <h1 class="text-3xl font-bold text-slate-900">📊 Resultados dos Exames - 2025</h1>
                        <p class="text-slate-600 mt-2">IPIAL - Instituto Politécnico Industrial "Alda Lara"</p>
                    </div>
                    <button id="backBtn" class="px-4 py-2 bg-slate-200 text-slate-800 font-semibold rounded-lg hover:bg-slate-300">← Voltar</button>
                </div>

                <!-- Statistics -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div class="bg-white p-6 rounded-lg shadow text-center">
                        <p class="text-slate-600 text-sm font-semibold">Total de Candidatos</p>
                        <p class="text-4xl font-bold text-blue-600 mt-2">${state.candidates.length}</p>
                    </div>
                    <div class="bg-white p-6 rounded-lg shadow text-center border-t-4 border-green-500">
                        <p class="text-slate-600 text-sm font-semibold">Aprovados</p>
                        <p class="text-4xl font-bold text-green-600 mt-2">${approved.length}</p>
                    </div>
                    <div class="bg-white p-6 rounded-lg shadow text-center border-t-4 border-red-500">
                        <p class="text-slate-600 text-sm font-semibold">Reprovados</p>
                        <p class="text-4xl font-bold text-red-600 mt-2">${rejected.length}</p>
                    </div>
                </div>

                <!-- Results Table -->
                <div class="bg-white rounded-lg shadow overflow-hidden">
                    <table class="w-full">
                        <thead class="bg-slate-100">
                            <tr>
                                <th class="px-6 py-3 text-left text-sm font-semibold">Nº</th>
                                <th class="px-6 py-3 text-left text-sm font-semibold">Nome Completo</th>
                                <th class="px-6 py-3 text-left text-sm font-semibold">BI/Passaporte</th>
                                <th class="px-6 py-3 text-left text-sm font-semibold">Curso</th>
                                <th class="px-6 py-3 text-center text-sm font-semibold">Nota</th>
                                <th class="px-6 py-3 text-center text-sm font-semibold">Resultado</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${state.candidates.map((c, i) => `
                                <tr class="border-b border-slate-200 hover:bg-slate-50">
                                    <td class="px-6 py-3 text-sm">${i+1}</td>
                                    <td class="px-6 py-3 font-semibold">${c.fullName}</td>
                                    <td class="px-6 py-3 text-sm font-mono">${c.idNumber}</td>
                                    <td class="px-6 py-3 text-sm">${c.course}</td>
                                    <td class="px-6 py-3 text-center font-bold">${c.score.toFixed(1)}</td>
                                    <td class="px-6 py-3 text-center">
                                        <span class="inline-block px-3 py-1 rounded text-xs font-bold ${c.status === 'Aprovado' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                                            ${c.status}
                                        </span>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

export function setupPublicEvents(handleBack) {
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', handleBack);
    }
}
