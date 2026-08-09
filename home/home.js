function logout() {
    showLoading();
    firebase.auth()
        .signOut()
        .then(() => {
            hideLoading();
            window.location.href = "../index.html";
        })
        .catch(error => {
            hideLoading();
            alert("Erro ao fazer logout)");
        })
}

function findTransactions() {
    firebase.firestore()
        .collection("transactions")
        .get()
        .then(snapshot => {
            const transactions = snapshot.docs.map(doc => doc.data());
            addTransactionsToScreen(transactions);
        })
}

function addTransactionsToScreen(transactions) {
    const orderedList = document.getElementById("transactions");
    
    transactions.forEach(transaction => {
        const listItem = document.createElement("li");
        listItem.classList.add(transaction.type);

        const date = document.createElement("p");
        date.innerHTML = formatDate(transaction.date);
        listItem.appendChild(date);

        const money = document.createElement("p");
        money.innerHTML = formatMoney(transaction.money);
        listItem.appendChild(money);

        const cathegory = document.createElement("p");
        cathegory.innerHTML = transaction.cathegory;
        listItem.appendChild(cathegory);

        if (transaction.description) {
            const description = document.createElement("p");
            description.innerHTML = transaction.description;
            listItem.appendChild(description);
        }

        orderedList.appendChild(listItem);  
    });
}

function createTransaction(type, date, currency, value, cathegory, description) {
    return {
        type: type,
        date: date,
        money: { currency: currency, value: value },
        cathegory: cathegory,
        description: description
    };
}

const fakeTransactions = [
    createTransaction('expense', '2026-01-01', 'R$', 10, 'Supermercado'),
    createTransaction('income', '2026-01-02', 'USD', 100, 'Salário', 'Senior Sistemas')
];

findTransactions();

