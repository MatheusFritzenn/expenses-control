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
            hideLoading();
            const transactions = snapshot.docs.map(doc => {
                return {
                    ...doc.data(),
                    uid: doc.id
                };
            });
            addTransactionsToScreen(transactions);
        })
        .catch(error => {
            console.log(error)
            hideLoading();
        })
}

function addTransactionsToScreen(transactions) {
    const orderedList = document.getElementById("transactions");
    
    transactions.forEach(transaction => {
        const listItem = document.createElement("li");
        listItem.classList.add(transaction.type);
        listItem.addEventListener("click", () => {
            window.location.href = "../transaction/transaction.html?uid=" + transaction.uid;
        })

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

function openTransactionInsertPage() {
    window.location.href = "../transaction/transaction.html";    
}