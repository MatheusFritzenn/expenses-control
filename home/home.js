firebase.auth().onAuthStateChanged(user => {
    if (!user) {
        window.location.href = "../index.html";
    } else {
        findTransactions(user);
    }
})

function findTransactions(user) {
    showLoading();
    firebase.firestore()
        .collection("transactions") 
        .where("user.uid", "==", user.uid)
        .orderBy("date", "desc")
        .get()
        .then(snapshot => {
            console.log("sucesso");
            hideLoading();
            const transactions = snapshot.docs.map(doc => doc.data());
            addTransactionsToScreen(transactions);
        })
        .catch(error => {
            console.log(error)
            hideLoading();
            alert("Erro ao consultar transações!")
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




