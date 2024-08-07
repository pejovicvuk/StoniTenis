const header: HTMLElement | null = document.querySelector(".calendar h3");
const dates: HTMLElement | null = document.querySelector(".dates");
const navs: NodeListOf<HTMLElement> = document.querySelectorAll("#prev, #next");

const months: string[] = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

let date: Date = new Date();
let month: number = date.getMonth();
let year: number = date.getFullYear();

function renderCalendar(): void {
    const start: number = new Date(year, month, 1).getDay();
    const endDate: number = new Date(year, month + 1, 0).getDate();
    const end: number = new Date(year, month, endDate).getDay();
    const endDatePrev: number = new Date(year, month, 0).getDate();

    let datesHtml: string = "";

    for (let i = start; i > 0; i--) {
        datesHtml += `<li class="inactive">${endDatePrev - i + 1}</li>`;
    }

    for (let i = 1; i <= endDate; i++) {
        let className: string =
            i === date.getDate() &&
                month === new Date().getMonth() &&
                year === new Date().getFullYear()
                ? ' class="today"'
                : "";
        datesHtml += `<li${className}>${i}</li>`;
    }

    for (let i = end; i < 6; i++) {
        datesHtml += `<li class="inactive">${i - end + 1}</li>`;
    }

    if (dates) {
        dates.innerHTML = datesHtml;
    }
    if (header) {
        header.textContent = `${months[month]} ${year}`;
    }
}

navs.forEach((nav: HTMLElement) => {
    nav.addEventListener("click", (e: Event) => {
        const target = e.target as HTMLElement;
        const btnId: string = target.id;

        if (btnId === "prev" && month === 0) {
            year--;
            month = 11;
        } else if (btnId === "next" && month === 11) {
            year++;
            month = 0;
        } else {
            month = btnId === "next" ? month + 1 : month - 1;
        }

        date = new Date(year, month, new Date().getDate());
        year = date.getFullYear();
        month = date.getMonth();

        renderCalendar();
    });
});

renderCalendar();
