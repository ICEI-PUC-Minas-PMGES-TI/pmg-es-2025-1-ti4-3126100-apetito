document.addEventListener('DOMContentLoaded', function() {
    const baseUrl = 'http://localhost:8080'; // Altere se necessário
    const mesasContainer = document.getElementById('mesasContainer');
    const listaEsperaModal = document.getElementById('listaEsperaModal');
    const fecharModalBtn = document.getElementById('fecharModalBtn');
    
    async function carregarMesas() {
        try {
            const response = await fetch(`${baseUrl}/api/mesas`, {
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const mesas = await response.json();
            
            // Limpa o container antes de adicionar novas mesas
            mesasContainer.innerHTML = '';
            
            // Verifica se todas as mesas estão ocupadas
            const todasOcupadas = mesas.every(mesa => mesa.status.toLowerCase() === 'ocupada');
            
            if (todasOcupadas) {
                listaEsperaModal.style.display = 'flex';
            }
            
            // Cria os cards estilizados para cada mesa
            mesas.forEach(mesa => {
                const status = mesa.status.toLowerCase();
                const mesaCard = document.createElement('div');
                mesaCard.className = `mesa mesa-${status === 'disponível' ? 'disponivel' : status === 'reservada' ? 'reservada' : 'ocupada'}`;
                
                // Determina o texto e botões com base no status
                let statusText, btnHtml;
                
                switch(status) {
                    case 'disponível':
                        statusText = 'Disponível';
                        btnHtml = `<button class="btn-acao btn-ocupar" data-id="${mesa.id}">Ocupar Mesa</button>`;
                        break;
                    case 'ocupada':
                        statusText = 'Ocupada';
                        btnHtml = `<button class="btn-acao btn-liberar" data-id="${mesa.id}">Liberar Mesa</button>`;
                        break;
                    case 'reservada':
                        statusText = 'Reservada';
                        btnHtml = `
                            <button class="btn-acao btn-ocupar" data-id="${mesa.id}">Ocupar</button>
                            <button class="btn-acao btn-liberar" data-id="${mesa.id}">Cancelar</button>
                        `;
                        break;
                    default:
                        statusText = mesa.status;
                        btnHtml = '';
                }
                
                // HTML do card estilizado
                mesaCard.innerHTML = `
                    <div class="mesa-content">
                        <div class="mesa-numero">Mesa ${mesa.id}</div>
                        <div class="mesa-status status-${status === 'disponível' ? 'disponivel' : status === 'reservada' ? 'reservada' : 'ocupada'}">
                            ${statusText}
                        </div>
                        <div class="mesa-capacidade">
                            <i class="fas fa-users mesa-capacity-icon"></i>
                            Capacidade: ${mesa.capacidade || 4} pessoas
                        </div>
                        <div class="mesa-acoes">${btnHtml}</div>
                    </div>
                `;
                
                mesasContainer.appendChild(mesaCard);
            });
            
            // Adiciona eventos aos botões de ocupar
            document.querySelectorAll('.btn-ocupar').forEach(btn => {
                btn.addEventListener('click', async function() {
                    const mesaId = this.getAttribute('data-id');
                    try {
                        const response = await fetch(`${baseUrl}/api/mesas/${mesaId}/ocupar`, {
                            method: 'POST'
                        });
                        
                        if (response.ok) {
                            carregarMesas();
                        } else {
                            console.error('Erro ao ocupar mesa:', response.statusText);
                        }
                    } catch (error) {
                        console.error('Erro ao ocupar mesa:', error);
                        alert('Erro ao ocupar mesa. Por favor, tente novamente.');
                    }
                });
            });
            
            // Adiciona eventos aos botões de liberar
            document.querySelectorAll('.btn-liberar').forEach(btn => {
                btn.addEventListener('click', async function() {
                    const mesaId = this.getAttribute('data-id');
                    try {
                        const response = await fetch(`${baseUrl}/api/mesas/${mesaId}/liberar`, {
                            method: 'POST'
                        });
                        
                        if (response.ok) {
                            carregarMesas();
                        } else {
                            console.error('Erro ao liberar mesa:', response.statusText);
                        }
                    } catch (error) {
                        console.error('Erro ao liberar mesa:', error);
                        alert('Erro ao liberar mesa. Por favor, tente novamente.');
                    }
                });
            });
            
        } catch (error) {
            console.error('Erro ao carregar mesas:', error);
            mesasContainer.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Erro ao carregar dados das mesas.</p>
                    <button onclick="location.reload()">Recarregar Página</button>
                </div>
            `;
        }
    }
    
    // Fechar modal
    fecharModalBtn.addEventListener('click', function() {
        listaEsperaModal.style.display = 'none';
    });
    
    // Fechar modal ao clicar fora
    window.addEventListener('click', function(event) {
        if (event.target === listaEsperaModal) {
            listaEsperaModal.style.display = 'none';
        }
    });
    
    // Carregar mesas inicialmente
    carregarMesas();
    
    // Atualizar a cada 30 segundos (opcional)
    setInterval(carregarMesas, 30000);
});