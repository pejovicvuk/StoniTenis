document.addEventListener('DOMContentLoaded', () => {
    const startTimeSelects = document.querySelectorAll('.start-time');
    const endTimeSelects = document.querySelectorAll('.end-time');
    // Function to populate time options
    function populateTimeOptions(select, start, end, initialValue) {
        select.innerHTML = ''; // Clear existing options
        for (let hour = start; hour <= end; hour++) {
            for (let min = 0; min < 60; min += 30) {
                let time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
                if (hour === end && min !== 0)
                    break; // Stop adding beyond the end limit
                let option = new Option(time, time);
                select.options.add(option);
                if (time === initialValue) {
                    select.value = time; // Set the initial value if it matches
                }
            }
        }
    }
    // Initialize all select elements with times
    startTimeSelects.forEach((select) => populateTimeOptions(select, 6, 23)); // From 6:00 AM to 11:30 PM
    endTimeSelects.forEach((select) => populateTimeOptions(select, 6, 23));
    // Function to update end times based on selected start time
    function updateEndTimeOptions(startTimeSelect, endTimeSelect) {
        const selectedTime = startTimeSelect.value;
        const selectedHour = parseInt(selectedTime.split(':')[0], 10);
        const selectedMinute = parseInt(selectedTime.split(':')[1], 10);
        // Determine the starting hour for the end time options
        let startHour = selectedHour + (selectedMinute === 30 ? 1 : 0);
        // Repopulate the end time options starting from the next available half-hour interval
        populateTimeOptions(endTimeSelect, startHour, 23);
    }
    // Attach event listeners to start time selects
    startTimeSelects.forEach((select, index) => {
        select.addEventListener('change', () => updateEndTimeOptions(select, endTimeSelects[index]));
    });
    // Initialize end times based on the initial start times (important if the start times are pre-selected)
    startTimeSelects.forEach((select, index) => updateEndTimeOptions(select, endTimeSelects[index]));
    function getRadnoVremeForDay(dayId) {
        return window.radnoVremeData.find(item => item.danUNedelji.toString() === dayId);
    }
    startTimeSelects.forEach((select, index) => {
        let dayId = select.closest('.day-container').querySelector('input[type="checkbox"]').id;
        let radnoVreme = getRadnoVremeForDay(dayId);
        let initialStart = radnoVreme ? radnoVreme.vremeOtvaranja : '06:00';
        console.log(initialStart);
        let initialEnd = radnoVreme ? radnoVreme.vremeZatvaranja : '06:00';
        populateTimeOptions(select, 6, 23, initialStart);
        populateTimeOptions(endTimeSelects[index], 6, 23, initialEnd);
    });
});
export {};
//shvati ovo!!!!
//# sourceMappingURL=Dashboard.js.map