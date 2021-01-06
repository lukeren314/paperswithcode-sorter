var options = {
  sortBy: "stars",
  sortOrder: "",
  include: "all-time",
  tasks: "",
  mustHaveRespository: false,
};

var documentElements = {};
var papers;
var papersList;
var loader;
function setupOptions() {
  papersList = document.getElementById("papers-list");
  setupButtonGroup("sortBy", ["stars", "published-date"]);
  setupButtonGroup("sortOrder", ["descending", "ascending"]);
  setupButtonGroup("include", [
    "all-time",
    "today",
    "this-week",
    "this-month",
    "this-year",
    "ytd",
  ]);
  setupInput("tasks");
  setupBool("must-have-repository");

  loader = document.getElementById("papers-loader");
  stopLoad();
}

function startLoad() {
  loader.style.display = "block";
}

function stopLoad() {
  loader.style.display = "none";
}

function setupButtonGroup(option, buttonIds) {
  documentElements[option] = [];
  for (let buttonId of buttonIds) {
    let button = document.getElementById(buttonId);
    button.addEventListener("click", () => {
      options[option] = buttonId;
      for (let otherButton of documentElements[option]) {
        if (otherButton.id != buttonId) {
          otherButton.classList.remove("selected");
        } else {
          otherButton.classList.add("selected");
        }
      }
    });
    documentElements[option].push(button);
  }
}

function setupInput(option) {
  let inputField = document.getElementById(option);
  inputField.addEventListener("change", () => {
    options[option] = inputField.value;
  });
  documentElements[option] = inputField;
}

function setupBool(option) {
  let boolOption = document.getElementById(option);
  options[option] = false;
  boolOption.addEventListener("click", () => {
    options[option] = !options[option];
    if (options[option]) {
      documentElements[option].add("selected");
    } else {
      documentElements[option].remove("selected");
    }
  });
  documentElements[option] = boolOption;
}

async function getPapers() {
  let inputField = document.getElementById("num-papers");
  console.log("making request");
  let url = "http://localhost:8000/papers?numPapers=" + inputField.value;
  startLoad();
  const responseData = await fetch(url, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => data);
  stopLoad();
  if (responseData.error != undefined) {
    alert(responseData["error"]);
  } else {
    setPapers(responseData);
  }
}

function setPapers(papersData) {
  papers = papersData.papers;
  updatePapersList(options);
}

function createPaperElement(paper) {
  let element = document.createElement("li");
  element.classList.add("paper");
  element.id = paper;
  return element;
}

function updatePapersList(options) {
  papersList.innerHTML = "";
  for (let paper of papers) {
    //filter
    if (options.mustHaveRespository && paper.repository_list.length == 0) {
      continue;
    }
    if (options.tasks) {
      for (let task of options.tasks.trim().split(" ")) {
        if (task) {
          for (let taskName of paper.tasks) {
            if (taskName ==)
          }
        }
      }
      continue;
    }

    let paperElement = createPaperElement(paper);
    papersList.appendChild(paperElement);
  }

  // filter

  // repository
  // date
  // tasks
  // sort
}

window.onload = () => setupOptions();
