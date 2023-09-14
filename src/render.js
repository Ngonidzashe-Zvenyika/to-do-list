import {format, parseISO} from "date-fns";
import editImage from "./edit-details.svg";
import deleteImage from "./delete-task.svg";

// These components display and intialize the folders;
const folderComponents = (() => {
    const heading = (folderName) => {
        const heading = document.createElement("h2");
        heading.innerText = folderName;
        return heading;
    }
    const buttonNewItem = (folder) => {
        const button = document.createElement("button");
        button.classList.add("new-item");
        button.innerText = "➕";
        button.type = "button";
        button.addEventListener("click", () => {
            formComponents.newItemInFolder(folder);
        })
        return button;
    }
    const header = (folder) => {
        const container = document.createElement("div");
        container.classList.add("header-container");
        container.appendChild(heading(folder.folderName));
        container.appendChild(buttonNewItem(folder));
        return container;
    }
    const loadNav = (folders) => {
        for (const folder of folders) {
            const nav = document.querySelector("nav");
            const button = document.createElement("button");
            button.innerText = folder.folderName;
            button.type = "button";
            button.addEventListener("click", () => {
                displayFolder(folder);
            })
            nav.appendChild(button);
        }
    }
    const displayFolder = (folder) => {
        const container = document.querySelector(".folder-container");
        container.replaceChildren();
        container.appendChild(header(folder));
        container.appendChild(itemComponents.renderProjectsInFolder(folder, folder.projects));
        container.appendChild(itemComponents.renderTasksInFolder(folder, folder.tasks));
    }
    return {loadNav, displayFolder}
})();

// These components control the pop-up overlay;
const overlayComponents = (() => {
    const displayOverlay = () => {
        const overlay = document.createElement("div");
        overlay.classList.add("overlay");
        zIndex(overlay);
        const body = document.querySelector("body");
        body.appendChild(overlay);
        return overlay;
    }
    const zIndex = (overlay) => {
        if (document.querySelector("form").style.display === "grid") overlay.style.zIndex = "1";
    }
    const dismissOverlay = (overlay) => {
        const body = document.querySelector("body");
        body.removeChild(overlay);
    }
    return {displayOverlay, dismissOverlay};
})();

