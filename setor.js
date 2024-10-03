const apiUrlSetor = 'http://localhost:8080/setor';

document.addEventListener('DOMContentLoaded', () => {
    carregarSetores();

    document.getElementById('botaoCriarSetor').addEventListener('click', () => {
        abrirModal('Criar Setor');
    });

    document.getElementById('botaoSalvarSetor').addEventListener('click', () => {
        salvarSetor();
    });
});

async function carregarSetores() {
    const response = await fetch(`${apiUrlSetor}/all`);
    const setores = await response.json();
    const tbody = document.getElementById('corpoTabelaSetores');
    tbody.innerHTML = '';
    setores.forEach(setor => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${setor.setorNome}</td>
            <td>
                <button class="btn btn-primary" onclick="editarSetor(${setor.setorId})">Atualizar</button>
                <button class="btn btn-primary" onclick="excluirSetor(${setor.setorId})">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function abrirModal(titulo) {
    document.getElementById('modalSetorLabel').innerText = titulo;
    document.getElementById('setorId').value = ''; // Corrigido para 'setorId'
    document.getElementById('setorNome').value = ''; // Corrigido para 'setorNome'
    const modal = new bootstrap.Modal(document.getElementById('modalSetor'));
    modal.show();
}

async function salvarSetor() {
    const id = document.getElementById('setorId').value; // Corrigido para 'setorId'
    const setor = {
        setorNome: document.getElementById('setorNome').value, // Corrigido para 'setorNome'
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${apiUrlSetor}/update/${id}` : `${apiUrlSetor}/create`;

    const response = await fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(setor)
    });
    
    const message = await response.text();
    document.getElementById('mensagemFeedback').innerText = message;
    document.getElementById('mensagemFeedback').style.display = 'block';
    carregarSetores();
}

async function editarSetor(id) {
    const response = await fetch(`${apiUrlSetor}/${id}`);
    const setor = await response.json();
    document.getElementById('modalSetorLabel').innerText = 'Atualizar Setor';
    document.getElementById('setorId').value = setor.setorId; // Corrigido para 'setorId'
    document.getElementById('setorNome').value = setor.setorNome; // Corrigido para 'setorNome'
    const modal = new bootstrap.Modal(document.getElementById('modalSetor'));
    modal.show();
}

async function excluirSetor(id) {
    const response = await fetch(`${apiUrlSetor}/delete/${id}`, {
        method: 'DELETE'
    });
    
    const message = await response.text();
    document.getElementById('mensagemFeedback').innerText = message;
    document.getElementById('mensagemFeedback').style.display = 'block';
    carregarSetores();
}
