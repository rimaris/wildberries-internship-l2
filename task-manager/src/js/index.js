const SortBy = {
  CREATED_TIME: 1,
  DONE_TIME: 2,
};
const DEADLINE_NOTIFICATION_MINUTES = 15;

let tasks = {
  1: {
    id: 1,
    title: "Create task manager",
    created: "2023-12-15T15:00",
    deadline: "2023-12-22T15:00",
    doneTime: "2023-12-30T15:00",
    done: true,
    notified: false,
    description: `Need to develop a web application to help users manage their time.
        Main functions:
        1. Create new tasks, with the following information:
         - title 
         - description (optional)
         - due date (date and time)
        2. View existing tasks with the ability to sort by creation date or due date.
        3. Task management:
         - marking tasks as completed
         - task modification
         - task deletion
        4. Notifications about tasks whose due date is approaching (e.g. in browser or via e-mail).
        
        Technical requirements:
        1. Frontend: Pure JavaScript or any modern framework (React, Vue, Angular, etc.).
        2. Data storage: use browser storage (localStorage, sessionStorage, etc.).
        3. Notifications: you can use Service Workers or third-party libraries for browser notifications.`,
  },
  2: {
    id: 2,
    title: "Implement Dark Mode",
    created: "2023-12-23T10:30",
    deadline: "2024-01-20T18:00",
    doneTime: null,
    done: false,
    notified: false,
    description: `Enhance the user experience by adding a Dark Mode feature to the task manager application.
      Main requirements:
      1. Allow users to toggle between light and dark mode.
      2. Ensure that the chosen mode is saved and persists across sessions.
      3. Consider providing a default mode based on system preferences.
      4. Adjust the application's color scheme, ensuring readability and aesthetics in both modes.
      5. Test the Dark Mode thoroughly on different browsers and devices.
      
      Technical considerations:
      1. Implement the feature using CSS for styling changes.
      2. Use JavaScript to manage the user's preference for mode.
      3. Ensure a smooth transition between light and dark modes.
      4. Update the UI components dynamically based on the selected mode.
      5. Document the implementation details for future reference.`,
  },
  3: {
    id: 3,
    title: "Integrate Task Search Functionality",
    created: "2024-01-10T12:45",
    deadline: "2024-02-28T17:00",
    doneTime: null,
    done: false,
    notified: false,
    description: `Improve user efficiency by implementing a search functionality in the task manager application.
      Main features:
      1. Add a search bar in the UI to allow users to search for tasks based on title or description.
      2. Ensure the search is case-insensitive and matches partial strings.
      3. Display search results dynamically as the user types in the search bar.
      4. Provide a clear option to reset or clear the search and return to the full task list.
      
      Technical considerations:
      1. Implement the search functionality using JavaScript.
      2. Optimize search performance for a large number of tasks.
      3. Test the feature thoroughly to ensure accurate and responsive results.
      4. Consider adding keyboard shortcuts for accessibility.
      5. Document the search algorithm and user interaction for future maintenance.`,
  },
};

let selectedTaskId = 1;
let sortBy = SortBy.CREATED_TIME;
let orderDesc = true;

function getCurrentDate() {
  let date = new Date();

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();

  return (
    year +
    "-" +
    (month < 10 ? "0" : "") +
    month +
    "-" +
    (day < 10 ? "0" : "") +
    day +
    "T" +
    (hour < 10 ? "0" : "") +
    hour +
    ":" +
    (minute < 10 ? "0" : "") +
    minute
  );
}

function addTask(task) {
  let maxId = 0;
  for (const [key, task] of Object.entries(tasks)) {
    if (parseInt(key) > maxId) {
      maxId = parseInt(key);
    }
  }
  task.id = maxId + 1;
  task.created = getCurrentDate();
  task.doneTime = null;
  task.done = false;
  tasks[task.id] = task;
  selectedTaskId = task.id;
  task.deadlineNotified = false;
  stateUpdated();
}

function setSelectedTaskTitle(title) {
  if (selectedTaskId === null || tasks[selectedTaskId] === undefined) {
    return;
  }
  tasks[selectedTaskId].title = title;
  stateUpdated();
}

