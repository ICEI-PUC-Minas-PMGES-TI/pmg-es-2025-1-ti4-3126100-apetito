document.addEventListener('DOMContentLoaded', function() {
    const mesaItems = document.querySelectorAll('.mesa-item');
    const modal = document.getElementById('reservaModal');
    const closeBtn = document.querySelector('.close-btn');
    const numeroMesaElement = document.getElementById('numeroMesa');
    const statusMesaElement = document.getElementById('statusMesa');
    const btnReservar = document.getElementById('btnReservar');
    const btnEstouAqui = document.getElementById('btnEstouAqui');
    const dataReservaInput = document.getElementById('dataReserva');
    const horaReservaInput = document.getElementById('horaReserva');
    const secaoMesas = document.getElementById('secaoMesas');
    const listaEspera = document.getElementById('listaEspera');
    const posicaoEspera = document.getElementById('posicaoEspera');
    const numeroPosicao = document.getElementById('numeroPosicao');
    const btnVoltarMesas = document.getElementById('btnVoltarMesas');
    
    let mesaAtual = null;
    
    function verificarMesasOcupadas() {
        const mesasDisponiveis = document.querySelectorAll('.mesa-item:not(.ocupada)');
        return mesasDisponiveis.length === 0;
    }
    
    function mostrarListaEspera() {
        secaoMesas.style.display = 'none';
        listaEspera.style.display = 'block';
        const posicao = Math.floor(Math.random() * 15) + 1;
        posicaoEspera.textContent = posicao;
        numeroPosicao.textContent = posicao;
    }
    
    function voltarParaMesas() {
        secaoMesas.style.display = 'block';
        listaEspera.style.display = 'none';
    }
    
    btnVoltarMesas.addEventListener('click', voltarParaMesas);
    
    if(verificarMesasOcupadas()) {
        mostrarListaEspera();
    }
    
    mesaItems.forEach(item => {
        item.addEventListener('click', function() {
            mesaItems.forEach(i => i.classList.remove('selected'));
            
            const estaOcupada = this.classList.contains('ocupada');
            
            if(estaOcupada) {
                alert('Esta mesa está ocupada. Por favor, selecione outra mesa.');
                return;
            }
            
            this.classList.add('selected');
            const mesaSelecionada = this.getAttribute('data-mesa');
            numeroMesaElement.textContent = mesaSelecionada;
            statusMesaElement.textContent = 'Disponível';
            mesaAtual = this;
            modal.style.display = 'block';
        });
    });
    
    btnEstouAqui.addEventListener('click', function() {
        if(!mesaAtual) return;
        mesaAtual.classList.add('ocupada');
        mesaAtual.setAttribute('data-status', 'ocupada');
        alert(`Mesa ${numeroMesaElement.textContent} marcada como ocupada. Bom atendimento!`);
        modal.style.display = 'none';
    });
    
    dataReservaInput.addEventListener('input', function(e) {
        let value = this.value.replace(/\D/g, '');
        if(value.length > 2) {
            value = value.substring(0,2) + '/' + value.substring(2);
        }
        if(value.length > 5) {
            value = value.substring(0,5) + '/' + value.substring(5,9);
        }
        this.value = value;
    });
    
    horaReservaInput.addEventListener('input', function(e) {
        let value = this.value.replace(/\D/g, '');
        if(value.length > 2) {
            value = value.substring(0,2) + ':' + value.substring(2,4);
        }
        this.value = value;
    });
    
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', function(event) {
        if(event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    btnReservar.addEventListener('click', function() {
        const data = dataReservaInput.value;
        const hora = horaReservaInput.value;
        
        if(!data || !hora) {
            alert('Por favor, preencha a data e horário da reserva.');
            return;
        }
        
        if(data.length < 10) {
            alert('Por favor, insira uma data válida no formato dd/mm/aaaa');
            return;
        }
        
        if(hora.length < 5) {
            alert('Por favor, insira um horário válido no formato hh:mm');
            return;
        }
        
        alert(`Reserva para a mesa ${numeroMesaElement.textContent} confirmada para ${data} às ${hora}`);
        modal.style.display = 'none';
    });
});