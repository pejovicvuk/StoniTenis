document.addEventListener('DOMContentLoaded', function () {
    loadReservationHandler();
});
var allData = [];
function loadReservationHandler() {
    fetch('/api/Reservation/get-reservations')
        .then(function (response) { return response.json(); })
        .then(function (data) {
        allData = data;
        displayItems(allData);
    })
        .catch(function (error) { return console.error('Error fetching data:', error); });
}
function displayItems(items) {
    var container = document.getElementById('resultsContainer');
    container.innerHTML = '';
    for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
        var item = items_1[_i];
        var div = document.createElement('div');
        div.className = 'item';
        var h2 = document.createElement('h2');
        var p = document.createElement('p');
        h2.innerText = "".concat(item.klubNaziv);
        p.innerText = "".concat(item.adresa);
        div.appendChild(h2);
        div.appendChild(p);
        container.appendChild(div);
    }
}
function searchItems(searchText) {
    var filteredData = allData.filter(function (item) {
        return item.adresa.toLowerCase().includes(searchText.toLowerCase()) ||
            item.opstina.toLowerCase().includes(searchText.toLowerCase()) ||
            item.klubNaziv.toLowerCase().includes(searchText.toLowerCase());
    });
    displayItems(filteredData);
}
document.getElementById('searchBar').addEventListener('keyup', function (e) {
    var target = e.target;
    searchItems(target.value);
});
//# sourceMappingURL=app.js.map