// ====================================
// IPIAL - Sistema de Gestão de Exames
// ====================================

const STATUS = {
    PENDING: 'Pendente',
    APPROVED: 'Aprovado',
    REJECTED: 'Reprovado'
};

const COURSES = [
    'Engenharia Informática',
    'Administração',
    'Contabilidade',
    'Gestão de Proyectos',
    'Educação Pré-Escolar',
    'Educação Especial'
];

const appState = {
    isAuthenticated: false,
    user: null,
    viewMode: 'admin',
    activeTab: 'dashboard',
    candidates: [],
    logs: [],
    isPublished: false,
    showAddForm: false,
    editingCandidate: null,

    init() {
        this.loadFromStorage();
    },

    loadFromStorage() {
        const candidates = localStorage.getItem('ipial_candidates');
        const logs = localStorage.getItem('ipial_logs');
        const published = localStorage.getItem('ipial_published');
        
        if (candidates) this.candidates = JSON.parse(candidates);
        if (logs) this.logs = JSON.parse(logs);
        if (published) this.isPublished = JSON.parse(published);
    },

    save() {
        localStorage.setItem('ipial_candidates', JSON.stringify(this.candidates));
        localStorage.setItem('ipial_logs', JSON.stringify(this.logs));
        localStorage.setItem('ipial_published', JSON.stringify(this.isPublished));
    },

    addLog(action) {
        this.logs.push({
            action,
            timestamp: new Date().toISOString(),
            user: this.user || 'Sistema'
        });
        this.save();
    },

    addCandidate(data) {
        if (this.candidates.some(c => c.idNumber === data.idNumber)) {
            return { success: false, error: 'BI/Passaporte já registado!' };
        }
        const candidate = {
            id: 'cand_' + Date.now(),
            ...data
        };
        this.candidates.push(candidate);
        this.addLog(`Novo candidato: ${data.fullName}`);
        this.save();
        return { success: true, candidate };
    },

    updateCandidate(id, data) {
        const index = this.candidates.findIndex(c => c.id === id);
        if (index !== -1) {
            this.candidates[index] = { ...this.candidates[index], ...data };
            this.addLog(`Atualizado: ${data.fullName}`);
            this.save();
            return true;
        }
        return false;
    },

    deleteCandidate(id) {
        const candidate = this.candidates.find(c => c.id === id);
        this.candidates = this.candidates.filter(c => c.id !== id);
        if (candidate) {
            this.addLog(`Eliminado: ${candidate.fullName}`);
        }
        this.save();
    },

    getStats() {
        const total = this.candidates.length;
        const approved = this.candidates.filter(c => c.status === STATUS.APPROVED).length;
        const rejected = this.candidates.filter(c => c.status === STATUS.REJECTED).length;
        const byCourse = {};
        COURSES.forEach(course => {
            byCourse[course] = this.candidates.filter(c => c.course === course).length;
        });
        return { total, approved, rejected, byCourse };
    },

    exportToCSV(candidates = null, filename = 'IPIAL_CANDIDATOS.csv') {
        const data = candidates || this.candidates;
        const headers = ['Nº', 'Nome', 'BI', 'Contacto', 'Idade', 'Curso', 'Nota', 'Estado'];
        const rows = data.map((c, i) => [
            i + 1,
            c.fullName,
            c.idNumber,
            c.contact,
            c.age,
            c.course,
            c.score.toFixed(1),
            c.status
        ]);
        
        let csv = headers.join(',') + '\n';
        rows.forEach(row => {
            csv += row.map(cell => `"${cell}"`).join(',') + '\n';
        });

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    },

    exportToPDF(candidates = null, title = 'Lista de Candidatos') {
        const data = candidates || this.candidates;
        const dateStr = new Date().toLocaleDateString('pt-PT');
        
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>${title}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    h1 { text-align: center; color: #1e293b; }
                    .date { text-align: center; color: #64748b; margin-bottom: 20px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th { background-color: #2563eb; color: white; padding: 10px; text-align: left; }
                    td { padding: 8px; border-bottom: 1px solid #e2e8f0; }
                    tr:nth-child(even) { background-color: #f8fafc; }
                </style>
            </head>
            <body>
                <h1>${title}</h1>
                <p class="date">Gerado em: ${dateStr}</p>
                <table>
                    <thead>
                        <tr>
                            <th>Nº</th>
                            <th>Nome</th>
                            <th>BI</th>
                            <th>Curso</th>
                            <th>Nota</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map((c, i) => `
                            <tr>
                                <td>${i + 1}</td>
                                <td>${c.fullName}</td>
                                <td>${c.idNumber}</td>
                                <td>${c.course}</td>
                                <td>${c.score.toFixed(1)}</td>
                                <td>${c.status}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </body>
            </html>
        `;

        const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = title.replace(/\s+/g, '_') + '_' + new Date().toISOString().split('T')[0] + '.html';
        link.click();
    },

    generateReport() {
        const stats = this.getStats();
        const approved = this.candidates.filter(c => c.status === STATUS.APPROVED);
        const rejected = this.candidates.filter(c => c.status === STATUS.REJECTED);
        const byCourse = {};
        
        COURSES.forEach(course => {
            const candidates = this.candidates.filter(c => c.course === course);
            byCourse[course] = {
                total: candidates.length,
                approved: candidates.filter(c => c.status === STATUS.APPROVED).length,
                rejected: candidates.filter(c => c.status === STATUS.REJECTED).length,
                average: candidates.length > 0 ? candidates.reduce((sum, c) => sum + c.score, 0) / candidates.length : 0
            };
        });

        const dateStr = new Date().toLocaleDateString('pt-PT');
        const timeStr = new Date().toLocaleTimeString('pt-PT');

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Relatório Geral - IPIAL 2025</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; background-color: #f8fafc; color: #1e293b; }
                    .container { max-width: 1000px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px; }
                    h1 { text-align: center; color: #2563eb; border-bottom: 3px solid #2563eb; padding-bottom: 10px; }
                    h2 { color: #1e293b; margin-top: 30px; border-left: 4px solid #2563eb; padding-left: 10px; }
                    .header { text-align: center; margin-bottom: 20px; }
                    .date { color: #64748b; font-size: 12px; }
                    .stats { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin: 20px 0; }
                    .stat-box { padding: 15px; background-color: #f1f5f9; border-radius: 8px; text-align: center; }
                    .stat-label { color: #64748b; font-size: 12px; }
                    .stat-number { font-size: 28px; font-weight: bold; color: #2563eb; }
                    table { width: 100%; border-collapse: collapse; margin: 15px 0; }
                    th { background-color: #2563eb; color: white; padding: 10px; text-align: left; }
                    td { padding: 8px; border-bottom: 1px solid #e2e8f0; }
                    tr:nth-child(even) { background-color: #f8fafc; }
                    .approved { color: #22c55e; font-weight: bold; }
                    .rejected { color: #ef4444; font-weight: bold; }
                    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #64748b; font-size: 12px; }
                    @media print { body { background-color: white; } .container { box-shadow: none; } }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>📊 RELATÓRIO GERAL - IPIAL 2025</h1>
                        <p class="date">Gerado em: ${dateStr} às ${timeStr}</p>
                    </div>

                    <h2>📈 Resumo Geral</h2>
                    <div class="stats">
                        <div class="stat-box">
                            <div class="stat-label">Total de Inscritos</div>
                            <div class="stat-number">${stats.total}</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-label">Aprovados</div>
                            <div class="stat-number approved">${stats.approved}</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-label">Reprovados</div>
                            <div class="stat-number rejected">${stats.rejected}</div>
                        </div>
                    </div>

                    <h2>📊 Distribuição por Curso</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Curso</th>
                                <th style="text-align: center;">Total</th>
                                <th style="text-align: center;">Aprovados</th>
                                <th style="text-align: center;">Reprovados</th>
                                <th style="text-align: center;">Média</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${COURSES.map(course => {
                                const data = byCourse[course];
                                return `
                                    <tr>
                                        <td><strong>${course}</strong></td>
                                        <td style="text-align: center;">${data.total}</td>
                                        <td style="text-align: center;" class="approved">${data.approved}</td>
                                        <td style="text-align: center;" class="rejected">${data.rejected}</td>
                                        <td style="text-align: center;"><strong>${data.average.toFixed(2)}</strong></td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>

                    <h2>👥 Lista Detalhada de Candidatos</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Nº</th>
                                <th>Nome</th>
                                <th>BI/Passaporte</th>
                                <th>Curso</th>
                                <th style="text-align: center;">Nota</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.candidates.map((c, i) => `
                                <tr>
                                    <td>${i + 1}</td>
                                    <td><strong>${c.fullName}</strong></td>
                                    <td>${c.idNumber}</td>
                                    <td>${c.course}</td>
                                    <td style="text-align: center;"><strong>${c.score.toFixed(1)}</strong></td>
                                    <td ${c.status === STATUS.APPROVED ? 'class="approved"' : c.status === STATUS.REJECTED ? 'class="rejected"' : ''}>${c.status}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>

                    <div class="footer">
                        <p>IPIAL - Instituto Politécnico Industrial "Alda Lara"</p>
                        <p>Sistema de Gestão de Exames de Acesso 2025</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'Relatorio_Geral_IPIAL_' + new Date().toISOString().split('T')[0] + '.html';
        link.click();
        this.addLog('Relatório geral gerado');
    }
};


// ====================================
// RENDER FUNCTIONS
// ====================================

function renderLoginPage() {
    return `
        <div class="login-container">
            <form class="login-form" id="loginForm">
                <div class="login-header">
                    <div class="login-logo">I</div>
                    <h1 class="login-h1">IPIAL</h1>
                    <p class="login-subtitle">Sistema de Gestão de Exames</p>
                </div>

                <div id="loginError" class="error-message" style="display: none;">
                    <span id="errorText"></span>
                </div>

                <div class="form-group">
                    <label class="form-label">Utilizador</label>
                    <input type="text" id="username" class="form-input" placeholder="admin" required>
                </div>

                <div class="form-group">
                    <label class="form-label">Palavra-passe</label>
                    <input type="password" id="password" class="form-input" placeholder="••••••••" required>
                </div>

                <button type="submit" class="submit-button">Acesso Restrito</button>

                <div class="login-divider">
                    <button type="button" id="publicBtn" class="public-button">
                        🔍 Consultar Resultados (Público)
                    </button>
                    <p class="status-text">
                        ${appState.isPublished ? '🟢 Resultados Publicados' : '⚪ Aguardando Publicação'}
                    </p>
                </div>
            </form>
        </div>
    `;
}

function renderAdminLayout() {
    return `
        <div class="app-container no-print">
            <aside class="sidebar no-print">
                <div class="sidebar-header">
                    <div class="sidebar-logo">I</div>
                    <div>
                        <p class="sidebar-title">IPIAL</p>
                        <p class="sidebar-subtitle">Gestão Académica</p>
                    </div>
                </div>

                <nav class="sidebar-nav">
                    <button class="nav-button ${appState.activeTab === 'dashboard' ? 'active' : ''}" data-tab="dashboard">
                        📊 Dashboard
                    </button>
                    <button class="nav-button ${appState.activeTab === 'candidates' ? 'active' : ''}" data-tab="candidates">
                        👥 Candidatos
                    </button>
                    <button class="nav-button ${appState.activeTab === 'publications' ? 'active' : ''}" data-tab="publications">
                        📄 Publicações
                    </button>
                </nav>

                <div class="sidebar-footer">
                    <button class="footer-button" id="exportBtn">⬇️ Exportar JSON</button>
                    <button class="footer-button" id="importBtn">⬆️ Importar JSON</button>
                    <input type="file" id="fileInput" accept=".json" style="display:none">
                    <button class="footer-button logout" id="logoutBtn">🚪 Sair</button>
                </div>
            </aside>

            <main class="main-content">
                <div class="main-header no-print">
                    <div>
                        <h2 class="header-title">
                            ${appState.activeTab === 'dashboard' ? '📊 Dashboard' : 
                              appState.activeTab === 'candidates' ? '👥 Candidatos' : 
                              '📄 Publicações'}
                        </h2>
                        <p class="header-subtitle">IPIAL • Sistema de Exames de Acesso 2025</p>
                    </div>
                    ${appState.activeTab === 'candidates' && !appState.showAddForm ? 
                      '<button class="add-button" id="addBtn">+ Inscrever Candidato</button>' : ''}
                </div>

                <div id="content"></div>
            </main>
        </div>
    `;
}

function renderDashboard() {
    const stats = appState.getStats();
    return `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px; margin-bottom: 32px;">
            <div class="stat-card">
                <div class="stat-icon total">📊</div>
                <div>
                    <p class="stat-label">Inscritos</p>
                    <p class="stat-number">${stats.total}</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon approved">✓</div>
                <div>
                    <p class="stat-label">Aprovados</p>
                    <p class="stat-number">${stats.approved}</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon rejected">✗</div>
                <div>
                    <p class="stat-label">Reprovados</p>
                    <p class="stat-number">${stats.rejected}</p>
                </div>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px;">
            <div class="card">
                <div class="card-header">
                    <h4 class="card-title">📊 Distribuição por Curso</h4>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
                    ${COURSES.map(course => {
                        const count = stats.byCourse[course] || 0;
                        const pct = stats.total ? (count / stats.total) * 100 : 0;
                        return `
                            <div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                    <span style="font-size: 12px; font-weight: 700; color: #64748b;">${course}</span>
                                    <span style="font-weight: 700;">${count}</span>
                                </div>
                                <div style="width: 100%; background-color: #f1f5f9; border-radius: 99px; height: 8px;">
                                    <div style="background-color: #2563eb; height: 100%; border-radius: 99px; width: ${pct}%;"></div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h4 class="card-title">📋 Atividade Recente</h4>
                </div>
                <div class="activity-list">
                    ${appState.logs.length === 0 ? '<p style="color: #94a3b8; font-style: italic;">Sem atividade</p>' : ''}
                    ${appState.logs.slice(0, 10).map(log => `
                        <div class="activity-item">
                            <p class="activity-action">${log.action}</p>
                            <div class="activity-meta">
                                <p class="activity-time">${new Date(log.timestamp).toLocaleTimeString()}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

function renderCandidatesList() {
    const searchTerm = (document.getElementById('searchInput')?.value || '').toLowerCase();
    const courseFilter = document.getElementById('courseFilter')?.value || '';
    const statusFilter = document.getElementById('statusFilter')?.value || '';

    let filtered = appState.candidates;

    if (searchTerm) {
        filtered = filtered.filter(c => 
            c.fullName.toLowerCase().includes(searchTerm) ||
            c.idNumber.toLowerCase().includes(searchTerm) ||
            c.contact.toLowerCase().includes(searchTerm)
        );
    }

    if (courseFilter) {
        filtered = filtered.filter(c => c.course === courseFilter);
    }

    if (statusFilter) {
        filtered = filtered.filter(c => c.status === statusFilter);
    }

    return `
        <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="margin: 0;">Gestão de Candidatos</h2>
                <button id="addCandidateBtn" class="btn-primary" style="padding: 10px 16px;">➕ Inscrever Candidato</button>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr auto; gap: 12px; margin-bottom: 16px;">
                <div>
                    <label style="display: block; font-size: 12px; color: #64748b; margin-bottom: 4px; font-weight: 600;">Pesquisar</label>
                    <input type="text" id="searchInput" class="form-input" placeholder="Nome, BI ou contacto...">
                </div>
                <div>
                    <label style="display: block; font-size: 12px; color: #64748b; margin-bottom: 4px; font-weight: 600;">Curso</label>
                    <select id="courseFilter" class="form-select">
                        <option value="">Todos os Cursos</option>
                        ${COURSES.map(course => `<option value="${course}">${course}</option>`).join('')}
                    </select>
                </div>
                <div>
                    <label style="display: block; font-size: 12px; color: #64748b; margin-bottom: 4px; font-weight: 600;">Estado</label>
                    <select id="statusFilter" class="form-select">
                        <option value="">Todos os Estados</option>
                        <option value="${STATUS.APPROVED}">${STATUS.APPROVED}</option>
                        <option value="${STATUS.REJECTED}">${STATUS.REJECTED}</option>
                        <option value="${STATUS.PENDING}">${STATUS.PENDING}</option>
                    </select>
                </div>
                <div style="display: flex; align-items: flex-end;">
                    <button id="reportBtn" class="btn-secondary" style="width: 100%;">📊 Relatório Geral</button>
                </div>
            </div>

            <div style="margin-bottom: 12px; color: #64748b; font-size: 12px;">
                Mostrando <strong>${filtered.length}</strong> de <strong>${appState.candidates.length}</strong> candidatos
            </div>

            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Foto</th>
                            <th>Candidato</th>
                            <th>Curso</th>
                            <th>BI / ID</th>
                            <th style="text-align: center;">Nota</th>
                            <th style="text-align: center;">Estado</th>
                            <th style="text-align: right;">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filtered.length === 0 ? 
                            '<tr><td colspan="7" style="text-align: center; padding: 32px;">Nenhum candidato encontrado.</td></tr>' : 
                            filtered.map(c => `
                                <tr>
                                    <td style="text-align: center;">
                                        ${c.photo ? 
                                            `<img src="${c.photo}" style="width: 40px; height: 50px; object-fit: cover; border-radius: 4px;">` : 
                                            '<div style="width: 40px; height: 50px; background-color: #e2e8f0; border-radius: 4px;"></div>'
                                        }
                                    </td>
                                    <td style="font-weight: 600;">${c.fullName}</td>
                                    <td style="font-size: 12px;">${c.course}</td>
                                    <td style="font-family: monospace; font-size: 12px;">${c.idNumber}</td>
                                    <td style="text-align: center; font-weight: 700;">${c.score.toFixed(1)}</td>
                                    <td style="text-align: center;">
                                        <span style="padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; 
                                            ${c.status === STATUS.APPROVED ? 'background-color: #dcfce7; color: #166534;' : 
                                              c.status === STATUS.REJECTED ? 'background-color: #fef2f2; color: #991b1b;' : 
                                              'background-color: #f3f4f6; color: #374151;'}">
                                            ${c.status}
                                        </span>
                                    </td>
                                    <td style="text-align: right; display: flex; gap: 6px; justify-content: flex-end;">
                                        <button class="btn-secondary btn-sm edit-btn" data-id="${c.id}">✎</button>
                                        <button class="btn-danger btn-sm delete-btn" data-id="${c.id}">🗑️</button>
                                    </td>
                                </tr>
                            `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function renderCandidateForm() {
    const c = appState.editingCandidate;
    return `
        <div class="card" style="max-width: 700px; margin: 0 auto;">
            <h3 style="margin-bottom: 24px; font-size: 18px; font-weight: 700;">
                ${c ? '✎ Editar' : '➕ Novo'} Candidato
            </h3>
            <form id="candidateForm" class="form-container">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                    <div class="form-field" style="grid-column: 1 / -1;">
                        <label class="form-label">📸 Foto do Candidato</label>
                        <div style="display: flex; gap: 16px; align-items: flex-start;">
                            <div id="photoPreview" style="width: 120px; height: 160px; background-color: #f1f5f9; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; border: 2px dashed #cbd5e1; overflow: hidden;">
                                ${c?.photo ? `<img src="${c.photo}" style="width: 100%; height: 100%; object-fit: cover;">` : '<span style="text-align: center; color: #94a3b8; font-size: 12px;">Clique para adicionar foto</span>'}
                            </div>
                            <input type="file" id="photoInput" accept="image/*" style="display:none">
                            <input type="hidden" id="photoData" name="photo" value="${c?.photo || ''}">
                            <div style="flex: 1;">
                                <p style="font-size: 12px; color: #64748b; margin: 0 0 8px 0;">Formatos: JPG, PNG (máx. 2MB)</p>
                                <button type="button" id="uploadPhotoBtn" class="btn-secondary">Escolher Imagem</button>
                                ${c?.photo ? '<button type="button" id="removePhotoBtn" class="btn-danger" style="margin-left: 8px;">Remover</button>' : ''}
                            </div>
                        </div>
                    </div>

                    <div class="form-field" style="grid-column: 1 / -1;">
                        <label class="form-label">Nome Completo *</label>
                        <input type="text" name="fullName" class="form-input" value="${c?.fullName || ''}" required>
                    </div>
                    <div class="form-field">
                        <label class="form-label">BI/Passaporte *</label>
                        <input type="text" name="idNumber" class="form-input" value="${c?.idNumber || ''}" required>
                    </div>
                    <div class="form-field">
                        <label class="form-label">Contacto *</label>
                        <input type="tel" name="contact" class="form-input" value="${c?.contact || ''}" required>
                    </div>
                    <div class="form-field">
                        <label class="form-label">Idade *</label>
                        <input type="number" name="age" class="form-input" value="${c?.age || 18}" min="15" required>
                    </div>
                    <div class="form-field" style="grid-column: 1 / -1;">
                        <label class="form-label">Curso *</label>
                        <select name="course" class="form-select" required>
                            <option value="">Selecione um Curso</option>
                            ${COURSES.map(course => `<option value="${course}" ${c?.course === course ? 'selected' : ''}>${course}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-field">
                        <label class="form-label">Nota *</label>
                        <input type="number" name="score" class="form-input" value="${c?.score || 0}" min="0" max="20" step="0.1" required>
                    </div>
                    <div class="form-field">
                        <label class="form-label">Estado *</label>
                        <select name="status" class="form-select" required>
                            <option value="${STATUS.PENDING}" ${c?.status === STATUS.PENDING ? 'selected' : ''}>${STATUS.PENDING}</option>
                            <option value="${STATUS.APPROVED}" ${c?.status === STATUS.APPROVED ? 'selected' : ''}>${STATUS.APPROVED}</option>
                            <option value="${STATUS.REJECTED}" ${c?.status === STATUS.REJECTED ? 'selected' : ''}>${STATUS.REJECTED}</option>
                        </select>
                    </div>
                    <div style="grid-column: 1 / -1; display: flex; gap: 12px; margin-top: 8px;">
                        <button type="submit" class="btn-primary">Guardar</button>
                        <button type="button" class="btn-secondary" id="cancelBtn">Cancelar</button>
                    </div>
                </div>
                <input type="hidden" id="candidateId" value="${c?.id || ''}">
            </form>
        </div>
    `;
}

function renderPublications() {
    return `
        <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
                <div>
                    <h3 style="font-size: 20px; font-weight: 900; margin: 0;">📢 Publicação de Resultados</h3>
                    <p style="color: #64748b; font-size: 14px; margin-top: 8px;">Controle a visibilidade das listas</p>
                </div>
                <div class="status-badge ${appState.isPublished ? 'published' : 'draft'}">
                    ${appState.isPublished ? '✓ Publicado' : '○ Privado'}
                </div>
            </div>

            <div class="publication-content">
                <button id="togglePublish" class="publish-button ${appState.isPublished ? 'inactive' : 'active'}" style="width: 100%;">
                    ${appState.isPublished ? '🔒 Suspender Publicação' : '🔓 Publicar Resultados Agora'}
                </button>

                <button id="previewBtn" class="btn-secondary" style="width: 100%; margin-top: 12px;">
                    👁️ Pré-visualizar Página Pública
                </button>
            </div>

            ${appState.isPublished ? `
            <div style="margin-top: 32px; padding-top: 32px; border-top: 1px solid #e2e8f0;">
                <h4 style="font-weight: 700; margin-bottom: 16px;">⬇️ Descarregar Listas Publicadas</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                    <button id="downloadListaCsvBtn" class="btn-secondary">📊 Exportar como CSV</button>
                    <button id="downloadListaPdfBtn" class="btn-secondary">📄 Exportar como PDF</button>
                    <button id="downloadAprovadosCsvBtn" class="btn-secondary">✓ Aprovados (CSV)</button>
                    <button id="downloadAprovadosPdfBtn" class="btn-secondary">✓ Aprovados (PDF)</button>
                </div>
            </div>
            ` : ''}

            <div style="margin-top: 32px; padding-top: 32px; border-top: 1px solid #e2e8f0;">
                <h4 style="font-weight: 700; margin-bottom: 16px;">📋 Listas que serão geradas:</h4>
                <div class="list-grid">
                    <div class="list-item">
                        <p class="list-item-title">Lista Geral</p>
                        <p class="list-item-desc">Todos os inscritos por ordem alfabética</p>
                    </div>
                    <div class="list-item">
                        <p class="list-item-title">Aprovados</p>
                        <p class="list-item-desc">Filtrados com nota ≥ 10</p>
                    </div>
                    <div class="list-item">
                        <p class="list-item-title">Reprovados</p>
                        <p class="list-item-desc">Nota < 10</p>
                    </div>
                    <div class="list-item">
                        <p class="list-item-title">Ranking Especial</p>
                        <p class="list-item-desc">Top 100 melhores notas</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderPublicResults() {
    if (!appState.isPublished) {
        return `
            <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background-color: #f8fafc;">
                <div style="text-align: center;">
                    <h1 style="font-size: 32px; font-weight: 900; margin-bottom: 16px;">🔒 Resultados Indisponíveis</h1>
                    <p style="color: #64748b; margin-bottom: 32px;">As listas ainda não foram publicadas.</p>
                    <button id="backBtn" class="btn-primary">← Voltar</button>
                </div>
            </div>
        `;
    }

    const approved = appState.candidates.filter(c => c.status === STATUS.APPROVED).length;
    const rejected = appState.candidates.filter(c => c.status === STATUS.REJECTED).length;
    const ranking = appState.candidates.slice().sort((a, b) => b.score - a.score).slice(0, 10);

    return `
        <div style="padding: 32px;">
            <div class="public-header no-print">
                <div>
                    <h1 class="public-title">📊 Resultados dos Exames - 2025</h1>
                    <p class="public-subtitle">IPIAL - Instituto Politécnico Industrial "Alda Lara"</p>
                </div>
                <button id="backBtn" class="btn-secondary">← Voltar</button>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 32px;">
                <div class="card" style="text-align: center;">
                    <p style="color: #64748b; font-size: 12px; margin: 0 0 8px 0;">Total</p>
                    <p style="font-size: 32px; font-weight: 900; color: #2563eb; margin: 0;">${appState.candidates.length}</p>
                </div>
                <div class="card" style="text-align: center; border-top: 4px solid #22c55e;">
                    <p style="color: #64748b; font-size: 12px; margin: 0 0 8px 0;">Aprovados</p>
                    <p style="font-size: 32px; font-weight: 900; color: #22c55e; margin: 0;">${approved}</p>
                </div>
                <div class="card" style="text-align: center; border-top: 4px solid #ef4444;">
                    <p style="color: #64748b; font-size: 12px; margin: 0 0 8px 0;">Reprovados</p>
                    <p style="font-size: 32px; font-weight: 900; color: #ef4444; margin: 0;">${rejected}</p>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 32px;">
                <div class="card">
                    <h3 style="margin-bottom: 16px;">🏆 Top 10 Melhores Notas</h3>
                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        ${ranking.length === 0 ? '<p style="color: #94a3b8;">Sem candidatos</p>' : ''}
                        ${ranking.map((c, i) => `
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; background-color: #f8fafc; border-radius: 6px;">
                                <div>
                                    <span style="font-weight: 700; font-size: 14px;">${i + 1}º</span>
                                    <span style="margin-left: 8px; font-weight: 600;">${c.fullName}</span>
                                </div>
                                <span style="font-weight: 900; color: #2563eb;">${c.score.toFixed(1)}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="card">
                    <h3 style="margin-bottom: 16px;">🔍 Consultar Resultado Individual</h3>
                    <input type="text" id="searchBiPublic" class="form-input" placeholder="Digite o seu BI/Passaporte" style="margin-bottom: 16px;">
                    <div id="publicSearchResult"></div>
                </div>
            </div>

            <div class="card">
                <h3 style="margin-bottom: 16px;">📋 Todos os Resultados</h3>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Nº</th>
                                <th>Nome</th>
                                <th>BI</th>
                                <th>Curso</th>
                                <th style="text-align: center;">Nota</th>
                                <th style="text-align: center;">Resultado</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${appState.candidates.map((c, i) => `
                                <tr>
                                    <td>${i + 1}</td>
                                    <td style="font-weight: 600;">${c.fullName}</td>
                                    <td>${c.idNumber}</td>
                                    <td>${c.course}</td>
                                    <td style="text-align: center; font-weight: 700;">${c.score.toFixed(1)}</td>
                                    <td style="text-align: center;">
                                        <span style="padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 700;
                                            ${c.status === STATUS.APPROVED ? 'background-color: #dcfce7; color: #166534;' : 
                                              c.status === STATUS.REJECTED ? 'background-color: #fef2f2; color: #991b1b;' : 
                                              'background-color: #f3f4f6; color: #374151;'}">
                                            ${c.status}
                                        </span>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; text-align: center; color: #64748b; font-size: 12px;">
                <p style="margin: 0;">Publicado em: ${new Date().toLocaleString('pt-PT')}</p>
            </div>
        </div>
    `;
}

// ====================================
// MAIN RENDER FUNCTION
// ====================================

function render() {
    const app = document.getElementById('app');

    if (appState.viewMode === 'public') {
        app.innerHTML = renderPublicResults();
        attachPublicListeners();
        return;
    }

    if (!appState.isAuthenticated) {
        app.innerHTML = renderLoginPage();
        attachLoginListeners();
        return;
    }

    app.innerHTML = renderAdminLayout();
    updateContent();
    attachAdminListeners();
}

function updateContent() {
    const content = document.getElementById('content');
    if (!content) return;

    if (appState.activeTab === 'dashboard') {
        content.innerHTML = renderDashboard();
    } else if (appState.activeTab === 'candidates') {
        if (appState.showAddForm) {
            content.innerHTML = renderCandidateForm();
            attachCandidateFormListeners();
        } else {
            content.innerHTML = renderCandidatesList();
            attachCandidateListListeners();
        }
    } else if (appState.activeTab === 'publications') {
        content.innerHTML = renderPublications();
        attachPublicationsListeners();
    }
}

// ====================================
// EVENT LISTENERS
// ====================================

function attachLoginListeners() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const user = document.getElementById('username').value;
            const pass = document.getElementById('password').value;

            if (user === 'admin' && pass === 'admin') {
                appState.isAuthenticated = true;
                appState.user = 'Administrador';
                appState.addLog('Login efetuado no sistema');
                render();
            } else {
                const errorDiv = document.getElementById('loginError');
                errorDiv.style.display = 'flex';
                document.getElementById('errorText').textContent = 'Credenciais inválidas!';
            }
        });
    }

    const publicBtn = document.getElementById('publicBtn');
    if (publicBtn) {
        publicBtn.addEventListener('click', (e) => {
            e.preventDefault();
            appState.viewMode = 'public';
            render();
        });
    }
}

function attachAdminListeners() {
    // Tab navigation
    document.querySelectorAll('[data-tab]').forEach(btn => {
        btn.addEventListener('click', () => {
            appState.activeTab = btn.dataset.tab;
            appState.showAddForm = false;
            appState.editingCandidate = null;
            updateContent();
        });
    });

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            appState.addLog('Logout efetuado');
            appState.isAuthenticated = false;
            appState.user = null;
            render();
        });
    }

    // Export
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            const data = JSON.stringify(appState.candidates, null, 2);
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `IPIAL_CANDIDATOS_${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            appState.addLog('Exportação realizada');
        });
    }

    // Import
    const importBtn = document.getElementById('importBtn');
    if (importBtn) {
        importBtn.addEventListener('click', () => {
            document.getElementById('fileInput').click();
        });
    }

    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    try {
                        const data = JSON.parse(ev.target.result);
                        if (Array.isArray(data)) {
                            let count = 0;
                            data.forEach(item => {
                                if (!appState.candidates.some(c => c.idNumber === item.idNumber)) {
                                    appState.candidates.push(item);
                                    count++;
                                }
                            });
                            appState.addLog(`Importação: ${count} itens`);
                            appState.save();
                            render();
                        }
                    } catch (err) {
                        alert('Erro ao importar arquivo!');
                    }
                };
                reader.readAsText(file);
            }
        });
    }

    // Add button
    const addBtn = document.getElementById('addBtn');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            appState.showAddForm = true;
            appState.editingCandidate = null;
            updateContent();
        });
    }
}

function attachCandidateFormListeners() {
    const form = document.getElementById('candidateForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);

            if (data.fullName.length < 5) {
                alert('Nome deve ter pelo menos 5 caracteres');
                return;
            }

            if (parseInt(data.age) < 15) {
                alert('Idade mínima é 15 anos');
                return;
            }

            const candidateData = {
                fullName: data.fullName,
                age: parseInt(data.age),
                idNumber: data.idNumber.toUpperCase(),
                contact: data.contact,
                course: data.course,
                score: parseFloat(data.score),
                status: data.status,
                photo: document.getElementById('photoData').value || ''
            };

            const candidateId = document.getElementById('candidateId').value;
            if (candidateId) {
                appState.updateCandidate(candidateId, candidateData);
            } else {
                const result = appState.addCandidate(candidateData);
                if (!result.success) {
                    alert(result.error);
                    return;
                }
            }

            appState.showAddForm = false;
            appState.editingCandidate = null;
            updateContent();
        });
    }

    // Photo upload handler
    const uploadPhotoBtn = document.getElementById('uploadPhotoBtn');
    if (uploadPhotoBtn) {
        uploadPhotoBtn.addEventListener('click', () => {
            document.getElementById('photoInput').click();
        });
    }

    const photoInput = document.getElementById('photoInput');
    if (photoInput) {
        photoInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 2 * 1024 * 1024) {
                    alert('Imagem muito grande! Máximo 2MB');
                    return;
                }
                const reader = new FileReader();
                reader.onload = (ev) => {
                    const base64 = ev.target.result;
                    document.getElementById('photoData').value = base64;
                    const preview = document.getElementById('photoPreview');
                    preview.innerHTML = `<img src="${base64}" style="width: 100%; height: 100%; object-fit: cover;">`;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Remove photo button
    const removePhotoBtn = document.getElementById('removePhotoBtn');
    if (removePhotoBtn) {
        removePhotoBtn.addEventListener('click', () => {
            document.getElementById('photoData').value = '';
            document.getElementById('photoPreview').innerHTML = '<span style="text-align: center; color: #94a3b8; font-size: 12px;">Clique para adicionar foto</span>';
            document.getElementById('photoInput').value = '';
        });
    }

    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            appState.showAddForm = false;
            appState.editingCandidate = null;
            updateContent();
        });
    }
}

function attachCandidateListListeners() {
    const addCandidateBtn = document.getElementById('addCandidateBtn');
    if (addCandidateBtn) {
        addCandidateBtn.addEventListener('click', () => {
            appState.editingCandidate = null;
            appState.showAddForm = true;
            updateContent();
        });
    }

    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            appState.editingCandidate = appState.candidates.find(c => c.id === id);
            appState.showAddForm = true;
            updateContent();
        });
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            const candidate = appState.candidates.find(c => c.id === id);
            if (confirm(`Eliminar ${candidate?.fullName}?`)) {
                appState.deleteCandidate(id);
                updateContent();
            }
        });
    });

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            updateContent();
        });
    }

    const courseFilter = document.getElementById('courseFilter');
    if (courseFilter) {
        courseFilter.addEventListener('change', () => {
            updateContent();
        });
    }

    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', () => {
            updateContent();
        });
    }

    const reportBtn = document.getElementById('reportBtn');
    if (reportBtn) {
        reportBtn.addEventListener('click', () => {
            appState.generateReport();
        });
    }
}

function attachPublicationsListeners() {
    const toggleBtn = document.getElementById('togglePublish');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            appState.isPublished = !appState.isPublished;
            appState.addLog(appState.isPublished ? 'Resultados publicados' : 'Publicação suspensa');
            appState.save();
            updateContent();
        });
    }

    const previewBtn = document.getElementById('previewBtn');
    if (previewBtn) {
        previewBtn.addEventListener('click', () => {
            appState.viewMode = 'public';
            render();
        });
    }

    // Download buttons
    const downloadListaCsvBtn = document.getElementById('downloadListaCsvBtn');
    if (downloadListaCsvBtn) {
        downloadListaCsvBtn.addEventListener('click', () => {
            appState.exportToCSV(appState.candidates, `IPIAL_Lista_Completa_${new Date().toISOString().split('T')[0]}.csv`);
            appState.addLog('Lista geral exportada em CSV');
        });
    }

    const downloadListaPdfBtn = document.getElementById('downloadListaPdfBtn');
    if (downloadListaPdfBtn) {
        downloadListaPdfBtn.addEventListener('click', () => {
            appState.exportToPDF(appState.candidates, 'Lista Completa de Candidatos - 2025');
            appState.addLog('Lista geral exportada em PDF');
        });
    }

    const downloadAprovadosCsvBtn = document.getElementById('downloadAprovadosCsvBtn');
    if (downloadAprovadosCsvBtn) {
        downloadAprovadosCsvBtn.addEventListener('click', () => {
            const approved = appState.candidates.filter(c => c.status === STATUS.APPROVED);
            appState.exportToCSV(approved, `IPIAL_Aprovados_${new Date().toISOString().split('T')[0]}.csv`);
            appState.addLog('Lista de aprovados exportada em CSV');
        });
    }

    const downloadAprovadosPdfBtn = document.getElementById('downloadAprovadosPdfBtn');
    if (downloadAprovadosPdfBtn) {
        downloadAprovadosPdfBtn.addEventListener('click', () => {
            const approved = appState.candidates.filter(c => c.status === STATUS.APPROVED);
            appState.exportToPDF(approved, 'Lista de Aprovados - 2025');
            appState.addLog('Lista de aprovados exportada em PDF');
        });
    }
}

function attachPublicListeners() {
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            appState.viewMode = 'none';
            appState.isAuthenticated = false;
            render();
        });
    }

    // Public search by BI
    const searchBiPublic = document.getElementById('searchBiPublic');
    if (searchBiPublic) {
        searchBiPublic.addEventListener('input', (e) => {
            const bi = e.target.value.toUpperCase();
            const resultDiv = document.getElementById('publicSearchResult');
            
            if (!bi) {
                resultDiv.innerHTML = '';
                return;
            }

            const candidate = appState.candidates.find(c => c.idNumber.toUpperCase() === bi);
            
            if (!candidate) {
                resultDiv.innerHTML = '<div style="padding: 12px; background-color: #fef2f2; border-radius: 6px; color: #991b1b;">ℹ️ Candidato não encontrado</div>';
                return;
            }

            resultDiv.innerHTML = `
                <div style="padding: 16px; background-color: #f8fafc; border-radius: 6px; border-left: 4px solid #2563eb;">
                    <div style="display: grid; grid-template-columns: auto 1fr; gap: 16px; align-items: center;">
                        ${candidate.photo ? `<img src="${candidate.photo}" style="width: 80px; height: 100px; object-fit: cover; border-radius: 4px;">` : '<div style="width: 80px; height: 100px; background-color: #e2e8f0; border-radius: 4px;"></div>'}
                        <div>
                            <p style="margin: 0; font-weight: 700; font-size: 16px;">${candidate.fullName}</p>
                            <p style="margin: 4px 0; font-size: 12px; color: #64748b;">BI: ${candidate.idNumber}</p>
                            <p style="margin: 4px 0; font-size: 12px; color: #64748b;">Curso: ${candidate.course}</p>
                            <div style="margin-top: 12px; display: flex; gap: 16px;">
                                <div>
                                    <span style="font-size: 12px; color: #64748b;">Nota</span>
                                    <p style="margin: 0; font-weight: 900; font-size: 20px; color: #2563eb;">${candidate.score.toFixed(1)}</p>
                                </div>
                                <div>
                                    <span style="font-size: 12px; color: #64748b;">Resultado</span>
                                    <p style="margin: 0; font-weight: 700; padding: 4px 8px; border-radius: 4px; display: inline-block;
                                        ${candidate.status === STATUS.APPROVED ? 'background-color: #dcfce7; color: #166534;' : 
                                          candidate.status === STATUS.REJECTED ? 'background-color: #fef2f2; color: #991b1b;' : 
                                          'background-color: #f3f4f6; color: #374151;'}">
                                        ${candidate.status}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
    }
}

// ====================================
// INITIALIZATION
// ====================================

appState.init();
render();
