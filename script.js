// LocalStorage Key
const STORAGE_KEY = "routines";

// Initialize routines from localStorage
let routines = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// DOM Elements
const routinesDiv = document.getElementById("routines");
const routineFormSection = document.getElementById("routineForm");
const formTitle = document.getElementById("formTitle");
const routineIdField = document.getElementById("routineId");
const routineNameField = document.getElementById("routineName");
const tasksField = document.getElementById("tasks");
const addRoutineFab = document.getElementById("addRoutineFab");
const toggleStatsFab = document.getElementById("toggleStatsFab");
// const analyticsSection = document.getElementById("analytics");

// Save routines to localStorage
function saveRoutines() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(routines));
}

// Populate routines dashboard
function populateRoutines() {
  routinesDiv.innerHTML = ""; // Clear content
  routines.forEach((routine, index) => {
    const routineDiv = document.createElement("div");
    routineDiv.className = "routine";
    routineDiv.innerHTML = `
      <div class="menu" onclick="toggleMenu(event, ${index})">
        ⋮
        <div class="menu-content" id="menu-${index}">
          <button onclick="editRoutine(${index})">Edit</button>
          <button onclick="deleteRoutine(${index})">Delete</button>
        </div>
      </div>
      <h3>${routine.name}</h3>
      <ul>
        ${routine.tasks
          .map(
            (task, taskIndex) => `
          <li class="${task.completed ? "completed" : ""}">
            <input type="checkbox" 
              ${task.completed ? "checked" : ""} 
              onchange="toggleTask(${index}, ${taskIndex})">
            ${task.name}
          </li>
        `
          )
          .join("")}
      </ul>
    `;
    routinesDiv.appendChild(routineDiv);
  });
}

// Initial Load
  updateProgressBar();
  
// Toggle Task Completion
function toggleTask(routineIndex, taskIndex) {
  routines[routineIndex].tasks[taskIndex].completed =
    !routines[routineIndex].tasks[taskIndex].completed;
  saveRoutines();
  populateRoutines();
// updateAnalytics();
  updateProgressBar();
}

// Add Routine
function addRoutine(event) {
  event.preventDefault();
  const routineName = routineNameField.value.trim();
  const tasks = tasksField.value
    .split(",")
    .map((task) => ({ name: task.trim(), completed: false }))
    .filter((task) => task.name);

  if (routineName && tasks.length) {
    const routineId = routineIdField.value;
    if (routineId) {
      // Edit existing routine
      routines[routineId] = { name: routineName, tasks };
    } else {
      // Add new routine
      routines.push({ name: routineName, tasks });
    }
    saveRoutines();
    resetForm();
    populateRoutines();
    routineFormSection.style.display = "none";
  }
}

// Edit Routine
function editRoutine(index) {
  const routine = routines[index];
  routineIdField.value = index;
  routineNameField.value = routine.name;
  tasksField.value = routine.tasks.map((task) => task.name).join(", ");
  formTitle.innerText = "Edit Routine";
  routineFormSection.style.display = "block";
}

// Delete Routine
function deleteRoutine(index) {
  routines.splice(index, 1);
  saveRoutines();
  populateRoutines();
//  updateAnalytics();
}

// Reset Form
function resetForm() {
  routineIdField.value = "";
  routineNameField.value = "";
  tasksField.value = "";
  formTitle.innerText = "Add Routine";
}

// Toggle Menu
function toggleMenu(event, index) {
  event.stopPropagation();
  const menu = document.getElementById(`menu-${index}`);
  menu.style.display = menu.style.display === "block" ? "none" : "block";
}

// Close all menus when clicking outside
document.addEventListener("click", () => {
  document.querySelectorAll(".menu-content").forEach((menu) => {
    menu.style.display = "none";
  });
});

// Weekly and Monthly Summary
function updateAnalytics() {
  const totalTasks = routines.reduce((sum, routine) => sum + routine.tasks.length, 0);
  const completedTasks = routines.reduce(
    (sum, routine) =>
      sum + routine.tasks.filter((task) => task.completed).length,
    0
  );
  const percentage = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  document.getElementById("weeklySummary").innerText = `This week: ${percentage}% tasks completed`;
  document.getElementById("monthlySummary").innerText = `This month: ${percentage}% tasks completed`;
}

// Event Listeners
addRoutineFab.addEventListener("click", () => {
  resetForm();
  routineFormSection.style.display = "block";
});
/*
toggleStatsFab.addEventListener("click", () => {
  const isHidden = analyticsSection.style.display === "none";
  analyticsSection.style.display = isHidden ? "block" : "none";
  if (isHidden) updateAnalytics();
}); 
*/
document
  .getElementById("saveRoutine")
  .addEventListener("click", addRoutine);
document
  .getElementById("cancelRoutine")
  .addEventListener("click", () => (routineFormSection.style.display = "none"));

// Initial Load
populateRoutines();

// updateAnalytics();


// Update Daily Progress Bar
function updateProgressBar() {
  const totalTasks = routines.reduce((sum, routine) => sum + routine.tasks.length, 0);
  const completedTasks = routines.reduce(
    (sum, routine) =>
      sum + routine.tasks.filter((task) => task.completed).length,
    0
  );

  const percentage = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;
  document.getElementById("progressBar").style.width = `${percentage}%`;
}


// Function to reset checkmarks and populate routines for the new day
function resetRoutinesForToday() {
  // Loop through all routines and reset task checkmarks
  routines.forEach((routine) => {
    routine.tasks.forEach((task) => {
      task.completed = false;  // Reset the checkmark (uncheck all tasks)
    });
  });
  updateProgressBar();
populateRoutines();
}




// Trigger the function at the specified time
triggerFunctionAtSpecificTime();



function triggerFunctionAtSpecificTime() {
    // Set the specific time (e.g., 9:00 AM)
    const specificTime = new Date();
    specificTime.setHours(3, 03, 0, 0);  // Set time to 9:00 AM

    // Calculate the delay until the specific time
    const now = new Date();
    let delay = specificTime - now;

    // If the time has already passed today, set the delay for the next day
    if (delay < 0) {
        delay += 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    }

    // Set a timeout to trigger the function at the specific time
    setTimeout(() => {
        // Call your function here
        resetRoutinesForToday();
        console.log("Function triggered!");
        // Refresh the page after the function call
        location.reload();

        // Set the function to trigger again the next day
        setInterval(() => {
           resetRoutinesForToday();
		   console.log("Function triggered!");
            location.reload();
        }, 24 * 60 * 60 * 1000);  // 24 hours in milliseconds
    }, delay);
}







