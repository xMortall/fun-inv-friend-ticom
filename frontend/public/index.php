<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Amigo invisivel</title>

    <link rel="stylesheet" href="css/geral.css">
</head>
<body>
    <div class="title">
        Amigo secreto
    </div>

    <!-- Tela 1: cadastro dos participantes -->
    <div class="tela" id="tela-cadastro">
        <div class="cadastro">
            <div class="campo-adicionar">
                <input type="text" id="input-nome" placeholder="Digite um nome" maxlength="40">
                <button id="btn-adicionar">Adicionar</button>
            </div>

            <ul id="lista-participantes"></ul>

            <p id="aviso-cadastro" class="aviso"></p>

            <button id="btn-iniciar" disabled>Iniciar sorteio</button>
        </div>
    </div>

    <!-- Tela 2: sorteio, uma pessoa por vez -->
    <div class="tela oculto" id="tela-sorteio">
        <div class="sorteio">
            <p class="progresso" id="progresso"></p>
            <p class="vez">Vez de <span id="nome-atual"></span> girar</p>

            <button id="btn-girar">Girar</button>

            <div class="resultado oculto" id="resultado">
                <a>Pessoa... <span id="pessoa"></span></a>
                <p id="aviso-proprio-nome" class="aviso oculto">Saiu o seu próprio nome! Gire novamente.</p>

                <div class="acoes">
                    <button id="btn-redo">Girar novamente</button>
                    <button id="btn-confirmar">Confirmar e passar</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Tela intermediaria: passar o dispositivo para a proxima pessoa -->
    <div class="tela oculto" id="tela-passar">
        <div class="sorteio">
            <p>Resultado guardado em segredo :)</p>
            <p>Passe o dispositivo para a próxima pessoa.</p>
            <button id="btn-pronto">Estou pronto(a)</button>
        </div>
    </div>

    <!-- Tela final -->
    <div class="tela oculto" id="tela-fim">
        <div class="sorteio">
            <p>Sorteio finalizado! 🎉</p>
            <button id="btn-reiniciar">Novo sorteio</button>
        </div>
    </div>

    <script src="js/main.js"></script>
</body>
</html>