function setSelectedTaskDone(done) {
  if (selectedTaskId === null || tasks[selectedTaskId] === undefined) {
    return;
  }
  tasks[selectedTaskId].done = done;
  if (done) {
    tasks[selectedTaskId].doneTime = getCurrentDate();
  } else {
    tasks[selectedTaskId].doneTime = null;
  }
  stateUpdated();
}

function setSelectedTaskDescription(description) {
  if (selectedTaskId === null || tasks[selectedTaskId] === undefined) {
    return;
  }
  tasks[selectedTaskId].description = description;
  stateUpdated();
}

function setSelectedTaskDeadline(deadline) {
  if (selectedTaskId === null || tasks[selectedTaskId] === undefined) {
    return;
  }
  tasks[selectedTaskId].deadline = deadline;
  tasks[selectedTaskId].notified = false;
  stateUpdated();
}

function deleteSelectedTask() {
  if (selectedTaskId === null || tasks[selectedTaskId] === undefined) {
    return;
  }
  delete tasks[selectedTaskId];
  selectedTaskId = null;
  stateUpdated();
}

const taskDescriptionElem = document.querySelector(
  ".task-details__description"
);
const taskListElem = document.querySelector(".task-list");
const mainTaskDetailsElem = document.querySelector(".main__task-details");
const sortBySelect = document.querySelector(".sort-by__select");
const sortByOrderBtn = document.querySelector(".sort-by__order-btn");
const modalCloseBtn = document.querySelector(".modal__close-btn");
const modalEl = document.querySelector(".modal");
const createTaskBtn = document.querySelector(".create-new-task-btn");
const modalSubmitBtn = document.querySelector(".modal__submit-btn");
const modalTaskDetailsElem = document.querySelector(".modal__task-details");

function sortFunc(a, b) {
  let aVal,
    bVal = null;
  if (sortBy == SortBy.CREATED_TIME) {
    aVal = a.created;
    bVal = b.created;
  } else {
    aVal = a.doneTime;
    bVal = b.doneTime;
  }

  if (aVal === bVal) {
    return 0;
  }

  if (aVal !== null && bVal === null) {
    return -1;
  }
  if (aVal === null && bVal !== null) {
    return 1;
  }

  if (aVal > bVal) {
    return orderDesc ? -1 : 1;
  }

  return orderDesc ? 1 : -1;
}

function stateUpdated() {
  render();
  saveStateToLocalStorage();
}

function render() {
  taskListElem.innerHTML = "";

  const tasksArr = [];
  for (const [key, task] of Object.entries(tasks)) {
    tasksArr.push(task);
  }
  tasksArr.sort(sortFunc);

  for (const task of tasksArr) {
    const snippet = document.createElement("div");
    snippet.classList.add("task-snippet");
    if (selectedTaskId === task.id) {
      snippet.classList.add("task-snippet_selected");
    }

    const statusVal = task.done ? "Done" : "In progress";
    snippet.innerHTML = `<div class="task-snippet__title">${task.title}</div>
    <div class="task-snippet__status">${statusVal}</div>`;
    snippet.dataset.id = task.id;
    taskListElem.appendChild(snippet);

    snippet.addEventListener("click", () => {
      selectedTaskId = task.id;
      stateUpdated();
    });
  }

  if (selectedTaskId === null || tasks[selectedTaskId] === undefined) {
    mainTaskDetailsElem.classList.add("hidden");
  } else {
    const selectedTask = tasks[selectedTaskId];
    mainTaskDetailsElem.classList.remove("hidden");
    mainTaskDetailsElem.querySelector(".task-details__title").value =
      selectedTask.title;
    if (selectedTask.done) {
      mainTaskDetailsElem.querySelector(
        ".task-details__done-checkbox"
      ).checked = true;
    } else {
      mainTaskDetailsElem.querySelector(
        ".task-details__done-checkbox"
      ).checked = false;
    }
    mainTaskDetailsElem.querySelector(".task-details__deadline").value =
      selectedTask.deadline;
    const descriptionText = selectedTask.description.replaceAll("\n", "<br>");
    const taskDetailsEl = mainTaskDetailsElem.querySelector(
      ".task-details__description"
    );
    if (taskDetailsEl.innerHTML !== descriptionText) {
      taskDetailsEl.innerHTML = descriptionText;
    }
  }

  sortByOrderBtn.innerHTML = orderDesc ? "&darr;" : "&uarr;";
}

