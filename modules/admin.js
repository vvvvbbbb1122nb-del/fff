// Admin Panel Layout
export function renderAdminLayout(state) {
    return `
        <div class="flex h-screen bg-slate-50">
            <!-- Sidebar -->
            <aside class="w-64 bg-slate-900 text-white flex flex-col fixed h-screen">
                <div class="p-6 border-b border-slate-800">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-lg">I</div>
                        <div>
                            <h1 class="font-bold text-lg">IPIAL</h1>
                            <p class="text-xs text-slate-500">Gestão Académica</p>
                        </div>
                    </div>
                </div>

                <nav class="flex-1 p-4 space-y-2">
                    <button class="nav-btn w-full text-left px-4 py-3 rounded-lg transition font-semibold ${state.activeTab === 'dashboard' ? 'bg-blue-600' : 'hover:bg-slate-800'}" data-tab="dashboard">
                        📊 Dashboard
                    </button>
                    <button class="nav-btn w-full text-left px-4 py-3 rounded-lg transition font-semibold ${state.activeTab === 'candidates' ? 'bg-blue-600' : 'hover:bg-slate-800'}" data-tab="candidates">
                        👥 Candidatos
                    </button>
                    <button class="nav-btn w-full text-left px-4 py-3 rounded-lg transition font-semibold ${state.activeTab === 'publications' ? 'bg-blue-600' : 'hover:bg-slate-800'}" data-tab="publications">
                        📄 Publicações
                    </button>
                </nav>

                <div class="p-4 border-t border-slate-800 space-y-2">
                    <button id="exportBtn" class="w-full text-left text-sm px-4 py-2 text-slate-400 hover:text-white transition font-semibold">⬇️ Exportar JSON</button>
                    <button id="importBtn" class="w-full text-left text-sm px-4 py-2 text-slate-400 hover:text-white transition font-semibold">⬆️ Importar JSON</button>
                    <input type="file" id="fileInput" accept=".json" style="display:none">
                    <button id="logoutBtn" class="w-full text-left text-sm px-4 py-2 text-red-400 hover:text-red-300 transition font-semibold">🚪 Sair</button>
                </div>
            </aside>

            <!-- Main Content -->
            <main class="flex-1 ml-64 p-8 overflow-y-auto">
                <div class="flex justify-between items-center mb-8">
                    <div>
                        <h2 class="text-3xl font-bold text-slate-900">
                            ${state.activeTab === 'dashboard' ? '📊 Dashboard' : state.activeTab === 'candidates' ? '👥 Candidatos' : '📄 Publicações'}
                        </h2>
                        <p class="text-slate-600 text-sm mt-1">IPIAL • Sistema de Gestão de Exames 2025</p>
                    </div>
                    ${state.activeTab === 'candidates' && !state.showAddForm ? '<button id="addBtn" class="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition">+ Novo Candidato</button>' : ''}
                </div>

                <div id="content"></div>
            </main>
        </div>
    `;
}

export function setupSidebarEvents(handleTabChange, handleLogout, handleExport, handleImport) {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tab = e.currentTarget.dataset.tab;
            handleTabChange(tab);
        });
    });

    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    document.getElementById('exportBtn').addEventListener('click', handleExport);
    document.getElementById('importBtn').addEventListener('click', () => {
        document.getElementById('fileInput').click();
    });

    document.getElementById('fileInput').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                try {
                    const data = JSON.parse(ev.target.result);
                    if (Array.isArray(data)) {
                        handleImport(data);
                    }
                } catch (err) {
                    alert('Erro ao importar arquivo!');
                }
            };
            reader.readAsText(file);
        }
    });

    const addBtn = document.getElementById('addBtn');
    if (addBtn) {
        addBtn.addEventListener('click', (e) => {
            const event = new CustomEvent('add-candidate');
            document.dispatchEvent(event);
        });
    }
}