// These components display and initialize the various forms;
const formComponents = (() => {
    const buttonDismiss = (overlay) => {
        const button = document.createElement("button");
        button.classList.add("dismiss-form");
        button.innerText = "✖";
        button.setAttribute("type", "button");
        button.addEventListener("click", () => {
            dismissForm(overlay);
        })
        const container = document.querySelector(".button-container");
        container.appendChild(button);
    }
    const buttonNewItemInFolder = (folder, overlay) => {
        const button = document.createElement("button");
        button.classList.add("submit-form");
        button.innerText = "Submit";
        button.setAttribute("type", "submit");
        button.addEventListener("click", (event) => {
            addToFolder(folder, event, overlay);
        })
        const form = document.querySelector("form");
        form.appendChild(button);
    }
    const buttonNewTaskInProject = (project, overlay) => {
        const button = document.createElement("button");
        button.classList.add("submit-form");
        button.innerText = "Submit";
        button.setAttribute("type", "submit");
        button.addEventListener("click", (event) => {
            addToProject(project, event, overlay);
        })
        const form = document.querySelector("form");
        form.appendChild(button);
    }
    const buttonEditItemInFolder = (folder, item, overlay) => {
        const button = document.createElement("button");
        button.classList.add("submit-form");
        button.innerText = "Submit";
        button.setAttribute("type", "submit");
        button.addEventListener("click", (event) => {
            editItem(folder, item, event, overlay);
        })
        const form = document.querySelector("form");
        form.appendChild(button);
    }
    const buttonEditTaskInProject = (project, task, overlay) => {
        const button = document.createElement("button");
        button.classList.add("submit-form");
        button.innerText = "Submit";
        button.setAttribute("type", "submit");
        button.addEventListener("click", (event) => {
            editTask(project, task, event, overlay);
        })
        const form = document.querySelector("form");
        form.appendChild(button);
    }
    const removeButtonDismiss = () => {
        const button = document.querySelector(".dismiss-form");
        const container = document.querySelector(".button-container");
        container.removeChild(button);
    }
    const removeButtonSubmit = () => {
        const button = document.querySelector(".submit-form");
        const form = document.querySelector("form");
        form.removeChild(button);
    }
    const dismissForm = (overlay) => {
        removeButtonDismiss();
        removeButtonSubmit();
        const form = document.querySelector("form");
        form.reset();
        form.style.display = "none";
        overlayComponents.dismissOverlay(overlay);
    }
    const addToFolder = (folder, event, overlay) => {
        const name = document.getElementById("input-name").value;
        const priority = document.getElementById("input-priority").value;
        const due = document.getElementById("input-due").value;
        const notes = document.getElementById("input-notes").value;
        const type = document.getElementById("input-type").value;
        if (name && priority && due && type) {
            event.preventDefault();
            let exists = false;
            switch (type) {
                case "Task":
                    exists = messageComponents.exists(folder.addTask(name, priority, due, notes));
                    break;
                case "Project":
                    exists = messageComponents.exists(folder.addProject(name, priority, due, notes));
                    break;
            }
            if (!exists) {
                folderComponents.displayFolder(folder);
                dismissForm(overlay);
            }
        }
    }
    const addToProject = (project, event, overlay) => {
        const taskName = document.getElementById("input-name").value;
        const taskPriority = document.getElementById("input-priority").value;
        const taskDue = document.getElementById("input-due").value;
        const taskNotes = document.getElementById("input-notes").value;
        if (taskName && taskPriority && taskDue) {
            event.preventDefault();
            const exists = messageComponents.exists(project.addTask(project.folder, taskName, taskPriority, taskDue, taskNotes));
            if (!exists) {
                dismissForm(overlay);
                detailsComponents.updateProjectDetails(project);
            }
        }
    }
    const editItem = (folder, item, event, overlay) => {
        const name = document.getElementById("input-name").value;
        const priority = document.getElementById("input-priority").value;
        const due = document.getElementById("input-due").value;
        const notes = document.getElementById("input-notes").value;
        if (name && priority && due) {
            event.preventDefault();
            const exists = messageComponents.exists(item.editDetails(folder, name, priority, due, notes));
            if (!exists) {
                folderComponents.displayFolder(folder);
                dismissForm(overlay);
            }
        }
    }
    const editTask = (project, task, event, overlay) => {
        const name = document.getElementById("input-name").value;
        const priority = document.getElementById("input-priority").value;
        const due = document.getElementById("input-due").value;
        const notes = document.getElementById("input-notes").value;
        if (name && priority && due) {
            event.preventDefault();
            const exists = messageComponents.exists(task.editDetails(project, name, priority, due, notes));
            if (!exists) {
                dismissForm(overlay);
                detailsComponents.updateProjectDetails(project);
            }
        }
    }
    const addType = () => {
        const container = document.querySelector(".input-type-container");
        container.style.display = "grid";
        const type = document.getElementById("input-type");
        type.setAttribute("required", "true");
    }
    const removeType = () => {
        const container = document.querySelector(".input-type-container");
        container.style.display = "none";
        const type = document.getElementById("input-type");
        type.removeAttribute("required");
    }
    const newItemInFolder = (folder) => {
        addType();
        const overlay = overlayComponents.displayOverlay();
        buttonDismiss(overlay);
        buttonNewItemInFolder(folder, overlay);
        const form = document.querySelector("form");
        form.style.display = "grid";
    }
    const newTaskInProject = (project) => {
        removeType();
        const overlay = overlayComponents.displayOverlay();
        buttonDismiss(overlay);
        buttonNewTaskInProject(project, overlay);
        const form = document.querySelector("form");
        form.style.display = "grid";
    }
    const editItemInFolder = (folder, item) => {
        removeType();
        const overlay = overlayComponents.displayOverlay();
        buttonDismiss(overlay);
        buttonEditItemInFolder(folder, item, overlay);
        const name = document.getElementById("input-name");
        name.value = item.name;
        const priority = document.getElementById("input-priority");
        priority.value = item.priority;
        const due = document.getElementById("input-due");
        due.value = item.due;
        const notes = document.getElementById("input-notes");
        notes.value = item.notes;
        const form = document.querySelector("form");
        form.style.display = "grid";
    }
    const editTaskInProject = (project, task) => {
        removeType();
        const overlay = overlayComponents.displayOverlay();
        buttonDismiss(overlay);
        buttonEditTaskInProject(project, task, overlay);
        const name = document.getElementById("input-name");
        name.value = task.name;
        const priority = document.getElementById("input-priority");
        priority.value = task.priority;
        const due = document.getElementById("input-due");
        due.value = task.due;
        const notes = document.getElementById("input-notes");
        notes.value = task.notes;
        const form = document.querySelector("form");
        form.style.display = "grid";
    }
    return {newItemInFolder, newTaskInProject, editItemInFolder, editTaskInProject};
})();

