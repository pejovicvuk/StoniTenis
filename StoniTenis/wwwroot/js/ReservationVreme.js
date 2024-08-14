let radnoVremeData = [];
export function setRadnoVremeData(x) {
    radnoVremeData = x;
}
document.addEventListener('DOMContentLoaded', () => {
    console.log(radnoVremeData);
});
const selectedTables = [];
function setupSeatSelection() {
    const seats = document.querySelectorAll('.seat');
    seats.forEach(seat => {
        seat.addEventListener('click', () => {
            const seatElement = seat;
            const seatId = seatElement.id;
            if (seatElement.classList.contains('selected')) {
                seatElement.classList.remove('selected');
                const index = selectedTables.indexOf(seatId);
                if (index > -1) {
                    selectedTables.splice(index, 1);
                }
            }
            else {
                seatElement.classList.add('selected');
                selectedTables.push(seatId);
            }
            console.log('Selected Tables:', selectedTables);
        });
    });
}
setupSeatSelection();
const calendar = document.querySelector(".calendar");
const date = document.querySelector(".date");
const daysContainer = document.querySelector(".days");
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");
const todayBtn = document.querySelector(".today-btn");
const gotoBtn = document.querySelector(".goto-btn");
const dateInput = document.querySelector(".date-input");
const eventDay = document.querySelector(".event-day");
const eventDate = document.querySelector(".event-date");
const eventsContainer = document.querySelector(".events");
const addEventBtn = document.querySelector(".add-event");
const addEventWrapper = document.querySelector(".add-event-wrapper");
const addEventCloseBtn = document.querySelector(".close");
const addEventTitle = document.querySelector(".event-name");
const addEventFrom = document.querySelector(".event-time-from");
const addEventTo = document.querySelector(".event-time-to");
const addEventSubmit = document.querySelector(".add-event-btn");
const selectPocetak = document.querySelector(".start-time");
const selectKraj = document.querySelector(".end-time");
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
getEvents();
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
    // Calculate the day of the week for the first day in the grid
    const firstGridDay = new Date(year, month, 1 - day);
    for (let x = 0; x < day; x++) {
        let gridDate = new Date(firstGridDay);
        gridDate.setDate(firstGridDay.getDate() + x);
        let weekDay = ((gridDate.getDay() + 6) % 7) + 1; // Adjust day of the week calculation to start from Monday
        days += `<div class="day prev-date" data-day-of-the-week="${weekDay}">${prevDays - x + 1}</div>`;
    }
    for (let i = 1; i <= lastDate; i++) {
        let currentDate = new Date(year, month, i);
        let weekDay = ((currentDate.getDay() + 6) % 7) + 1; // Monday = 1, Sunday = 7
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
            updateEvents(i);
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
        let weekDay = ((nextDate.getDay() + 6) % 7) + 1; // Monday = 1, Sunday = 7
        days += `<div class="day next-date" data-day-of-the-week="${weekDay}">${j}</div>`;
    }
    if (daysContainer) {
        daysContainer.innerHTML = days;
    }
    addListner();
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
initCalendar();
function addListner() {
    const days = document.querySelectorAll(".day");
    days.forEach((day) => {
        day.addEventListener("click", (e) => {
            const target = e.target;
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
function updateEvents(date) {
    let events = "";
    eventsArr.forEach((event) => {
        if (date === event.day &&
            month + 1 === event.month &&
            year === event.year) {
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
    saveEvents();
}
if (addEventBtn) {
    addEventBtn.addEventListener("click", () => {
        addEventWrapper.classList.toggle("active");
        const activeDay = document.querySelector(".day.active");
        const dayOfWeek = parseInt(activeDay.getAttribute("data-day-of-the-week"), 10);
        const radnoVreme = radnoVremeData.find(data => data.danUNedelji === dayOfWeek);
        if (radnoVreme) {
            addEventTitle.style.display = "block";
            addEventSubmit.style.display = "block";
            selectPocetak.style.display = "block";
            selectKraj.style.display = "block";
            document.getElementById("toLabel").style.display = "block";
            document.getElementById("lokalMessage").style.display = "none";
            const startTime = radnoVreme.vremeOtvaranja.substring(0, 5);
            const endTime = radnoVreme.vremeZatvaranja.substring(0, 5);
            populateSelectOptions(selectPocetak, startTime, endTime);
            populateSelectOptions(selectKraj, startTime, endTime);
        }
        else {
            addEventTitle.style.display = "none";
            addEventSubmit.style.display = "none";
            selectPocetak.style.display = "none";
            selectKraj.style.display = "none";
            document.getElementById("toLabel").style.display = "none";
            document.getElementById("lokalMessage").style.display = "block";
        }
    });
}
function populateSelectOptions(selectElement, start, end) {
    if (!selectElement)
        return;
    selectElement.innerHTML = '';
    const [startHour, startMinute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);
    let currentHour = startHour;
    let currentMinute = startMinute;
    while (currentHour < endHour || (currentHour === endHour && currentMinute <= endMinute)) {
        const timeOption = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
        const optionElement = new Option(timeOption, timeOption);
        selectElement.options.add(optionElement);
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
document.addEventListener("click", (e) => {
    if (e.target !== addEventBtn && addEventWrapper && !addEventWrapper.contains(e.target)) {
        addEventWrapper.classList.remove("active");
    }
});
if (addEventTitle) {
    addEventTitle.addEventListener("input", (e) => {
        addEventTitle.value = addEventTitle.value.slice(0, 60);
    });
}
if (addEventFrom) {
    addEventFrom.addEventListener("input", (e) => {
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
    addEventTo.addEventListener("input", (e) => {
        addEventTo.value = addEventTo.value.replace(/[^0-9:]/g, "");
        if (addEventTo.value.length === 2) {
            addEventTo.value += ":";
        }
        if (addEventTo.value.length > 5) {
            addEventTo.value = addEventTo.value.slice(0, 5);
        }
    });
}
//modifikuj posle kad dodas stolove
if (addEventSubmit) {
    addEventSubmit.addEventListener("click", () => {
        const eventTitle = addEventTitle ? addEventTitle.value : "";
        const eventTimeFrom = selectPocetak ? selectPocetak.value : "";
        const eventTimeTo = selectKraj ? selectKraj.value : "";
        if (eventTitle === "" || eventTimeFrom === "" || eventTimeTo === "") {
            alert("Please fill all the fields");
            return;
        }
        const timeFromArr = eventTimeFrom.split(":");
        const timeToArr = eventTimeTo.split(":");
        if (timeFromArr.length !== 2 ||
            timeToArr.length !== 2 ||
            Number(timeFromArr[0]) > 23 ||
            Number(timeFromArr[1]) > 59 ||
            Number(timeToArr[0]) > 23 ||
            Number(timeToArr[1]) > 59) {
            alert("Invalid Time Format");
            return;
        }
        const timeFrom = convertTime(eventTimeFrom);
        const timeTo = convertTime(eventTimeTo);
        // Add selected tables to the event
        const newEvent = {
            title: eventTitle,
            time: `${timeFrom} - ${timeTo}`,
            stolovi: selectedTables.slice(), // Include a copy of the selected tables
        };
        let eventExist = false;
        eventsArr.forEach((event) => {
            if (event.day === activeDay &&
                event.month === month + 1 &&
                event.year === year) {
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
        let eventAdded = false;
        if (eventsArr.length > 0) {
            eventsArr.forEach((item) => {
                if (item.day === activeDay &&
                    item.month === month + 1 &&
                    item.year === year) {
                    item.events.push(newEvent);
                    eventAdded = true;
                }
            });
        }
        if (!eventAdded) {
            eventsArr.push({
                day: activeDay,
                month: month + 1,
                year: year,
                events: [newEvent],
            });
        }
        addEventWrapper.classList.remove("active");
        addEventTitle.value = "";
        selectPocetak.value = "";
        selectKraj.value = "";
        // Reset selected tables
        selectedTables.length = 0;
        document.querySelectorAll('.seat.selected').forEach(seat => {
            seat.classList.remove('selected');
        });
        updateEvents(activeDay);
        const activeDayEl = document.querySelector(".day.active");
        if (activeDayEl && !activeDayEl.classList.contains("event")) {
            activeDayEl.classList.add("event");
        }
    });
}
eventsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("event")) {
        if (confirm("Are you sure you want to delete this event?")) {
            const eventTitle = e.target.children[0].children[1].innerHTML;
            eventsArr.forEach((event) => {
                if (event.day === activeDay &&
                    event.month === month + 1 &&
                    event.year === year) {
                    event.events.forEach((item, index) => {
                        if (item.title === eventTitle) {
                            event.events.splice(index, 1);
                        }
                    });
                    if (event.events.length === 0) {
                        eventsArr.splice(eventsArr.indexOf(event), 1);
                        const activeDayEl = document.querySelector(".day.active");
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
function saveEvents() {
    localStorage.setItem("events", JSON.stringify(eventsArr));
}
function getEvents() {
    if (localStorage.getItem("events") === null) {
        return;
    }
    eventsArr.push(...JSON.parse(localStorage.getItem("events")));
}
function convertTime(time) {
    let timeArr = time.split(":");
    let timeHour = Number(timeArr[0]);
    let timeMin = timeArr[1];
    let timeFormat = timeHour >= 12 ? "PM" : "AM";
    timeHour = timeHour % 12 || 12;
    return timeHour + ":" + timeMin + " " + timeFormat;
}
//# sourceMappingURL=ReservationVreme.js.map