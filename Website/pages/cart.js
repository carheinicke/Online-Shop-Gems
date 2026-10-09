// ==========================================
// GEMS SCHMUCK - GLOBALE WARENKORB LOGIK (cart.js)
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    // 1. Zähler im Header auf jeder Seite beim Laden aktualisieren
    updateCartBadge();

    // 2. Logik für die Produktseiten ("In den Warenkorb"-Buttons)
    initAddToCartLogic();

    // 3. Logik für die Warenkorb-Seite (falls wir uns auf warenkorb.html befinden)
    if (document.getElementById("cart-container")) {
        renderCartPage();
    }

    // 4. Logik für die Kassen-Seite (falls wir uns auf kasse.html befinden)
    if (document.getElementById("checkout-summary")) {
        renderCheckoutSummary();
    }
});

// ==========================================
// HILFSFUNKTION: PREIS-TEXT IN ZAHL UMWANDELN
// ==========================================
// Wandelt Formate wie "129,00 €" oder "49,00" sicher in eine JavaScript-Zahl um
function parsePriceToFloat(priceString) {
    if (!priceString) return 0;
    // Entfernt Euro-Zeichen, Leerzeichen und Punkte (Tausendertrenner, falls vorhanden)
    let cleaned = priceString.replace('€', '').replace(/\s/g, '').replace(/\./g, '');
    // Ersetzt das deutsche Komma durch einen mathematischen Punkt
    cleaned = cleaned.replace(',', '.');
    let number = parseFloat(cleaned);
    return isNaN(number) ? 0 : number;
}

// ==========================================
// LOGIK: PRODUKTE HINZUFÜGEN
// ==========================================
function initAddToCartLogic() {
    const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
    
    addToCartButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            const productCard = event.target.closest(".product-card");
            
            if (productCard) {
                const productTitle = productCard.querySelector("h3").innerText;
                const productPrice = productCard.querySelector(".price").innerText;
                const productImg = productCard.querySelector(".product-img-wrapper img").src;

                const product = {
                    id: Date.now() + Math.random().toString(36).substr(2, 5), // Eindeutige ID
                    title: productTitle,
                    price: productPrice,
                    img: productImg
                };

                addProductToStorage(product);
                updateCartBadge();

                // Button-Feedback
                button.innerText = "✓ Hinzugefügt";
                button.style.background = "#8d7265";
                setTimeout(() => {
                    button.innerText = "In den Warenkorb";
                    button.style.background = "#4a3b35";
                }, 1500);
            }
        });
    });
}

