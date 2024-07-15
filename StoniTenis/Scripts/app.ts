document.addEventListener('DOMContentLoaded', () => {
    loadReservationHandler();
});

interface Reservation {
    adresa: string;
    opstina: string;
}

let allData: Reservation[] = [];

function loadReservationHandler(): void {
    fetch('/api/Reservation/get-reservations')
        .then(response => response.json())
        .then(data => {
            allData = data as Reservation[];
            displayItems(allData);
        })
        .catch(error => console.error('Error fetching data:', error));
}

function displayItems(items: Reservation[]): void {
    const container = document.getElementById('resultsContainer') as HTMLDivElement;
    container.innerHTML = '';

    for (const item of items) {
        const div = document.createElement('div');
        div.className = 'item';
        const p = document.createElement('p');
        p.innerText = `Address: ${item.adresa}`;
        div.appendChild(p);
        container.appendChild(div);
    }
}

function searchItems(searchText: string): void {
    const filteredData = allData.filter(item =>
        item.adresa.toLowerCase().includes(searchText.toLowerCase()) ||
        item.opstina.toLowerCase().includes(searchText.toLowerCase())
    );
    displayItems(filteredData);
}

document.getElementById('searchBar')!.addEventListener('keyup', (e: KeyboardEvent) => {
    const target = e.target as HTMLInputElement;
    searchItems(target.value);
});
