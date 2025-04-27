let pedidoId = null;

async function criarPedido() {
const tipoPedido = document.getElementById("tipoPedido").value; // Pega o tipo de pedido (mesa ou online)
const mesaId = document.getElementById("mesaSelect").value; // Pegue o valor do select
const nomeCliente = document.getElementById("nomeCliente").value;
const enderecoCliente = document.getElementById("enderecoCliente").value;

// Verifique se o tipoPedido está vazio
if (!tipoPedido) {
    alert("Por favor, selecione um tipo de pedido.");
    return;
}

// Verifique se o mesaId está vazio (somente para tipo "mesa")
if (tipoPedido === 'mesa' && (!mesaId || mesaId === "null")) {
    alert("Por favor, selecione uma mesa válida.");
    return;
}

const pedidoData = {
    tipoPedido: tipoPedido,
    mesaId: mesaId,
    nomeCliente: nomeCliente,
    enderecoCliente: enderecoCliente
};

try {
    const response = await fetch('http://localhost:8080/api/pedidos', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(pedidoData)
    });

    if (response.ok) {
        const pedido = await response.json();
        pedidoId = pedido.id;
        alert("Pedido criado com sucesso!");
    } else {
        alert("Erro ao criar o pedido.");
    }
} catch (error) {
    console.error("Erro na requisição:", error);
}
}


async function carregarCardapio() {
    const response = await fetch('http://localhost:8080/api/cardapio');
    const itens = await response.json();
    const cardapioDiv = document.getElementById('cardapio');
    cardapioDiv.innerHTML = '';
    itens.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item-cardapio';
        itemDiv.innerHTML = ` 
            <strong>${item.nome}</strong> - R$${item.preco.toFixed(2)}<br>
            <em>${item.descricao}</em><br>
            <input type="number" id="qtd-${item.id}" value="1" min="1" style="width: 50px;">
            <button onclick="adicionarItem(${item.id})">Adicionar</button>
        `;
        cardapioDiv.appendChild(itemDiv);
    });
}

async function carregarCarrinho() {
    if (!pedidoId) return;
    const response = await fetch(`http://localhost:8080/api/pedidos/${pedidoId}`);
    if (!response.ok) return;
    const pedido = await response.json();
    const carrinhoDiv = document.getElementById('carrinho');
    carrinhoDiv.innerHTML = '';

    if (!pedido.itens || pedido.itens.length === 0) {
        carrinhoDiv.innerHTML = "<p>Carrinho vazio</p>";
        return;
    }

    pedido.itens.forEach(itemPedido => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item-carrinho';
        itemDiv.innerHTML = ` 
            <strong>${itemPedido.itemCardapio.nome}</strong> - Qtd: ${itemPedido.quantidade}<br>
            <button onclick="removerItem(${itemPedido.id})">Remover</button>
        `;
        carrinhoDiv.appendChild(itemDiv);
    });

    // Atualiza o total do carrinho
    await atualizarTotal();
}

async function atualizarTotal() {
    if (!pedidoId) return;
    const response = await fetch(`http://localhost:8080/api/pedidos/${pedidoId}/total`);
    if (response.ok) {
        const total = await response.json();
        document.getElementById('totalCarrinho').innerText = `Total: R$ ${total.toFixed(2)}`;
    }
}

async function adicionarItem(itemCardapioId) {
    if (!pedidoId) {
        alert('Crie um pedido primeiro!');
        return;
    }

    const quantidade = document.getElementById(`qtd-${itemCardapioId}`).value;
    const response = await fetch(`http://localhost:8080/api/pedidos/${pedidoId}/itens/${itemCardapioId}?quantidade=${quantidade}`, {
        method: 'POST'
    });

    if (response.ok) {
        await carregarCarrinho();
    } else {
        alert('Erro ao adicionar item.');
    }
}

async function removerItem(itemPedidoId) {
    if (!pedidoId) {
        alert('Crie um pedido primeiro!');
        return;
    }

    const response = await fetch(`http://localhost:8080/api/pedidos/${pedidoId}/itens/${itemPedidoId}`, { method: 'DELETE' });

    if (response.ok) {
        await carregarCarrinho();
    } else {
        alert('Erro ao remover item.');
    }
}

async function finalizarPedido() {
    if (!pedidoId) {
        alert('Crie um pedido primeiro!');
        return;
    }

    const response = await fetch(`http://localhost:8080/api/pedidos/${pedidoId}/finalizar`, { method: 'PUT' });

    if (response.ok) {
        abrirModalAvaliacao();
    } else {
        alert('Erro ao finalizar pedido.');
    }
}

function abrirModalAvaliacao() {
    document.getElementById('modalAvaliacao').style.display = 'block';
    criarEstrelas('ambiente');
    criarEstrelas('comida');
    criarEstrelas('atendimento');
}

function criarEstrelas(id) {
    const container = document.getElementById(id);
    container.innerHTML = ''; // limpa se já tiver
    for (let i = 1; i <= 5; i++) {
        const estrela = document.createElement('span');
        estrela.innerHTML = '☆';
        estrela.style.fontSize = '24px';
        estrela.style.cursor = 'pointer';
        estrela.dataset.value = i;
        estrela.onclick = function () {
            selecionarEstrelas(id, i);
        };
        container.appendChild(estrela);
    }
}

function selecionarEstrelas(id, valor) {
    const estrelas = document.querySelectorAll(`#${id} span`);
    estrelas.forEach((estrela, index) => {
        estrela.innerHTML = index < valor ? '★' : '☆';
    });
    // Salva nota no próprio container
    document.getElementById(id).dataset.nota = valor;
}

function enviarAvaliacao() {
    const notaAmbiente = document.getElementById('ambiente').dataset.nota || 0;
    const notaComida = document.getElementById('comida').dataset.nota || 0;
    const notaAtendimento = document.getElementById('atendimento').dataset.nota || 0;
    const comentario = document.getElementById('comentario').value;

    const avaliacao = {
        ambiente: notaAmbiente,
        comida: notaComida,
        atendimento: notaAtendimento,
        comentario: comentario,
        data: new Date().toISOString()
    };

    localStorage.setItem(`avaliacao_${pedidoId}`, JSON.stringify(avaliacao));
    alert('Obrigado pela sua avaliação!');
    document.getElementById('modalAvaliacao').style.display = 'none';
}

function atualizarTipoPedido() {
    const tipoPedido = document.getElementById("tipoPedido").value;
    const mesaSelecionada = document.getElementById("mesaSelecionada");
    const dadosCliente = document.getElementById("dadosCliente");

    if (tipoPedido === 'mesa') {
        mesaSelecionada.style.display = 'block';
        dadosCliente.style.display = 'none';
        carregarMesas();  // Atualiza as opções de mesas
    } else {
        mesaSelecionada.style.display = 'none';
        dadosCliente.style.display = 'block';
    }
}

async function carregarMesas() {
    const response = await fetch('http://localhost:8080/mesas');
    const mesas = await response.json();
    const mesaSelect = document.getElementById("mesaSelect");
    mesaSelect.innerHTML = `<option value="null">Selecione uma mesa</option>`;
    mesas.forEach(mesa => {
        const option = document.createElement('option');
        option.value = mesa.id;
        option.textContent = `Mesa ${mesa.id}`;
        mesaSelect.appendChild(option);
    });
}

// Chama a função para carregar o cardápio ao iniciar a página
carregarCardapio();