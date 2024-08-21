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
});

const selectedTables: string[] = [];

function setupSeatSelection(): void {
    const seats = document.querySelectorAll('.seat');

    seats.forEach(seat => {
        seat.addEventListener('click', () => {
            const seatElement = seat as HTMLElement;
            const seatId = seatElement.id;

            if (seatElement.classList.contains('selected')) {
                seatElement.classList.remove('selected');
                const index = selectedTables.indexOf(seatId);
                if (index > -1) {
                    selectedTables.splice(index, 1);
                }
            } else {
                seatElement.classList.add('selected');
                selectedTables.push(seatId);
            }

            updateTimeOptions(selectPocetak, selectKraj);
        });
    });
}
function updateTimeOptions(startSelect: HTMLSelectElement | null, endSelect: HTMLSelectElement | null): void {
    if (!startSelect || !endSelect) return;

    const activeDay = document.querySelector(".day.active");
    if (!activeDay) return;

    const dayOfWeek = parseInt(activeDay.getAttribute("data-day-of-the-week"), 10);
    const radnoVreme = radnoVremeData.find(data => data.danUNedelji === dayOfWeek);
    if (!radnoVreme) return;

    const startTime = radnoVreme.vremeOtvaranja.substring(0, 5);
    const endTime = radnoVreme.vremeZatvaranja.substring(0, 5);

    populateSelectOptions(startSelect, startTime, endTime);
    populateSelectOptions(endSelect, startTime, endTime);
}
setupSeatSelection();

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
const eventsContainer: HTMLElement | null = document.querySelector(".events");
const addEventBtn: HTMLElement | null = document.querySelector(".add-event");
const addEventWrapper: HTMLElement | null = document.querySelector(".add-event-wrapper");
const addEventCloseBtn: HTMLElement | null = document.querySelector(".close");
const addEventTitle: HTMLInputElement | null = document.querySelector(".event-name");
const addEventFrom: HTMLInputElement | null = document.querySelector(".event-time-from");
const addEventTo: HTMLInputElement | null = document.querySelector(".event-time-to");
const addEventSubmit: HTMLElement | null = document.querySelector(".add-event-btn");
const selectPocetak: HTMLSelectElement | null = document.querySelector(".start-time");
const selectKraj: HTMLSelectElement | null = document.querySelector(".end-time");
const stolovi: HTMLElement | null = document.querySelector(".containerStolovi");

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

//uzimanje rezervacija serveru
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
        initCalendar();
        updateTimeOptions(selectPocetak, selectKraj);
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
        updateEvents(activeDay);
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
            updateEvents(i);
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
            updateEvents(Number(target.innerHTML));
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

