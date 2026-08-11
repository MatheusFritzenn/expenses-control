function getErrorMessage(error) {
    if (error.code === "auth/user-not-found" || error.code === "auth/invalid-credential") {
        return "Usuário não encontrado.";
    } else if (error.code === "auth/email-already-in-use") {
        return "Usuário já cadastrado."
    }
    else {
        return error.message;
    }
}    

function showLoading() {
    const div = document.createElement("div");
    div.classList.add("loading", "centralize");
    div.id = "loading";
    const label = document.createElement("label");
    label.innerText = "Carregando...";

    div.appendChild(label);

    document.body.appendChild(div)
}

function hideLoading() {
    document.getElementById("loading").remove();
}

function validateEmail(email) {
    return /\S+@+\S+\.\S+/.test(email);
}

function formatDate(date){
    return new Date(date.replace(/-/g, '/')).toLocaleDateString('pt-br');
}

function formatMoney(money){
    return money.currency + " " + money.value.toFixed(2);
}

function logout() {
    showLoading();
    firebase.auth()
        .signOut()
        .then(() => {
            hideLoading();
            window.location.href = "../../index.html";
        })
        .catch(error => {
            hideLoading();
            alert("Erro ao fazer logout)");
        })
}