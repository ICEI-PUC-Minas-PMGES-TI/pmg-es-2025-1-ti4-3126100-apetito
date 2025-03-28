document.getElementById("form-login").addEventListener("submit", function (event){
event.preventDefault()
    const username = document.getElementById("nome").value
    const password = document.getElementById("senha").value

    fetch("http://localhost:8080/api/auth/login",{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    }).then(response => {
        if (!response.ok) {
            throw new Error("Erro ao fazer login");
        }
        return response.json();
    })
        .then(data => {
            console.log("Login bem-sucedido:", data);
            // salvar token, redirecionar, etc.
        })
        .catch(error => {
            console.error("Erro:", error);
        });



})

