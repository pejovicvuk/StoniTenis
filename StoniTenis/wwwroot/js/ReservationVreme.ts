import { RadnoVremeData } from "interfaces.js";

let radnoVremeData: readonly RadnoVremeData[] = [];
export let userImePrezime: string;
export let userID: number;

export function setRadnoVremeData(data: readonly RadnoVremeData[]) {
    radnoVremeData = data;
}
export function setUserDetails(imePrezime: string, id: number): void {
    userImePrezime = imePrezime;
    userID = id;
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('User ID:', userID);
    console.log('User Name:', userImePrezime);
    initCalendar();
    fetchAndCombineReservations();
    makeGrid();
    initDragSelection();
});

async function fetchBrojStolovaLokal(): Promise<number> {
    const lokalID = Number(urlParams.get('id'));
    const brojStolovaUrl = `/Reservation/get-brojStolova?lokalID=${lokalID}`;

    const response = await fetch(brojStolovaUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    const brojStolova = await response.json();
    return brojStolova;
}

function makeGrid(event?: Event): void {
    if (event) event.preventDefault();

    const selectedDayElement = document.querySelector('.day.active');

    const dayOfWeek = parseInt(selectedDayElement.getAttribute('data-day-of-the-week'), 10);
    const radnoVreme = radnoVremeData.find(r => r.danUNedelji === dayOfWeek);

    const openingHours = parseInt(radnoVreme.vremeOtvaranja.split(':')[0], 10);
    const openingMinutes = parseInt(radnoVreme.vremeOtvaranja.split(':')[1], 10);
    const closingHours = parseInt(radnoVreme.vremeZatvaranja.split(':')[0], 10);
    const closingMinutes = parseInt(radnoVreme.vremeZatvaranja.split(':')[1], 10);

    fetchBrojStolovaLokal().then(width => {
        const tbl = document.getElementById('dynamicGrid');

        const table = tbl as HTMLTableElement;
        const timeLabels = document.getElementById('timeLabels');

        table.innerHTML = '';
        if (timeLabels) timeLabels.innerHTML = '';

        const headerRow = table.createTHead().insertRow();
        for (let i = 0; i < width; i++) {
            const headerCell = document.createElement('th');
            headerCell.textContent = `Sto ${i + 1}`;
            headerRow.appendChild(headerCell);
        }

        let currentMinutes = openingHours * 60 + openingMinutes;
        const totalMinutes = closingHours * 60 + closingMinutes;
        let firstLabelAdded = false;

        while (currentMinutes <= totalMinutes) {
            const row = table.insertRow();
            for (let j = 0; j < width; j++) {
                row.insertCell();
            }

            const hours = Math.floor(currentMinutes / 60);
            const minutes = currentMinutes % 60;
            if (currentMinutes === openingHours * 60 + openingMinutes ||
                currentMinutes === totalMinutes ||
                minutes === 0) {
                if (timeLabels) {
                    const timeLabelDiv = document.createElement('div');
                    timeLabelDiv.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                    //if (timeLabelDiv.textContent.endsWith(':30')) {
                    //    timeLabelDiv.style.marginTop = "20px";
                    //    timeLabelDiv.style.position = "absolute";
                    //}
                    timeLabels.appendChild(timeLabelDiv);
                    firstLabelAdded = true;
                }
            }
            currentMinutes += 15;
        }
    });
}


function initDragSelection() {
    const grid = document.getElementById('dynamicGrid');
    let isSelecting = false, startTime, endTime, startCell, endCell;

    if (!grid) return;

    grid.onmousedown = (event) => {
        isSelecting = true;
        startCell = event.target;
        startTime = getTimeFromCell(startCell);
        event.preventDefault(); // Prevent text selection
    };

    grid.onmouseover = (event) => {
        if (isSelecting) {
            endCell = event.target;
            highlightCells(startCell, endCell);
        }
    };

    grid.onmouseup = (event) => {
        if (isSelecting) {
            endCell = event.target;
            endTime = getTimeFromCell(endCell);
            console.log(`Reservation starts at ${startTime}, ends at ${endTime}`);
            isSelecting = false;
            clearHighlight();
        }
    };
}

function getTimeFromCell(cell) {

    const selectedDayElement = document.querySelector('.day.active');
    const dayOfWeek = parseInt(selectedDayElement.getAttribute('data-day-of-the-week'), 10);
    const radnoVreme = radnoVremeData.find(r => r.danUNedelji === dayOfWeek);

    const openingHours = parseInt(radnoVreme.vremeOtvaranja.split(':')[0], 10);
    const openingMinutes = parseInt(radnoVreme.vremeOtvaranja.split(':')[1], 10);
    const closingHours = parseInt(radnoVreme.vremeZatvaranja.split(':')[0], 10);
    const closingMinutes = parseInt(radnoVreme.vremeZatvaranja.split(':')[1], 10);


    const row = cell.parentNode.rowIndex + parseInt(document.getElementById('timeLabels').children[0].textContent.split(':')[0], 10);
    console.log(row);
    const hour = Math.floor(row * 15 / 60);
    const minute = (row * 15) % 60;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
}

function highlightCells(start: HTMLElement, end: HTMLElement) {
    // Ensure elements are treated as HTMLTableCellElement
    const startCell = start as HTMLTableCellElement;
    const endCell = end as HTMLTableCellElement;

    // Check if both cells are in the same column
    if (startCell.cellIndex !== endCell.cellIndex) {
        console.log("Selection must be in the same column.");
        return;
    }

    // Ensure we have valid rows from parent nodes
    const startRow = startCell.parentElement as HTMLTableRowElement;
    const endRow = endCell.parentElement as HTMLTableRowElement;

    // Get the range of rows to be highlighted
    const minRowIdx = Math.min(startRow.rowIndex, endRow.rowIndex);
    const maxRowIdx = Math.max(startRow.rowIndex, endRow.rowIndex);

    // Get the grid table element
    const grid = document.getElementById('dynamicGrid') as HTMLTableElement;
    if (!grid) {
        console.error("Table element not found");
        return;
    }

    // Reset previous highlights in the same column
    Array.from(grid.rows).forEach(row => {
        const cell = row.cells[startCell.cellIndex];
        if (cell) {
            cell.classList.remove('highlight');
        }
    });

    // Highlight the selected range in the column
    for (let i = minRowIdx; i <= maxRowIdx; i++) {
        const cell = grid.rows[i].cells[startCell.cellIndex];
        if (cell) {
            cell.classList.add('highlight');
        }
    }

    // Log the table header information for the selected column
    const headerInfo = grid.rows[0].cells[startCell.cellIndex].textContent;
    console.log(`Reservation made on table: ${headerInfo}`);
}



function clearHighlight() {
    document.querySelectorAll('#dynamicGrid td').forEach(cell => {
        cell.classList.remove('highlight');
    });
}




function addDayClickListener(): void {
    const days: NodeListOf<HTMLElement> = document.querySelectorAll(".day");
    days.forEach((day) => {
        day.addEventListener("click", () => {
            days.forEach(d => d.classList.remove('active'));
            day.classList.add('active');
            makeGrid();
        });
    });
}

const urlParams = new URLSearchParams(window.location.search);
const date: HTMLElement | null = document.querySelector(".date");
const daysContainer: HTMLElement | null = document.querySelector(".days");
const prev: HTMLElement | null = document.querySelector(".prev");
const next: HTMLElement | null = document.querySelector(".next");
const todayBtn: HTMLElement | null = document.querySelector(".today-btn");
const gotoBtn: HTMLElement | null = document.querySelector(".goto-btn");
const dateInput: HTMLInputElement | null = document.querySelector(".date-input");
const eventDay: HTMLElement | null = document.querySelector(".event-day");
const eventDate: HTMLElement | null = document.querySelector(".event-date");
const allReservationsContainer: HTMLElement | null = document.querySelector(".all-reservations");

let today: Date = new Date();
let activeDay: number | undefined;
let month: number = today.getMonth();
let year: number = today.getFullYear();

const months: string[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

const eventsArr: {
    day: number;
    month: number;
    year: number;
    events: {
        title: string;
        time: string;
        korisnikID: number;
        lokalID: number;
        stolovi?: string[];
    }[];
}[] = [];

async function fetchAndCombineReservations(): Promise<void> {
    const reservationUrl = `/Reservation/get-reservation?korisnikID=${userID}`;
    const groupReservationUrl = `/Reservation/get-groupReservation?korisnikID=${userID}`;

    const reservationResponse = await fetch(reservationUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    const groupReservationResponse = await fetch(groupReservationUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    const reservations = await reservationResponse.json();
    const groupReservations = await groupReservationResponse.json();

    if (Array.isArray(reservations) && reservations.length > 0) {
        mergeReservationsWithGroups(reservations, groupReservations);
        updateCalendarWithReservations();
        displayAllReservations();
    } else {
        console.log("No reservations found");
    }
}

function mergeReservationsWithGroups(reservations: any[], groupReservations: any[]): void {
    const groupedReservations = groupReservations.reduce((acc, groupReservation) => {
        const { rezervacijaID, brojStola, lokalID } = groupReservation;
        if (!acc[rezervacijaID]) {
            acc[rezervacijaID] = {
                stolovi: [],
                lokalID: lokalID 
            };
        }
        acc[rezervacijaID].stolovi.push(brojStola);
        return acc;
    }, {});

    reservations.forEach(reservation => {
        const { id } = reservation;
        if (groupedReservations[id]) {
            reservation.stolovi = groupedReservations[id].stolovi || [];
            reservation.lokalID = groupedReservations[id].lokalID; 
        } else {
            reservation.stolovi = [];
        }
    });

    updateReservationsArray(reservations);
}

function updateReservationsArray(reservations: any[]): void {
    const lokalID = Number(urlParams.get('id'));

    reservations.forEach(reservation => {
        if (reservation.lokalID === lokalID) { 
            const date = new Date(reservation.datum);
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();

            const event = {
                title: userImePrezime,
                time: `${reservation.pocetak} - ${reservation.kraj}`,
                korisnikID: reservation.korisniciID,
                lokalID: reservation.lokalID,
                stolovi: reservation.stolovi
            };

            let eventAdded = false;

            eventsArr.forEach(item => {
                if (item.day === day && item.month === month && item.year === year) {
                    item.events.push(event);
                    eventAdded = true;
                }
            });

            if (!eventAdded) {
                eventsArr.push({
                    day: day,
                    month: month,
                    year: year,
                    events: [event]
                });
            }
        }
    });
    console.log(eventsArr);
}

function updateCalendarWithReservations(): void {
    if (activeDay) {
    } else {
        initCalendar();
    }
}

function initCalendar(): void {
    const firstDay: Date = new Date(year, month, 1);
    const lastDay: Date = new Date(year, month + 1, 0);
    const prevLastDay: Date = new Date(year, month, 0);
    const prevDays: number = prevLastDay.getDate();
    const lastDate: number = lastDay.getDate();
    const day: number = firstDay.getDay();
    const nextDays: number = 7 - lastDay.getDay() - 1;

    if (date) {
        date.innerHTML = months[month] + " " + year;
    }

    let days: string = "";

    const firstGridDay: Date = new Date(year, month, 1 - day);

    for (let x: number = 0; x < day; x++) {
        let gridDate = new Date(firstGridDay);
        gridDate.setDate(firstGridDay.getDate() + x);
        let weekDay = ((gridDate.getDay() + 6) % 7) + 1;
        days += `<div class="day prev-date" data-day-of-the-week="${weekDay}">${prevDays - x + 1}</div>`;
    }

    for (let i: number = 1; i <= lastDate; i++) {
        let currentDate = new Date(year, month, i);
        let weekDay = ((currentDate.getDay() + 6) % 7) + 1;
        let event: boolean = false;
        eventsArr.forEach((eventObj) => {
            if (
                eventObj.day === i &&
                eventObj.month === month + 1 &&
                eventObj.year === year
            ) {
                event = true;
            }
        });
        if (
            i === new Date().getDate() &&
            year === new Date().getFullYear() &&
            month === new Date().getMonth()
        ) {
            activeDay = i;
            getActiveDay(i);
            if (event) {
                days += `<div class="day today active event" data-day-of-the-week="${weekDay}">${i}</div>`;
            } else {
                days += `<div class="day today active" data-day-of-the-week="${weekDay}">${i}</div>`;
            }
        } else {
            if (event) {
                days += `<div class="day event" data-day-of-the-week="${weekDay}">${i}</div>`;
            } else {
                days += `<div class="day" data-day-of-the-week="${weekDay}">${i}</div>`;
            }
        }
    }

    for (let j: number = 1; j <= nextDays; j++) {
        let nextDate = new Date(year, month + 1, j);
        let weekDay = ((nextDate.getDay() + 6) % 7) + 1;
        days += `<div class="day next-date" data-day-of-the-week="${weekDay}">${j}</div>`;
    }

    if (daysContainer) {
        daysContainer.innerHTML = days;
    }
    proveriRadnoVreme();
    addListner();
    addDayClickListener();
}

function prevMonth(): void {
    month--;
    if (month < 0) {
        month = 11;
        year--;
    }
    initCalendar();
}

function nextMonth(): void {
    month++;
    if (month > 11) {
        month = 0;
        year++;
    }
    initCalendar();
}

if (prev) {
    prev.addEventListener("click", prevMonth);
}
if (next) {
    next.addEventListener("click", nextMonth);
}

function addListner(): void {
    const days: NodeListOf<HTMLElement> = document.querySelectorAll(".day");
    days.forEach((day) => {
        day.addEventListener("click", (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            getActiveDay(Number(target.innerHTML));
            activeDay = Number(target.innerHTML);
            days.forEach((day) => {
                day.classList.remove("active");
            });
            if (target.classList.contains("prev-date")) {
                prevMonth();
                setTimeout(() => {
                    const days = document.querySelectorAll(".day");
                    days.forEach((day) => {
                        if (
                            !day.classList.contains("prev-date") &&
                            day.innerHTML === target.innerHTML
                        ) {
                            day.classList.add("active");
                        }
                    });
                }, 100);
            } else if (target.classList.contains("next-date")) {
                nextMonth();
                setTimeout(() => {
                    const days = document.querySelectorAll(".day");
                    days.forEach((day) => {
                        if (
                            !day.classList.contains("next-date") &&
                            day.innerHTML === target.innerHTML
                        ) {
                            day.classList.add("active");
                        }
                    });
                }, 100);
            } else {
                target.classList.add("active");
            }
        });
    });
}

if (todayBtn) {
    todayBtn.addEventListener("click", () => {
        today = new Date();
        month = today.getMonth();
        year = today.getFullYear();
        initCalendar();
    });
}

if (dateInput) {
    dateInput.addEventListener("input", (e: InputEvent) => {
        dateInput.value = dateInput.value.replace(/[^0-9/]/g, "");
        if (dateInput.value.length === 2) {
            dateInput.value += "/";
        }
        if (dateInput.value.length > 7) {
            dateInput.value = dateInput.value.slice(0, 7);
        }
        if (e.inputType === "deleteContentBackward") {
            if (dateInput.value.length === 3) {
                dateInput.value = dateInput.value.slice(0, 2);
            }
        }
    });
}

if (gotoBtn) {
    gotoBtn.addEventListener("click", gotoDate);
}

function gotoDate(): void {
    const dateArr: string[] = dateInput.value.split("/");
    if (dateArr.length === 2) {
        if (Number(dateArr[0]) > 0 && Number(dateArr[0]) < 13 && dateArr[1].length === 4) {
            month = Number(dateArr[0]) - 1;
            year = Number(dateArr[1]);
            initCalendar();
            return;
        }
    }
    alert("Invalid Date");
}

function getActiveDay(date: number): void {
    const day: Date = new Date(year, month, date);
    const dayName: string = day.toString().split(" ")[0];
    if (eventDay) {
        eventDay.innerHTML = dayName;
    }
    if (eventDate) {
        eventDate.innerHTML = date + " " + months[month] + " " + year;
    }
}

//function updateEvents(date: number): void {
//    let events = "";

//    eventsArr.forEach((event) => {
//        if (
//            date === event.day &&
//            month + 1 === event.month &&
//            year === event.year
//        ) {
//            event.events.forEach((event) => {
//                const stolovi = event.stolovi ? `Stolovi: ${event.stolovi.join(', ')}` : '';
//                events += `<div class="event">
//                    <div class="title">
//                        <i class="fas fa-circle"></i>
//                        <h3 class="event-title">${event.title}</h3>
//                    </div>
//                    <div class="event-time">
//                        <span class="event-time">${event.time}</span>
//                        <br>
//                        <span class="event-tables">${stolovi}</span>
//                    </div>
//                </div>`;
//            });
//        }
//    });

//    if (events === "") {
//        events = `<div class="no-event"><h3>No Events</h3></div>`;
//    }

//    if (eventsContainer) {
//        eventsContainer.innerHTML = events;
//    }
//}

function displayAllReservations(): void {
    let allReservationsHTML = "";

    eventsArr.forEach((eventObj) => {
        eventObj.events.forEach((event) => {
            const stolovi = event.stolovi ? `Stolovi: ${event.stolovi.join(', ')}` : '';
            const reservationDate = `${eventObj.day} ${months[eventObj.month - 1]} ${eventObj.year}`;

            allReservationsHTML += `
            <div class="reservation" data-day="${eventObj.day}" data-month="${eventObj.month}" data-year="${eventObj.year}">
                <div class="reservation-date">${reservationDate}</div>
                <div class="reservation-details">${event.title} - ${event.time} ${stolovi}</div>
            </div>`;
        });
    });

    if (allReservationsHTML === "") {
        allReservationsHTML = `<div class="no-reservation"><h3>No Reservations</h3></div>`;
    }

    if (allReservationsContainer) {
        allReservationsContainer.innerHTML = allReservationsHTML;


        const reservations = allReservationsContainer.querySelectorAll('.reservation');
        reservations.forEach((reservation) => {
            reservation.addEventListener('click', (e) => {
                const target = e.currentTarget as HTMLElement;
                const day = Number(target.getAttribute('data-day'));
                const month = Number(target.getAttribute('data-month')) - 1; 
                const year = Number(target.getAttribute('data-year'));

                activeDay = day;
                setYearAndMonth(year, month);
                initCalendar();
                document.querySelectorAll('.day').forEach((dayElem) => {
                    if (Number(dayElem.innerHTML) === day && !dayElem.classList.contains('prev-date') && !dayElem.classList.contains('next-date')) {
                        dayElem.classList.add('active');
                    } else {
                        dayElem.classList.remove('active');
                    }
                });
            });
        });
    }
}

function setYearAndMonth(yearVal: number, monthVal: number): void {
    year = yearVal;
    month = monthVal;
}

function proveriRadnoVreme(): void {
    const days = document.querySelectorAll(".day");

    days.forEach(day => {
        const dayElement = day as HTMLElement; 
        const dayOfWeek = parseInt(dayElement.getAttribute("data-day-of-the-week"), 10);
        const radnoVreme = radnoVremeData.find(data => data.danUNedelji === dayOfWeek);

        if (!radnoVreme) {
            dayElement.classList.add("disabled-day");
            dayElement.style.pointerEvents = "none"; 
        } else {
            dayElement.classList.remove("disabled-day");
            dayElement.style.pointerEvents = "auto"; 
        }
    });
}



//kreiranje rezervacija
function createReservationAndGroupReservationJson(eventsArr) {
    const results = [];

    if (eventsArr.length === 0) {
        console.log("nema rezervacija");
        return results; 
    }

    const eventItem = eventsArr[eventsArr.length - 1];

    eventItem.events.forEach(event => {
        if (!event.time) {
            return; 
        }

        const [startTime, endTime] = event.time.split(' - ');
        const formattedDate = `${eventItem.year}-${String(eventItem.month).padStart(2, '0')}-${String(eventItem.day).padStart(2, '0')}`;

        const reservationData = {
            korisnici_id: event.korisnikID,
            pocetak: convertTimeTo24HourFormat(startTime),
            kraj: convertTimeTo24HourFormat(endTime),
            datum: formattedDate,
            stalna_rezervacija: false,
            zavrseno: false
        };

        const groupReservationData = event.stolovi?.map(stolovi_id => ({
            BrojStola: stolovi_id,
            LokalID: event.lokalID
        })) || [];

        results.push({ reservationData, groupReservationData });
    });

    return results.length > 0 ? results : console.log("nema rezervacija");
}

async function sendReservationToServer(reservationData: any, groupReservationData: any[]): Promise<void> {
    const formattedReservationData = {
        KorisniciID: reservationData.korisnici_id,
        Pocetak: `${reservationData.pocetak}:00`,
        Kraj: `${reservationData.kraj}:00`,
        Datum: reservationData.datum,
        StalnaRezervacija: reservationData.stalna_rezervacija,
        Zavrseno: reservationData.zavrseno
    };

    const response = await fetch('add-reservation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedReservationData)
    });

    const data = await response.json();
    const reservationID = data.rezervacijaID;

    if (groupReservationData && groupReservationData.length > 0) {
        groupReservationData.forEach(groupReservation => {
            groupReservation.RezervacijaID = reservationID;
        });
        await sendGroupReservationToServer(groupReservationData);
    }
}

async function sendGroupReservationToServer(groupReservationDataArray: any[]): Promise<void> {
    for (const groupReservationData of groupReservationDataArray) {
        const formattedGroupReservationData = {
            BrojStola: parseInt(groupReservationData.BrojStola, 10),
            LokalID: groupReservationData.LokalID,
            RezervacijaID: groupReservationData.RezervacijaID
        };

        const response = await fetch('/Reservation/add-groupReservation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formattedGroupReservationData)
        });

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            console.log('Group Reservation success:', data);
        } else {
            console.log('Non-JSON response received');
        }
    }
}

function convertTimeTo24HourFormat(time: string): string {
    const [hours, minutes] = time.split(/:| /);
    const period = time.slice(-2);
    let hourNumber = parseInt(hours, 10);

    if (period === 'PM' && hourNumber !== 12) {
        hourNumber += 12;
    } else if (period === 'AM' && hourNumber === 12) {
        hourNumber = 0;
    }

    return `${String(hourNumber).padStart(2, '0')}:${minutes}`;
}
