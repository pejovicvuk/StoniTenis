
document.addEventListener('DOMContentLoaded', function () {
    loadReservationHandler(); 
});


let allData = []; 

function loadReservationHandler() {
    fetch('/api/Reservation/get-reservations')
        .then(res => res.json())
        .then(data => {
            allData = data; 
            displayItems(allData); 
        })
        .catch(error => console.error('Error fetching data:', error));
}

function displayItems(items) {
    const container = document.getElementById('resultsContainer');
    container.innerHTML = ''; 
    items.forEach(item => {
        container.innerHTML += `
            <div class="item">
                <p>Lokacija: ${item.lokacija}</p>
                <p>Adresa: ${item.adresa}</p>
            </div>
        `;
    });
}

function searchItems(searchText) {
    const filteredData = allData.filter(item =>
        item.adresa.toLowerCase().includes(searchText.toLowerCase()) ||
        item.lokacija.toLowerCase().includes(searchText.toLowerCase())
    );
    displayItems(filteredData); 
}


document.getElementById('searchBar').addEventListener('keyup', (e) => {
    searchItems(e.target.value);
});

