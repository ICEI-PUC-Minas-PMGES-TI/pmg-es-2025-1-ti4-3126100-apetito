// Variáveis globais
let pedidoId = null;
const API_URL = "http://localhost:8080/api";

// Função principal para carregar pedidos da cozinha
async function carregarPedidosCozinha() {
  try {
    const container = document.getElementById("pedidos-container");
    
    // Mostrar estado de carregamento
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-spinner fa-spin"></i>
        <h3>Carregando pedidos...</h3>
        <p>Aguarde enquanto buscamos os pedidos ativos</p>
      </div>
    `;

    const response = await fetch(`${API_URL}/pedidos/cozinha`);
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const pedidos = await response.json();

    // Simular delay para melhor UX (remova em produção)
    setTimeout(() => renderizarPedidos(pedidos), 300);

    // Agendar próxima atualização
    setTimeout(carregarPedidosCozinha, 30000);

  } catch (error) {
    console.error("Erro ao carregar pedidos:", error);
    mostrarErroCarregamento();
  }
}

// Função para renderizar os pedidos na tela
function renderizarPedidos(pedidos) {
  const container = document.getElementById("pedidos-container");

  if (pedidos.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-box-open"></i>
        <h3>Nenhum pedido ativo</h3>
        <p>Quando houver novos pedidos, eles aparecerão aqui automaticamente</p>
      </div>
    `;
    return;
  }

  container.innerHTML = "";

  pedidos.forEach(pedido => {
    const pedidoDiv = document.createElement("div");
    pedidoDiv.className = "pedido-card";
    pedidoDiv.innerHTML = criarHTMLPedido(pedido);
    container.appendChild(pedidoDiv);
  });
}

// Função para criar o HTML de um pedido individual
function criarHTMLPedido(pedido) {
  const tipoPedido = pedido.mesaId ? `Mesa ${pedido.mesaId}` : "Online";
  const tipoClass = pedido.mesaId ? "" : "online";
  const statusClass = pedido.status === "FINALIZADO" ? "status-finalizado" : "status-andamento";
  const statusText = pedido.status === "FINALIZADO" ? "PRONTO" : "EM PREPARO";
  const statusIcon = pedido.status === "FINALIZADO" ? "fa-check-circle" : "fa-clock";
  const clienteEmail = localStorage.getItem(`pedido_${pedido.id}_email`) || '';

  return `
    <div class="pedido-header">
      <span class="pedido-id"><i class="fas fa-receipt"></i> Pedido #${pedido.id}</span>
      <span class="pedido-tipo ${tipoClass}">
        <i class="fas ${pedido.mesaId ? "fa-chair" : "fa-mobile-alt"}"></i> ${tipoPedido}
      </span>
    </div>
    
    ${clienteEmail ? `
      <div class="cliente-email" onclick="abrirModalEmail('${clienteEmail}')">
        <i class="fas fa-envelope"></i> ${clienteEmail}
      </div>
    ` : ''}
    
    <div class="item-list">
      ${pedido.itens.map(item => `
        <div class="item">
          <span>
            <span class="item-quantidade">${item.quantidade}x</span>
            ${item.itemCardapio.nome}
          </span>
          <span>R$ ${(item.itemCardapio.preco * item.quantidade).toFixed(2)}</span>
        </div>
      `).join("")}
    </div>
    
    <div class="pedido-footer">
      <span class="pedido-status ${statusClass}">
        <i class="fas ${statusIcon}"></i> ${statusText}
      </span>
      <span><strong>Total:</strong> R$ ${pedido.total.toFixed(2)}</span>
    </div>
  `;
}

// Função para mostrar erro de carregamento
function mostrarErroCarregamento() {
  document.getElementById("pedidos-container").innerHTML = `
    <div class="empty-state">
      <i class="fas fa-exclamation-triangle"></i>
      <h3>Erro ao carregar pedidos</h3>
      <p>Tente novamente ou verifique sua conexão</p>
      <button onclick="carregarPedidosCozinha()" class="btn-tentar-novamente">
        <i class="fas fa-sync-alt"></i> Tentar novamente
      </button>
    </div>
  `;
}

// Funções para o modal de email
function abrirModalEmail(email) {
  const modal = document.getElementById('emailModal');
  document.getElementById('clienteEmail').value = email;
  document.getElementById('emailSubject').value = `Sobre seu pedido no Apetito`;
  modal.style.display = 'block';
}

function fecharModalEmail() {
  document.getElementById('emailModal').style.display = 'none';
}

// Função para enviar email
async function enviarEmail(event) {
  event.preventDefault();
  
  const form = event.target;
  const btn = form.querySelector('button[type="submit"]');
  const btnText = btn.querySelector('.btn-text');
  const spinner = btn.querySelector('.loading-spinner');
  
  // Mostrar estado de carregamento
  btnText.style.display = 'none';
  spinner.style.display = 'inline-block';
  btn.disabled = true;

  try {
    const formData = new FormData(form);
    formData.append('_subject', 'Mensagem do Restaurante Apetito');
    formData.append('_template', 'table');
    formData.append('_autoresponse', 'Recebemos sua mensagem! Em breve retornaremos.');

    const response = await fetch('https://formsubmit.co/ajax/contatoapetito@gmail.com', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Erro ao enviar e-mail');
    }

    mostrarModalSucesso();
    form.reset();
    fecharModalEmail();

  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    alert(`Erro ao enviar e-mail: ${error.message}`);
  } finally {
    btnText.style.display = 'inline-block';
    spinner.style.display = 'none';
    btn.disabled = false;
  }
}

// Função para mostrar modal de sucesso
function mostrarModalSucesso() {
  const modal = document.createElement('div');
  modal.id = 'email-success-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
  `;
  
  modal.innerHTML = `
    <div style="
      background: white;
      padding: 2rem;
      border-radius: 8px;
      text-align: center;
      max-width: 500px;
    ">
      <i class="fas fa-check-circle" style="font-size:3rem; color:#4CAF50;"></i>
      <h3 style="color:#8B0000; margin:1rem 0;">E-mail enviado com sucesso!</h3>
      <p>O cliente receberá sua mensagem em breve.</p>
      <button onclick="this.closest('#email-success-modal').remove()" class="btn" style="margin-top:1rem;">
        Fechar
      </button>
    </div>
  `;
  
  document.body.appendChild(modal);
}

// Inicialização quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", function() {
  // Carregar pedidos inicialmente
  carregarPedidosCozinha();
  
  // Configurar listeners
  document.querySelector('.close-modal').addEventListener('click', fecharModalEmail);
  document.getElementById('emailForm').addEventListener('submit', enviarEmail);
  
  // Fechar modal ao clicar fora
  window.addEventListener('click', function(event) {
    const modal = document.getElementById('emailModal');
    if (event.target === modal) {
      fecharModalEmail();
    }
  });
  
  // Atualizar com F5 (mas prevenir o comportamento padrão)
  document.addEventListener("keydown", (e) => {
    if (e.key === "F5") {
      e.preventDefault();
      carregarPedidosCozinha();
    }
  });
});