var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
document.addEventListener('DOMContentLoaded', () => {
    loadReservationHandler();
});
let allData = [];
function loadReservationHandler() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch('get-lokal');
        if (!response.ok) {
            console.error('Failed to fetch data');
            return;
        }
        const data = yield response.json();
        allData = data;
        displayItems(allData);
    });
}
function displayItems(items) {
    const container = document.getElementById('resultsContainer');
    container.innerHTML = '';
    for (const item of items) {
        const div = document.createElement('div');
        div.className = 'item';
        div.setAttribute('data-lokal-id', item.id.toString());
        const h2 = document.createElement('h2');
        const p = document.createElement('p');
        h2.innerText = `${item.klubNaziv}`;
        p.innerText = `${item.adresa}`;
        div.appendChild(h2);
        div.appendChild(p);
        container.appendChild(div);
    }
}
document.getElementById('resultsContainer').addEventListener('click', function (event) {
    const target = event.target;
    const child = target.closest('.item');
    if (child !== null) {
        console.log(child);
        const lokalId = child.getAttribute('data-lokal-id');
        if (lokalId) {
            window.location.href = `Vreme?id=${lokalId}`;
        }
    }
});
function searchItems(searchText) {
    const filteredData = allData.filter(item => item.adresa.toLowerCase().includes(searchText.toLowerCase()) ||
        item.opstina.toLowerCase().includes(searchText.toLowerCase()) ||
        item.klubNaziv.toLowerCase().includes(searchText.toLowerCase()));
    displayItems(filteredData);
}
document.getElementById('searchBar').addEventListener('keyup', (e) => {
    const target = e.target;
    searchItems(target.value);
});
//# sourceMappingURL=ReservationLokal.js.map