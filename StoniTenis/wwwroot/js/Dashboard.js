export function initializePage(radnoVremeData) {
    console.log("JavaScript Initialized");
    const startTimeSelects = document.querySelectorAll('.start-time');
    const endTimeSelects = document.querySelectorAll('.end-time');
    startTimeSelects.forEach((select) => populateTimeOptions(select, 6, 23));
    endTimeSelects.forEach((select) => populateTimeOptions(select, 6, 23));
    function updateEndTimeOptions(startTimeSelect, endTimeSelect) {
        const selectedTime = startTimeSelect.value;
        const selectedHour = parseInt(selectedTime.split(':')[0], 10);
        const selectedMinute = parseInt(selectedTime.split(':')[1], 10);
        let startHour = selectedHour + (selectedMinute === 30 ? 1 : 0);
        populateTimeOptions(endTimeSelect, startHour, 23);
    }
    startTimeSelects.forEach((select, index) => {
        select.addEventListener('change', () => updateEndTimeOptions(select, endTimeSelects[index]));
    });
    startTimeSelects.forEach((select, index) => updateEndTimeOptions(select, endTimeSelects[index]));
    function getRadnoVremeForDay(dayId) {
        return radnoVremeData.find(item => item.danUNedelji.toString() === dayId);
    }
    startTimeSelects.forEach((select, index) => {
        let dayId = select.closest('.day-container').querySelector('input[type="checkbox"]').id;
        console.log(dayId);
        let radnoVreme = getRadnoVremeForDay(dayId);
        let formatTime = (time) => {
            let [hours, minutes] = time.split(':');
            hours = hours.padStart(2, '0');
            return `${hours}:${minutes}`;
        };
        let initialStart = radnoVreme ? formatTime(radnoVreme.vremeOtvaranja) : '06:00';
        console.log(initialStart);
        let initialEnd = radnoVreme ? formatTime(radnoVreme.vremeZatvaranja) : '06:00';
        console.log(initialEnd);
        populateTimeOptions(select, 6, 23, initialStart);
        populateTimeOptions(endTimeSelects[index], 6, 23, initialEnd);
    });
    function populateTimeOptions(select, start, end, initialValue) {
        select.innerHTML = '';
        for (let hour = start; hour <= end; hour++) {
            for (let min = 0; min < 60; min += 30) {
                let time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
                if (hour === end && min !== 0)
                    break;
                let option = new Option(time, time);
                select.options.add(option);
                if (time === initialValue) {
                    select.value = time;
                }
            }
        }
    }
}
//# sourceMappingURL=Dashboard.js.map