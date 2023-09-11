import editImage from "./edit-details.svg";
import deleteImage from "./delete-task.svg";
export {renderApplication};



const  renderApplication = (folders) => {
    const body = document.querySelector("body");
    body.innerHTML = "<header><h1>Taskmaster</h1></header><main><nav></nav><div class='folder-container'></div></main><form action='' method=''><div class='button-container'></div><div class='input-type-container'><label for='input-type'>Task or Project:</label><select name='input-type' id='input-type' required><option value=''>--Please choose an option--</option><option value='Task'>Task</option><option value='Project'>Project</option></select></div><div><label for='input-name'>Name:</label><input type='text' id='input-name' name='input-name' required></div><div><label for='input-priority'>Priority:</label><select name='input-priority' id='input-priority' required><option value=''>--Please choose an option--</option><option value='Low'>Low</option><option value='Medium'>Medium</option><option value='High'>High</option></select></div><div><label for='input-due'>Due Date:</label><input type='date' id='input-due' name='input-due' required></div><div class='notes'><label for='input-notes'>Notes:</label><textarea id='input-notes' name='input-notes' rows='5' cols='30' value=''></textarea></div></form><footer>Made by <a href='https://github.com/Ngonidzashe-Zvenyika'>Ngonidzashe Zvenyika</a></footer>";
    folderComponents.loadNav(folders);
    const current = folders[0];
    folderComponents.displayFolder(current);
}



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
        container.appendChild(itemComponents.renderProjectsInFolder(folder, folder.folderProjects));
        container.appendChild(itemComponents.renderTasksInFolder(folder, folder.folderTasks));
    }
    return {loadNav, displayFolder}
})();



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
    const checkbox = (item, status, nameElement) => {
        const element = document.createElement("input");
        element.classList.add("checkbox");
        element.setAttribute("type", "checkbox");
        if (status === true) element.setAttribute("checked", "true");
        element.addEventListener("click", () => {
            item.toggleStatus();
            strikeThrough(nameElement, item.status);
        })
        return element;
    }
    const due = (dueDate) => {
        const element = document.createElement("p");
        element.innerText = dueDate;
        return element;
    }
    const iconEditItemInFolder = (folder, item) => {
        const icon = document.createElement("img");
        icon.classList.add("icon");
        icon.src = editImage;
        icon.alt = "Edit details";
        icon.addEventListener("click", () => {
            if (item.status === true) {
                //
            } else formComponents.editItemInFolder(folder, item);
        })
        return icon;
    }
    const iconEditTaskInProject = (project, task) => {
        const icon = document.createElement("img");
        icon.classList.add("icon");
        icon.src = editImage;
        icon.alt = "Edit details";
        icon.addEventListener("click", () => {
            if (task.status === true) {
                //
            } else formComponents.editTaskInProject(project, task);
        })
        return icon;
    }
    const iconDeleteTaskInFolder = (folder, taskName) => {
        const icon = document.createElement("img");
        icon.classList.add("icon");
        icon.src = deleteImage;
        icon.alt = "Delete task";
        icon.addEventListener("click", () => {
            folder.removeTask(taskName);
            folderComponents.displayFolder(folder);
        })
        return icon;
    }
    const iconDeleteProjectInFolder = (folder, projectName) => {
        const icon = document.createElement("img");
        icon.classList.add("icon");
        icon.src = deleteImage;
        icon.alt = "Delete task";
        icon.addEventListener("click", () => {
            folder.removeProject(projectName);
            folderComponents.displayFolder(folder);
        })
        return icon;
    }
    const iconDeleteTaskInProject = (project, taskName) => {
        const icon = document.createElement("img");
        icon.classList.add("icon");
        icon.src = deleteImage;
        icon.alt = "Delete task";
        icon.addEventListener("click", () => {
            project.removeTask(taskName);
            detailsComponents.updateProjectDetails(project);
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
    const headerTasksInProject = (project) => {
        const container = document.createElement("div");
        container.classList.add("header-container")
        container.appendChild(headingTasks());
        container.appendChild(buttonNewTaskInProject(project));
        return container;
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
    const buttonNewTaskInProject = (project) => {
        const button = document.createElement("button");
        button.classList.add("new-item");
        button.innerText = "➕";
        button.type = "button";
        button.addEventListener("click", () => {
            formComponents.newTaskInProject(project);
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
            element.appendChild(checkbox(task, task.status, nameElement));
            element.appendChild(nameElement);
            element.appendChild(buttonTaskDetails(task));
            element.appendChild(due(task.due));
            element.appendChild(iconEditItemInFolder(folder, task));
            element.appendChild(iconDeleteTaskInFolder(folder, task.name));
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
            element.appendChild(checkbox(project, project.status, nameElement));
            element.appendChild(nameElement);
            element.appendChild(buttonProjectDetails(project));
            element.appendChild(due(project.due));
            element.appendChild(iconEditItemInFolder(folder, project));
            element.appendChild(iconDeleteProjectInFolder(folder, project.name));
            container.appendChild(element);
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
            element.appendChild(checkbox(task, task.status, nameElement));
            element.appendChild(nameElement);
            element.appendChild(buttonTaskDetails(task));
            element.appendChild(due(task.due));
            element.appendChild(iconEditTaskInProject(project, task));
            element.appendChild(iconDeleteTaskInProject(project, task.name));
            container.appendChild(element);
        }
        return container;
    }
    return {renderTasksInFolder, renderProjectsInFolder, renderTasksInProject}
})();



const formComponents = (() => {
    const displayOverlay = () => {
        const overlay = document.createElement("div");
        overlay.classList.add("overlay-form");
        const body = document.querySelector("body");
        body.appendChild(overlay);
    }
    const dismissOverlay = () => {
        const body = document.querySelector("body");
        const overlay = document.querySelector(".overlay-form");
        body.removeChild(overlay);
    }
    const buttonDismiss = () => {
        const button = document.createElement("button");
        button.classList.add("dismiss-form");
        button.innerText = "✖";
        button.setAttribute("type", "button");
        button.addEventListener("click", () => {
            dismissForm();
        })
        const container = document.querySelector(".button-container");
        container.appendChild(button);
    }
    const removeButtonDismiss = () => {
        const button = document.querySelector(".dismiss-form");
        const container = document.querySelector(".button-container");
        container.removeChild(button);
    }
    const buttonNewItemInFolder = (folder) => {
        const button = document.createElement("button");
        button.classList.add("submit-form");
        button.innerText = "Submit";
        button.setAttribute("type", "submit");
        button.addEventListener("click", (event) => {
            addToFolder(folder, event);
            dismissForm();
            folderComponents.displayFolder(folder);
        })
        const form = document.querySelector("form");
        form.appendChild(button);
    }
    const buttonNewTaskInProject = (project) => {
        const button = document.createElement("button");
        button.classList.add("submit-form");
        button.innerText = "Submit";
        button.setAttribute("type", "submit");
        button.addEventListener("click", (event) => {
            addToProject(project, event);
            dismissForm();
            detailsComponents.updateProjectDetails(project);
        })
        const form = document.querySelector("form");
        form.appendChild(button);
    }
    const buttonEditItemInFolder = (folder, item) => {
        const button = document.createElement("button");
        button.classList.add("submit-form");
        button.innerText = "Submit";
        button.setAttribute("type", "submit");
        button.addEventListener("click", (event) => {
            editItem(item, event);
            dismissForm();
            folderComponents.displayFolder(folder);
        })
        const form = document.querySelector("form");
        form.appendChild(button);
    }
    const buttonEditTaskInProject = (project, task) => {
        const button = document.createElement("button");
        button.classList.add("submit-form");
        button.innerText = "Submit";
        button.setAttribute("type", "submit");
        button.addEventListener("click", (event) => {
            editItem(task, event);
            dismissForm();
            detailsComponents.updateProjectDetails(project);
        })
        const form = document.querySelector("form");
        form.appendChild(button);
    }
    const removeButtonSubmit = () => {
        const button = document.querySelector(".submit-form");
        const form = document.querySelector("form");
        form.removeChild(button);
    }
    const addToFolder = (folder, event) => {
        const name = document.getElementById("input-name").value;
        const priority = document.getElementById("input-priority").value;
        const due = document.getElementById("input-due").value;
        const notes = document.getElementById("input-notes").value;
        const item = document.getElementById("input-type").value;
        if (name && priority && due && item) {
            event.preventDefault();
            switch (item) {
                case "Task":
                    folder.addTask(name, priority, due, notes);
                    break;
                case "Project":
                    folder.addProject(name, priority, due, notes);
                    break;
            }
        }
    }
    const addToProject = (project, event) => {
        const taskName = document.getElementById("input-name").value;
        const taskPriority = document.getElementById("input-priority").value;
        const taskDue = document.getElementById("input-due").value;
        const taskNotes = document.getElementById("input-notes").value;
        if (taskName && taskPriority && taskDue) {
            event.preventDefault();
            project.addTask(project.folder, taskName, taskPriority, taskDue, taskNotes);
        }
    }
    const editItem = (item, event) => {
        const name = document.getElementById("input-name").value;
        const priority = document.getElementById("input-priority").value;
        const due = document.getElementById("input-due").value;
        const notes = document.getElementById("input-notes").value;
        if (name && priority && due) {
            event.preventDefault();
            item.editDetails(name, priority, due, notes);
        }
    }
    const newItemInFolder = (folder) => {
        const taskType = document.querySelector(".input-type-container");
        taskType.style.display = "grid";
        displayOverlay();
        buttonDismiss();
        buttonNewItemInFolder(folder);
        const form = document.querySelector("form");
        form.style.display = "grid";
    }
    const hideTaskType = () => {
        const taskType = document.querySelector(".input-type-container");
        taskType.style.display = "none";
    }
    const newTaskInProject = (project) => {
        hideTaskType();
        displayOverlay();
        buttonDismiss();
        buttonNewTaskInProject(project);
        const form = document.querySelector("form");
        form.style.display = "grid";
    }
    const editItemInFolder = (folder, item) => {
        buttonDismiss();
        hideTaskType();
        const name = document.getElementById("input-name");
        name.value = item.name;
        const priority = document.getElementById("input-priority");
        priority.value = item.priority;
        const due = document.getElementById("input-due");
        due.value = item.due;
        const notes = document.getElementById("input-notes");
        notes.value = item.notes;
        displayOverlay();
        buttonEditItemInFolder(folder, item);
        const form = document.querySelector("form");
        form.style.display = "grid";
    }
    const editTaskInProject = (project, task) => {
        buttonDismiss();
        hideTaskType();
        const name = document.getElementById("input-name");
        name.value = task.name;
        const priority = document.getElementById("input-priority");
        priority.value = task.priority;
        const due = document.getElementById("input-due");
        due.value = task.due;
        const notes = document.getElementById("input-notes");
        notes.value = task.notes;
        displayOverlay();
        buttonEditTaskInProject(project, task);
        const form = document.querySelector("form");
        form.style.display = "grid";
    }
    const dismissForm = () => {
        removeButtonDismiss();
        removeButtonSubmit();
        dismissOverlay();
        const form = document.querySelector("form");
        form.reset();
        form.style.display = "none";
    }
    return {newItemInFolder, newTaskInProject, editItemInFolder, editTaskInProject};
})();



const detailsComponents = (() => {
    const displayOverlay = () => {
        const overlay = document.createElement("div");
        overlay.classList.add("overlay-details");
        const body = document.querySelector("body");
        body.appendChild(overlay);
    }
    const dismissOverlay = () => {
        const body = document.querySelector("body");
        const overlay = document.querySelector(".overlay-details");
        body.removeChild(overlay);
    }
    const buttonDismiss = (details) => {
        const button = document.createElement("button");
        button.classList.add("dismiss-details");
        button.innerText = "✖";
        button.addEventListener("click", () => {
            dismissDetails(details);
        })
        return button;
    }
    const dismissDetails = (details) => {
        dismissOverlay();
        const body = document.querySelector("body");
        body.removeChild(details);
    }
    const name = (name) => {
        const element = document.createElement("h2");
        element.innerText = name;
        return element;
    }
    const folder = (folder) => {
        const container = document.createElement("div");
        container.classList.add("row");
        const label = document.createElement("h4");
        label.innerText = "Folder:";
        const value = document.createElement("p");
        value.innerText = folder;
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
        value.innerText = due;
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
    const renderTaskDetails = (task) => {
        const container = document.createElement("div");
        container.classList.add("details");
        container.appendChild(buttonDismiss(container));
        container.appendChild(name(task.name));
        container.appendChild(folder(task.folder));
        container.appendChild(priority(task.priority));
        container.appendChild(due(task.due));
        container.appendChild(status(task.status));
        container.appendChild(notes(task.notes));
        return container;
    }
    const renderProjectDetails = (project) => {
        const container = document.createElement("div");
        container.classList.add("details");
        container.appendChild(buttonDismiss(container));
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
        displayOverlay();
        const body = document.querySelector("body");
        body.appendChild(renderTaskDetails(task));
    }
    const displayProjectDetails = (project) => {
        displayOverlay();
        const body = document.querySelector("body");
        body.appendChild(renderProjectDetails(project));
    }
    const updateProjectDetails = (project) => {
        const currentDetails = document.querySelector(".details");
        const body = document.querySelector("body");
        body.removeChild(currentDetails);
        body.appendChild(renderProjectDetails(project));
    }
    return {displayProjectDetails, displayTaskDetails, updateProjectDetails}
})();





