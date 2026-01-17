// Candidates Module
export function renderCandidatesList(state, handleEdit, handleDelete) {
    return `
        <div class="bg-white rounded-lg shadow overflow-hidden">
            <table class="w-full">
                <thead class="bg-slate-100">
                    <tr>
                        <th class="px-6 py-3 text-left text-sm font-semibold">Nome</th>
                        <th class="px-6 py-3 text-left text-sm font-semibold">BI</th>
                        <th class="px-6 py-3 text-left text-sm font-semibold">Curso</th>
                        <th class="px-6 py-3 text-center text-sm font-semibold">Nota</th>
                        <th class="px-6 py-3 text-center text-sm font-semibold">Estado</th>
                        <th class="px-6 py-3 text-right text-sm font-semibold">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    ${state.candidates.length === 0 ? '<tr><td colspan="6" class="px-6 py-8 text-center text-slate-500">Sem candidatos</td></tr>' : ''}
                    ${state.candidates.map(c => `
                        <tr class="border-b border-slate-200 hover:bg-slate-50">
                            <td class="px-6 py-3 font-semibold">${c.fullName}</td>
                            <td class="px-6 py-3">${c.idNumber}</td>
                            <td class="px-6 py-3">${c.course}</td>
                            <td class="px-6 py-3 text-center font-bold">${c.score.toFixed(1)}</td>
                            <td class="px-6 py-3 text-center">
                                <span class="inline-block px-3 py-1 rounded text-xs font-bold ${c.status === 'Aprovado' ? 'bg-green-100 text-green-800' : c.status === 'Reprovado' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}">
                                    ${c.status}
                                </span>
                            </td>
                            <td class="px-6 py-3 text-right space-x-2">
                                <button class="edit-btn px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600" data-id="${c.id}">✎ Editar</button>
                                <button class="delete-btn px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600" data-id="${c.id}">🗑️ Eliminar</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

export function renderCandidateForm(state) {
    const c = state.editingCandidate;
    return `
        <div class="bg-white p-6 rounded-lg shadow max-w-2xl">
            <h3 class="text-xl font-bold mb-6">${c ? '✎ Editar' : '➕ Novo'} Candidato</h3>
            <form id="candidateForm" class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <input type="text" name="fullName" class="col-span-2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Nome Completo" value="${c?.fullName || ''}" required>
                    <input type="text" name="idNumber" class="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="BI/Passaporte" value="${c?.idNumber || ''}" required>
                    <input type="tel" name="contact" class="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Contacto" value="${c?.contact || ''}" required>
                    <input type="number" name="age" class="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Idade" value="${c?.age || 18}" min="15" required>
                    <select name="course" class="col-span-2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required>
                        <option value="">Selecione um Curso</option>
                        <option value="Construção Civil" ${c?.course === 'Construção Civil' ? 'selected' : ''}>Construção Civil</option>
                        <option value="Electrónica e Telecomunicações" ${c?.course === 'Electrónica e Telecomunicações' ? 'selected' : ''}>Electrónica e Telecomunicações</option>
                        <option value="Electricidade" ${c?.course === 'Electricidade' ? 'selected' : ''}>Electricidade</option>
                        <option value="Informática" ${c?.course === 'Informática' ? 'selected' : ''}>Informática</option>
                    </select>
                    <input type="number" name="score" class="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Nota" value="${c?.score || 0}" min="0" max="20" step="0.1" required>
                    <select name="status" class="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required>
                        <option value="Pendente" ${c?.status === 'Pendente' ? 'selected' : ''}>Pendente</option>
                        <option value="Aprovado" ${c?.status === 'Aprovado' ? 'selected' : ''}>Aprovado</option>
                        <option value="Reprovado" ${c?.status === 'Reprovado' ? 'selected' : ''}>Reprovado</option>
                    </select>
                </div>
                <div class="flex gap-4">
                    <button type="submit" class="flex-1 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">✓ Guardar</button>
                    <button type="button" id="cancelBtn" class="flex-1 py-2 bg-slate-300 text-slate-800 font-bold rounded-lg hover:bg-slate-400">✕ Cancelar</button>
                </div>
                <input type="hidden" id="candidateId" value="${c?.id || ''}">
            </form>
        </div>
    `;
}

export function setupCandidateEvents(state, onSave, onEdit, onDelete, onCancel) {
    document.getElementById('candidateForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const form = e.target;
        const data = new FormData(form);
        
        const candidateData = {
            fullName: data.get('fullName'),
            idNumber: data.get('idNumber'),
            contact: data.get('contact'),
            age: parseInt(data.get('age')),
            course: data.get('course'),
            score: parseFloat(data.get('score')),
            status: data.get('status')
        };

        onSave(candidateData);
    });

    document.getElementById('cancelBtn').addEventListener('click', onCancel);

    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            onEdit(id);
        });
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            if (confirm('Tem a certeza que deseja eliminar?')) {
                onDelete(id);
            }
        });
    });
}