// These components display and initialize the individual projects and tasks (items);
const itemComponents = (() => {
    const itemContainer = () => {
        const container = document.createElement("div");
        container.classList.add("item");
        return container;
    }
    const priority = (priority) => {
        const element = document.createElement("p"); 
        element.classList.add("priority");
        switch (priority) {
            case "Low":
                element.style.backgroundColor = "green";
                break;
            case "Medium":
                element.style.backgroundColor = "orange";
                break;
            case "High":
                element.style.backgroundColor = "red";
                break;
        }
        return element;
    }
    const name = (name, status) => {
        const element = document.createElement("h4");
        element.classList.add("name");
        element.innerText = name;
        strikeThrough(element, status);
        return element;
    }
    const strikeThrough = (nameElement, status) => {
        nameElement.style.textDecoration = (status === true) ? "line-through" : "none";
    }
    const checkboxInFolder = (item, status, nameElement) => {
        const element = document.createElement("input");
        element.classList.add("checkbox");
        element.setAttribute("type", "checkbox");
        (status === true) ? element.checked = true : element.checked = false;
        element.addEventListener("click", (event) => {
            const message = item.toggleStatus();
            if (message) {
                event.preventDefault();
                messageComponents.completed(message);
            } else {
                (item.status === true) ? element.checked = true : element.checked = false;
                strikeThrough(nameElement, item.status);
            }
        })
        return element;
    }
    const checkboxInProject = (projectComplete, item, status, nameElement) => {
            const element = document.createElement("input");
            element.classList.add("checkbox");
            element.setAttribute("type", "checkbox");
            (status === true) ? element.checked = true : element.checked = false;
            element.addEventListener("click", (event) => {
                if (projectComplete) {
                    event.preventDefault();
                    const message = "You may not edit tasks within a completed project.";
                    messageComponents.completed(message);
                } else {
                    item.toggleStatus();
                    (item.status === true) ? element.checked = true : element.checked = false;
                    strikeThrough(nameElement, item.status);
                }
            })
            return element;
    }
    const due = (dueDate) => {
        const element = document.createElement("p");
        element.innerText = format(parseISO(dueDate), "dd MMM");
        return element;
    }
    const iconEditItemInFolder = (folder, item) => {
        const icon = document.createElement("img");
        icon.classList.add("icon");
        icon.src = editImage;
        icon.alt = "Edit item details";
        icon.addEventListener("click", () => {
            if (item.status === true) {
                const message = "You may not edit a completed item.";
                messageComponents.completed(message);
            } else formComponents.editItemInFolder(folder, item);
        })
        return icon;
    }
    const iconEditTaskInProject = (project, task) => {
        const icon = document.createElement("img");
        icon.classList.add("icon");
        icon.src = editImage;
        icon.alt = "Edit item details";
        icon.addEventListener("click", () => {
            if (task.status === true) {
                const message = "You may not edit a completed item.";
                messageComponents.completed(message);
            } else formComponents.editTaskInProject(project, task);
        })
        return icon;
    }
    const iconDeleteTaskInFolder = (folder, task) => {
        const icon = document.createElement("img");
        icon.classList.add("icon");
        icon.src = deleteImage;
        icon.alt = "Delete item";
        icon.addEventListener("click", () => {
            folder.removeTask(task);
            folderComponents.displayFolder(folder);
        })
        return icon;
    }
    const iconDeleteProjectInFolder = (folder, project) => {
        const icon = document.createElement("img");
        icon.classList.add("icon");
        icon.src = deleteImage;
        icon.alt = "Delete item";
        icon.addEventListener("click", () => {
            folder.removeProject(project);
            folderComponents.displayFolder(folder);
        })
        return icon;
    }
    const iconDeleteTaskInProject = (project, task) => {
        const icon = document.createElement("img");
        icon.classList.add("icon");
        icon.src = deleteImage;
        icon.alt = "Delete item";
        icon.addEventListener("click", () => {
            if (project.status === true) {
                const message = "You may not edit tasks within a completed project.";
                messageComponents.completed(message);
            } else {
                project.removeTask(task);
                detailsComponents.updateProjectDetails(project);
            }
        })
        return icon;
    }
    const headingTasks = () => {
        const element = document.createElement("h3");
        element.innerText = "Tasks";
        return element;
    }
    const headingProjects = () => {
        const element = document.createElement("h3");
        element.innerText = "Projects";
        return element;
    }
    const buttonTaskDetails = (task) => {
        const button = document.createElement("button");
        button.innerText = "Details";
        button.type = "button";
        button.addEventListener("click", () => {
            detailsComponents.displayTaskDetails(task);
        })
        return button;
    }
    const buttonProjectDetails = (project) => {
        const button = document.createElement("button");
        button.innerText = "Details";
        button.type = "button";
        button.addEventListener("click", () => {
            detailsComponents.displayProjectDetails(project);
        })
        return button;
    }
    const headerTasksInProject = (project) => {
        const container = document.createElement("div");
        container.classList.add("header-container")
        container.appendChild(headingTasks());
        container.appendChild(buttonNewTaskInProject(project));
        return container;
    }
    const buttonNewTaskInProject = (project) => {
        const button = document.createElement("button");
        button.classList.add("new-item");
        button.innerText = "➕";
        button.type = "button";
        button.addEventListener("click", () => {
            if (project.status) {
                const message = "You may not edit tasks within a completed project.";
                messageComponents.completed(message);
            } else {
                formComponents.newTaskInProject(project);
            }
        })
        return button;
    }
    const renderTasksInFolder = (folder, tasks) => {
        const container = document.createElement("div");
        container.classList.add("tasks");
        if (tasks.length >= 1) container.appendChild(headingTasks());
        for (const task of tasks) {
            const element = itemContainer();
            element.appendChild(priority(task.priority));
            const nameElement = name(task.name, task.status);
            element.appendChild(checkboxInFolder(task, task.status, nameElement));
            element.appendChild(nameElement);
            element.appendChild(buttonTaskDetails(task));
            element.appendChild(due(task.due));
            element.appendChild(iconEditItemInFolder(folder, task));
            element.appendChild(iconDeleteTaskInFolder(folder, task));
            container.appendChild(element);
        }
        return container;
    }
    const renderProjectsInFolder = (folder, projects) => { 
        const container = document.createElement("div");
        container.classList.add("projects");
        if (projects.length >= 1) container.appendChild(headingProjects());
        for (const project of projects) {
            const element = itemContainer();
            element.appendChild(priority(project.priority));
            const nameElement = name(project.name, project.status);
            element.appendChild(checkboxInFolder(project, project.status, nameElement));
            element.appendChild(nameElement);
            element.appendChild(buttonProjectDetails(project));
            element.appendChild(due(project.due));
            element.appendChild(iconEditItemInFolder(folder, project));
            element.appendChild(iconDeleteProjectInFolder(folder, project));
            container.append(element);
        }
        return container;
    }
    const renderTasksInProject = (project, tasks) => {
        const container = document.createElement("div");
        container.classList.add("tasks");
        container.appendChild(headerTasksInProject(project));
        for (const task of tasks) {
            const element = itemContainer();
            element.appendChild(priority(task.priority));
            const nameElement = name(task.name, task.status);
            element.appendChild(checkboxInProject(project.status, task, task.status, nameElement));
            element.appendChild(nameElement);
            element.appendChild(buttonTaskDetails(task));
            element.appendChild(due(task.due));
            element.appendChild(iconEditTaskInProject(project, task));
            element.appendChild(iconDeleteTaskInProject(project, task));
            container.appendChild(element);
        }
        return container;
    }
    return {renderTasksInFolder, renderProjectsInFolder, renderTasksInProject}
})();

