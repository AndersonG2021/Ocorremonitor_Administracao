async function lerTodosSetores() {
    const uri = 'http://localhost:8080/setor/all';
    const req = await fetch(uri);
    if (!req.ok) throw new Error(`Erro HTTP! status: ${req.status}`);
    return req.json();
}

async function lerTodasFalhas() {
    const uri = 'http://localhost:8080/falhas/all';
    const req = await fetch(uri);
    if (!req.ok) throw new Error(`Erro HTTP! status: ${req.status}`);
    return req.json();
}

async function carregarDados() {
    try {
        const [setores, falhas] = await Promise.all([lerTodosSetores(), lerTodasFalhas()]);
        preencherTabelaHistorico(falhas);
        preencherSelect(setores);
    } catch (error) {
        console.error("Erro ao carregar dados:", error);
    }
}

function preencherTabelaHistorico(falhas) {
    const contadorFalhas = {};

    falhas.forEach(falha => {
        const tipo = falha.tipoFalha;
        contadorFalhas[tipo] = (contadorFalhas[tipo] || 0) + 1;
    });

    const corpoTabela = document.getElementById('corpoTabelaHistorico');
    corpoTabela.innerHTML = '';

    for (const tipo in contadorFalhas) {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${tipo}</td><td>${contadorFalhas[tipo]}</td>`;
        corpoTabela.appendChild(row);
    }
}

function preencherSelect(setores) {
    const select = document.getElementById('selectDepartamento');
    select.innerHTML = '<option value="0">Todos</option>';

    setores.forEach(setor => {
        const option = document.createElement('option');
        option.value = setor.setorId;
        option.textContent = setor.setorNome;
        select.appendChild(option);
    });
}

document.getElementById('botaoAplicarFiltro').addEventListener('click', async () => {
    const setorSelecionado = document.getElementById('selectDepartamento').value;
    const dataSelecionada = document.getElementById('inputDataFiltro').value;

    try {
        const falhas = await lerTodasFalhas();
        const falhasFiltradas = filtrarFalhas(falhas, setorSelecionado, dataSelecionada);
        preencherTabelaFiltrada(falhasFiltradas);
    } catch (error) {
        console.error("Erro ao filtrar falhas:", error);
    }
});

function filtrarFalhas(falhas, setorSelecionado, dataSelecionada) {
    return falhas.filter(falha => {
        const pertenceAoSetor = setorSelecionado == 0 || falha.setor.setorId == setorSelecionado;
        const noDiaSelecionado = !dataSelecionada || falha.dataOcorrido === dataSelecionada;

        return pertenceAoSetor && noDiaSelecionado;
    });
}

function preencherTabelaFiltrada(falhas) {
    const corpoTabelaFiltrada = document.getElementById('corpoTabelaFiltrada');
    corpoTabelaFiltrada.innerHTML = '';

    const contadorFalhas = {};

    falhas.forEach(falha => {
        const tipo = falha.tipoFalha;
        contadorFalhas[tipo] = (contadorFalhas[tipo] || 0) + 1;
    });

    for (const tipo in contadorFalhas) {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${tipo}</td><td>${contadorFalhas[tipo]}</td>`;
        corpoTabelaFiltrada.appendChild(row);
    }
}

// Carregar dados ao iniciar a página
carregarDados();
