document.addEventListener('DOMContentLoaded', () => {
    loadReservationHandler();
});

interface Reservation {
    id: number;
    adresa: string;
    opstina: string;
    grad: string;
    klubNaziv: string;
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
        const h2 = document.createElement('h2');
        const p = document.createElement('p');
        h2.innerText = `${item.klubNaziv}`
        p.innerText = `${item.adresa}`;
        div.appendChild(h2);
        div.appendChild(p);
        container.appendChild(div);

        div.addEventListener('click', function (event: MouseEvent): void {
            localStorage.setItem('selectedLokal', JSON.stringify(item));
            window.location.href = '/api/Reservation/vreme';
        });

    }
}


function searchItems(searchText: string): void {
    const filteredData = allData.filter(item =>
        item.adresa.toLowerCase().includes(searchText.toLowerCase()) ||
        item.opstina.toLowerCase().includes(searchText.toLowerCase()) ||
        item.klubNaziv.toLowerCase().includes(searchText.toLowerCase())
    );
    displayItems(filteredData);
}

document.getElementById('searchBar')!.addEventListener('keyup', (e: KeyboardEvent) => {
    const target = e.target as HTMLInputElement;
    searchItems(target.value);
});

