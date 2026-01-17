// Login Page
export function renderLogin(state) {
    return `
        <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
            <div class="w-full max-w-md px-8 py-12 bg-white rounded-2xl shadow-2xl">
                <div class="text-center mb-8">
                    <div class="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">I</div>
                    <h1 class="text-2xl font-bold text-slate-900">IPIAL</h1>
                    <p class="text-slate-500 text-sm mt-1">Sistema de Gestão de Exames</p>
                </div>

                <form id="loginForm" class="space-y-4">
                    <div>
                        <label class="block text-sm font-semibold text-slate-700 mb-2">Utilizador</label>
                        <input type="text" id="username" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="admin" required>
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-slate-700 mb-2">Palavra-passe</label>
                        <input type="password" id="password" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="••••••••" required>
                    </div>
                    <button type="submit" class="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition">Acesso Restrito</button>
                </form>

                <div class="mt-6 pt-6 border-t border-slate-200">
                    <button id="publicBtn" class="w-full py-2 bg-slate-100 text-slate-800 font-semibold rounded-lg hover:bg-slate-200 transition">🔍 Consultar Resultados (Público)</button>
                    <p class="text-center text-xs text-slate-500 mt-4">
                        ${state.isPublished ? '🟢 Resultados Publicados' : '⚪ Resultados Aguardando Publicação'}
                    </p>
                </div>
            </div>
        </div>
    `;
}

export function setupLoginEvents(handleLogin, handleGoPublic) {
    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('username').value;
        const pass = document.getElementById('password').value;
        
        if (user === 'admin' && pass === 'admin') {
            handleLogin('Admin');
        } else {
            alert('Credenciais inválidas! Use admin/admin');
        }
    });

    document.getElementById('publicBtn').addEventListener('click', handleGoPublic);
}
