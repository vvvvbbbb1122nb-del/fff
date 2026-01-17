// Dashboard Module
export function renderDashboard(state) {
    const approved = state.candidates.filter(c => c.status === 'Aprovado').length;
    const rejected = state.candidates.filter(c => c.status === 'Reprovado').length;

    return `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-white p-6 rounded-lg shadow">
                <p class="text-slate-600 text-sm font-semibold mb-2">📊 Inscritos</p>
                <p class="text-4xl font-bold text-slate-900">${state.candidates.length}</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
                <p class="text-slate-600 text-sm font-semibold mb-2">✓ Aprovados</p>
                <p class="text-4xl font-bold text-green-600">${approved}</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow border-l-4 border-red-500">
                <p class="text-slate-600 text-sm font-semibold mb-2">✗ Reprovados</p>
                <p class="text-4xl font-bold text-red-600">${rejected}</p>
            </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow">
            <h3 class="text-lg font-bold mb-4">📋 Atividade Recente</h3>
            <div class="space-y-3 max-h-96 overflow-y-auto">
                ${state.logs.length === 0 ? '<p class="text-slate-500">Sem atividade</p>' : ''}
                ${state.logs.slice(0, 10).map(log => `
                    <div class="border-l-4 border-blue-500 pl-4 py-2">
                        <p class="text-sm font-semibold text-slate-800">${log.action}</p>
                        <p class="text-xs text-slate-500">${new Date(log.timestamp).toLocaleTimeString()}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}
