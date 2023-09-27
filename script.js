const saved = document.querySelector(".saved .saved-container");
const savedExpand = document.querySelector(".saved-expand");

const recent = document.querySelector(".recent .recent-container");
const recentExpand = document.querySelector(".recent-expand");

saved.addEventListener("click", () => {
    if (savedExpand.style.display === "none") {
        savedExpand.style.display = "block";
    } else {
        savedExpand.style.display = "none";
    }
});

recent.addEventListener("click", () => {
    if (recentExpand.style.display === "none") {
        recentExpand.style.display = "block";
    } else {
        recentExpand.style.display = "none";
    }
});
