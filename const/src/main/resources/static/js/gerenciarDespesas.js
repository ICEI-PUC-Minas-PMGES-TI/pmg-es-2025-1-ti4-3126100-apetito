const API_URL = "http://localhost:8080/api/despesas";

const form = document.getElementById("despesa-form");
const idInput = document.getElementById("despesa-id");
const nomeInput = document.getElementById("despesa-nome");
const parcelasInput = document.getElementById("despesa-parcelas");
const precoInput = document.getElementById("despesa-preco");
const vencimentoInput = document.getElementById("despesa-vencimento");
const submitBtn = document.querySelector("#despesa-form button[type='submit']");
const cancelBtn = document.getElementById("cancel-btn");
const refreshBtn = document.getElementById("refresh-btn");
const pdfBtn = document.getElementById("pdf-btn");
const despesasList = document.getElementById("despesas-list");

let isEditing = false;

document.addEventListener("DOMContentLoaded", () => {
    fetchDespesas();
    const hoje = new Date().toISOString().split("T")[0];
    vencimentoInput.min = hoje;
});

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const despesaData = {
        nome: nomeInput.value,
        parcelas: parseInt(parcelasInput.value),
        preco: parseFloat(precoInput.value),
        dataVencimento: vencimentoInput.value,
    };

    try {
        if (isEditing) {
            await updateDespesa(idInput.value, despesaData);
        } else {
            await createDespesa(despesaData);
        }
        resetForm();
        fetchDespesas();
    } catch (error) {
        console.error("Erro:", error);
        alert("Ocorreu um erro. Verifique o console para mais detalhes.");
    }
});

cancelBtn.addEventListener("click", resetForm);
refreshBtn.addEventListener("click", fetchDespesas);
pdfBtn.addEventListener("click", gerarRelatorioPDF);

async function fetchDespesas() {
    try {
        const response = await fetch(API_URL);
        const despesas = await response.json();
        displayDespesas(despesas);
    } catch (error) {
        console.error("Erro ao buscar despesas:", error);
    }
}

async function createDespesa(despesaData) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(despesaData),
    });
    return await response.json();
}

async function updateDespesa(id, despesaData) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(despesaData),
    });
    return await response.json();
}

async function deleteDespesa(id) {
    if (confirm("Tem certeza que deseja excluir esta despesa?")) {
        try {
            await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
            });
            fetchDespesas();
        } catch (error) {
            console.error("Erro ao deletar despesa:", error);
        }
    }
}

function displayDespesas(despesas) {
    despesasList.innerHTML = "";

    if (despesas.length === 0) {
        despesasList.innerHTML = '<li class="empty-message">Nenhuma despesa cadastrada</li>';
        return;
    }

    despesas.forEach((despesa) => {
        const li = document.createElement("li");
        li.className = "despesa-item";

        const dataVencimento = new Date(despesa.dataVencimento);
        const dataFormatada = dataVencimento.toLocaleDateString("pt-BR");
        const hoje = new Date();
        const diffTime = dataVencimento - hoje;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let statusClass = "";
        if (diffDays < 0) {
            statusClass = "vencida";
        } else if (diffDays <= 7) {
            statusClass = "proxima";
        }

        li.innerHTML = `
            <div class="despesa-info">
                <h3>${despesa.nome}</h3>
                <p>${despesa.parcelas} parcela(s) · Vence em ${dataFormatada}</p>
                ${diffDays < 0 ? `<span class="status-badge ${statusClass}">Vencida há ${Math.abs(diffDays)} dia(s)</span>` : 
                 diffDays <= 7 ? `<span class="status-badge ${statusClass}">Vence em ${diffDays} dia(s)</span>` : ''}
            </div>
            <div class="despesa-valor">
                R$ ${despesa.preco.toFixed(2)}
            </div>
            <div class="despesa-actions">
                <button class="btn btn-primary edit-btn" data-id="${despesa.id}">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn btn-danger delete-btn" data-id="${despesa.id}">
                    <i class="fas fa-trash-alt"></i> Excluir
                </button>
            </div>
        `;

        despesasList.appendChild(li);
    });

    document.querySelectorAll(".edit-btn").forEach((btn) => {
        btn.addEventListener("click", () => editDespesa(btn.dataset.id));
    });

    document.querySelectorAll(".delete-btn").forEach((btn) => {
        btn.addEventListener("click", () => deleteDespesa(btn.dataset.id));
    });
}

