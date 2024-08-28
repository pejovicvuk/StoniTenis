var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let radnoVremeData = [];
export let userImePrezime;
export let userID;
export function setRadnoVremeData(data) {
    radnoVremeData = data;
}
export function setUserDetails(imePrezime, id) {
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
function fetchBrojStolovaLokal() {
    return __awaiter(this, void 0, void 0, function* () {
        const lokalID = Number(urlParams.get('id'));
        const brojStolovaUrl = `/Reservation/get-brojStolova?lokalID=${lokalID}`;
        const response = yield fetch(brojStolovaUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const brojStolova = yield response.json();
        return brojStolova;
    });
}
function makeGrid(event) {
    if (event)
        event.preventDefault();
    const selectedDayElement = document.querySelector('.day.active');
    const dayOfWeek = parseInt(selectedDayElement.getAttribute('data-day-of-the-week'), 10);
    const radnoVreme = radnoVremeData.find(r => r.danUNedelji === dayOfWeek);
    const openingHours = parseInt(radnoVreme.vremeOtvaranja.split(':')[0], 10);
    const openingMinutes = parseInt(radnoVreme.vremeOtvaranja.split(':')[1], 10);
    const closingHours = parseInt(radnoVreme.vremeZatvaranja.split(':')[0], 10);
    const closingMinutes = parseInt(radnoVreme.vremeZatvaranja.split(':')[1], 10);
    fetchBrojStolovaLokal().then(width => {
        const tbl = document.getElementById('dynamicGrid');
        const table = tbl;
        const timeLabels = document.getElementById('timeLabels');
        table.innerHTML = '';
        if (timeLabels)
            timeLabels.innerHTML = '';
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
    if (!grid)
        return;
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
function highlightCells(start, end) {
    // Ensure elements are treated as HTMLTableCellElement
    const startCell = start;
    const endCell = end;
    // Check if both cells are in the same column
    if (startCell.cellIndex !== endCell.cellIndex) {
        console.log("Selection must be in the same column.");
        return;
    }
    // Ensure we have valid rows from parent nodes
    const startRow = startCell.parentElement;
    const endRow = endCell.parentElement;
    // Get the range of rows to be highlighted
    const minRowIdx = Math.min(startRow.rowIndex, endRow.rowIndex);
    const maxRowIdx = Math.max(startRow.rowIndex, endRow.rowIndex);
    // Get the grid table element
    const grid = document.getElementById('dynamicGrid');
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
function addDayClickListener() {
    const days = document.querySelectorAll(".day");
    days.forEach((day) => {
        day.addEventListener("click", () => {
            days.forEach(d => d.classList.remove('active'));
            day.classList.add('active');
            makeGrid();
        });
    });
}
const urlParams = new URLSearchParams(window.location.search);
const date = document.querySelector(".date");
const daysContainer = document.querySelector(".days");
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");
const todayBtn = document.querySelector(".today-btn");
const gotoBtn = document.querySelector(".goto-btn");
const dateInput = document.querySelector(".date-input");
const eventDay = document.querySelector(".event-day");
const eventDate = document.querySelector(".event-date");
const allReservationsContainer = document.querySelector(".all-reservations");
let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();
const months = [
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
const eventsArr = [];
function fetchAndCombineReservations() {
    return __awaiter(this, void 0, void 0, function* () {
        const reservationUrl = `/Reservation/get-reservation?korisnikID=${userID}`;
        const groupReservationUrl = `/Reservation/get-groupReservation?korisnikID=${userID}`;
        const reservationResponse = yield fetch(reservationUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const groupReservationResponse = yield fetch(groupReservationUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const reservations = yield reservationResponse.json();
        const groupReservations = yield groupReservationResponse.json();
        if (Array.isArray(reservations) && reservations.length > 0) {
            mergeReservationsWithGroups(reservations, groupReservations);
            updateCalendarWithReservations();
            displayAllReservations();
        }
        else {
            console.log("No reservations found");
        }
    });
}
function mergeReservationsWithGroups(reservations, groupReservations) {
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
        }
        else {
            reservation.stolovi = [];
        }
    });
    updateReservationsArray(reservations);
}
function updateReservationsArray(reservations) {
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
function updateCalendarWithReservations() {
    if (activeDay) {
    }
    else {
        initCalendar();
    }
}
function initCalendar() {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);
    const prevDays = prevLastDay.getDate();
    const lastDate = lastDay.getDate();
    const day = firstDay.getDay();
    const nextDays = 7 - lastDay.getDay() - 1;
    if (date) {
        date.innerHTML = months[month] + " " + year;
    }
    let days = "";
    const firstGridDay = new Date(year, month, 1 - day);
    for (let x = 0; x < day; x++) {
        let gridDate = new Date(firstGridDay);
        gridDate.setDate(firstGridDay.getDate() + x);
        let weekDay = ((gridDate.getDay() + 6) % 7) + 1;
        days += `<div class="day prev-date" data-day-of-the-week="${weekDay}">${prevDays - x + 1}</div>`;
    }
    for (let i = 1; i <= lastDate; i++) {
        let currentDate = new Date(year, month, i);
        let weekDay = ((currentDate.getDay() + 6) % 7) + 1;
        let event = false;
        eventsArr.forEach((eventObj) => {
            if (eventObj.day === i &&
                eventObj.month === month + 1 &&
                eventObj.year === year) {
                event = true;
            }
        });
        if (i === new Date().getDate() &&
            year === new Date().getFullYear() &&
            month === new Date().getMonth()) {
            activeDay = i;
            getActiveDay(i);
            if (event) {
                days += `<div class="day today active event" data-day-of-the-week="${weekDay}">${i}</div>`;
            }
            else {
                days += `<div class="day today active" data-day-of-the-week="${weekDay}">${i}</div>`;
            }
        }
        else {
            if (event) {
                days += `<div class="day event" data-day-of-the-week="${weekDay}">${i}</div>`;
            }
            else {
                days += `<div class="day" data-day-of-the-week="${weekDay}">${i}</div>`;
            }
        }
    }
    for (let j = 1; j <= nextDays; j++) {
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
function prevMonth() {
    month--;
    if (month < 0) {
        month = 11;
        year--;
    }
    initCalendar();
}
function nextMonth() {
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
function addListner() {
    const days = document.querySelectorAll(".day");
    days.forEach((day) => {
        day.addEventListener("click", (e) => {
            const target = e.target;
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
                        if (!day.classList.contains("prev-date") &&
                            day.innerHTML === target.innerHTML) {
                            day.classList.add("active");
                        }
                    });
                }, 100);
            }
            else if (target.classList.contains("next-date")) {
                nextMonth();
                setTimeout(() => {
                    const days = document.querySelectorAll(".day");
                    days.forEach((day) => {
                        if (!day.classList.contains("next-date") &&
                            day.innerHTML === target.innerHTML) {
                            day.classList.add("active");
                        }
                    });
                }, 100);
            }
            else {
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
    dateInput.addEventListener("input", (e) => {
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
function gotoDate() {
    const dateArr = dateInput.value.split("/");
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
function getActiveDay(date) {
    const day = new Date(year, month, date);
    const dayName = day.toString().split(" ")[0];
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
function displayAllReservations() {
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
                const target = e.currentTarget;
                const day = Number(target.getAttribute('data-day'));
                const month = Number(target.getAttribute('data-month')) - 1;
                const year = Number(target.getAttribute('data-year'));
                activeDay = day;
                setYearAndMonth(year, month);
                initCalendar();
                document.querySelectorAll('.day').forEach((dayElem) => {
                    if (Number(dayElem.innerHTML) === day && !dayElem.classList.contains('prev-date') && !dayElem.classList.contains('next-date')) {
                        dayElem.classList.add('active');
                    }
                    else {
                        dayElem.classList.remove('active');
                    }
                });
            });
        });
    }
}
function setYearAndMonth(yearVal, monthVal) {
    year = yearVal;
    month = monthVal;
}
function proveriRadnoVreme() {
    const days = document.querySelectorAll(".day");
    days.forEach(day => {
        const dayElement = day;
        const dayOfWeek = parseInt(dayElement.getAttribute("data-day-of-the-week"), 10);
        const radnoVreme = radnoVremeData.find(data => data.danUNedelji === dayOfWeek);
        if (!radnoVreme) {
            dayElement.classList.add("disabled-day");
            dayElement.style.pointerEvents = "none";
        }
        else {
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
        var _a;
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
        const groupReservationData = ((_a = event.stolovi) === null || _a === void 0 ? void 0 : _a.map(stolovi_id => ({
            BrojStola: stolovi_id,
            LokalID: event.lokalID
        }))) || [];
        results.push({ reservationData, groupReservationData });
    });
    return results.length > 0 ? results : console.log("nema rezervacija");
}
function sendReservationToServer(reservationData, groupReservationData) {
    return __awaiter(this, void 0, void 0, function* () {
        const formattedReservationData = {
            KorisniciID: reservationData.korisnici_id,
            Pocetak: `${reservationData.pocetak}:00`,
            Kraj: `${reservationData.kraj}:00`,
            Datum: reservationData.datum,
            StalnaRezervacija: reservationData.stalna_rezervacija,
            Zavrseno: reservationData.zavrseno
        };
        const response = yield fetch('add-reservation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formattedReservationData)
        });
        const data = yield response.json();
        const reservationID = data.rezervacijaID;
        if (groupReservationData && groupReservationData.length > 0) {
            groupReservationData.forEach(groupReservation => {
                groupReservation.RezervacijaID = reservationID;
            });
            yield sendGroupReservationToServer(groupReservationData);
        }
    });
}
function sendGroupReservationToServer(groupReservationDataArray) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const groupReservationData of groupReservationDataArray) {
            const formattedGroupReservationData = {
                BrojStola: parseInt(groupReservationData.BrojStola, 10),
                LokalID: groupReservationData.LokalID,
                RezervacijaID: groupReservationData.RezervacijaID
            };
            const response = yield fetch('/Reservation/add-groupReservation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formattedGroupReservationData)
            });
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const data = yield response.json();
                console.log('Group Reservation success:', data);
            }
            else {
                console.log('Non-JSON response received');
            }
        }
    });
}
function convertTimeTo24HourFormat(time) {
    const [hours, minutes] = time.split(/:| /);
    const period = time.slice(-2);
    let hourNumber = parseInt(hours, 10);
    if (period === 'PM' && hourNumber !== 12) {
        hourNumber += 12;
    }
    else if (period === 'AM' && hourNumber === 12) {
        hourNumber = 0;
    }
    return `${String(hourNumber).padStart(2, '0')}:${minutes}`;
}
//# sourceMappingURL=ReservationVreme.js.map