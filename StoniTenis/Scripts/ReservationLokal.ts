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

async function loadReservationHandler(): Promise<void> {
    try {
        const response = await fetch('/api/Reservation/get-reservations');
        const data: Reservation[] = await response.json();
        displayItems(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
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

    }
    container.addEventListener('click', function (event: MouseEvent): void {
        const target = event.target as HTMLElement;
        const child = target.closest('.item');

        console.log(child);
    });
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
 