const saved = document.querySelector(".saved .saved-container");
const savedExpand = document.querySelector(".saved-expand");

const recent = document.querySelector(".recent .recent-container");
const recentExpand = document.querySelector(".recent-expand");

saved.addEventListener("click", () => {
    savedExpand.classList.toggle("display-expand-block");
});

recent.addEventListener("click", () => {
    recentExpand.classList.toggle("display-expand-block");
});
