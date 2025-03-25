function adicionarItem(inputId) {
    const input = document.getElementById(inputId);
    let quantidade = parseInt(input.value);
    if (!isNaN(quantidade)) {
        input.value = quantidade + 1;
    }
}

const precos = {
    item1: 8.00,
    item2: 44.50,
    item3: 39.90,
    item4: 45.00,
    item5: 35.80,
    item6: 12.40
};

let numeroComanda;
document.addEventListener("DOMContentLoaded", () => {
    numeroComanda = gerarNumeroComanda();
    mostrarNumeroComanda();
});

function gerarNumeroComanda() {
    return Math.floor(1000 + Math.random() * 9000);
}

function mostrarNumeroComanda() {
    document.getElementById('numero-comanda').textContent = numeroComanda;
}

function gerarComanda() {
    const items = [
        { nome: 'Pão de Queijo', id: 'item1' },
        { nome: 'Tutu à Mineira', id: 'item2' },
        { nome: 'Feijão Tropeiro', id: 'item3' },
        { nome: 'Ambrosia Mineira', id: 'item4' },
        { nome: 'Frango com Quiabo', id: 'item5' },
        { nome: 'Bolo de Fubá', id: 'item6' }
    ];

    let pedido = `<h2 class='titulo-comanda'>Comanda Nº ${numeroComanda}</h2>
    <table class='tabela-comanda'>
        <thead>
            <tr>
                <th>Item</th>
                <th>Quantidade</th>
                <th>Preço Unitário</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>`;

    let totalGeral = 0;
    let algumItemAdicionado = false;

    items.forEach(item => {
        const quantidade = parseInt(document.getElementById(item.id).value);
        if (quantidade > 0) {
            const precoUnitario = precos[item.id];
            const totalItem = quantidade * precoUnitario;
            totalGeral += totalItem;

            pedido += `<tr>
                            <td>${item.nome}</td>
                            <td>${quantidade}</td>
                            <td>R$ ${precoUnitario.toFixed(2)}</td>
                            <td>R$ ${totalItem.toFixed(2)}</td>
                        </tr>`;

            algumItemAdicionado = true;
        }
    });

    pedido += `</tbody></table><br>
    <h3 class='total-comanda'>Total Geral: R$ ${totalGeral.toFixed(2)}</h3>`;

    if (algumItemAdicionado) {
        const modal = document.createElement('div');
        modal.id = 'modal';
        modal.innerHTML = `
            <div id="modal-content">
                ${pedido}
                <button onclick="fecharComanda()" class="fechar-comanda">Fechar Comanda</button>
            </div>
        `;
        document.body.appendChild(modal);
    } else {
        alert('Você precisa adicionar pelo menos um item ao pedido!');
    }
}

function fecharComanda() {
    const modal = document.getElementById('modal');
    if (modal) {
        document.body.removeChild(modal);
    }
}
