import editImage from "./edit-details.svg";
import deleteImage from "./delete-task.svg";
export {renderApplication};

function renderApplication(folders) {
    const body = document.querySelector("body");
    body.innerHTML = "<header><h1>Taskmaster</h1></header><main><nav></nav><div id='folder-container'><div id='folder-container-header'></div><div id='project-container'></div><div id='task-container'></div></div></main><form action='' method=''><div class='dismiss-button-container'><button id='dismiss-button' type='button'>✖</button></div><div><label for='task-type'>Task Type:</label><select name='task-type' id='task-type' required><option value=''>--Please choose an option--</option><option value='Standard Task'>Standard Task</option><option value='Project'>Project</option></select></div><div><label for='task-name'>Task Name:</label><input type='text' id='task-name' name='task-name' required></div><div><label for='task-priority'>Priority:</label><select name='task-priority' id='task-priority' required>  <option value=''>--Please choose an option--</option><option value='Low'>Low</option><option value='Medium'>Medium</option><option value='High'>High</option></select></div><div><label for='task-due'>Due Date:</label><input type='date' id='task-due' name='task-due' required></div><div class='notes'><label for='task-notes'>Notes:</label><textarea id='task-notes' name='task-notes' rows='5' cols='30'></textarea></div><div><button id='submit-button' type='submit'>Add Task</button></div></form><div id='overlay'></div><footer>Made by <a href='https://github.com/Ngonidzashe-Zvenyika'>Ngonidzashe Zvenyika</a></footer>";
    renderFolderButtons(folders);
}

function renderFolderButtons(folders) {
    renderFolder(folders[0]);
    for (const folder of folders) {
        const nav = document.querySelector("nav");
        const button = document.createElement("button");
        button.innerText = folder.folderName;
        button.type = "button";
        button.addEventListener("click", () => {
            renderFolder(folder);
        })
        nav.appendChild(button);
    }
}

function renderFolder(folder) {
    const renderHeading = () => {
        const heading = document.createElement("h2");
        heading.innerText = folder.folderName;
        return heading;
    }
    const renderNewTaskButton = () => {
        const button = document.createElement("button");
        button.classList.add("new-task");
        button.innerHTML = "&#10133;";
        button.type = "button";
        button.addEventListener("click", () => {
            renderForm(folder);
        });
        return button;
    }
    const renderHeader = () => {
        const header = document.getElementById("folder-container-header");
        header.replaceChildren();
        header.appendChild(renderHeading());
        header.appendChild(renderNewTaskButton());
    }
    renderHeader();
    renderFolderContents(folder);
}

