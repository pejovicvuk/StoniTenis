const modal = document.getElementById("lokalModal") as HTMLElement;

const btn = document.getElementById("addLokalBtn") as HTMLButtonElement;

const span = document.getElementsByClassName("close")[0] as HTMLElement;

btn.onclick = function () {
    modal.style.display = "block";
}

span.onclick = function () {
    modal.style.display = "none";
}

window.onclick = function (event: MouseEvent) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

const form = document.getElementById("lokalForm") as HTMLFormElement;

form.onsubmit = function (event: Event) {
    modal.style.display = "none";
}