// These components display the details for each task or project object;
const detailsComponents = (() => {
    const buttonDismiss = (details, overlay) => {
        const button = document.createElement("button");
        button.classList.add("dismiss-details");
        button.innerText = "✖";
        button.addEventListener("click", () => {
            dismissDetails(details, overlay);
        })
        return button;
    }
    const dismissDetails = (detailsContainer, overlay) => {
        const body = document.querySelector("body");
        body.removeChild(detailsContainer);
        overlayComponents.dismissOverlay(overlay);
    }
    const name = (name) => {
        const element = document.createElement("h2");
        element.innerText = name;
        return element;
    }
    const folder = (folderName) => {
        const container = document.createElement("div");
        container.classList.add("row");
        const label = document.createElement("h4");
        label.innerText = "Folder:";
        const value = document.createElement("p");
        value.innerText = folderName;
        container.appendChild(label);
        container.appendChild(value);
        return container;
    }
    const priority = (priority) => {
        const container = document.createElement("div");
        container.classList.add("row");
        const label = document.createElement("h4");
        label.innerText = "Priority:";
        const value = document.createElement("p");
        value.innerText = priority;
        container.appendChild(label);
        container.appendChild(value);
        return container;
    }
    const due = (due) => {
        const container = document.createElement("div");
        container.classList.add("row");
        const label = document.createElement("h4");
        label.innerText = "Due Date:";
        const value = document.createElement("p");
        value.innerText = format(parseISO(due), "EEEE - dd MMMM yyyy");
        container.appendChild(label);
        container.appendChild(value);
        return container;
    }
    const status = (status) => {
        const container = document.createElement("div");
        container.classList.add("row");
        const label = document.createElement("h4");
        label.innerText = "Completed:";
        const value = document.createElement("p");
        value.innerText = (status === true) ? "True" : "False";
        container.appendChild(label);
        container.appendChild(value);
        return container;
    }
    const notes = (notes) => {
        const container = document.createElement("div");
        container.classList.add("notes");
        const label = document.createElement("h4");
        label.innerText = "Notes:";
        const value = document.createElement("p");
        value.classList.add("note-content");
        value.innerText = notes;
        container.appendChild(label);
        container.appendChild(value);
        return container;
    }
    const renderTaskDetails = (task, overlay) => {
        const container = document.createElement("div");
        container.classList.add("details");
        container.classList.add("task-details");
        container.appendChild(buttonDismiss(container, overlay));
        container.appendChild(name(task.name));
        container.appendChild(folder(task.folder));
        container.appendChild(priority(task.priority));
        container.appendChild(due(task.due));
        container.appendChild(status(task.status));
        container.appendChild(notes(task.notes));
        return container;
    }
    const renderProjectDetails = (project, overlay) => {
        const container = document.createElement("div");
        container.classList.add("details");
        container.classList.add("project-details");
        container.appendChild(buttonDismiss(container, overlay));
        container.appendChild(name(project.name));
        container.appendChild(folder(project.folder));
        container.appendChild(priority(project.priority));
        container.appendChild(due(project.due));
        container.appendChild(status(project.status));
        container.appendChild(notes(project.notes));
        container.appendChild(itemComponents.renderTasksInProject(project, project.tasks));
        return container;
    }
    const displayTaskDetails = (task) => {
        const overlay = overlayComponents.displayOverlay();
        const body = document.querySelector("body");
        body.appendChild(renderTaskDetails(task, overlay));
    }
    const displayProjectDetails = (project) => {
        const overlay = overlayComponents.displayOverlay();
        const body = document.querySelector("body");
        body.appendChild(renderProjectDetails(project, overlay));
    }
    const updateProjectDetails = (project) => {
        const currentDetails = document.querySelector(".details");
        const overlay = document.querySelector(".overlay");
        const body = document.querySelector("body");
        body.removeChild(currentDetails);
        body.removeChild(overlay);
        displayProjectDetails(project); 
    }   
    return {displayTaskDetails, displayProjectDetails, updateProjectDetails}
})();

