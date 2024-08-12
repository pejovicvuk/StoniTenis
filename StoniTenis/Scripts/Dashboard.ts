export { }; // This line ensures the file is treated as a module
declare global {
    interface Window {
        radnoVremeData: any; // Use 'any' or define a more specific type
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const startTimeSelects: NodeListOf<HTMLSelectElement> = document.querySelectorAll('.start-time');
    const endTimeSelects: NodeListOf<HTMLSelectElement> = document.querySelectorAll('.end-time');

    // Function to populate time options
    function populateTimeOptions(select: HTMLSelectElement, start: number, end: number, initialValue?: string): void {
        select.innerHTML = ''; // Clear existing options
        for (let hour: number = start; hour <= end; hour++) {
            for (let min: number = 0; min < 60; min += 30) {
                let time: string = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
                if (hour === end && min !== 0) break; // Stop adding beyond the end limit
                let option = new Option(time, time);
                select.options.add(option);
                if (time === initialValue) {
                    select.value = time; // Set the initial value if it matches
                }
            }
        }
    }

    // Initialize all select elements with times
    startTimeSelects.forEach((select: HTMLSelectElement) => populateTimeOptions(select, 6, 23)); // From 6:00 AM to 11:30 PM
    endTimeSelects.forEach((select: HTMLSelectElement) => populateTimeOptions(select, 6, 23));

    // Function to update end times based on selected start time
    function updateEndTimeOptions(startTimeSelect: HTMLSelectElement, endTimeSelect: HTMLSelectElement): void {
        const selectedTime: string = startTimeSelect.value;
        const selectedHour: number = parseInt(selectedTime.split(':')[0], 10);
        const selectedMinute: number = parseInt(selectedTime.split(':')[1], 10);

        // Determine the starting hour for the end time options
        let startHour: number = selectedHour + (selectedMinute === 30 ? 1 : 0);

        // Repopulate the end time options starting from the next available half-hour interval
        populateTimeOptions(endTimeSelect, startHour, 23);
    }

    // Attach event listeners to start time selects
    startTimeSelects.forEach((select: HTMLSelectElement, index: number) => {
        select.addEventListener('change', () => updateEndTimeOptions(select, endTimeSelects[index]));
    });

    // Initialize end times based on the initial start times (important if the start times are pre-selected)
    startTimeSelects.forEach((select: HTMLSelectElement, index: number) => updateEndTimeOptions(select, endTimeSelects[index]));
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
//shvati ovo!!!!