async function editDespesa(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const despesa = await response.json();

        idInput.value = despesa.id;
        nomeInput.value = despesa.nome;
        parcelasInput.value = despesa.parcelas;
        precoInput.value = despesa.preco;
        vencimentoInput.value = despesa.dataVencimento;

        submitBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Atualizar';
        cancelBtn.style.display = "inline-block";
        isEditing = true;

        document.querySelector(".form-section").scrollIntoView({ behavior: "smooth" });
    } catch (error) {
        console.error("Erro ao buscar despesa para edição:", error);
    }
}

function resetForm() {
    form.reset();
    idInput.value = "";
    submitBtn.innerHTML = '<i class="fas fa-save"></i> Salvar';
    cancelBtn.style.display = "none";
    isEditing = false;

    const hoje = new Date().toISOString().split("T")[0];
    vencimentoInput.value = hoje;
}

async function gerarRelatorioPDF() {
    try {
        const response = await fetch(API_URL);
        const despesas = await response.json();
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Configurações do relatório
        const colunas = {
            nome: 15,
            parcelas: 60,
            preco: 90,
            vencimento: 130,
            status: 190
        };

        // Cabeçalho do relatório
        doc.setFontSize(18);
        doc.text("Relatório de Despesas", 105, 15, { align: 'center' });

        doc.setFontSize(10);
        const dataEmissao = new Date().toLocaleDateString('pt-BR');
        doc.text(`Data de emissão: ${dataEmissao}`, 105, 23, { align: 'center' });

        // Cabeçalho da tabela
        doc.setFontSize(12);
        doc.setDrawColor(0);
        doc.setFillColor(200, 200, 200);
        doc.rect(10, 30, 190, 10, 'F');
        doc.setTextColor(0, 0, 0);
        doc.text("Nome", colunas.nome, 37);
        doc.text("Parcelas", colunas.parcelas, 37);
        doc.text("Valor", colunas.preco, 37);
        doc.text("Vencimento", colunas.vencimento, 37);
        doc.text("Status", colunas.status, 37, { align: 'right' });

        let y = 45; // Posição Y inicial para os itens
        const hoje = new Date();
        
        // Adicionar cada despesa ao PDF
        despesas.forEach((despesa) => {
            if (y > 270) { // Verifica se precisa de nova página
                doc.addPage();
                y = 20;
                // Cabeçalho da tabela na nova página
                doc.setFontSize(12);
                doc.setDrawColor(0);
                doc.setFillColor(200, 200, 200);
                doc.rect(10, 10, 190, 10, 'F');
                doc.setTextColor(0, 0, 0);
                doc.text("Nome", colunas.nome, 17);
                doc.text("Parcelas", colunas.parcelas, 17);
                doc.text("Valor", colunas.preco, 17);
                doc.text("Vencimento", colunas.vencimento, 17);
                doc.text("Status", colunas.status, 17, { align: 'right' });
                y = 25;
            }

            // Formatar dados da despesa
            const dataVencimento = new Date(despesa.dataVencimento);
            const diffTime = dataVencimento - hoje;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const dataFormatada = dataVencimento.toLocaleDateString('pt-BR');
            
            // Determinar status e cor
            let status = "";
            let statusColor = [0, 0, 0]; // Preto padrão
            
            if (diffDays < 0) {
                status = "VENCIDA";
                statusColor = [255, 0, 0]; // Vermelho
            } else if (diffDays <= 7) {
                status = `Vence em ${diffDays} dia(s)`;
                statusColor = [255, 165, 0]; // Laranja
            } else {
                status = "PENDENTE";
                statusColor = [0, 0, 0]; // Preto
            }

            // Adicionar linha da despesa
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            doc.text(despesa.nome, colunas.nome, y);
            doc.text(despesa.parcelas.toString(), colunas.parcelas, y);
            doc.text(`R$ ${despesa.preco.toFixed(2)}`, colunas.preco, y);
            doc.text(dataFormatada, colunas.vencimento, y);

            // Status com cor condicional
            doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
            doc.text(status, colunas.status, y, { align: 'right' });

            // Linha divisória
            doc.setDrawColor(200, 200, 200);
            doc.line(10, y + 5, 200, y + 5);
            
            y += 10; // Próxima linha
        });

        // Rodapé com total
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`Total de despesas: ${despesas.length}`, 14, 285);
        doc.text(`Valor total: R$ ${despesas.reduce((sum, d) => sum + d.preco, 0).toFixed(2)}`, 14, 290);

        // Salvar o PDF
        doc.save(`Relatorio_Despesas_${dataEmissao.replace(/\//g, '-')}.pdf`);
        
    } catch (error) {
        console.error("Erro ao gerar relatório PDF:", error);
        alert("Erro ao gerar relatório. Verifique o console para mais detalhes.");
    }
}

// Inicialização
fetchDespesas();