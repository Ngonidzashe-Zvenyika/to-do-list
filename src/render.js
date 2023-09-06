export {renderApplication};

function renderApplication(folders) {
    const body = document.querySelector("body");
    body.innerHTML = "<header><h1>Taskmaster</h1></header><main><nav></nav><div id='folder-container'><div id='folder-container-header'></div></div></main><form action='' method=''><div class='dismiss-button-container'><button id='dismiss-button' type='button'>✖</button></div><div><label for='task-type'>Task Type:</label><select name='task-type' id='task-type' required><option value='Standard Task'>Standard Task</option><option value='Project'>Project</option></select></div><div><label for='task-name'>Task Name:</label><input type='text' id='task-name' name='task-name' required></div><div><label for='task-priority'>Priority:</label><select name='task-priority' id='task-priority' required><option value='Low'>Low</option><option value='Medium'>Medium</option><option value='High'>High</option></select></div><div><label for='task-due'>Due Date:</label><input type='date' id='task-due' name='task-due' required></div><div class='notes'><label for='task-notes'>Notes:</label><textarea id='task-notes' name='task-notes' rows='5' cols='30'></textarea></div><div><button id='submit-button' type='submit'>Add Task</button></div></form><div id='overlay'></div><footer>Made by <a href='https://github.com/Ngonidzashe-Zvenyika'>Ngonidzashe Zvenyika</a></footer>";
    renderFolderButtons(folders);
}

function renderFolderButtons(folders) {
    folders.forEach(folder => {
        const nav = document.querySelector("nav");
        const folderButton = document.createElement("button");
        folderButton.innerText = folder.folderName;
        folderButton.type = "button";
        folderButton.addEventListener("click", () => {
            renderSelectedFolder(folder);
        })
        nav.appendChild(folderButton);
    })
}

function renderSelectedFolder(folder) {
    const NewContainerHeading = () => {
        const containerHeading = document.createElement("h2");
        containerHeading.innerText = folder.folderName;
        return containerHeading;
    }
    const NewTaskButton = () => {
        const newTaskButton = document.createElement("button");
        newTaskButton.classList.add("new-task");
        newTaskButton.innerHTML = "&#10133;";
        newTaskButton.type = "button";
        newTaskButton.addEventListener("click", () => {
            renderForm(folder);
        });
        return newTaskButton;
    }
    const appendContainerHeader = () => {
        const folderContainerHeader = document.getElementById("folder-container-header");
        folderContainerHeader.replaceChildren();
        folderContainerHeader.appendChild(NewContainerHeading());
        folderContainerHeader.appendChild(NewTaskButton());
    }
    appendContainerHeader();
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
        if (taskName && taskDue) {
            event.preventDefault();
            addTask(taskName, taskPriority, taskDue, taskNotes, taskType);
            dismissOverlay();
            dismissForm();
        }
    }
    const addTask = (taskName, taskPriority, taskDue, taskNotes, taskType) => {
        switch(taskType) {
            case "Standard Task":
                folder.addFolderTask(taskName, taskPriority, taskDue, taskNotes);
                break;
            case "Project":
                folder.addProject(taskName, taskPriority, taskDue, taskNotes);
                break;
        }
    }
    displayOverlay();
    displayForm();
}



