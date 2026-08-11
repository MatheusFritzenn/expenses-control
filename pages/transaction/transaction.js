let currentUser = null;
firebase.auth().onAuthStateChanged(user => {
    if (!user) {
        window.location.href = "../../index.html";
    } else {
        currentUser = user;
    }
});

if (!isNewTransaction()) {
    const uid = getTransactionUid();
    findTransactionByUid(uid);
}

function getTransactionUid() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("uid");
}

function isNewTransaction() {
    return getTransactionUid() ? false : true;
}

function findTransactionByUid(uid) {
    showLoading();

    transactionService.findByUid(uid)
        .then(transaction => {
            hideLoading();
            if (transaction) {
                fillTransactionString(transaction);
                toggleSaveButtonDisable();
            } else {
                alert("Documento não encontrado.")
                goBackToHomePage();
            }
        })
        .catch(() => {
            alert("Erro ao recuperar documento.")
            goBackToHomePage();  
        })
}

function fillTransactionString(transaction) {
    if (transaction.type == "expense") {
        form.expense().checked = true;
    } else {
        form.income().checked = true;
    }

    form.date().value = transaction.date;
    form.currency().value = transaction.money.currency;
    form.value().value = transaction.money.value;
    form.cathegory().value = transaction.cathegory;
    form.description().value = transaction.description;
}

function newTransaction() {
    return {
        type: form.expense().checked ? "expense" : "income",
        date: form.date().value,
        money: {
            currency: form.currency().value,
            value: parseFloat(form.value().value)
        },
        cathegory: form.cathegory().value,
        description: form.description().value,
        user: {
            uid: currentUser.uid
        }
    }    
}

function saveTransaction() {
    const transaction = newTransaction();

    if (isNewTransaction()) {
        insert(transaction);
    } else {
        update(transaction);
    }
}

function insert(transaction) {
    showLoading();

    transactionService.save(transaction)
    .then(() => {
        hideLoading();
        alert("Transação inserida com sucesso!");
        goBackToHomePage();
    })
    .catch((error) => {
        hideLoading();
        alert("Ocorreu um erro ao inserir transação: " + error.message)
    })
}

function update(transaction) {
    showLoading();
    transactionService.update(getTransactionUid(), transaction)
    .then(() => {
        hideLoading();
        alert("Transação alterada com sucesso!");
        goBackToHomePage();
    })
    .catch((error) => {
        hideLoading();
        alert("Ocorreu um erro ao atualizar transação: " + error.message)
    })
}

function onBlurDate() {
    const date = form.date().value;
    form.dateInvalidError().style.display = !date ? "block" : "none";

    toggleSaveButtonDisable();
}

function onBlurValue() {
    const value = form.value().value;
    form.valueRequiredError().style.display = !value ? "block" : "none";
    form.valueInvalidError().style.display = value <= 0 ? "block" : "none";

    toggleSaveButtonDisable();
}

function onBlurCathegory() {
    const cathegory = form.cathegory().value;
    form.cathegoryRequiredError().style.display = !cathegory ? "block" : "none";

    toggleSaveButtonDisable();
}

function toggleSaveButtonDisable() {
    form.saveButton().disabled = !isFormValid();
}

function isFormValid() {
    const date = form.date().value;
    if (!date) {
        return false;
    } 

    const value = form.value().value;
    if (!value || value <= 0) {
        return false;
    }

    const cathegory = form.cathegory().value;
    if (!cathegory) { 
        return false;
    }

    return true;
}

function goBackToHomePage() {
    window.location.href = "../home/home.html";    
}

const form = {
    date: () => document.getElementById("date"),
    value: () => document.getElementById("value"),
    cathegory: () => document.getElementById("cathegory"),
    description: () => document.getElementById("description"),
    currency: () => document.getElementById("currency"),
    expense: () => document.getElementById("expense"),
    income: () => document.getElementById("income"),

    dateInvalidError: () => document.getElementById("date-invalid-error"),
    valueRequiredError: () => document.getElementById("value-required-error"),
    valueInvalidError: () => document.getElementById("value-invalid-error"),
    cathegoryRequiredError: () => document.getElementById("cathegory-required-error"),
    
    saveButton: () => document.getElementById("save-button"),
    cancelButton: () => document.getElementById("cancel-button")
}