// These components display elaborative messages when an operation fails;
const messageComponents = (() => {
    const buttonDismiss = (container, overlay) => {
        const button = document.createElement("button");
        button.classList.add("dismiss-message");
        button.innerText = "✖";
        button.addEventListener("click", () => {
            dismissMessage(container, overlay);
        })
        return button;
    }
    const dismissMessage = (messageContainer, overlay) => {
        const body = document.querySelector("body");
        body.removeChild(messageContainer);
        overlayComponents.dismissOverlay(overlay);
    }
    const displayMessage = (text) => {
        const overlay = overlayComponents.displayOverlay();
        const container = document.createElement("div");
        container.classList.add("message");
        const message = document.createElement("p");
        message.classList.add("text");
        message.innerText = text;
        container.appendChild(buttonDismiss(container, overlay));
        container.appendChild(message);
        const body = document.querySelector("body");
        body.appendChild(container);
    }
    const exists = (exists) => {
        if (exists) {
            displayMessage(exists);
            return true;
        }
    }
    const completed = (text) => {
        if (text) displayMessage(text);
    }
    return {exists, completed};
})();

// This function is exported to initialze the application display.
const displayApplication = (folders) => {
    const body = document.querySelector("body");
    body.innerHTML = "<header><h1>Task Master</h1></header><main><nav></nav><div class='folder-container'></div></main><form action='' method=''><div class='button-container'></div><div class='input-type-container'><label for='input-type'>Task or Project:</label><select name='input-type' id='input-type' required><option value=''>--Please choose an option--</option><option value='Task'>Task</option><option value='Project'>Project</option></select></div><div><label for='input-name'>Name:</label><input type='text' id='input-name' name='input-name' required></div><div><label for='input-priority'>Priority:</label><select name='input-priority' id='input-priority' required><option value=''>--Please choose an option--</option><option value='Low'>Low</option><option value='Medium'>Medium</option><option value='High'>High</option></select></div><div><label for='input-due'>Due Date:</label><input type='date' id='input-due' name='input-due' required></div><div class='notes'><label for='input-notes'>Notes:</label><textarea id='input-notes' name='input-notes' rows='5' cols='30' value=''></textarea></div></form><footer>Made by <a href='https://github.com/Ngonidzashe-Zvenyika'>Ngonidzashe Zvenyika</a></footer>";
    folderComponents.loadNav(folders);
    const current = folders[0];
    folderComponents.displayFolder(current);
}

export {displayApplication};