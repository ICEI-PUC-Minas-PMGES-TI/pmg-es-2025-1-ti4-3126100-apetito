// Função para formatar valores monetários
function formatarMoeda(valor) {
  return "R$ " + valor.toFixed(2).replace(".", ",");
}

// Função para criar gráfico genérico
function criarGrafico(elementId, apiUrl, tipo = "bar", isCurrency = false) {
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      const ctx = document.getElementById(elementId).getContext("2d");

      new Chart(ctx, {
        type: tipo,
        data: {
          labels: Object.keys(data),
          datasets: [
            {
              label:
                tipo === "pie" || tipo === "doughnut"
                  ? ""
                  : isCurrency
                  ? "Valor (R$)"
                  : "Quantidade",
              data: Object.values(data),
              backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF",
                "#FF9F40",
                "#8AC249",
                "#EA5F89",
                "#00BFFF",
                "#A0522D",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: tipo === "bar" ? "top" : "right",
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  let label = context.label || "";
                  if (label) label += ": ";
                  if (isCurrency) {
                    label += formatarMoeda(context.raw);
                  } else {
                    label += context.raw;
                  }
                  return label;
                },
              },
            },
          },
          scales:
            tipo === "bar"
              ? {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: isCurrency
                        ? function (value) {
                            return formatarMoeda(value);
                          }
                        : undefined,
                    },
                  },
                }
              : undefined,
          indexAxis: elementId === "graficoItensMaisPedidos" ? "y" : "x",
        },
      });
    })
    .catch((error) => console.error("Erro ao carregar dados:", error));
}

// Função para criar o gráfico de Lucro (Vendas - Despesas)
async function criarGraficoLucro() {
  try {
    // Busca vendas totais
    const responseVendas = await fetch(
      "http://localhost:8080/api/relatorios/vendas-totais"
    );
    const vendas = await responseVendas.json();

    // Busca despesas totais
    const responseDespesas = await fetch(
      "http://localhost:8080/api/relatorios/despesas-totais"
    );
    const despesasData = await responseDespesas.json();
    const despesas = Object.values(despesasData).reduce((a, b) => a + b, 0);

    // Calcula lucro
    const lucro = vendas - despesas;

    const ctx = document.getElementById("graficoLucro").getContext("2d");

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Vendas", "Despesas", "Lucro"],
        datasets: [
          {
            label: "Valor (R$)",
            data: [vendas, despesas, lucro],
            backgroundColor: [
              "#4CAF50", // Verde para vendas
              "#F44336", // Vermelho para despesas
              "#FFC107", // Amarelo para lucro
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return (
                  context.dataset.label + ": " + formatarMoeda(context.raw)
                );
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: false, // Para melhor visualização de valores negativos
            ticks: {
              callback: function (value) {
                return formatarMoeda(value);
              },
            },
            title: {
              display: true,
              text: "Valor (R$)",
            },
          },
        },
      },
    });
  } catch (error) {
    console.error("Erro:", error);
    document.getElementById("graficoLucro").innerHTML =
      '<p style="color:red">Erro ao calcular lucro</p>';
  }
}

// Criar todos os gráficos quando a página carregar
document.addEventListener("DOMContentLoaded", function () {
  // Gráficos principais (topo da página)
  criarGrafico(
    "graficoDespesasTotais",
    "http://localhost:8080/api/relatorios/despesas-totais",
    "pie",
    true
  );
  criarGraficoLucro();

  // Gráficos secundários
  criarGrafico(
    "graficoDespesasOperacionais",
    "http://localhost:8080/api/relatorios/despesas-operacionais",
    "bar",
    true
  );
  criarGrafico(
    "graficoItensMaisPedidos",
    "http://localhost:8080/api/relatorios/itens-mais-pedidos",
    "bar"
  );
  criarGrafico(
    "graficoTiposPedidos",
    "http://localhost:8080/api/relatorios/tipo-pedidos",
    "pie"
  );
});
