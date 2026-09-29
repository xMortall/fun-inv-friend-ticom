const STORAGE_KEY = 'amigoSecretoState';

let state = {
    participants: [], // todos os participantes cadastrados
    turnOrder: [],     // ordem em que cada um gira
    pool: [],          // nomes que ainda podem sair no sorteio
    turnIndex: 0,       // quem esta girando agora (indice em turnOrder)
    currentDraw: null   // nome que saiu nessa rodada, ainda nao confirmado
};

// Telas
const telaCadastro = document.getElementById('tela-cadastro');
const telaSorteio = document.getElementById('tela-sorteio');
const telaPassar = document.getElementById('tela-passar');
const telaFim = document.getElementById('tela-fim');

// Cadastro
const inputNome = document.getElementById('input-nome');
const btnAdicionar = document.getElementById('btn-adicionar');
const listaParticipantes = document.getElementById('lista-participantes');
const avisoCadastro = document.getElementById('aviso-cadastro');
const btnIniciar = document.getElementById('btn-iniciar');

// Sorteio
const progresso = document.getElementById('progresso');
const nomeAtual = document.getElementById('nome-atual');
const btnGirar = document.getElementById('btn-girar');
const resultado = document.getElementById('resultado');
const pessoa = document.getElementById('pessoa');
const avisoProprioNome = document.getElementById('aviso-proprio-nome');
const btnRedo = document.getElementById('btn-redo');
const btnConfirmar = document.getElementById('btn-confirmar');

// Passar / Fim
const btnPronto = document.getElementById('btn-pronto');
const btnReiniciar = document.getElementById('btn-reiniciar');

function mostrarTela(tela) {
    [telaCadastro, telaSorteio, telaPassar, telaFim].forEach(t => t.classList.add('oculto'));
    tela.classList.remove('oculto');
}

function salvar() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function embaralhar(lista) {
    const copia = [...lista];
    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
}

// ---- Cadastro de participantes ----

function renderParticipantes() {
    listaParticipantes.innerHTML = '';
    state.participants.forEach(nome => {
        const li = document.createElement('li');

        const span = document.createElement('span');
        span.textContent = nome;

        const btnRemover = document.createElement('button');
        btnRemover.textContent = 'x';
        btnRemover.addEventListener('click', () => removerParticipante(nome));

        li.appendChild(span);
        li.appendChild(btnRemover);
        listaParticipantes.appendChild(li);
    });

    btnIniciar.disabled = state.participants.length < 3;
}

function adicionarParticipante() {
    const nome = inputNome.value.trim();
    avisoCadastro.textContent = '';

    if (!nome) {
        return;
    }

    const jaExiste = state.participants.some(p => p.toLowerCase() === nome.toLowerCase());
    if (jaExiste) {
        avisoCadastro.textContent = 'Esse nome já foi adicionado.';
        return;
    }

    state.participants.push(nome);
    inputNome.value = '';
    salvar();
    renderParticipantes();
    inputNome.focus();
}

function removerParticipante(nome) {
    state.participants = state.participants.filter(p => p !== nome);
    salvar();
    renderParticipantes();
}

// ---- Sorteio ----

function iniciarSorteio() {
    if (state.participants.length < 3) {
        return;
    }

    state.turnOrder = embaralhar(state.participants);
    state.pool = embaralhar(state.participants);
    state.turnIndex = 0;
    state.currentDraw = null;

    salvar();
    mostrarTela(telaSorteio);
    renderVez();
}

function renderVez() {
    if (state.turnIndex >= state.turnOrder.length) {
        mostrarTela(telaFim);
        localStorage.removeItem(STORAGE_KEY);
        return;
    }

    state.currentDraw = null;
    resultado.classList.add('oculto');
    avisoProprioNome.classList.add('oculto');
    btnGirar.disabled = false;

    const atual = state.turnOrder[state.turnIndex];
    nomeAtual.textContent = atual;
    progresso.textContent = `${state.turnIndex + 1} de ${state.turnOrder.length}`;

    mostrarTela(telaSorteio);
    salvar();
}

function girar() {
    const atual = state.turnOrder[state.turnIndex];

    if (state.pool.length === 0) {
        return;
    }

    // Situação sem saída: só sobrou o próprio nome da última pessoa.
    // Reinicia o sorteio inteiro para desfazer esse impasse.
    if (state.pool.length === 1 && state.pool[0] === atual) {
        alert('Só sobrou o seu próprio nome e não tem como continuar. O sorteio será reiniciado.');
        iniciarSorteio();
        return;
    }

    const indiceSorteado = Math.floor(Math.random() * state.pool.length);
    state.currentDraw = state.pool[indiceSorteado];

    pessoa.textContent = state.currentDraw;
    resultado.classList.remove('oculto');
    btnGirar.disabled = true;

    const saiuOProprioNome = state.currentDraw === atual;
    avisoProprioNome.classList.toggle('oculto', !saiuOProprioNome);
    btnConfirmar.disabled = saiuOProprioNome;

    salvar();
}

function sortearNovamente() {
    btnGirar.disabled = false;
    girar();
}

function confirmarSorteio() {
    const atual = state.turnOrder[state.turnIndex];

    if (!state.currentDraw || state.currentDraw === atual) {
        return;
    }

    state.pool = state.pool.filter(nome => nome !== state.currentDraw);
    state.turnIndex += 1;
    state.currentDraw = null;

    salvar();
    mostrarTela(telaPassar);
}

function reiniciarTudo() {
    state = {
        participants: [],
        turnOrder: [],
        pool: [],
        turnIndex: 0,
        currentDraw: null
    };
    localStorage.removeItem(STORAGE_KEY);
    renderParticipantes();
    mostrarTela(telaCadastro);
}

// ---- Eventos ----

btnAdicionar.addEventListener('click', adicionarParticipante);
inputNome.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        adicionarParticipante();
    }
});

btnIniciar.addEventListener('click', iniciarSorteio);
btnGirar.addEventListener('click', girar);
btnRedo.addEventListener('click', sortearNovamente);
btnConfirmar.addEventListener('click', confirmarSorteio);
btnPronto.addEventListener('click', renderVez);
btnReiniciar.addEventListener('click', reiniciarTudo);

// ---- Recupera estado salvo (ex.: recarregou a página no meio do sorteio) ----

(function carregarEstado() {
    const salvo = localStorage.getItem(STORAGE_KEY);
    if (!salvo) {
        mostrarTela(telaCadastro);
        return;
    }

    try {
        state = JSON.parse(salvo);
    } catch (e) {
        mostrarTela(telaCadastro);
        return;
    }

    renderParticipantes();

    if (state.turnOrder.length > 0) {
        renderVez();
    } else {
        mostrarTela(telaCadastro);
    }
})();
