let draggedTask = null;

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    draggedTask = event.target;
}

function drop(event) {
    event.preventDefault();

    if (draggedTask) {
        const dropZone = event.target.closest('.column');
        dropZone.appendChild(draggedTask);
        draggedTask = null;
        saveTasksToLocalStorage();
    }
}

function addTask() {
    const taskInput = document.getElementById("taskInput");
    const taskText = taskInput.value.trim();

    if (taskText !== "") {
        const newTask = document.createElement("div");
        newTask.className = "task";
        newTask.textContent = taskText;
        newTask.draggable = true;
        newTask.id = "task" + Date.now();
        newTask.setAttribute("ondragstart", "drag(event)");

        const taskButtons = document.createElement("div");
        taskButtons.className = "task-buttons";

        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.onclick = function () {
            removeTask(newTask);
        };

        taskButtons.appendChild(removeButton);
        newTask.appendChild(taskButtons);

        const todoColumn = document.getElementById("todo");
        todoColumn.appendChild(newTask);

        taskInput.value = "";
        saveTasksToLocalStorage();
    }
}

function removeTask(task) {
    const column = task.parentElement;
    column.removeChild(task);
    saveTasksToLocalStorage();
}

function confirmClearAllTasks() {
    if (confirm("Are you sure you want to clear all tasks?")) {
        clearAllTasks();
    }
}

function clearAllTasks() {
    const columns = document.querySelectorAll(".column");

    columns.forEach(column => {
        const tasks = column.querySelectorAll(".task");
        tasks.forEach(task => {
            column.removeChild(task);
        });
    });

    saveTasksToLocalStorage();
}

function saveTasksToLocalStorage() {
    const columns = document.querySelectorAll(".column");
    const tasksData = {};

    columns.forEach(column => {
        const tasks = column.querySelectorAll(".task");
        const tasksArray = [];

        tasks.forEach(task => {
            tasksArray.push(task.textContent);
        });

        const columnName = column.id;
        tasksData[columnName] = tasksArray;
    });

    localStorage.setItem("tasks", JSON.stringify(tasksData));
}

function loadTasksFromLocalStorage() {
    const savedTasks = localStorage.getItem("tasks");

    if (savedTasks) {
        const tasksData = JSON.parse(savedTasks);

        for (const columnName in tasksData) {
            const column = document.getElementById(columnName);

            if (column) {
                tasksData[columnName].forEach(taskText => {
                    const newTask = document.createElement("div");
                    newTask.className = "task";
                    newTask.textContent = taskText;
                    newTask.draggable = true;
                    newTask.id = "task" + Date.now();
                    newTask.setAttribute("ondragstart", "drag(event)");

                    const taskButtons = document.createElement("div");
                    taskButtons.className = "task-buttons";

                    const removeButton = document.createElement("button");
                    removeButton.textContent = "Remove";
                    removeButton.onclick = function () {
                        removeTask(newTask);
                    };

                    taskButtons.appendChild(removeButton);
                    newTask.appendChild(taskButtons);

                    column.appendChild(newTask);
                });
            }
        }
    }
}


window.onload = loadTasksFromLocalStorage;
