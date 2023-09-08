import editImage from "./edit-details.svg";
import deleteImage from "./delete-task.svg";
export {renderApplication};

const  renderApplication = (folders) => {
    const body = document.querySelector("body");
    body.innerHTML = "<header><h1>Taskmaster</h1></header><main><nav></nav><div class='folder-container'></div></main><form action='' method=''><div class='button-container'></div><div><label for='task-type'>Task Type:</label><select name='task-type' id='task-type' required><option value=''>--Please choose an option--</option><option value='Standard Task'>Standard Task</option><option value='Project'>Project</option></select></div><div><label for='task-name'>Task Name:</label><input type='text' id='task-name' name='task-name' required></div><div><label for='task-priority'>Priority:</label><select name='task-priority' id='task-priority' required><option value=''>--Please choose an option--</option><option value='Low'>Low</option><option value='Medium'>Medium</option><option value='High'>High</option></select></div><div><label for='task-due'>Due Date:</label><input type='date' id='task-due' name='task-due' required></div><div class='notes'><label for='task-notes'>Notes:</label><textarea id='task-notes' name='task-notes' rows='5' cols='30'></textarea></div></form><footer>Made by <a href='https://github.com/Ngonidzashe-Zvenyika'>Ngonidzashe Zvenyika</a></footer>";
    folderComponents.appendFolders(folders);
    folderComponents.renderFolder(folders[0]);
}

