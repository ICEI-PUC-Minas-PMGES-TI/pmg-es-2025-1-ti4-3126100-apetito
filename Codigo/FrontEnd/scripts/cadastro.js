document.getElementById('registerForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    try {
    const response = await fetch('http://localhost:8080/api/auth/register', {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json'
},
    body: JSON.stringify({ username, password, role })
});

    const result = await response.text();
    alert(result);
} catch (error) {
    console.error('Erro ao registrar usuário:', error);
    alert('Erro ao registrar usuário. Verifique sua conexão ou tente novamente.');
}
});

