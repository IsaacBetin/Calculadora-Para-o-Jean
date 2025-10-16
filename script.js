// Seleciona o elemento de exibição (display) e todos os botões
const display = document.getElementById('display');
const buttons = document.querySelectorAll('.box-buttons button');

// Flag para saber se um resultado acabou de ser calculado
let lastActionWasEquals = false;

// Função principal que trata o clique em qualquer botão
function handleButtonClick(buttonValue) {
    // Ação de Limpar 'C'
    if (buttonValue === 'C') {
        display.value = '';
        lastActionWasEquals = false;
        return;
    }

    // Ação de Apagar '<' (Backspace)
    if (buttonValue === '<') {
        // Apaga o último caractere, se o display não estiver vazio ou em 'Erro'
        if (display.value.trim() !== '' && display.value !== 'Erro') {
            display.value = display.value.slice(0, -1);
        }
        lastActionWasEquals = false;
        return;
    }

    // Ação de Resultado '='
    if (buttonValue === '=') {
        try {
            // Verifica se o display não está vazio antes de calcular
            if (display.value.trim() !== '' && display.value !== 'Erro') {
                // Usa a função eval() para calcular a expressão.
                let result = eval(display.value);
                // Arredonda resultados com muitas casas decimais
                display.value = Number(result.toFixed(10));
                lastActionWasEquals = true;
            }
        } catch (error) {
            // Exibe 'Erro' se a expressão for inválida
            display.value = 'Erro';
            lastActionWasEquals = true;
        }
        return;
    }

    // Lógica para números e operadores
    
    // Lista dos operadores matemáticos e ponto decimal
    const isOperatorOrDecimal = ['/', '*', '-', '+', '.'].includes(buttonValue);

    // Se o display está com 'Erro', limpa antes de digitar qualquer coisa nova
    if (display.value === 'Erro') {
        display.value = '';
    }

    // 1. Se o último clique foi '=', e o novo clique é um número/ponto, começa um novo cálculo
    if (lastActionWasEquals && !isOperatorOrDecimal) {
        display.value = buttonValue;
        lastActionWasEquals = false;
    }
    // 2. Se o último clique foi '=', e o novo clique é um operador, continua o cálculo
    else if (lastActionWasEquals && isOperatorOrDecimal) {
        display.value += buttonValue;
        lastActionWasEquals = false;
    }
    // 3. Caso contrário, apenas concatena o valor ao display
    else {
        display.value += buttonValue;
        lastActionWasEquals = false;
    }
}

// Adiciona um listener de evento de clique a cada botão da calculadora
buttons.forEach(button => {
    button.addEventListener('click', () => {
        handleButtonClick(button.textContent);
    });
});

// Suporte a teclas do teclado (melhor usabilidade)
document.addEventListener('keydown', (event) => {
    const key = event.key;
    let buttonValue = '';

    // Mapeamento de teclas para os valores dos botões
    if (/[0-9]|\./.test(key)) {
        buttonValue = key;
    } else if (['+', '-', '*', '/'].includes(key)) {
        buttonValue = key;
    } else if (key === 'Enter') {
        buttonValue = '=';
        event.preventDefault(); // Impede o comportamento padrão do Enter
    } else if (key === 'Backspace') {
        buttonValue = '<';
    } else if (key === 'Delete') {
        buttonValue = 'C';
    }

    if (buttonValue) {
        handleButtonClick(buttonValue);
        
        // (Opcional) Simular o clique visualmente
        const button = Array.from(buttons).find(btn => btn.textContent === buttonValue);
        if (button) {
            button.classList.add('active-key');
            setTimeout(() => button.classList.remove('active-key'), 100);
        }
    }
});

/* Se for usar a simulação visual, adicione este CSS no seu style.css:
.active-key {
    transform: scale(0.95);
    opacity: 0.8;
}
*/