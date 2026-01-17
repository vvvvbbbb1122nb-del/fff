// Status constants
export const STATUS = {
    PENDING: 'Pendente',
    APPROVED: 'Aprovado',
    REJECTED: 'Reprovado'
};

// Available courses
export const COURSES = [
    'Informática',
    'Eletrónica',
    'Construção Civil',
    'Eletricidade',
    'Mecânica Automóvel',
    'Administração'
];

// State Management Class
export default class State {
    constructor() {
        this.isAuthenticated = false;
        this.user = null;
        this.viewMode = 'admin'; // 'admin' or 'public'
        this.activeTab = 'dashboard'; // 'dashboard', 'candidates', 'publications'
        this.candidates = [];
        this.logs = [];
        this.isPublished = false;
        this.showAddForm = false;
        this.editingCandidate = null;
        this.selectedCandidate = null;
    }

    init() {
        this.loadFromStorage();
    }

    loadFromStorage() {
        try {
            const saved = localStorage.getItem('ipial_candidates');
            if (saved) this.candidates = JSON.parse(saved);
            const logs = localStorage.getItem('ipial_logs');
            if (logs) this.logs = JSON.parse(logs);
            const pub = localStorage.getItem('ipial_published');
            if (pub) this.isPublished = pub === 'true';
        } catch (e) {
            console.error('Erro ao carregar dados:', e);
        }
    }

    save() {
        localStorage.setItem('ipial_candidates', JSON.stringify(this.candidates));
        localStorage.setItem('ipial_logs', JSON.stringify(this.logs));
        localStorage.setItem('ipial_published', this.isPublished.toString());
    }

    addLog(action) {
        const newLog = {
            id: crypto.randomUUID?.() || Date.now().toString(),
            action,
            timestamp: new Date().toISOString(),
            user: this.user || 'Visitante'
        };
        this.logs = [newLog, ...this.logs].slice(0, 50);
        this.save();
    }

    addCandidate(data) {
        // Check for duplicate ID
        if (this.candidates.some(c => c.idNumber.toLowerCase() === data.idNumber.toLowerCase())) {
            return { success: false, error: `Erro: O BI/Passaporte "${data.idNumber}" já existe no sistema.` };
        }

        const newCandidate = {
            ...data,
            id: crypto.randomUUID?.() || Date.now().toString(),
            createdAt: new Date().toISOString()
        };

        this.candidates.push(newCandidate);
        this.addLog(`Candidato registrado: ${data.fullName}`);
        this.save();
        return { success: true };
    }

    updateCandidate(id, data) {
        const idx = this.candidates.findIndex(c => c.id === id);
        if (idx >= 0) {
            this.candidates[idx] = { ...this.candidates[idx], ...data };
            this.addLog(`Dados atualizados: ${data.fullName}`);
            this.save();
            return { success: true };
        }
        return { success: false };
    }

    deleteCandidate(id) {
        const candidate = this.candidates.find(c => c.id === id);
        if (candidate) {
            this.candidates = this.candidates.filter(c => c.id !== id);
            this.addLog(`Candidato eliminado: ${candidate.fullName}`);
            this.save();
            return { success: true };
        }
        return { success: false };
    }

    getStats() {
        const total = this.candidates.length;
        const approved = this.candidates.filter(c => c.status === STATUS.APPROVED).length;
        const rejected = this.candidates.filter(c => c.status === STATUS.REJECTED).length;

        const byCourse = {};
        COURSES.forEach(course => {
            byCourse[course] = this.candidates.filter(c => c.course === course).length;
        });

        return { total, approved, rejected, byCourse };
    }
}
