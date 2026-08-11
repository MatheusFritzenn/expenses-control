firebase.auth().onAuthStateChanged(user => {
    if (!user) {
        window.location.href = "../../index.html";
    } else {
        findTransactions(user);
    }
})

function findTransactions(user) {
    showLoading();
    transactionService.findByUser(user)
        .then(transactions => {
            hideLoading();
            addTransactionsToScreen(transactions);
        })
        .catch(error => {
            hideLoading();
        })
}

function addTransactionsToScreen(transactions) {
    const orderedList = document.getElementById("transactions");
    
    transactions.forEach(transaction => {
        const listItem = createTransactionListItem(transaction);
        listItem.appendChild(createDeleteButton(transaction));
        listItem.appendChild(createParagraph(formatDate(transaction.date)));
        listItem.appendChild(createParagraph(formatMoney(transaction.money)));
        listItem.appendChild(createParagraph(transaction.cathegory));
        listItem.appendChild(createParagraph(transaction.description));

        orderedList.appendChild(listItem);  
    });
}

function createTransactionListItem(transaction) {
    const listItem = document.createElement("li");
    listItem.classList.add(transaction.type);
    listItem.id = transaction.uid;
    listItem.addEventListener("click", () => {
        window.location.href = "../transaction/transaction.html?uid=" + transaction.uid;
    });
    return listItem;
}

function createDeleteButton() {
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Remover";
    deleteButton.classList.add("outline", "danger");
    deleteButton.addEventListener("click", event => {
        event.stopPropagation();
        askRemoveTransaction(transaction);
    });
    return deleteButton;
}

function createParagraph(value) {
    const element = document.createElement("p");
    element.innerHTML = value ?? "";
    return element;
}

function askRemoveTransaction(transaction) {
    const shouldRemove = confirm("Deseja remover a transação?");
    if(shouldRemove) {
        removeTransaction(transaction);
    }
}

function removeTransaction(transaction) {
    showLoading();

    transactionService.remove(transaction)
    .then(() => {
        hideLoading();
        alert("Transação excluída com sucesso!")
        document.getElementById(transaction.uid).remove();
    })
    .catch(error => {
        hideLoading();
        alert("Erro ao excluir transação: " + error.message)
    })
}

function openTransactionInsertPage() {
    window.location.href = "../transaction/transaction.html";    
}