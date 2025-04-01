// Variável global para armazenar a última reserva
let ultimaReserva = null;

document.getElementById('reservaForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const mesaSelect = document.getElementById('mesaSelect').value;
    const mesaIdInput = document.getElementById('mesaId').value;
    const dataHora = document.getElementById('dataHora').value;

    // Usa o valor do select ou do input (select tem prioridade)
    const mesaId = mesaSelect || mesaIdInput;

    if (!mesaId || mesaId < 1 || mesaId > 5) {
        alert('Por favor, selecione ou digite um ID de mesa válido (1 a 5)');
        return;
    }

    if (!dataHora) {
        alert('Por favor, selecione uma data e hora para a reserva');
        return;
    }

    const reservaData = {
        mesaId: parseInt(mesaId),
        dataHoraReservada: dataHora
    };

    fetch('http://localhost:8080/api/reservas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservaData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao reservar mesa');
        }
        return response.json();
    })
    .then(data => {
        // Armazena a última reserva
        ultimaReserva = {
            mesa: mesaId,
            dataHora: dataHora
        };
        
        // Exibe a confirmação e a última reserva
        alert(`Mesa ${mesaId} reservada com sucesso para ${formatarData(dataHora)}`);
        exibirUltimaReserva();
        document.getElementById('reservaForm').reset();
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao reservar mesa: ' + error.message);
    });
});

// Função para formatar a data para exibição
function formatarData(dataISO) {
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR') + ' às ' + data.toLocaleTimeString('pt-BR');
}

// Função para exibir a última reserva na tela
function exibirUltimaReserva() {
    const divUltimaReserva = document.getElementById('ultimaReserva') || criarDivUltimaReserva();
    
    if (ultimaReserva) {
        divUltimaReserva.innerHTML = `
            <h3>Última Reserva:</h3>
            <p>Mesa: ${ultimaReserva.mesa}</p>
            <p>Data/Hora: ${formatarData(ultimaReserva.dataHora)}</p>
        `;
    } else {
        divUltimaReserva.innerHTML = '<p>Nenhuma reserva realizada ainda.</p>';
    }
}

// Função para criar a div de exibição se não existir
function criarDivUltimaReserva() {
    const div = document.createElement('div');
    div.id = 'ultimaReserva';
    div.style.margin = '20px 0';
    div.style.padding = '15px';
    div.style.border = '1px solid #ccc';
    div.style.borderRadius = '5px';
    document.body.appendChild(div);
    return div;
}

// Exibe a última reserva ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    exibirUltimaReserva();
});