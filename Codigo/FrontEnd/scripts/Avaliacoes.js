document.getElementById("avaliacao-form").addEventListener("submit", function(event) {
    event.preventDefault();

    let avaliacao = {
        nome: document.getElementById("nome").value,
        comida: parseInt(document.querySelector('input[name="comida"]:checked').value),
        tempoEspera: parseInt(document.querySelector('input[name="tempoEspera"]:checked').value),
        ambiente: parseInt(document.querySelector('input[name="ambiente"]:checked').value),
        atendimento: parseInt(document.querySelector('input[name="atendimento"]:checked').value),
        comentario: document.getElementById("comentario").value
    };

    fetch('http://localhost:8080/api/avaliacoes/salvar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(avaliacao)
    })
    .then(response => response.json())
    .then(data => {
        alert('Avaliação enviada com sucesso!');
    })
    .catch(error => {
        console.error('Erro ao enviar avaliação:', error);
    });
});

document.querySelector('.navbar-toggle').addEventListener('click', function() {
    document.querySelector('.navbar-links').classList.toggle('active');});
