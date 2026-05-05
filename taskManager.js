let taskInput = document.getElementById("taskInput");
let addTask = document.getElementById("addTask");
let taskList = document.getElementById("taskList");

let filter = "all";

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
console.log(tasks);

addTask.addEventListener("click", function () {
    if (taskInput.value === "") return;

    let task = {
        id: Date.now(),
        name: taskInput.value,
        completed: false,
        time: new Date().toLocaleDateString()
    };

    tasks.push(task);
    taskInput.value = "";

    saveTask();
});

let dateElement = document.getElementById("currentDate");

let today = new Date();

let options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
};

dateElement.textContent = today.toLocaleDateString('en-US', options);

function saveTask() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    loadTask();
}

function loadTask() {
    taskList.innerHTML = "";

    let filtered = [];

    if (filter === "all") {
        filtered = tasks;
    }
    else if (filter === "pending") {
        for (let i = 0; i < tasks.length; i++) {
            if (!tasks[i].completed) {
                filtered.push(tasks[i]);
            }
        }
    }
    else if (filter === "completed") {
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].completed) {
                filtered.push(tasks[i]);
            }
        }
    }

    filtered.forEach(task => {
        let div = document.createElement("div");
        div.classList.add("taskitem");

        div.innerHTML = `
            <div class="left">
                <input type="checkbox" ${task.completed ? "checked" : ""} 
                onclick="toggleTask(${task.id})">

                <span class="${task.completed ? "completed" : ""}">
                    ${task.name}
                </span>

                <span class="dateTask">
                    ${task.time}
                </span>
            </div>

            <div class="actions">
                <button class="editbut" onclick="editTask(${task.id})">Edit</button>
                <button class="deletebut" onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `;

        taskList.appendChild(div);
    });

    updateCount();
}

function toggleTask(id) {
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === id) {
            tasks[i].completed = !tasks[i].completed;
        }
    }

    saveTask();
}

function deleteTask(id) {
    let newTasks = [];

    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id !== id) {
            newTasks.push(tasks[i]);
        }
    }

    tasks = newTasks;

    saveTask();
}

function editTask(id) {
    let newName = prompt("Edit Task");

    if (!newName) return;

    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === id) {
            tasks[i].name = newName;
        }
    }

    saveTask();
}

document.getElementById("filallTask").onclick = () => {
    filter = "all";
    loadTask();
};

document.getElementById("filpendingTask").onclick = () => {
    filter = "pending";
    loadTask();
};

document.getElementById("filcompletedTask").onclick = () => {
    filter = "completed";
    loadTask();
};

function updateCount() {
    let total = tasks.length;
    let completed = tasks.filter(t => t.completed).length;
    let pending = total - completed;

    document.getElementById("allTask").innerHTML = `All Task <span>${total}</span>`;
    document.getElementById("pendingTask").innerHTML = `Pending Task <span>${pending}</span>`;
    document.getElementById("completedTask").innerHTML = `Completed Task <span>${completed}</span>`;

    document.getElementById("totalText").innerText = "Total Task " + total;
}

loadTask();