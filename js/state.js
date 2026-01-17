// ====================================
// GERENCIAMENTO DE ESTADO - IPIAL
// ====================================

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
