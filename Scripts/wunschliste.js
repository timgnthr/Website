let total = 0;
let wishlist = [];

window.onload = function () {
    // Daten aus localStorage laden
    const stored = localStorage.getItem("wishlistData");
    if (stored) {
        wishlist = JSON.parse(stored);
        wishlist.forEach(item => {
            addToDOM(item.name, item.price);
            total += item.price;
        });
        document.getElementById('total').textContent = total.toFixed(2);
    }
};


function addItem() {
    const nameInput = document.getElementById('itemName');
    const priceInput = document.getElementById('itemPrice');
    const name = nameInput.value.trim();
    const price = parseFloat(priceInput.value);

    if (!name || isNaN(price) || price < 0) {
        alert("Bitte gültigen Namen und Preis eingeben.");
        return;
    }

    wishlist.push({ name, price });
    total += price;
    localStorage.setItem("wishlistData", JSON.stringify(wishlist));
    renderList();
    document.getElementById('total').textContent = total.toFixed(2);

    nameInput.value = '';
    priceInput.value = '';
}



function addToDOM(name, price, index) {
    const list = document.getElementById('wishlist');
    const item = document.createElement('li');

    const text = document.createElement('span');
    text.textContent = `${name} - ${price.toFixed(2)} €`;

    const delButton = document.createElement('button');
    delButton.textContent = "✖";
    delButton.className = "delete-btn";

    delButton.onclick = function () {
        total -= price;
        document.getElementById('total').textContent = total.toFixed(2);
        wishlist.splice(index, 1);
        localStorage.setItem("wishlistData", JSON.stringify(wishlist));
        renderList();
    };

    item.appendChild(text);
    item.appendChild(delButton);
    list.appendChild(item);
}


window.onload = function () {
    const stored = localStorage.getItem("wishlistData");
    if (stored) {
        wishlist = JSON.parse(stored);
        wishlist.forEach(item => total += item.price);
        renderList();
        document.getElementById('total').textContent = total.toFixed(2);
    }
};


function renderList() {
    const list = document.getElementById('wishlist');
    list.innerHTML = ''; // Liste leeren

    wishlist.forEach((item, index) => {
        addToDOM(item.name, item.price, index);
    });
}
