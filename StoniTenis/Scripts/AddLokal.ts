// Get the modal
const modal = document.getElementById("lokalModal") as HTMLElement;

// Get the button that opens the modal
const btn = document.getElementById("addLokalBtn") as HTMLButtonElement;

// Get the <span> element that closes the modal
const span = document.getElementsByClassName("close")[0] as HTMLElement;

// When the user clicks on the button, open the modal
btn.onclick = function () {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal content, close it
window.onclick = function (event: MouseEvent) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

// Form submission logic
const form = document.getElementById("lokalForm") as HTMLFormElement;

form.onsubmit = function (event: Event) {
    modal.style.display = "none";
}
