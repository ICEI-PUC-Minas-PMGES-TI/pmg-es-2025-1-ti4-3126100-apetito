const premios = [
    { 
        tipo: "desconto", 
        valor: 10, 
        texto: "10% OFF", 
        probabilidade: 30,
        icone: "fa-tag"
    },
    { 
        tipo: "desconto", 
        valor: 15, 
        texto: "15% OFF", 
        probabilidade: 20,
        icone: "fa-percentage"
    },
    { 
        tipo: "desconto", 
        valor: 20, 
        texto: "20% OFF", 
        probabilidade: 10,
        icone: "fa-star"
    },
    { 
        tipo: "brinde", 
        texto: "Sobremesa Grátis", 
        probabilidade: 15,
        icone: "fa-ice-cream"
    },
    { 
        tipo: "brinde", 
        texto: "Bebida Grátis", 
        probabilidade: 15,
        icone: "fa-glass-cheers"
    },
    { 
        tipo: "nada", 
        texto: "Tente Novamente", 
        probabilidade: 10,
        icone: "fa-redo"
    }
];

// Variáveis de controle
let podeGirar = true;
let premioAtual = null;
const ROULETTE_STORAGE_KEY = 'roleta_premios';

function inicializarRoleta() {
    const roleta = document.querySelector('.roleta');
    roleta.innerHTML = '<div class="roleta-gancho"></div>';
    
    // Cores baseadas no tema amarelo/preto
    const coresSetores = [
        'setor-ouro', 'setor-preto', 'setor-destaque',
        'setor-ouro', 'setor-preto', 'setor-destaque'
    ];
    
    let anguloAtual = 0;
    const totalProbabilidade = premios.reduce((sum, p) => sum + p.probabilidade, 0);
    
    premios.forEach((premio, index) => {
        const anguloSetor = (premio.probabilidade / totalProbabilidade) * 360;
        const setor = document.createElement('div');
        setor.className = `roleta-setor ${coresSetores[index % coresSetores.length]}`;
        setor.style.transform = `rotate(${anguloAtual}deg)`;
        
        const span = document.createElement('span');
        span.textContent = premio.texto;
        setor.appendChild(span);
        
        roleta.appendChild(setor);
        anguloAtual += anguloSetor;
    });
}

// Gira a roleta
function girarRoleta() {
    if (!podeGirar) return;
    
    podeGirar = false;
    document.getElementById('btnGirar').disabled = true;
    
    // Seleciona um prêmio aleatório considerando a probabilidade
    const random = Math.random() * 100;
    let acumulado = 0;
    
    for (const premio of premios) {
        acumulado += premio.probabilidade;
        if (random <= acumulado) {
            premioAtual = premio;
            break;
        }
    }
    
    // Calcula o ângulo de parada
    const setores = Array.from(document.querySelectorAll('.roleta-setor'));
    const indexPremio = premios.findIndex(p => p === premioAtual);
    const anguloPorSetor = 360 / premios.length;
    const anguloParada = 360 * 5 + (indexPremio * anguloPorSetor) + (Math.random() * anguloPorSetor);
    
    // Animação
    const roleta = document.querySelector('.roleta');
    roleta.style.transition = 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
    roleta.style.transform = `rotate(${-anguloParada}deg)`;
    
    // Mostra o prêmio após a animação
    setTimeout(() => {
        mostrarPremio();
    }, 4000);
}

// Mostra o prêmio ganho
function mostrarPremio() {
    const modal = document.getElementById('modalPremio');
    const titulo = document.getElementById('premioTitulo');
    const descricao = document.getElementById('premioDescricao');
    const formResgate = document.getElementById('formResgate');
    const cupomContainer = document.getElementById('cupomContainer');
    
    titulo.textContent = premioAtual.tipo === 'nada' ? 'Que pena!' : 'Parabéns!';
    
    if (premioAtual.tipo === 'nada') {
        descricao.textContent = 'Não foi desta vez. Tente novamente mais tarde!';
        formResgate.style.display = 'none';
        cupomContainer.style.display = 'none';
        
        setTimeout(() => {
            fecharModalPremio();
        }, 2000);
    } 
    else if (premioAtual.tipo === 'desconto') {
        descricao.textContent = `Você ganhou ${premioAtual.valor}% de desconto no seu próximo pedido!`;
        formResgate.style.display = 'none';
        cupomContainer.style.display = 'block';
        

    // Salva o cupom no localStorage
const cupons = JSON.parse(localStorage.getItem(ROULETTE_STORAGE_KEY) || '[]');
cupons.push({
    codigo: `ROULETTE_${Date.now()}`,
    desconto: premioAtual.valor,
    data: new Date().toISOString(),
    usado: false
});
localStorage.setItem(ROULETTE_STORAGE_KEY, JSON.stringify(cupons));
} else {
        descricao.textContent = `Você ganhou: ${premioAtual.texto}! Por favor, informe seus dados para resgate.`;
        formResgate.style.display = 'block';
        cupomContainer.style.display = 'none';
        
        // Mostra campos apropriados
        document.getElementById('enderecoResgateGroup').style.display = 'block';
        document.getElementById('mesaResgateGroup').style.display = 'none';
    }
    
    modal.style.display = 'flex';
}

// Resgata prêmio físico (brinde)
function resgatarPremio() {
    const nome = document.getElementById('nomeResgate').value;
    const contato = document.getElementById('contatoResgate').value;
    const endereco = document.getElementById('enderecoResgate').value;
    const mesa = document.getElementById('mesaResgate').value;
    
    if (!nome || !contato) {
        alert('Por favor, preencha pelo menos nome e telefone');
        return;
    }
    
    // Salva o resgate no localStorage
    const resgates = JSON.parse(localStorage.getItem('roleta_resgates')) || [];
    resgates.push({
        premio: premioAtual.texto,
        nome,
        contato,
        endereco,
        mesa,
        data: new Date().toISOString(),
        resgatado: false
    });
    localStorage.setItem('roleta_resgates', JSON.stringify(resgates));
    
    alert('Prêmio registrado com sucesso! Entraremos em contato para a entrega.');
    fecharModalPremio();
}

// Fecha o modal
function fecharModalPremio() {
    document.getElementById('modalPremio').style.display = 'none';
    document.getElementById('btnGirar').disabled = false;
    podeGirar = true;
    
    // Limpa formulário
    document.getElementById('nomeResgate').value = '';
    document.getElementById('contatoResgate').value = '';
    document.getElementById('enderecoResgate').value = '';
    document.getElementById('mesaResgate').value = '';
}

// Modifique seu pedido.js para verificar cupons da roleta
// Adicione esta função ao seu pedido.js original
function verificarCuponsRoleta() {
    const cupons = JSON.parse(localStorage.getItem(ROULETTE_STORAGE_KEY)) || [];
    const cupomAtivo = cupons.find(c => !c.usado);
    
    if (cupomAtivo) {
        return {
            codigo: cupomAtivo.codigo,
            desconto: cupomAtivo.desconto
        };
    }
    return null;
}

// Inicializa a roleta quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    inicializarRoleta();
    
    // Verifica se já girou hoje (pode implementar lógica para limitar giros por dia)
    const hoje = new Date().toLocaleDateString();
    const ultimoGiro = localStorage.getItem('ultimo_giro');
    
    if (ultimoGiro === hoje) {
        document.getElementById('btnGirar').disabled = true;
        document.getElementById('btnGirar').textContent = 'Volte amanhã para girar novamente!';
    }
});