const folderComponents = (() => {
    const renderHeading = (name) => {
        const heading = document.createElement("h2");
        heading.innerText = name;
        return heading;
    }
    const renderNewTaskButton = (folder) => {
        const button = document.createElement("button");
        button.classList.add("new-task");
        button.innerText = "➕";
        button.type = "button";
        button.addEventListener("click", () => {
            formComponents.renderForm(folder);
        });
        return button;
    }
    const renderFolderHeader = (folder) => {
        const container = document.createElement("div");
        container.classList.add("folder-container-header");
        container.appendChild(renderHeading(folder.folderName));
        container.appendChild(renderNewTaskButton(folder));
        return container;
    }
    const appendFolders = (folders) => {
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
    const renderFolder = (folder) => {
        const container = document.querySelector(".folder-container");
        container.replaceChildren();
        container.appendChild(renderFolderHeader(folder));
        container.appendChild(taskComponents.renderProjectElements(folder.folderProjects));
        container.appendChild(taskComponents.renderTaskElements(folder.folderTasks));
    }
    return {appendFolders, renderFolder}
})();

const taskComponents = (() => {
    const renderContainerElement = () => {
        const container = document.createElement("div");
        container.classList.add("task");
        return container;
    }
    const renderPriorityElement = (priority) => {
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
    const renderNameElement = (name, status) => {
        const element = document.createElement("h4");
        element.classList.add("name");
        element.innerText = name;
        strikeThrough(element, status);
        return element;
    }
    const strikeThrough = (nameElement, status) => {
        nameElement.style.textDecoration = (status === true) ? "line-through" : "none";
    }
    const renderCheckboxElement = (task, status, nameElement) => {
        const element = document.createElement("input");
        element.classList.add("checkbox");
        element.setAttribute("type", "checkbox");
        if (status === true) element.setAttribute("checked", "true");
        element.addEventListener("click", () => {
            objectComponents.toggleTaskStatus(task);
            strikeThrough(nameElement, task.status);
        })
        return element;
    }
    const renderTaskDetailsButton = (task) => {
        const button = document.createElement("button");
        button.classList.add("view");
        button.innerText = "Details";
        button.addEventListener("click", () => {
            detailsComponents.displayTaskDetails(task);
        })
        return button;
    }
    const renderProjectDetailsButton = (project) => {
        const button = document.createElement("button");
        button.classList.add("view");
        button.innerText = "Details";
        button.addEventListener("click", () => {
            detailsComponents.displayProjectDetails(project);
        })
        return button;
    }
    const renderDueElement = (due) => {
        const element = document.createElement("p");
        element.innerText = due;
        return element;
    }
    const renderEditIcon = () => {
        const icon = document.createElement("img");
        icon.classList.add("icon")
        icon.src = editImage;
        icon.alt = "Edit details";
        return icon;
    }
    const renderDeleteIcon = () => {
        const icon = document.createElement("img");
        icon.classList.add("icon")
        icon.src = deleteImage;
        icon.alt = "Delete task";
        return icon;
    }
    const renderTasksHeading = () => {
        const element = document.createElement("h3");
        element.innerText = "Tasks";
        return element;
    }
    const renderTaskElements = (tasks) => {
        const container = document.createElement("div");
        container.classList.add("tasks");
        if (tasks.length >= 1) container.appendChild(renderTasksHeading());
        for (const task of tasks) {
            const element = renderContainerElement();
            element.appendChild(renderPriorityElement(task.priority));
            const nameElement = renderNameElement(task.name, task.status);
            element.appendChild(renderCheckboxElement(task, task.status, nameElement));
            element.appendChild(nameElement);
            element.appendChild(renderTaskDetailsButton(task));
            element.appendChild(renderDueElement(task.due));
            element.appendChild(renderEditIcon());
            element.appendChild(renderDeleteIcon());
            container.appendChild(element);
        }
        return container;
    }
    const renderProjectsHeading = () => {
        const element = document.createElement("h3");
        element.innerText = "Projects";
        return element;
    }
    const renderProjectElements = (projects) => { 
        const container = document.createElement("div");
        container.classList.add("projects");
        if (projects.length >= 1) container.appendChild(renderProjectsHeading());
        for (const project of projects) {
            const element = renderContainerElement();
            element.appendChild(renderPriorityElement(project.priority));
            const nameElement = renderNameElement(project.name, project.status);
            element.appendChild(renderCheckboxElement(project, project.status, nameElement));
            element.appendChild(nameElement);
            element.appendChild(renderProjectDetailsButton(project));
            element.appendChild(renderDueElement(project.due));
            element.appendChild(renderEditIcon());
            element.appendChild(renderDeleteIcon());
            container.appendChild(element);
        }
        return container;
    }
    return {renderTaskElements, renderProjectElements}
})();

const overlayComponents = (() => {
    const displayOverlay = () => {
        const overlay = document.createElement("div");
        overlay.classList.add("overlay");
        const body = document.querySelector("body");
        body.appendChild(overlay);
    }
    const dismissOverlay = () => {
        const body = document.querySelector("body");
        const overlay = document.querySelector(".overlay");
        body.removeChild(overlay);
    }
    return {displayOverlay, dismissOverlay}
})();

const formComponents = (() => {
    const renderDismissButton = () => {
        const button = document.createElement("button");
        button.classList.add("dismiss-button");
        button.innerText = "✖";
        button.setAttribute("type", "button");
        button.addEventListener("click", () => {
            dismissForm();
        });
        const container = document.querySelector(".button-container");
        container.appendChild(button);
    }
    const removeDismissButton = () => {
        const button = document.querySelector(".dismiss-button");
        const container = document.querySelector(".button-container");
        container.removeChild(button);
    }
    const renderSubmitButton = (folder) => {
        const button = document.createElement("button");
        button.classList.add("submit-button");
        button.innerText = "Submit";
        button.setAttribute("type", "submit");
        button.addEventListener("click", (event) => {
            submitForm(folder, event);
        });
        const form = document.querySelector("form");
        form.appendChild(button);
    }
    const removeSubmitButton = () => {
        const button = document.querySelector(".submit-button");
        const form = document.querySelector("form");
        form.removeChild(button);
    }
    const submitForm = (folder, event) => {
        const taskName = document.getElementById("task-name").value;
        const taskPriority = document.getElementById("task-priority").value;
        const taskDue = document.getElementById("task-due").value;
        const taskNotes = document.getElementById("task-notes").value;
        const taskType = document.getElementById("task-type").value;
        if (taskName && taskPriority && taskDue && taskType) {
            event.preventDefault();
            objectComponents.addTask(folder, taskName, taskPriority, taskDue, taskNotes, taskType);
            folderComponents.renderFolder(folder);
            dismissForm();
        }
    }
    const renderForm = (folder) => {
        overlayComponents.displayOverlay();
        renderDismissButton();
        renderSubmitButton(folder);
        const form = document.querySelector("form");
        form.style.display = "grid";
    }
    const dismissForm = () => {
        removeSubmitButton();
        removeDismissButton();
        overlayComponents.dismissOverlay();
        const form = document.querySelector("form");
        form.reset();
        form.style.display = "none";
    }
    return {renderForm};
})();

const detailsComponents = (() => {
    const renderDismissDetailsButton = (detailsContainer) => {
        const button = document.createElement("button");
        button.classList.add("dismiss");
        button.innerText = "✖";
        button.addEventListener("click", () => {
            dismissDetails(detailsContainer);
        });
        return button;
    }
    const dismissDetails = (detailsContainer) => {
        overlayComponents.dismissOverlay()
        const body = document.querySelector("body");
        body.removeChild(detailsContainer);
    }
    const renderTaskName = (name) => {
        const element = document.createElement("h2");
        element.innerText = name;
        return element;
    }
    const renderTaskFolder = (folder) => {
        const container = document.createElement("div");
        container.classList.add("row");
        const label = document.createElement("h4");
        label.innerText = "Folder:"
        const value = document.createElement("p");
        value.innerText = folder;
        container.appendChild(label);
        container.appendChild(value);
        return container;
    }
    const renderTaskPriority = (priority) => {
        const container = document.createElement("div");
        container.classList.add("row");
        const label = document.createElement("h4");
        label.innerText = "Priority:"
        const value = document.createElement("p");
        value.innerText = priority;
        container.appendChild(label);
        container.appendChild(value);
        return container;
    }
    const renderTaskDue = (due) => {
        const container = document.createElement("div");
        container.classList.add("row");
        const label = document.createElement("h4");
        label.innerText = "Due Date:"
        const value = document.createElement("p");
        value.innerText = due;
        container.appendChild(label);
        container.appendChild(value);
        return container;
    }
    const renderTaskStatus = (status) => {
        const container = document.createElement("div");
        container.classList.add("row");
        const label = document.createElement("h4");
        label.innerText = "Completed:"
        const value = document.createElement("p");
        value.innerText = (status === true) ? "True" : "False";
        container.appendChild(label);
        container.appendChild(value);
        return container;
    }
    const renderTaskNotes = (notes) => {
        const container = document.createElement("div");
        container.classList.add("notes");
        const label = document.createElement("h4");
        label.innerText = "Notes:"
        const value = document.createElement("p");
        value.style.backgroundColor = "silver";
        value.innerText = notes;
        container.appendChild(label);
        container.appendChild(value);
        return container;
    }
    const renderProjectDetails = (project) => {
        const container = document.createElement("div");
        container.classList.add("details");
        container.appendChild(renderDismissDetailsButton(container));
        container.appendChild(renderTaskName(project.name));
        container.appendChild(renderTaskFolder(project.folder));
        container.appendChild(renderTaskPriority(project.priority));
        container.appendChild(renderTaskDue(project.due));
        container.appendChild(renderTaskStatus(project.status));
        container.appendChild(renderTaskNotes(project.notes));
        container.appendChild(taskComponents.renderTaskElements(project.tasks));
        return container;
    }
    const renderTaskDetails = (task) => {
        const container = document.createElement("div");
        container.classList.add("details");
        container.appendChild(renderDismissDetailsButton(container));
        container.appendChild(renderTaskName(task.name));
        container.appendChild(renderTaskFolder(task.folder));
        container.appendChild(renderTaskPriority(task.priority));
        container.appendChild(renderTaskDue(task.due));
        container.appendChild(renderTaskStatus(task.status));
        container.appendChild(renderTaskNotes(task.notes));
        return container;
    }
    const displayProjectDetails = (project) => {
        overlayComponents.displayOverlay();
        const body = document.querySelector("body");
        body.appendChild(renderProjectDetails(project));
    }
    const displayTaskDetails = (task) => {
        overlayComponents.displayOverlay();
        const body = document.querySelector("body");
        body.appendChild(renderTaskDetails(task));
    }
    return {displayProjectDetails, displayTaskDetails}
})();

const objectComponents = (() => {
    const addTask = (folder, taskName, taskPriority, taskDue, taskNotes, taskType) => {
        switch(taskType) {
            case "Standard Task":
                folder.addFolderTask(taskName, taskPriority, taskDue, taskNotes);
                break;
            case "Project":
                folder.addProject(taskName, taskPriority, taskDue, taskNotes);
                break;
        }
    }
    const toggleTaskStatus = (task) => {
        task.toggleTaskStatus();
    }
    return {toggleTaskStatus, addTask}
})();