// ==========================================
// LOGIK: WARENKORB-SEITE RENDERN
// ==========================================
function renderCartPage() {
    const cartContainer = document.getElementById("cart-container");
    const cart = getCartFromStorage();

    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div style="text-align: center; padding: 40px 20px;">
                <svg style="width: 60px; height: 60px; stroke: #8d7265; stroke-width: 1.5; fill: none; margin-bottom: 20px; display: inline-block;" xmlns="http://w3.org" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                <h2 style="color: #4a3b35; font-size: 1.5rem; margin-bottom: 10px; font-weight: 500; font-family: sans-serif;">Dein Warenkorb ist noch leer</h2>
                <p style="color: #8d7265; font-size: 1rem; margin-bottom: 30px; max-width: 400px; margin-left: auto; margin-right: auto; line-height: 1.5; font-family: sans-serif;">Entdecke unsere handgefertigten Kollektionen und finde dein neues Lieblingsstück.</p>
                <a href="shop.html" class="submit-btn" style="text-decoration: none; display: inline-block; width: auto; padding: 12px 35px; background: #4a3b35; color: #fff; border-radius: 25px; transition: background 0.2s; font-family: sans-serif;">Jetzt stöbern</a>
            </div>
        `;
        return;
    }

    let html = '<div style="display: flex; flex-direction: column; gap: 20px;">';
    let total = 0;

    cart.forEach(item => {
        total += parsePriceToFloat(item.price);

        html += `
            <div style="display: flex; align-items: center; justify-content: space-between; background: #f8eee3; padding: 15px 20px; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.02);">
                <div style="display: flex; align-items: center; gap: 20px;">
                    <img src="${item.img}" style="width: 70px; height: 70px; object-fit: cover; border-radius: 8px;" alt="${item.title}">
                    <div>
                        <h3 style="margin: 0 0 5px 0; color: #4a3b35; font-size: 1.1rem;">${item.title}</h3>
                        <p style="margin: 0; color: #8d7265; font-weight: bold;">${item.price}</p>
                    </div>
                </div>
                <button onclick="removeItemFromCart('${item.id}')" style="background: none; border: none; color: #8d7265; cursor: pointer; font-size: 1.1rem; font-weight: bold; transition: color 0.2s;">&times; Entfernen</button>
            </div>
        `;
    });

    html += `
        <div style="border-top: 1px dashed #d9c1ad; padding-top: 20px; margin-top: 20px; display: flex; flex-direction: column; align-items: flex-end; gap: 15px;">
            <p style="font-size: 1.3rem; font-weight: bold; color: #4a3b35; margin: 0;">Gesamtsumme: ${total.toFixed(2).replace('.', ',')} €</p>
            <a href="kasse.html" class="submit-btn" style="text-decoration: none; text-align: center; display: inline-block; width: auto; padding: 12px 35px;">Zur Kasse weitergehen</a>
        </div>
    </div>`;

    cartContainer.innerHTML = html;
}

// ==========================================
// LOGIK: KASSEN-ÜBERSICHT RENDERN
// ==========================================
function renderCheckoutSummary() {
    const summaryContainer = document.getElementById("checkout-summary");
    const totalContainer = document.getElementById("checkout-total");
    const cart = getCartFromStorage();

    if (cart.length === 0) {
        summaryContainer.innerHTML = `<p style="font-style: italic; color: #8d7265;">Dein Warenkorb ist leer.</p>`;
        if (totalContainer) totalContainer.innerText = "0,00 €";
        return;
    }

    let html = '<div style="display: flex; flex-direction: column; gap: 15px;">';
    let total = 0;

    cart.forEach(item => {
        // REPARIERT: Nutzt jetzt die neue, sichere Umwandlungsfunktion
        total += parsePriceToFloat(item.price);

        html += `
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.95rem;">
                <span style="color: #4a3b35; font-weight: 500;">${item.title}</span>
                <span style="color: #8d7265; font-weight: bold;">${item.price}</span>
            </div>
        `;
    });

    html += '</div>';
    summaryContainer.innerHTML = html;
    
    if (totalContainer) {
        totalContainer.innerText = `${total.toFixed(2).replace('.', ',')} €`;
    }
}

// ==========================================
// HILFSFUNKTIONEN (STORAGE & UTILS)
// ==========================================
function getCartFromStorage() {
    const cart = localStorage.getItem("gems_cart");
    return cart ? JSON.parse(cart) : [];
}

function addProductToStorage(product) {
    const cart = getCartFromStorage();
    cart.push(product);
    localStorage.setItem("gems_cart", JSON.stringify(cart));
}

function removeItemFromCart(id) {
    let cart = getCartFromStorage();
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem("gems_cart", JSON.stringify(cart));
    
    updateCartBadge();
    renderCartPage();
}

function updateCartBadge() {
    const cart = getCartFromStorage();
    const badges = document.querySelectorAll(".cart-badge");
    
    badges.forEach(badge => {
        badge.innerText = cart.length;
    });
}

// ==========================================
// LOGIK: KAUFABSCHLUSS & WARENKORB LEEREN
// ==========================================
function handleCheckout(event) {
    event.preventDefault(); 

    const cart = getCartFromStorage();
    if (cart.length === 0) {
        alert("Dein Warenkorb ist leer! Bitte füge zuerst Produkte hinzu.");
        return;
    }

    localStorage.removeItem("gems_cart");
    updateCartBadge();
    window.location.href = "erfolg.html";
}
