const modal = document.getElementById("lokalModal");
const btn = document.getElementById("addLokalBtn");
const span = document.getElementsByClassName("close")[0];
btn.onclick = () => modal.style.display = "block";
span.onclick = () => modal.style.display = "block";
window.onclick = function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
};
const form = document.getElementById("lokalForm");
form.onsubmit = () => modal.style.display = "none";
//# sourceMappingURL=AddLokal.js.map