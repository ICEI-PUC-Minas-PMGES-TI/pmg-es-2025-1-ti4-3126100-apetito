const formAvaliacao = document.getElementById('formAvaliacao');
const mensagem = document.getElementById('mensagem');

formAvaliacao.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Captura os valores dos campos
    const avaliacao = {
        notaComida: parseInt(document.getElementById('notaComida').value),
        notaAtendimento: parseInt(document.getElementById('notaAtendimento').value),
        notaAmbiente: parseInt(document.getElementById('notaAmbiente').value),
        comentario: document.getElementById('comentario').value || ''
    };

    try {
        // Envia a avaliação via POST
        const response = await fetch('http://localhost:8080/avaliacoes', {  // Alterado para /avaliacoes
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(avaliacao),
        });

        if (response.ok) {
            const dados = await response.json();
            mensagem.textContent = 'Avaliação enviada com sucesso!';
            mensagem.style.color = 'green';
            formAvaliacao.reset();
        } else {
            mensagem.textContent = 'Erro ao enviar avaliação. Tente novamente.';
            mensagem.style.color = 'red';
        }
    } catch (error) {
        mensagem.textContent = 'Erro na comunicação com o servidor.';
        mensagem.style.color = 'red';
    }
});