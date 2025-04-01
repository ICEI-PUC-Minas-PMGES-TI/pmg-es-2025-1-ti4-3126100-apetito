// Dados do cardápio
const cardapio = [
    { id: 1, nome: "Hambúrguer", categoria: "comida", preco: 25.90 },
    { id: 2, nome: "Pizza", categoria: "comida", preco: 45.90 },
    { id: 3, nome: "Refrigerante", categoria: "bebida", preco: 8.90 },
    { id: 4, nome: "Suco Natural", categoria: "bebida", preco: 12.90 },
    { id: 5, nome: "Sorvete", categoria: "sobremesa", preco: 15.90 },
    { id: 6, nome: "Brownie", categoria: "sobremesa", preco: 18.90 }
];

// Pedido atual
let pedidoAtual = {
    itens: [],
    precoTotal: 0
};

// Carrega o cardápio quando a página é aberta
document.addEventListener('DOMContentLoaded', function() {
    exibirCardapio(cardapio);
    exibirComanda(); // Exibe a comanda com pedidos feitos ao carregar a página
});

// Função para exibir o cardápio
function exibirCardapio(itens) {
    const cardapioContainer = document.getElementById('cardapio');
    cardapioContainer.innerHTML = '';
    
    itens.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = `item-cardapio categoria-${item.categoria}`;
        itemElement.innerHTML = `
            <h3>${item.nome}</h3>
            <p>R$ ${item.preco.toFixed(2)}</p>
            <div class="contador-quantidade">
                <button onclick="alterarQuantidade(${item.id}, -1)">-</button>
                <input type="number" id="quantidade-${item.id}" value="0" min="0">
                <button onclick="alterarQuantidade(${item.id}, 1)">+</button>
            </div>
            <button onclick="adicionarAoCarrinho(${item.id})">Adicionar</button>
        `;
        cardapioContainer.appendChild(itemElement);
    });
}

// Função para filtrar o cardápio
function filtrarCardapio(categoria) {
    if (categoria === 'todos') {
        exibirCardapio(cardapio);
    } else {
        const itensFiltrados = cardapio.filter(item => item.categoria === categoria);
        exibirCardapio(itensFiltrados);
    }
}

// Função para alterar quantidade
function alterarQuantidade(itemId, mudanca) {
    const inputQuantidade = document.getElementById(`quantidade-${itemId}`);
    let novaQuantidade = parseInt(inputQuantidade.value) + mudanca;
    novaQuantidade = novaQuantidade < 0 ? 0 : novaQuantidade;
    inputQuantidade.value = novaQuantidade;
}

// Função para adicionar item ao carrinho
function adicionarAoCarrinho(itemId) {
    const itemCardapio = cardapio.find(item => item.id === itemId);
    const quantidade = parseInt(document.getElementById(`quantidade-${itemId}`).value);
    
    if (quantidade <= 0) {
        alert("Por favor, selecione uma quantidade válida.");
        return;
    }
    
    // Verifica se o item já está no pedido
    const itemExistente = pedidoAtual.itens.find(item => item.id === itemId);
    
    if (itemExistente) {
        itemExistente.quantidade += quantidade;
    } else {
        pedidoAtual.itens.push({
            id: itemId,
            nome: itemCardapio.nome,
            categoria: itemCardapio.categoria,
            quantidade: quantidade,
            precoUnitario: itemCardapio.preco
        });
    }
    
    // Atualiza o preço total
    pedidoAtual.precoTotal += itemCardapio.preco * quantidade;
    
    // Atualiza a exibição do pedido
    exibirPedidoAtual();
    
    // Reseta a quantidade no cardápio
    document.getElementById(`quantidade-${itemId}`).value = 0;
}

// Função para exibir o pedido atual
function exibirPedidoAtual() {
    const pedidoContainer = document.getElementById('pedidoAtual');
    
    if (pedidoAtual.itens.length === 0) {
        pedidoContainer.innerHTML = "<p>Nenhum item adicionado ainda.</p>";
        return;
    }
    
    let html = "<h3>Itens do Pedido:</h3><ul>";
    
    pedidoAtual.itens.forEach(item => {
        html += `
            <li>
                ${item.nome} - 
                ${item.quantidade}x R$ ${item.precoUnitario.toFixed(2)} = 
                R$ ${(item.quantidade * item.precoUnitario).toFixed(2)}
                <button onclick="removerItem(${item.id})" style="margin-left: 10px;">Remover</button>
            </li>
        `;
    });
    
    html += `</ul><p><strong>Total: R$ ${pedidoAtual.precoTotal.toFixed(2)}</strong></p>`;
    pedidoContainer.innerHTML = html;
}

// Função para remover item do pedido
function removerItem(itemId) {
    const itemIndex = pedidoAtual.itens.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
        const item = pedidoAtual.itens[itemIndex];
        pedidoAtual.precoTotal -= item.quantidade * item.precoUnitario;
        pedidoAtual.itens.splice(itemIndex, 1);
        exibirPedidoAtual();
    }
}

