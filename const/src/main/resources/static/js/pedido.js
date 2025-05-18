let pedidoId = null;
let itensCardapio = [];

async function criarPedido() {
  const tipoPedido = document.getElementById("tipoPedido").value;
  const mesaId = document.getElementById("mesaSelect").value;
  const nomeCliente = document.getElementById("nomeCliente").value;
  const enderecoCliente = document.getElementById("enderecoCliente").value;

  if (!tipoPedido) {
    alert("Por favor, selecione um tipo de pedido.");
    return;
  }

  if (tipoPedido === "mesa" && (!mesaId || mesaId === "null")) {
    alert("Por favor, selecione uma mesa válida.");
    return;
  }

  if (tipoPedido === "online" && (!nomeCliente || !enderecoCliente)) {
    alert("Para pedidos online, preencha nome e endereço.");
    return;
  }

  const params = new URLSearchParams();
  params.append("tipoPedido", tipoPedido);

  if (tipoPedido === "mesa") {
    params.append("mesaId", mesaId);
  } else {
    params.append("nomeCliente", nomeCliente);
    params.append("enderecoCliente", enderecoCliente);
  }

  try {
    const response = await fetch(
      `http://localhost:8080/api/pedidos?${params.toString()}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (response.ok) {
      const pedido = await response.json();
      pedidoId = pedido.id;
      alert("Pedido criado com sucesso!");
      await carregarCarrinho();
    } else {
      const error = await response.text();
      alert(`Erro ao criar pedido: ${error}`);
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
    alert("Erro ao conectar com o servidor");
  }
}

async function carregarCardapio() {
  try {
    const response = await fetch("http://localhost:8080/api/cardapio");
    if (!response.ok) throw new Error("Erro ao carregar cardápio");
    itensCardapio = await response.json();
    exibirItensCardapio(itensCardapio);
  } catch (error) {
    console.error("Erro ao carregar cardápio:", error);
    alert("Erro ao carregar cardápio. Tente recarregar a página.");
  }
}

function exibirItensCardapio(itens) {
  const cardapioDiv = document.getElementById("cardapio");
  cardapioDiv.innerHTML = "";

  itens.forEach((item) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "item-cardapio";
    itemDiv.innerHTML = ` 
      <strong>${item.nome}</strong> - R$${item.preco.toFixed(2)}<br>
      <em>${item.descricao}</em><br>
      <input type="number" id="qtd-${item.id}" value="1" min="1" style="width: 50px;">
      <button class="btn-primary" onclick="adicionarItem(${item.id})">Adicionar</button>
    `;
    cardapioDiv.appendChild(itemDiv);
  });
}

function filtrarCardapio() {
  const termo = document.getElementById("filtroCardapio").value.toLowerCase();
  
  if (!termo) {
    exibirItensCardapio(itensCardapio);
    return;
  }

  const itensFiltrados = itensCardapio.filter(item => 
    item.nome.toLowerCase().includes(termo)
  );

  itensFiltrados.sort((a, b) => {
    const aComeca = a.nome.toLowerCase().startsWith(termo);
    const bComeca = b.nome.toLowerCase().startsWith(termo);
    
    if (aComeca && !bComeca) return -1;
    if (!aComeca && bComeca) return 1;
    return 0;
  });

  exibirItensCardapio(itensFiltrados);
}

async function carregarCarrinho() {
  if (!pedidoId) {
    document.getElementById("carrinho").innerHTML = "<p>Carrinho vazio</p>";
    document.getElementById("totalCarrinho").innerText = "Total: R$ 0.00";
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:8080/api/pedidos/${pedidoId}`
    );
    if (!response.ok) throw new Error("Erro ao carregar carrinho");

    const pedido = await response.json();
    const carrinhoDiv = document.getElementById("carrinho");
    carrinhoDiv.innerHTML = "";

    if (!pedido.itens || pedido.itens.length === 0) {
      carrinhoDiv.innerHTML = "<p>Carrinho vazio</p>";
      document.getElementById("totalCarrinho").innerText = "Total: R$ 0.00";
      return;
    }

    pedido.itens.forEach((itemPedido) => {
      const itemDiv = document.createElement("div");
      itemDiv.className = "item-carrinho";
      itemDiv.innerHTML = ` 
        <strong>${itemPedido.itemCardapio.nome}</strong> - Qtd: ${itemPedido.quantidade}<br>
        <button class="btn-primary" onclick="removerItem(${itemPedido.id})">Remover</button>
      `;
      carrinhoDiv.appendChild(itemDiv);
    });

    await atualizarTotal();
  } catch (error) {
    console.error("Erro ao carregar carrinho:", error);
  }
}

