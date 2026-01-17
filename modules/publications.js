// Publications Module
export function renderPublications(state, handleTogglePublish) {
    return `
        <div class="bg-white p-6 rounded-lg shadow">
            <div class="flex justify-between items-center mb-6">
                <div>
                    <h3 class="text-xl font-bold">📢 Publicação de Resultados</h3>
                    <p class="text-slate-600 text-sm mt-1">Controle a visibilidade das listas públicas</p>
                </div>
                <span class="px-4 py-2 rounded-lg font-semibold ${state.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                    ${state.isPublished ? '✓ Publicado' : '○ Privado'}
                </span>
            </div>

            <div class="space-y-4">
                <div class="p-4 bg-slate-50 rounded-lg">
                    <p class="text-sm font-semibold text-slate-700 mb-2">Link Público</p>
                    <code class="text-xs text-blue-600">https://ipial.ao/resultados-2025</code>
                </div>

                <button id="togglePublish" class="w-full py-3 font-bold rounded-lg transition ${state.isPublished ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-blue-600 text-white hover:bg-blue-700'}">
                    ${state.isPublished ? '🔒 Suspender Publicação' : '🔓 Publicar Resultados Agora'}
                </button>

                <button id="previewBtn" class="w-full py-3 bg-slate-200 text-slate-800 font-bold rounded-lg hover:bg-slate-300 transition">
                    👁️ Pré-visualizar Página Pública
                </button>
            </div>

            <div class="mt-8 pt-8 border-t border-slate-200">
                <h4 class="font-bold mb-4">📋 Listas que serão geradas:</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="p-4 border border-slate-200 rounded-lg bg-slate-50">
                        <p class="font-semibold text-sm">Lista Geral</p>
                        <p class="text-xs text-slate-600 mt-1">Todos os inscritos alfabeticamente</p>
                    </div>
                    <div class="p-4 border border-slate-200 rounded-lg bg-slate-50">
                        <p class="font-semibold text-sm">Aprovados</p>
                        <p class="text-xs text-slate-600 mt-1">Filtrados com nota ≥ 10</p>
                    </div>
                    <div class="p-4 border border-slate-200 rounded-lg bg-slate-50">
                        <p class="font-semibold text-sm">Reprovados</p>
                        <p class="text-xs text-slate-600 mt-1">Candidatos com nota < 10</p>
                    </div>
                    <div class="p-4 border border-slate-200 rounded-lg bg-slate-50">
                        <p class="font-semibold text-sm">Ranking Especial</p>
                        <p class="text-xs text-slate-600 mt-1">Top 100 melhores notas</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export function setupPublicationEvents(handleTogglePublish, handlePreview) {
    document.getElementById('togglePublish').addEventListener('click', handleTogglePublish);
    document.getElementById('previewBtn').addEventListener('click', handlePreview);
}
