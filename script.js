const saved = document.querySelector(".saved .saved-container");
const savedExpand = document.querySelector(".saved-expand");

const recent = document.querySelector(".recent .recent-container");
const recentExpand = document.querySelector(".recent-expand");

let isPortalLoaded = false;

saved.addEventListener("click", e => {
  if (e.target === saved || e.target.parentElement === saved) {
    savedExpand.classList.toggle("display-expand-block");
  } 
});

recent.addEventListener("click", e => {
  if (e.target === recent || e.target.parentElement === recent) {
    recentExpand.classList.toggle("display-expand-block");
  } 
});

// Portal
const showButton = document.querySelector(".search-bar-container");
const favDialog = document.getElementById("portal");
const searchBox = document.getElementById("search-input");
const API = "https://wordcave.vercel.app/wordcave/word/define/";

showButton.addEventListener("keypress", e => {
  if (e.key === "Enter") {
    openPortal();
  }
});

// Listens to see if the portal is closed
favDialog.addEventListener("close", () => {
  document.body.style.filter = "none";
  searchBox.focus();
  resetUI();
});

// Cleans up the portal
function resetUI() {
  document.querySelector("#portal .gif").innerHTML = "";

  const spinner = document.createElement("img");
  spinner.setAttribute("data-src", "./img/Spinner.svg");
  spinner.setAttribute("draggable", "false");
  spinner.className = "lazyload";
  spinner.id = "spinner"
  const header = document.querySelector("#portal .header p");
  header.innerHTML = "";
  header.appendChild(spinner);

  document.querySelector("#portal .meaning").innerHTML = "";
  document.querySelector("#portal .examples").innerHTML = "";
  document.querySelectorAll("#portal .player p").forEach(p => p.style.display = "none");

  document.querySelector("#portal .controls").style.display = "none";

  // Portal controls
  document.querySelector("#portal .controls .pages").innerHTML = "";
  currentPageIndex = 0;

  isPortalLoaded = false;
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function isMp4(URL) {
  return URL.includes("mp4");
}

function getDate(time = null) {
  let date = new Date();

  if (time) date = new Date(time);

  let month = date.getMonth();

  switch (month) {
    case 0:
      month = "Jan";
      break;
    case 1:
      month = "Feb";
      break;
    case 2:
      month = "March";
      break;
    case 3:
      month = "April";
      break;
    case 4:
      month = "May";
      break;
    case 5:
      month = "June";
      break;
    case 6:
      month = "July";
      break;
    case 7:
      month = "Aug";
      break;
    case 8:
      month = "Sep";
      break;
    case 9:
      month = "Oct";
      break;
    case 10:
      month = "Nov";
      break;
    case 11:
      month = "Dec";
      break;
  }
    
  return `${month}, ${date.getDate()}`;
}

// Gives the current time in milliseconds 
function getTime() {
  return new Date().getTime();
}

// Adds new words to local storage
function addRecentLocal(word) {
  const time = getTime();
  if (!localStorage.getItem("Recent")) {
    let items = [{Word: word, Time: time}];
    items = JSON.stringify(items);
    localStorage.setItem("Recent", items);
  } else {
    let recentLocalData = localStorage.getItem("Recent");
    recentLocalData = JSON.parse(recentLocalData);
    recentLocalData.push({Word: word, Time: time});
    recentLocalData = JSON.stringify(recentLocalData);
    localStorage.setItem("Recent", recentLocalData);
  }
}

// Adds new words to the DOM
function addRecent(word, time = null) {
  let FormartedDate;

  if (time) {
    FormartedDate = time;
  } else {
    FormartedDate = getDate();
    // Adds the new word to local storage
    addRecentLocal(word);
  }
  
  const orderedList = document.querySelector(".recent-expand ol")
  const recentWord = document.createElement("li");

  // Adds an event listener to the new item only if it is created by invoking the search bar
  if (!time) getNewItemReady(recentWord);

  recentWord.innerHTML = `${word}`;
  const dateHolder = document.createElement("p");
  dateHolder.innerHTML = FormartedDate;

  recentWord.appendChild(dateHolder);

  // Checks to see if there is an `ol`
  if (!orderedList) {
    const newOrderedList = document.createElement("ol");
    newOrderedList.prepend(recentWord);

    document.querySelector(".recent-container .recent-expand")
      .appendChild(newOrderedList);
  } else {
    orderedList.prepend(recentWord);
  }
}

function mp4Append(URL) {
  const mp4Video = document.createElement("video");
  mp4Video.setAttribute("autoplay", "");
  mp4Video.setAttribute("oncanplay", "this.muted = true");
  mp4Video.setAttribute("loop", "");

  const mp4Source = document.createElement("source");
  mp4Source.setAttribute("src", URL);
  mp4Source.setAttribute("type", "video/mp4");

  const support = document.createTextNode("Your browser does not support video tag");

  mp4Video.appendChild(mp4Source);
  mp4Video.appendChild(support);
  
  document.querySelector(".gif").appendChild(mp4Video);
}

function gifAppend(URL) {
  const gifImg = document.createElement("img");
  gifImg.setAttribute("data-src", URL);
  gifImg.classList.add("lazyload");
  document.querySelector(".gif").appendChild(gifImg);
}

let xhrResponseText;
function assembler(e, showWord = undefined) {
  // If the e === `internal`, `assembler` is invoked by manually, not by the search bar
  if (e.key === "Enter" || e === "internal") {
    let userInput = searchBox.value.trim().toLowerCase();

    // Checks to see if the current process is invoked by the search bar
    // showWord only `!` when the current process is invoked by the search bar
    // otherwise we pass a desired word to process along with it when we call the `assembler` manually
    if (showWord) userInput = showWord.toLowerCase();

    const searchQuery = API + userInput;
    const xhr = new XMLHttpRequest();

    xhr.open("GET", searchQuery);
    xhr.onreadystatechange = function () {
      if (this.readyState === 4) {
        if (this.status === 200) {
          if (JSON.parse(this.responseText) === "Word not Found or Something went wrong!") {
            document.querySelector("#portal .header p").innerHTML = "We could not find the word in our servers!";
            return;
          }
          userInput = capitalize(userInput);
          
          // Calls addRecent only if the current process invoked by the search bar
          if (!showWord) addRecent(userInput);
          
          // Sends how many definitions are there
          addPages(JSON.parse(this.responseText).Definition.Senses.length);

          // Adds event listeners to pages and initialize some variables
          checkPages();
          xhrResponseText = [this.responseText, userInput];

          const response = JSON.parse(this.responseText).Definition.Senses[0];
          const definition = document.createElement('li');
          definition.innerHTML = response.Definition;
          const examples = document.createElement('li');
          examples.innerHTML = response.Examples;
          
          document.querySelector(".header p").innerHTML = userInput;
          document.querySelectorAll(".player p")
            .forEach(p => p.style.display = "block");
          document.querySelector(".meaning").appendChild(definition);
          document.querySelector(".examples").appendChild(examples);

          // Shows the controls
          document.querySelector("#portal .controls").style.display = "flex";
          isPortalLoaded = true;

          const defId = response.ID;

          // Returns `undefined` if the correct media is not found
          const media = JSON.parse(this.responseText).Media[defId];

          if (media === undefined) {
            console.log("Media not found!");
          } else if (!media.includes("https")) {
            if (media.includes("opt")) {
              const mediaBase = `https://word-images.cdn-wordup.com/${media}`;
              isMp4(mediaBase) ? mp4Append(mediaBase) : gifAppend(mediaBase);
            } else {
              const mediaBase = `https://word-images.cdn-wordup.com/opt/${media}`;
              isMp4(mediaBase) ? mp4Append(mediaBase) : gifAppend(mediaBase);
            }
          } else {
            isMp4(media) ? mp4Append(media) : gifAppend(media);
         }

        } else {
          console.log("Something went wrong!");
        }
      }
    };

    xhr.send();
    
    xhr.onerror = () => {
      document.querySelector("#portal .header p").innerHTML = "Try Again!";
    };

    // Aborts the xhr request if the user closes the portal 
    favDialog.addEventListener("close", () => xhr.abort());
  }
}

showButton.addEventListener("keypress", assembler);

// Closes the portal when the user clicks the header `p`
document.addEventListener("click", (e) => {
  const word = document.querySelector(".header p");
  if (favDialog.open) {
    if (e.target === word) {
      favDialog.close();
    }
  }
});

// Gets the recent words from local storage and add them to recent window
function displayRecent() {
  let recentItems = localStorage.getItem("Recent");
  if (!recentItems) return;
  recentItems = JSON.parse(recentItems);
  recentItems.forEach(item => {
    addRecent(item.Word, getDate(item.Time));
  })

  // Adds event listeners to those items 
  const recentWordsList = document.querySelectorAll(".recent-container .recent-expand ol li");
  getItemsReady(recentWordsList);
}

document.addEventListener("DOMContentLoaded", displayRecent);

// Adds event listeners to recent & saved items 
function getItemsReady(itemLists) {
  itemLists.forEach(item => {
    item.addEventListener("click", e => {
      if (e.target === item) {
        const word = e.target.innerText.split("\n")[0];
        invokeAssembler(word);
      } else if (e.target.parentElement === item) {
        const word = e.target.parentElement.innerText.split("\n")[0];
        invokeAssembler(word);
      }
    });
  });
}

// Adds an event listener to a newly created item, those words that are freshly added to DOM
function getNewItemReady(item) {
    item.addEventListener("click", e => {
      if (e.target === item) {
        const word = e.target.innerText.split("\n")[0];
        invokeAssembler(word);
      } else if (e.target.parentElement === item) {
        const word = e.target.parentElement.innerText.split("\n")[0];
        invokeAssembler(word);
      }
    });
}

function invokeAssembler(word) {
  const MESSAGE = "internal";
  assembler(MESSAGE, word);
  openPortal();
}

function openPortal() {
  favDialog.showModal();
  document.body.style.filter = "blur(7px)";
}

// Portal's controls
const nextBtn = document.querySelector("#portal .controls #next");
const beforeBtn = document.querySelector("#portal .controls #before");

let circles;
let itemLeng;
function checkPages() {
  circles = document.querySelectorAll("#portal .controls .pages li");
  itemLeng = circles.length - 1;

  circles.forEach((item, key) => {
    // If the user clicks a specific item
    item.addEventListener("click", () => {
      pageScaler(key);
      resetNewPageUI();
      updatePortal(currentPageIndex);
    });
  });
  circles.item(0).className = "scaler";
}

function resetNewPageUI() {
  document.querySelector("#portal .gif").innerHTML = "";
  document.querySelector("#portal .meaning").innerHTML = "";
  document.querySelector("#portal .examples").innerHTML = "";
  document.querySelectorAll("#portal .player p")
    .forEach((p) => (p.style.display = "none"));
}

// Stores the current page index
let currentPageIndex = 0;

nextBtn.addEventListener("click", () => {
  if (itemLeng === currentPageIndex) {
    console.log("Maximum `next` limit");
  } else {
    currentPageIndex = currentPageIndex + 1;
    const nextItem = circles.item(currentPageIndex);
    resetPages();
    nextItem.classList.add("scaler");
    resetNewPageUI();
    updatePortal(currentPageIndex);
  }
});

beforeBtn.addEventListener("click", () => {
  if (currentPageIndex === 0) {
    console.log("maximum `before` limit");
  } else {
    currentPageIndex = currentPageIndex - 1;
    const nextItem = circles.item(currentPageIndex);
    resetPages();
    nextItem.classList.add("scaler");
    resetNewPageUI();
    updatePortal(currentPageIndex);
  }
})

// Portal Shortcuts
document.addEventListener("keydown", e => {
  if (favDialog.open && isPortalLoaded) {
    if (e.key === "ArrowRight") {
      nextBtn.dispatchEvent(new Event("click"));
    } else if (e.key === "ArrowLeft") {
      beforeBtn.dispatchEvent(new Event("click"));
    }
  }
});

function resetPages() {
  circles.forEach(page => {
    page.classList.remove("scaler");
  });
}

function pageScaler(listIndex) {
  const nextItem = circles.item(listIndex);
  resetPages();
  currentPageIndex = listIndex;
  nextItem.classList.add("scaler");
}

// Updates the portal
function updatePortal(pageIndex) {
  const [responseText, userInput] = xhrResponseText;
  const response = JSON.parse(responseText).Definition.Senses[pageIndex];
  const definition = document.createElement("li");
  definition.innerHTML = response.Definition;
  const examples = document.createElement("li");
  examples.innerHTML = response.Examples;

  document.querySelector(".header p").innerHTML = userInput;
  document
    .querySelectorAll(".player p")
    .forEach((p) => (p.style.display = "block"));
  document.querySelector(".meaning").appendChild(definition);
  document.querySelector(".examples").appendChild(examples);

  // Shows the controls
  document.querySelector("#portal .controls").style.display = "flex";

  const defId = response.ID;

  // Returns `undefined` if the correct media is not found
  const media = JSON.parse(responseText).Media[defId];

  if (media === undefined) {
    console.log("Media not found!");
  } else if (!media.includes("https")) {
    if (media.includes("opt")) {
      const mediaBase = `https://word-images.cdn-wordup.com/${media}`;
      isMp4(mediaBase) ? mp4Append(mediaBase) : gifAppend(mediaBase);
    } else {
      const mediaBase = `https://word-images.cdn-wordup.com/opt/${media}`;
      isMp4(mediaBase) ? mp4Append(mediaBase) : gifAppend(mediaBase);
    }
  } else {
    isMp4(media) ? mp4Append(media) : gifAppend(media);
  }
}

function addPages(howMany) {
  // We don't want to start the count with `0`
  const howManyItems = howMany - 1;
  const pageContainer = document.querySelector("#portal .controls .pages");
  for (let index = 0; index <= howManyItems; index++) {
    const newItem = document.createElement("li");
    pageContainer.appendChild(newItem);
  }
}
