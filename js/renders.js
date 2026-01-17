// ====================================
// FUNÇÕES DE RENDERIZAÇÃO - IPIAL
// ====================================

// ▶ PÁGINA DE LOGIN
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

// ▶ LAYOUT PRINCIPAL DO ADMIN
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
                </div>

                <div id="content"></div>
            </main>
        </div>
    `;
}

// ▶ DASHBOARD
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