async function atualizarTotal() {
  if (!pedidoId) return;

  try {
    const response = await fetch(
      `http://localhost:8080/api/pedidos/${pedidoId}/total`
    );
    if (response.ok) {
      const total = await response.json();
      document.getElementById("totalCarrinho").innerText = `Total: R$ ${total.toFixed(2)}`;
    }
  } catch (error) {
    console.error("Erro ao atualizar total:", error);
  }
}

async function adicionarItem(itemCardapioId) {
  if (!pedidoId) {
    alert("Crie um pedido primeiro!");
    return;
  }

  const quantidade = document.getElementById(`qtd-${itemCardapioId}`).value;

  try {
    const response = await fetch(
      `http://localhost:8080/api/pedidos/${pedidoId}/itens/${itemCardapioId}?quantidade=${quantidade}`,
      {
        method: "POST",
      }
    );

    if (response.ok) {
      await carregarCarrinho();
    } else {
      const error = await response.text();
      alert(`Erro ao adicionar item: ${error}`);
    }
  } catch (error) {
    console.error("Erro ao adicionar item:", error);
    alert("Erro ao conectar com o servidor");
  }
}

async function removerItem(itemPedidoId) {
  if (!pedidoId) {
    alert("Crie um pedido primeiro!");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:8080/api/pedidos/${pedidoId}/itens/${itemPedidoId}`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      await carregarCarrinho();
    } else {
      const error = await response.text();
      alert(`Erro ao remover item: ${error}`);
    }
  } catch (error) {
    console.error("Erro ao remover item:", error);
    alert("Erro ao conectar com o servidor");
  }
}

async function finalizarPedido() {
  if (!pedidoId) {
    alert("Crie um pedido primeiro!");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:8080/api/pedidos/${pedidoId}/finalizar`,
      {
        method: "PUT",
      }
    );

    if (response.ok) {
      abrirModalAvaliacao();
    } else {
      const error = await response.text();
      alert(`Erro ao finalizar pedido: ${error}`);
    }
  } catch (error) {
    console.error("Erro ao finalizar pedido:", error);
    alert("Erro ao conectar com o servidor");
  }
}

function abrirModalAvaliacao() {
  document.getElementById("modalAvaliacao").style.display = "block";
  criarEstrelas("ambiente");
  criarEstrelas("comida");
  criarEstrelas("atendimento");
}

function criarEstrelas(id) {
  const container = document.getElementById(id);
  container.innerHTML = "";
  for (let i = 1; i <= 5; i++) {
    const estrela = document.createElement("span");
    estrela.innerHTML = "☆";
    estrela.style.fontSize = "24px";
    estrela.style.cursor = "pointer";
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
    estrela.innerHTML = index < valor ? "★" : "☆";
  });
  document.getElementById(id).dataset.nota = valor;
}

const CLIENTE_SESSION_KEY = 'cliente_session_pedidos';

function getSessionId() {
  let sessionId = localStorage.getItem('current_session_id');
  if (!sessionId) {
    sessionId = 'sessao_' + Date.now();
    localStorage.setItem('current_session_id', sessionId);
  }
  return sessionId;
}

async function enviarAvaliacao() {
  const notaAmbiente = document.getElementById("ambiente").dataset.nota || 0;
  const notaComida = document.getElementById("comida").dataset.nota || 0;
  const notaAtendimento = document.getElementById("atendimento").dataset.nota || 0;
  const comentario = document.getElementById("comentario").value;

  const avaliacao = {
    ambiente: notaAmbiente,
    comida: notaComida,
    atendimento: notaAtendimento,
    comentario: comentario,
    data: new Date().toISOString(),
  };

  localStorage.setItem(`avaliacao_${pedidoId}`, JSON.stringify(avaliacao));
  
  const sessionId = getSessionId();
  const historico = JSON.parse(localStorage.getItem(CLIENTE_SESSION_KEY) || '{}');
  
  if (!historico[sessionId]) {
    historico[sessionId] = [];
  }
  
  try {
    const response = await fetch(`http://localhost:8080/api/pedidos/${pedidoId}`);
    if (response.ok) {
      const pedido = await response.json();
      historico[sessionId].push({
        id: pedidoId,
        data: new Date().toISOString(),
        tipo: pedido.tipoPedido,
        itens: pedido.itens,
        total: pedido.total,
        status: 'Finalizado',
        avaliacao: avaliacao
      });
      localStorage.setItem(CLIENTE_SESSION_KEY, JSON.stringify(historico));
    }
  } catch (error) {
    console.error("Erro ao buscar detalhes do pedido:", error);
  }

  alert("Obrigado pela sua avaliação!");
  document.getElementById("modalAvaliacao").style.display = "none";

  pedidoId = null;
  carregarCarrinho();
}