sortByOrderBtn.addEventListener("click", () => {
  orderDesc = !orderDesc;
  render();
});

sortBySelect.addEventListener("change", (e) => {
  sortBy = e.target.value;
  render();
});

modalCloseBtn.addEventListener("click", () => {
  modalEl.classList.remove("modal_shown");
});

createTaskBtn.addEventListener("click", () => {
  modalEl.classList.add("modal_shown");
  modalTaskDetailsElem.querySelector(".task-details__title").value = "";
  modalTaskDetailsElem.querySelector(".task-details__deadline").value = null;
  modalTaskDetailsElem.querySelector(".task-details__description").innerHTML =
    "Enter task description here";
});

modalSubmitBtn.addEventListener("click", () => {
  const title = modalTaskDetailsElem.querySelector(
    ".task-details__title"
  ).value;
  const deadline = modalTaskDetailsElem.querySelector(
    ".task-details__deadline"
  ).value;
  const description = modalTaskDetailsElem
    .querySelector(".task-details__description")
    .innerHTML.replaceAll("<br>", "\n");
  if (!title || !deadline || !description) {
    return;
  }
  addTask({ title, deadline, description });
  modalEl.classList.remove("modal_shown");
});

function saveStateToLocalStorage() {
  localStorage.setItem("taskManagerTasks", JSON.stringify(tasks));
  localStorage.setItem("taskManagerSelectedTaskId", selectedTaskId);
}

function loadStateFromLocalStorage() {
  const tasksStr = localStorage.getItem("taskManagerTasks");
  if (tasksStr === null) {
    return;
  }
  tasks = JSON.parse(tasksStr);

  selectedTaskId = parseInt(localStorage.getItem("taskManagerSelectedTaskId"));
  if (isNaN(selectedTaskId)) {
    selectedTaskId = null;
  }
}

function setupNotifications() {
  if (Notification.permission !== "denied") {
    Notification.requestPermission();
  }

  setInterval(() => {
    if (Notification.permission !== "denied") {
      for (const [key, task] of Object.entries(tasks)) {
        const difference = new Date(task.deadline) - new Date();
        const differenceMinutes = Math.round(difference / (1000 * 60));
        if (differenceMinutes <= DEADLINE_NOTIFICATION_MINUTES && !task.notified && !task.done) {
          task.notified = true;
          const notification = new Notification(task.title, {body: "Deadline is approaching"});
          notification.onclick = () => {
            selectedTaskId = task.id;
            window.parent.parent.focus();
            notification.close();
            stateUpdated();
          }
          stateUpdated();
        }
      }
    }
  }, 1000);
}

mainTaskDetailsElem
  .querySelector(".task-details__title")
  .addEventListener("input", (e) => {
    setSelectedTaskTitle(e.target.value);
  });

mainTaskDetailsElem
  .querySelector(".task-details__done-checkbox")
  .addEventListener("change", (e) => {
    setSelectedTaskDone(e.target.checked);
  });

mainTaskDetailsElem
  .querySelector(".task-details__description")
  .addEventListener("input", (e) => {
    setSelectedTaskDescription(e.target.innerHTML.replaceAll("<br>", "\n"));
  });

mainTaskDetailsElem
  .querySelector(".task-details__deadline")
  .addEventListener("input", (e) => {
    setSelectedTaskDeadline(e.target.value);
  });
mainTaskDetailsElem
  .querySelector(".task-details__delete-btn")
  .addEventListener("click", () => {
    deleteSelectedTask();
  });

loadStateFromLocalStorage();
setupNotifications();
render();
