const teclasDiv = document.getElementById('teclas');
const bolinhasDiv = document.querySelector('.bolinhas');
const pontuacaoSpan = document.getElementById('pontuacao');
const cronometroSpan = document.getElementById('cronometro');
const palavraCorretaSpan = document.getElementById('palavra-correta');
const pausarButton = document.getElementById('pausar-button');

const palavrasAleatorias = ['abacaxi', 'banana', 'morango', 'laranja', 'uva'];
let senhaCorreta = '';
let senhaAtual = '';
let pontuacao = 0;
let tempoInicial;
let cronometroId;
let pausado = false;

function gerarNovaPalavraCorreta() {
    senhaCorreta = palavrasAleatorias[Math.floor(Math.random() * palavrasAleatorias.length)];
    palavraCorretaSpan.textContent = senhaCorreta;
    senhaAtual = '';
    atualizaBolinhas();
    reiniciarCronometro();
}

gerarNovaPalavraCorreta();

document.addEventListener('keydown', (event) => {
    if (pausado) return;

    const tecla = event.key;

    if (event.key === 'Backspace') {
        event.preventDefault();
        if (senhaAtual.length > 0) {
            senhaAtual = senhaAtual.slice(0, -1); // Remove a última letra da senha atual
            atualizaBolinhas();
        }
    } else if (/^[a-zA-Z]$/.test(tecla)) { // Verifica se a tecla pressionada é uma letra
        if (senhaAtual === '') {
            tempoInicial = Date.now();
        }

        teclasDiv.textContent = tecla.toUpperCase();
        teclasDiv.classList.add('pulsado');

        if (senhaAtual.length < senhaCorreta.length) {
            senhaAtual += tecla.toLowerCase();
            atualizaBolinhas();
            if (senhaAtual[senhaAtual.length - 1] !== senhaCorreta[senhaAtual.length - 1]) {
                pontuacao -= 1; // Desconta 1 ponto por letra errada
                if (pontuacao < 0) {
                    pontuacao = 0;
                }
                pontuacaoSpan.textContent = pontuacao;
            }
        }

        if (senhaAtual.length === senhaCorreta.length && senhaAtual !== senhaCorreta) {
            bolinhasDiv.innerHTML = '';
            senhaAtual = '';
            gerarNovaPalavraCorreta();
        }

        if (senhaAtual === senhaCorreta) {
            senhaAtual = '';
            atualizaBolinhas();
            atualizaPontuacao();
            gerarNovaPalavraCorreta();
        }
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'Backspace' && senhaAtual !== '') {
        event.preventDefault();
        history.back(); // Volta à página anterior
    }

    teclasDiv.classList.remove('pulsado');
});

pausarButton.addEventListener('click', () => {
    if (pausado) {
        pausarButton.textContent = 'Pausar';
        pausarButton.classList.remove('pausado');
        pausado = false;
        reiniciarCronometro();
    } else {
        pausarButton.textContent = 'Retomar';
        pausarButton.classList.add('pausado');
        pausado = true;
        clearInterval(cronometroId);
    }
});

function atualizaBolinhas() {
    bolinhasDiv.innerHTML = '';

    for (let i = 0; i < senhaCorreta.length; i++) {
        const bolinha = document.createElement('div');
        bolinha.classList.add('bolinha');

        if (i < senhaAtual.length) {
            if (senhaAtual[i] === senhaCorreta[i]) {
                bolinha.classList.add('correta');
            } else {
                bolinha.classList.add('incorreta');
            }
        }

        bolinhasDiv.appendChild(bolinha);
    }
}

function atualizaPontuacao() {
    const tempoDecorrido = (Date.now() - tempoInicial) / 1000; // Tempo decorrido em segundos
    const pontuacaoAtual = Math.round((senhaCorreta.length / tempoDecorrido) * 10); // Cálculo da pontuação
    pontuacao += pontuacaoAtual;
    pontuacaoSpan.textContent = pontuacao;
}

function reiniciarCronometro() {
    clearInterval(cronometroId);
    cronometroSpan.textContent = 0;
    cronometroId = setInterval(() => {
        const tempoDecorrido = Math.round((Date.now() - tempoInicial) / 1000); // Tempo decorrido em segundos
        cronometroSpan.textContent = tempoDecorrido;
    }, 1000);
}