function limparSessao() {
  const sessionId = localStorage.getItem('current_session_id');
  if (sessionId) {
    const historico = JSON.parse(localStorage.getItem(CLIENTE_SESSION_KEY) || '{}');
    delete historico[sessionId];
    localStorage.setItem(CLIENTE_SESSION_KEY, JSON.stringify(historico));
  }
  localStorage.removeItem('current_session_id');
  window.location.href = 'cliente.html';
}

function atualizarTipoPedido() {
  const tipoPedido = document.getElementById("tipoPedido").value;
  const mesaSelecionada = document.getElementById("mesaSelecionada");
  const dadosCliente = document.getElementById("dadosCliente");

  if (tipoPedido === "mesa") {
    mesaSelecionada.style.display = "block";
    dadosCliente.style.display = "none";
    carregarMesas();
  } else {
    mesaSelecionada.style.display = "none";
    dadosCliente.style.display = "block";
  }
}

async function carregarMesas() {
  try {
    const response = await fetch("http://localhost:8080/mesas");
    const mesas = await response.json();

    const todasOcupadas = mesas.every((mesa) => mesa.status === "ocupado");

    if (todasOcupadas) {
      alert("Todas as mesas estão ocupadas no momento. Por favor, aguarde na fila de espera.");
      return;
    }

    const mesaSelect = document.getElementById("mesaSelect");
    mesaSelect.innerHTML = `<option value="null">Selecione uma mesa</option>`;

    mesas.forEach((mesa) => {
      if (mesa.status !== "ocupado") {
        const option = document.createElement("option");
        option.value = mesa.id;
        option.textContent = `Mesa ${mesa.id}`;
        mesaSelect.appendChild(option);
      }
    });
  } catch (error) {
    console.error("Erro ao carregar mesas:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  carregarCardapio();
  atualizarTipoPedido();
  inicializarRoleta();
});

// Variáveis da Roleta
let podeGirar = true;
let premioAtual = null;

// Inicializar Roleta
function inicializarRoleta() {
    const roletaBtn = document.getElementById("roletaBtn");
    const modal = document.getElementById("roletaModal");
    const closeBtn = document.querySelector(".roleta-close-btn");
    const girarBtn = document.getElementById("girarRoletaBtn");
    const resgateOnlineBtn = document.getElementById("resgateOnlineBtn");
    const resgatePresencialBtn = document.getElementById("resgatePresencialBtn");
    const confirmarOnlineBtn = document.getElementById("confirmarOnlineBtn");

    // Abrir modal
    roletaBtn.addEventListener("click", function() {
        modal.style.display = "block";
        resetarRoleta();
    });

    // Fechar modal
    closeBtn.addEventListener("click", function() {
        modal.style.display = "none";
    });

    // Clicar fora do modal para fechar
    window.addEventListener("click", function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    // Girar roleta
    girarBtn.addEventListener("click", function() {
        if (podeGirar) {
            girarRoleta();
        }
    });

    // Opções de resgate
    resgateOnlineBtn.addEventListener("click", function() {
        document.getElementById("opcoesResgate").classList.add("hidden");
        document.getElementById("formularioOnline").classList.remove("hidden");
    });

    resgatePresencialBtn.addEventListener("click", function() {
        document.getElementById("opcoesResgate").classList.add("hidden");
        const codigo = gerarCodigo();
        document.getElementById("roletaCodigo").textContent = codigo;
        document.getElementById("codigoPresencial").classList.remove("hidden");
        salvarPremio(codigo);
    });

    // Confirmar resgate online
    confirmarOnlineBtn.addEventListener("click", function() {
        const nome = document.getElementById("roletaNome").value;
        const telefone = document.getElementById("roletaTelefone").value;
        const endereco = document.getElementById("roletaEndereco").value;

        if (!nome || !telefone || !endereco) {
            alert("Por favor, preencha todos os campos!");
            return;
        }

        const codigo = gerarCodigo();
        salvarPremio(codigo, { nome, telefone, endereco: endereco });
        
        alert(`Prêmio confirmado! Seu código de resgate é: ${codigo}`);
        modal.style.display = "none";
    });
}

// Girar a roleta
function girarRoleta() {
    podeGirar = false;
    const roleta = document.getElementById("roleta");
    const resultado = document.getElementById("resultadoRoleta");
    const textoResultado = document.getElementById("textoResultado");
    const opcoesResgate = document.getElementById("opcoesResgate");
    const formularioOnline = document.getElementById("formularioOnline");
    const codigoPresencial = document.getElementById("codigoPresencial");

    // Resetar elementos de resultado
    resultado.classList.remove("hidden");
    opcoesResgate.classList.add("hidden");
    formularioOnline.classList.add("hidden");
    codigoPresencial.classList.add("hidden");

    // Número aleatório de voltas (5-10) + posição do prêmio
    const voltas = 5 + Math.floor(Math.random() * 5);
    const anguloPorPremio = 45; // 360° / 8 setores
    const premios = ["sobremesa", "bebida", "prato-feito", "nada", "desconto", "nada", "sobremesa", "nada"];
    const premioIndex = Math.floor(Math.random() * premios.length);
    const anguloFinal = voltas * 360 + (premioIndex * anguloPorPremio);
    
    // Girar a roleta
    roleta.style.transform = `rotate(${-anguloFinal}deg)`;
    
    // Determinar o prêmio
    setTimeout(() => {
        premioAtual = premios[premioIndex];
        
        // Exibir resultado
        switch(premioAtual) {
            case "sobremesa":
                textoResultado.textContent = "Parabéns! Você ganhou uma sobremesa grátis!";
                textoResultado.style.color = "#FF9AA2";
                break;
            case "bebida":
                textoResultado.textContent = "Parabéns! Você ganhou uma bebida grátis!";
                textoResultado.style.color = "#FFB7B2";
                break;
            case "prato-feito":
                textoResultado.textContent = "Parabéns! Você ganhou um prato feito grátis!";
                textoResultado.style.color = "#FFDAC1";
                break;
            case "desconto":
                textoResultado.textContent = "Parabéns! Você ganhou 10% de desconto no seu próximo pedido!";
                textoResultado.style.color = "#B5EAD7";
                break;
            case "nada":
                textoResultado.textContent = "Não foi dessa vez! Tente novamente mais tarde.";
                textoResultado.style.color = "#888";
                break;
        }
        
        // Mostrar opções de resgate se ganhou algo
        if (premioAtual !== "nada") {
            opcoesResgate.classList.remove("hidden");
        }
        
        podeGirar = true;
    }, 5000); // Tempo da animação
}

// Resetar roleta
function resetarRoleta() {
    const roleta = document.getElementById("roleta");
    roleta.style.transform = "rotate(0deg)";
    premioAtual = null;
    
    document.getElementById("resultadoRoleta").classList.add("hidden");
    document.getElementById("roletaNome").value = "";
    document.getElementById("roletaTelefone").value = "";
    document.getElementById("roletaEndereco").value = "";
}

// Gerar código aleatório
function gerarCodigo() {
    const letras = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    const numeros = "23456789";
    let codigo = "";
    
    for (let i = 0; i < 2; i++) {
        codigo += letras.charAt(Math.floor(Math.random() * letras.length));
    }
    
    for (let i = 0; i < 4; i++) {
        codigo += numeros.charAt(Math.floor(Math.random() * numeros.length));
    }
    
    return codigo;
}

// Salvar prêmio no localStorage
function salvarPremio(codigo, dadosCliente = null) {
    if (premioAtual === "nada") return;
    
    const premios = JSON.parse(localStorage.getItem("premiosCliente") || []);
    const novoPremio = {
        id: Date.now(),
        codigo: codigo,
        tipo: premioAtual,
        data: new Date().toISOString(),
        resgatado: false,
        dadosCliente: dadosCliente
    };
    
    premios.push(novoPremio);
    localStorage.setItem("premiosCliente", JSON.stringify(premios));
}