// Função para finalizar o pedido
function finalizarPedido() {
    const pedido = {
        precoTotal: pedidoAtual.precoTotal,
        itens: pedidoAtual.itens.map(item => ({
            nome: item.nome,
            quantidade: item.quantidade,
            precoUnitario: item.precoUnitario
        }))
    };

    // Enviar o pedido para o backend (ajustar URL conforme necessário)
    fetch('http://localhost:8080/api/pedidos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(pedido)
    })
    .then(response => response.json())
    .then(data => {
        // Salvar no localStorage
        salvarPedidoNoLocalStorage(pedido);
        alert('Pedido realizado com sucesso!');
        console.log(data);
    })
    .catch(error => {
        alert('Erro ao realizar o pedido');
        console.error(error);
    });
}

// Função para salvar pedido no localStorage
function salvarPedidoNoLocalStorage(pedido) {
    // Obter pedidos anteriores ou iniciar um array vazio
    let pedidosAnteriores = JSON.parse(localStorage.getItem('pedidos')) || [];
    pedidosAnteriores.push(pedido);
    localStorage.setItem('pedidos', JSON.stringify(pedidosAnteriores));
    exibirComanda(); // Atualiza a comanda na tela
}

// Função para exibir a comanda com pedidos feitos
function exibirComanda() {
    const comandaContainer = document.getElementById('pedidosLocalStorage');
    let pedidosAnteriores = JSON.parse(localStorage.getItem('pedidos')) || [];

    if (pedidosAnteriores.length === 0) {
        comandaContainer.innerHTML = "<p>Nenhum pedido realizado ainda.</p>";
        return;
    }

    let html = "<h3>Comanda - Pedidos Realizados:</h3><ul>";
    
    pedidosAnteriores.forEach((pedido, index) => {
        html += `
            <li>
                <strong>Pedido #${index + 1}</strong><br>
                Itens:<br>
                <ul>
                    ${pedido.itens.map(item => `
                        <li>${item.nome} - ${item.quantidade}x R$ ${item.precoUnitario.toFixed(2)}</li>
                    `).join('')}
                </ul>
                <strong>Total: R$ ${pedido.precoTotal.toFixed(2)}</strong>
            </li>
        `;
    });

    html += `</ul>`;
    comandaContainer.innerHTML = html;
}

// Adicione esta função ao seu arquivo JavaScript
function simularPagamento() {
    // Obter pedidos do localStorage
    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    
    if (pedidos.length === 0) {
        alert('Não há pedidos para pagar!');
        return;
    }
    
    // Calcular valor total de todos os pedidos
    const valorTotal = pedidos.reduce((total, pedido) => total + pedido.precoTotal, 0);
    
    // Criar modal de pagamento
    const modalHTML = `
        <div id="modalPagamento" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        ">
            <div style="
                background: white;
                padding: 20px;
                border-radius: 10px;
                width: 80%;
                max-width: 500px;
            ">
                <h2>Finalizar Pagamento</h2>
                <p><strong>Valor Total:</strong> R$ ${valorTotal.toFixed(2)}</p>
                
                <h3>Métodos de Pagamento:</h3>
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin: 10px 0;">
                        <input type="radio" name="metodoPagamento" value="cartao" checked> Cartão de Crédito/Débito
                    </label>
                    <label style="display: block; margin: 10px 0;">
                        <input type="radio" name="metodoPagamento" value="pix"> PIX
                    </label>
                    <label style="display: block; margin: 10px 0;">
                        <input type="radio" name="metodoPagamento" value="dinheiro"> Dinheiro
                    </label>
                </div>
                
                <button onclick="confirmarPagamento()" style="
                    padding: 10px 20px;
                    background-color: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                ">
                    Confirmar Pagamento
                </button>
                
                <button onclick="fecharModal()" style="
                    padding: 10px 20px;
                    background-color: #f44336;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    margin-left: 10px;
                ">
                    Cancelar
                </button>
            </div>
        </div>
    `;
    
    // Adicionar modal ao corpo do documento
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Função para confirmar o pagamento (que na verdade limpa o localStorage)
function confirmarPagamento() {
    // Limpar localStorage
    localStorage.removeItem('pedidos');
    
    // Fechar modal
    fecharModal();
    
    // Atualizar exibição
    exibirComanda();
    
    // Mostrar mensagem de sucesso
    alert('Pagamento realizado com sucesso! Obrigado pela preferência.');
}

// Função para fechar o modal
function fecharModal() {
    const modal = document.getElementById('modalPagamento');
    if (modal) {
        modal.remove();
    }
}

// Adicione este botão ao seu HTML, por exemplo antes do </body>
// <button onclick="simularPagamento()" style="padding: 10px 20px; margin-top: 20px;">Pagar Pedidos</button>
