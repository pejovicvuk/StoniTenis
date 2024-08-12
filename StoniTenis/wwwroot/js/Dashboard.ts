import { RadnoVremeData } from "interfaces.js"; 

export function initializePage(radnoVremeData: readonly RadnoVremeData[]) {
    document.addEventListener('DOMContentLoaded', () => {
        const startTimeSelects: NodeListOf<HTMLSelectElement> = document.querySelectorAll('.start-time');
        const endTimeSelects: NodeListOf<HTMLSelectElement> = document.querySelectorAll('.end-time');

        console.log(radnoVremeData);

        function populateTimeOptions(select: HTMLSelectElement, start: number, end: number, initialValue?: string): void {
            select.innerHTML = '';
            for (let hour: number = start; hour <= end; hour++) {
                for (let min: number = 0; min < 60; min += 30) {
                    let time: string = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
                    if (hour === end && min !== 0) break;
                    let option = new Option(time, time);
                    select.options.add(option);
                    if (time === initialValue) {
                        select.value = time;
                    }
                }
            }
        }

        startTimeSelects.forEach((select: HTMLSelectElement) => populateTimeOptions(select, 6, 23)); // od kad do kad
        endTimeSelects.forEach((select: HTMLSelectElement) => populateTimeOptions(select, 6, 23));

        function updateEndTimeOptions(startTimeSelect: HTMLSelectElement, endTimeSelect: HTMLSelectElement): void {
            const selectedTime: string = startTimeSelect.value;
            const selectedHour: number = parseInt(selectedTime.split(':')[0], 10);
            const selectedMinute: number = parseInt(selectedTime.split(':')[1], 10);

            let startHour: number = selectedHour + (selectedMinute === 30 ? 1 : 0);

            populateTimeOptions(endTimeSelect, startHour, 23);
        }

        startTimeSelects.forEach((select: HTMLSelectElement, index: number) => {
            select.addEventListener('change', () => updateEndTimeOptions(select, endTimeSelects[index]));
        });

        startTimeSelects.forEach((select: HTMLSelectElement, index: number) => updateEndTimeOptions(select, endTimeSelects[index]));
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
    });
}