const modal = document.getElementById("lokalModal");
const btn = document.getElementById("addLokalBtn");
const span = document.getElementsByClassName("close")[0];
btn.onclick = function () {
    modal.style.display = "block";
};
span.onclick = function () {
    modal.style.display = "none";
};
window.onclick = function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
};
const form = document.getElementById("lokalForm");
form.onsubmit = function (event) {
    modal.style.display = "none";
};
//# sourceMappingURL=AddLokal.js.map