function renderFolderContents(folder) {
    const renderContainerElement = () => {
        const containerElement = document.createElement("div");
        containerElement.classList.add("container-element");
        return containerElement;
    }
    const renderPriorityElement = (priority) => {
        const priorityElement = document.createElement("div"); 
        priorityElement.classList.add("priority");
        switch (priority) {
            case "Low":
                priorityElement.style.backgroundColor = "green";
                break;
            case "Medium":
                priorityElement.style.backgroundColor = "orange";
                break;
            case "High":
                priorityElement.style.backgroundColor = "red";
                break;
        }
        return priorityElement;
    }
    const renderCheckboxElement = (status) => {
        const checkboxElement = document.createElement("input");
        checkboxElement.classList.add("completed-checkbox");
        checkboxElement.setAttribute("type", "checkbox");
        if (status === true) {
            checkboxElement.setAttribute("checked", "true");
        }
        return checkboxElement;
    }
    const renderNameElement = (name) => {
        const nameElement = document.createElement("h3");
        nameElement.classList.add("name");
        nameElement.innerText = name;
        return nameElement;
    }
    const renderDetailsButton = () => {
        const detailsButton = document.createElement("button");
        detailsButton.classList.add("view-details");
        detailsButton.innerText = "Details";
        return detailsButton;
    }
    const renderDueDateElement = (due) => {
        const dueDateElement = document.createElement("p");
        dueDateElement.innerText = due;
        return dueDateElement;
    }
    const renderEditIcon = () => {
        const editIcon = document.createElement("img");
        editIcon.classList.add("icon")
        editIcon.src = editImage;
        editIcon.alt = "Edit details";
        return editIcon;
    }
    const renderDeleteIcon = () => {
        const deleteIcon = document.createElement("img");
        deleteIcon.classList.add("icon")
        deleteIcon.src = deleteImage;
        deleteIcon.alt = "Delete task";
        return deleteIcon;
    }
    const renderProjectsHeading = () => {
        const heading = document.createElement("h3");
        heading.innerText = "Projects";
        return heading;
    }
    const renderProjectElements = () => {
        const projects = folder.folderProjects;
        const projectContainer = document.getElementById("project-container");
        projectContainer.replaceChildren();
        if (projects.length >= 1) projectContainer.appendChild(renderProjectsHeading());
        for (const project of projects) {
            const containerElement = renderContainerElement();
            containerElement.appendChild(renderPriorityElement(project.priority));
            containerElement.appendChild(renderCheckboxElement(project.status));
            containerElement.appendChild(renderNameElement(project.name));
            containerElement.appendChild(renderDetailsButton());
            containerElement.appendChild(renderDueDateElement(project.due));
            containerElement.appendChild(renderEditIcon());
            containerElement.appendChild(renderDeleteIcon());
            projectContainer.appendChild(containerElement);
        }
    }
    const renderTasksHeading = () => {
        const heading = document.createElement("h3");
        heading.innerText = "Tasks";
        return heading;
    }
    const renderStandardTaskElements = () => {
        const tasks = folder.folderTasks;
        const taskContainer = document.getElementById("task-container");
        taskContainer.replaceChildren();
        if (tasks.length >= 1) taskContainer.appendChild(renderTasksHeading());
        for (const task of tasks) {
            const containerElement = renderContainerElement();
            containerElement.appendChild(renderPriorityElement(task.priority));
            containerElement.appendChild(renderCheckboxElement(task.status));
            containerElement.appendChild(renderNameElement(task.name));
            containerElement.appendChild(renderDetailsButton());
            containerElement.appendChild(renderDueDateElement(task.due));
            containerElement.appendChild(renderEditIcon());
            containerElement.appendChild(renderDeleteIcon());
            taskContainer.appendChild(containerElement);
        }
    }
    renderProjectElements();
    renderStandardTaskElements();
}

function renderForm(folder) {
    const displayOverlay = () => {
        const overlay = document.getElementById("overlay");
        overlay.style.display = "block";
    }
    const dismissOverlay = () => {
        const overlay = document.getElementById("overlay");
        overlay.style.display = "none";
    }
    const displayForm = () => {
        const form = document.querySelector("form");
        form.style.display = "grid";
        const dismissButton = document.getElementById("dismiss-button");
        dismissButton.addEventListener("click", () => {
            dismissOverlay();
            dismissForm();
        });
        const submitButton = document.getElementById("submit-button");
        submitButton.addEventListener("click", (event) => {
            submitForm(event);
        });
    }
    const dismissForm = () => {
        const form = document.querySelector("form");
        form.reset();
        form.style.display = "none";
    }
    const submitForm = (event) => {
        const taskName = document.getElementById("task-name").value;
        const taskPriority = document.getElementById("task-priority").value;
        const taskDue = document.getElementById("task-due").value;
        const taskNotes = document.getElementById("task-notes").value;
        const taskType = document.getElementById("task-type").value;
        if (taskName && taskPriority && taskDue && taskType) {
            event.preventDefault();
            addTask(folder, taskName, taskPriority, taskDue, taskNotes, taskType);
            renderFolderContents(folder);
            dismissOverlay();
            dismissForm();
        }
    }
    displayOverlay();
    displayForm();
}

function addTask(folder, taskName, taskPriority, taskDue, taskNotes, taskType) {
    switch(taskType) {
        case "Standard Task":
            folder.addFolderTask(taskName, taskPriority, taskDue, taskNotes);
            break;
        case "Project":
            folder.addProject(taskName, taskPriority, taskDue, taskNotes);
            break;
    }
}



