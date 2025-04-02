// Função para fazer a requisição de cadastro
document.getElementById('registerForm')?.addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:8080/api/cadastrar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome: name, email: email, senha: password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao realizar cadastro');
        }
        return response.json();
    })
    .then(data => {
        alert("Cadastro realizado com sucesso");
        window.location.href = "login.html"; // Redireciona para login após cadastro
    })
    .catch(error => alert("Erro: " + error.message));
});

// Função para fazer a requisição de login
document.getElementById('loginForm')?.addEventListener('submit', function (event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    fetch('http://localhost:8080/api/logar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, senha: password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro de login');
        }
        return response.json();
    })
    .then(data => {
        alert("Login bem-sucedido");
        window.location.href = "index.html"; // Redireciona para a página principal após login
    })
    .catch(error => alert("Erro: " + error.message));
});

// Função para criar um pedido (apenas na index.html)
document.getElementById('orderForm')?.addEventListener('submit', function (event) {
    event.preventDefault();

    const itemName = document.getElementById('itemName').value;
    const quantity = document.getElementById('quantity').value;

    fetch('http://localhost:8080/api/pedidos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nomeItem: itemName, quantidade: quantity })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao criar pedido');
        }
        return response.json();
    })
    .then(data => alert("Pedido criado"))
    .catch(error => console.error("Erro:", error.message));
});

// Função para reservar uma mesa (apenas na index.html)
document.getElementById('reserveForm')?.addEventListener('submit', function (event) {
    event.preventDefault();

    const tableId = document.getElementById('tableId').value;
    const reservationDate = document.getElementById('reservationDate').value;

    fetch('http://localhost:8080/api/reservas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mesa: { id: tableId }, dataReserva: reservationDate })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao reservar mesa');
        }
        return response.json();
    })
    .then(data => alert("Reserva realizada"))
    .catch(error => console.error("Erro:", error.message));
});