function updateEvents(date: number): void {
    let events = "";

    eventsArr.forEach((event) => {
        if (
            date === event.day &&
            month + 1 === event.month &&
            year === event.year
        ) {
            event.events.forEach((event) => {
                const stolovi = event.stolovi ? `Stolovi: ${event.stolovi.join(', ')}` : '';
                events += `<div class="event">
                    <div class="title">
                        <i class="fas fa-circle"></i>
                        <h3 class="event-title">${event.title}</h3>
                    </div>
                    <div class="event-time">
                        <span class="event-time">${event.time}</span>
                        <br>
                        <span class="event-tables">${stolovi}</span>
                    </div>
                </div>`;
            });
        }
    });

    if (events === "") {
        events = `<div class="no-event"><h3>No Events</h3></div>`;
    }

    if (eventsContainer) {
        eventsContainer.innerHTML = events;
    }
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



if (addEventBtn) {
    addEventBtn.addEventListener("click", () => {
        addEventWrapper.classList.toggle("active");
        const activeDay = document.querySelector(".day.active");
        const dayOfWeek = parseInt(activeDay.getAttribute("data-day-of-the-week"), 10);

        const radnoVreme = radnoVremeData.find(data => data.danUNedelji === dayOfWeek);

        if (radnoVreme) {
            addEventTitle.value = userImePrezime;
            addEventTitle.style.display = "block";
            addEventSubmit.style.display = "block";
            selectPocetak.style.display = "block";
            selectKraj.style.display = "block";
            stolovi.style.display = "flex";
            document.getElementById("toLabel").style.display = "block";
            document.getElementById("lokalMessage").style.display = "none";

            const startTime = radnoVreme.vremeOtvaranja.substring(0, 5);
            const endTime = radnoVreme.vremeZatvaranja.substring(0, 5);

            populateSelectOptions(selectPocetak, startTime, endTime);
            populateSelectOptions(selectKraj, startTime, endTime);
        } else {
            addEventTitle.style.display = "none";
            addEventSubmit.style.display = "none";
            selectPocetak.style.display = "none";
            selectKraj.style.display = "none";
            stolovi.style.display = "none";
            document.getElementById("toLabel").style.display = "none";
            document.getElementById("lokalMessage").style.display = "block";
        }
    });
}

function populateSelectOptions(selectElement: HTMLSelectElement, start: string, end: string): void {
    if (!selectElement) return;

    selectElement.innerHTML = '';

    const [startHour, startMinute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);

    const reservedTimes = eventsArr
        .filter(eventItem =>
            eventItem.day === activeDay &&
            eventItem.month === (month + 1) &&
            eventItem.year === year &&
            selectedTables.some(table => eventItem.events.some(event => event.stolovi?.includes(table)))
        )
        .flatMap(eventItem =>
            eventItem.events.filter(event =>
                event.lokalID === Number(urlParams.get('id')) &&
                selectedTables.some(table => event.stolovi?.includes(table))
            )
        )
        .map(event => ({
            start: convertTimeTo24HourFormat(event.time.split(' - ')[0]),
            end: convertTimeTo24HourFormat(event.time.split(' - ')[1])
        }));

    let currentHour = startHour;
    let currentMinute = startMinute;

    while (currentHour < endHour || (currentHour === endHour && currentMinute <= endMinute)) {
        const currentTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
        const isReserved = reservedTimes.some(reservedTime =>
            (currentTime > reservedTime.start && currentTime < reservedTime.end)
        );

        if (!isReserved || currentTime === reservedTimes.find(reservedTime => reservedTime.start === currentTime)?.start || currentTime === reservedTimes.find(reservedTime => reservedTime.end === currentTime)?.end) {
            const optionElement = new Option(currentTime, currentTime);
            selectElement.options.add(optionElement);
        }

        currentMinute += 15;
        if (currentMinute >= 60) {
            currentMinute = 0;
            currentHour += 1;
        }
    }
}




if (addEventCloseBtn) {
    addEventCloseBtn.addEventListener("click", () => {
        addEventWrapper.classList.remove("active");
    });
}

document.addEventListener("click", (e: MouseEvent) => {
    if (e.target !== addEventBtn && addEventWrapper && !addEventWrapper.contains(e.target as Node)) {
        addEventWrapper.classList.remove("active");
    }
});

if (addEventTitle) {
    addEventTitle.addEventListener("input", (e: InputEvent) => {
        addEventTitle.value = addEventTitle.value.slice(0, 60);
    });
}

if (addEventFrom) {
    addEventFrom.addEventListener("input", (e: InputEvent) => {
        addEventFrom.value = addEventFrom.value.replace(/[^0-9:]/g, "");
        if (addEventFrom.value.length === 2) {
            addEventFrom.value += ":";
        }
        if (addEventFrom.value.length > 5) {
            addEventFrom.value = addEventFrom.value.slice(0, 5);
        }
    });
}

if (addEventTo) {
    addEventTo.addEventListener("input", (e: InputEvent) => {
        addEventTo.value = addEventTo.value.replace(/[^0-9:]/g, "");
        if (addEventTo.value.length === 2) {
            addEventTo.value += ":";
        }
        if (addEventTo.value.length > 5) {
            addEventTo.value = addEventTo.value.slice(0, 5);
        }
    });
}

if (addEventSubmit) {
    addEventSubmit.addEventListener("click", () => {
        const eventTitle: string = addEventTitle ? addEventTitle.value : "";
        const eventTimeFrom: string = selectPocetak ? selectPocetak.value : "";
        const eventTimeTo: string = selectKraj ? selectKraj.value : "";

        if (eventTitle === "" || eventTimeFrom === "" || eventTimeTo === "") {
            alert("Please fill all the fields");
            return;
        }

        const timeFromArr: string[] = eventTimeFrom.split(":");
        const timeToArr: string[] = eventTimeTo.split(":");

        if (
            timeFromArr.length !== 2 ||
            timeToArr.length !== 2 ||
            Number(timeFromArr[0]) > 23 ||
            Number(timeFromArr[1]) > 59 ||
            Number(timeToArr[0]) > 23 ||
            Number(timeToArr[1]) > 59
        ) {
            alert("Invalid Time Format");
            return;
        }

        const timeFrom: string = convertTime(eventTimeFrom);
        const timeTo: string = convertTime(eventTimeTo);

        const newEvent = {
            title: eventTitle,
            time: `${timeFrom} - ${timeTo}`,
            korisnikID: userID,
            lokalID: Number(urlParams.get('id')),
            stolovi: selectedTables.slice(),
        };
        let eventExist: boolean = false;

        eventsArr.forEach((event) => {
            if (
                event.day === activeDay &&
                event.month === month + 1 &&
                event.year === year
            ) {
                event.events.forEach((event) => {
                    if (event.title === eventTitle) {
                        eventExist = true;
                    }
                });
            }
        });

        if (eventExist) {
            alert("Event already added");
            return;
        }

        let eventAdded: boolean = false;

        if (eventsArr.length > 0) {
            eventsArr.forEach((item) => {
                if (
                    item.day === activeDay &&
                    item.month === month + 1 &&
                    item.year === year
                ) {
                    item.events.push(newEvent);
                    eventAdded = true;
                }
            });
        }

        if (!eventAdded) {
            eventsArr.push({
                day: activeDay!,
                month: month + 1,
                year: year,
                events: [newEvent],
            });
        }

        addEventWrapper.classList.remove("active");
        addEventTitle.value = "";
        selectPocetak.value = "";
        selectKraj.value = "";

        selectedTables.length = 0;
        document.querySelectorAll('.seat.selected').forEach(seat => {
            seat.classList.remove('selected');
        });

        updateEvents(activeDay!);
        const activeDayEl = document.querySelector(".day.active");
        if (activeDayEl && !activeDayEl.classList.contains("event")) {
            activeDayEl.classList.add("event");
        }

        const reservations = createReservationAndGroupReservationJson(eventsArr);



        if (reservations) {
            reservations.forEach(reservation => {
                sendReservationToServer(reservation.reservationData, reservation.groupReservationData);
                //sendGroupReservationToServer(reservation.groupReservationData);
            });
        }
        console.log(eventsArr);
    });
}

eventsContainer.addEventListener("click", (e: MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains("event")) {
        if (confirm("Are you sure you want to delete this event?")) {
            const eventTitle: string = (e.target as HTMLElement).children[0].children[1].innerHTML;
            eventsArr.forEach((event) => {
                if (
                    event.day === activeDay &&
                    event.month === month + 1 &&
                    event.year === year
                ) {
                    event.events.forEach((item, index) => {
                        if (item.title === eventTitle) {
                            event.events.splice(index, 1);
                        }
                    });
                    if (event.events.length === 0) {
                        eventsArr.splice(eventsArr.indexOf(event), 1);
                        const activeDayEl: HTMLElement | null = document.querySelector(".day.active");
                        if (activeDayEl && activeDayEl.classList.contains("event")) {
                            activeDayEl.classList.remove("event");
                        }
                    }
                }
            });
            updateEvents(activeDay);
        }
    }
});

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

//slanje aktivnih rezervacija serveru
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



//funkcije za vreme
function convertTime(time: string): string {
    let timeArr: string[] = time.split(":");
    let timeHour: number = Number(timeArr[0]);
    let timeMin: string = timeArr[1];
    let timeFormat: string = timeHour >= 12 ? "PM" : "AM";
    timeHour = timeHour % 12 || 12;  // Convert "00" to "12" for AM
    return timeHour + ":" + timeMin + " " + timeFormat;
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