const apiUrlEmpregado = 'http://localhost:8080/empregado';
const apiUrlSetor = 'http://localhost:8080/setor/all';

document.addEventListener('DOMContentLoaded', () => {
    carregarSetores();
    carregarEmpregados();

    document.getElementById('botaoCriarColaborador').addEventListener('click', () => {
        abrirModal('Criar Colaborador');
    });

    document.getElementById('botaoSalvarColaborador').addEventListener('click', () => {
        salvarColaborador();
    });
});

async function carregarSetores() {
    const response = await fetch(apiUrlSetor);
    const setores = await response.json();
    const select = document.getElementById('departamentoColaborador');
    select.innerHTML = '';
    setores.forEach(setor => {
        const option = document.createElement('option');
        option.value = setor.setorId;
        option.textContent = setor.setorNome;
        select.appendChild(option);
    });
}

async function carregarEmpregados() {
    const response = await fetch(`${apiUrlEmpregado}/all`);
    const empregados = await response.json();
    const tbody = document.getElementById('corpoTabelaColaboradores');
    tbody.innerHTML = '';
    empregados.forEach(empregado => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${empregado.nomeEmpregado}</td>
            <td>${empregado.emailEmpregado}</td>
            <td>${empregado.matriculaEmpregado}</td>
            <td>${empregado.setor.setorNome}</td>
            <td>
                <button class="btn btn-primary" onclick="editarEmpregado(${empregado.idEmpregado})">Atualizar</button>
                <button class="btn btn-primary" onclick="excluirEmpregado(${empregado.idEmpregado})">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function abrirModal(titulo) {
    document.getElementById('modalColaboradorLabel').innerText = titulo;
    document.getElementById('idColaborador').value = '';
    document.getElementById('nomeColaborador').value = '';
    document.getElementById('emailColaborador').value = '';
    document.getElementById('matriculaColaborador').value = '';
    document.getElementById('departamentoColaborador').value = '';
    const modal = new bootstrap.Modal(document.getElementById('modalColaborador'));
    modal.show();
}

async function salvarColaborador() {
    const id = document.getElementById('idColaborador').value;
    const empregado = {
        nomeEmpregado: document.getElementById('nomeColaborador').value,
        emailEmpregado: document.getElementById('emailColaborador').value,
        matriculaEmpregado: document.getElementById('matriculaColaborador').value,
        setor: {
            setorId: parseInt(document.getElementById('departamentoColaborador').value)
        }
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${apiUrlEmpregado}/update/${id}` : `${apiUrlEmpregado}/create`;

    const response = await fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(empregado)
    });
    
    const message = await response.text();
    document.getElementById('mensagemFeedback').innerText = message;
    document.getElementById('mensagemFeedback').style.display = 'block';
    carregarEmpregados();
}

async function editarEmpregado(id) {
    const response = await fetch(`${apiUrlEmpregado}/${id}`);
    const empregado = await response.json();
    document.getElementById('modalColaboradorLabel').innerText = 'Atualizar Colaborador';
    document.getElementById('idColaborador').value = empregado.idEmpregado;
    document.getElementById('nomeColaborador').value = empregado.nomeEmpregado;
    document.getElementById('emailColaborador').value = empregado.emailEmpregado;
    document.getElementById('matriculaColaborador').value = empregado.matriculaEmpregado;
    document.getElementById('departamentoColaborador').value = empregado.setor.setorId;
    const modal = new bootstrap.Modal(document.getElementById('modalColaborador'));
    modal.show();
}

async function excluirEmpregado(id) {
    const response = await fetch(`${apiUrlEmpregado}/delete/${id}`, {
        method: 'DELETE'
    });
    
    const message = await response.text();
    document.getElementById('mensagemFeedback').innerText = message;
    document.getElementById('mensagemFeedback').style.display = 'block';
    carregarEmpregados();
}
