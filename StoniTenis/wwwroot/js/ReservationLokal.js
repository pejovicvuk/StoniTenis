document.addEventListener('DOMContentLoaded', () => {
    loadReservationHandler();
});
let allData = [];
function loadReservationHandler() {
    fetch('get-reservations')
        .then(response => response.json())
        .then(data => {
        allData = data;
        displayItems(allData);
    })
        .catch(error => console.error('Error fetching data:', error));
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